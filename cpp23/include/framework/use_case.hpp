#pragma once
#include "framework/result.hpp"
#include <any>
#include <functional>
#include <typeindex>
#include <unordered_map>
#include <utility>
namespace framework {
class UseCaseRegistry {
public:
    template <typename Command, typename Response, typename Handler>
    [[nodiscard]] Result<bool> add(Handler&& handler) {
        const auto key = std::type_index(typeid(Command));
        if (handlers_.contains(key))
            return Result<bool>::failure({ErrorCode::conflict, "Use case handler already registered."});
        handlers_.emplace(key, [fn = std::forward<Handler>(handler)](const void* raw) -> std::any {
            return std::any(fn(*static_cast<const Command*>(raw)));
        });
        return Result<bool>::success(true);
    }
    template <typename Command, typename Response>
    [[nodiscard]] Result<Response> execute(const Command& command) const {
        const auto it = handlers_.find(std::type_index(typeid(Command)));
        if (it == handlers_.end())
            return Result<Response>::failure({ErrorCode::not_found, "Use case handler is not registered."});
        try {
            return Result<Response>::success(std::any_cast<Response>(it->second(&command)));
        } catch (const std::bad_any_cast&) {
            return Result<Response>::failure({ErrorCode::internal, "Use case response type mismatch."});
        }
    }
private:
    using ErasedHandler = std::function<std::any(const void*)>;
    std::unordered_map<std::type_index, ErasedHandler> handlers_;
};
} // namespace framework

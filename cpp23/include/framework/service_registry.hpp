#pragma once
#include "framework/result.hpp"
#include <memory>
#include <mutex>
#include <type_traits>
#include <typeindex>
#include <unordered_map>
#include <utility>
namespace framework {
class ServiceRegistry {
public:
    template <typename Interface, typename Implementation>
    [[nodiscard]] Result<bool> add(std::shared_ptr<Implementation> service) {
        static_assert(std::is_base_of_v<Interface, Implementation> || std::is_same_v<Interface, Implementation>,
                      "Implementation must satisfy the registered interface type.");
        if (!service) return Result<bool>::failure({ErrorCode::validation, "Cannot register a null service."});
        std::lock_guard lock(mutex_);
        const auto key = std::type_index(typeid(Interface));
        if (services_.contains(key))
            return Result<bool>::failure({ErrorCode::conflict, "Service interface is already registered."});
        services_.emplace(key, std::move(service));
        return Result<bool>::success(true);
    }
    template <typename Interface>
    [[nodiscard]] Result<std::shared_ptr<Interface>> get() const {
        std::lock_guard lock(mutex_);
        const auto it = services_.find(std::type_index(typeid(Interface)));
        if (it == services_.end())
            return Result<std::shared_ptr<Interface>>::failure({ErrorCode::not_found, "Service is not registered."});
        return Result<std::shared_ptr<Interface>>::success(std::static_pointer_cast<Interface>(it->second));
    }
private:
    mutable std::mutex mutex_;
    std::unordered_map<std::type_index, std::shared_ptr<void>> services_;
};
} // namespace framework

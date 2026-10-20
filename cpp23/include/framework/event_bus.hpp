#pragma once
#include <functional>
#include <mutex>
#include <typeindex>
#include <unordered_map>
#include <utility>
#include <vector>
namespace framework {
class EventBus {
public:
    template <typename Event, typename Handler>
    void subscribe(Handler&& handler) {
        std::lock_guard lock(mutex_);
        auto& handlers = handlers_[std::type_index(typeid(Event))];
        handlers.push_back([fn = std::forward<Handler>(handler)](const void* event) {
            fn(*static_cast<const Event*>(event));
        });
    }
    template <typename Event>
    void publish(const Event& event) const {
        std::vector<ErasedHandler> snapshot;
        {
            std::lock_guard lock(mutex_);
            const auto it = handlers_.find(std::type_index(typeid(Event)));
            if (it == handlers_.end()) return;
            snapshot = it->second;
        }
        for (const auto& handler : snapshot) handler(&event);
    }
private:
    using ErasedHandler = std::function<void(const void*)>;
    mutable std::mutex mutex_;
    std::unordered_map<std::type_index, std::vector<ErasedHandler>> handlers_;
};
} // namespace framework

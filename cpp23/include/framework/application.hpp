#pragma once
#include "framework/lifecycle.hpp"
#include "framework/result.hpp"
#include <functional>
#include <utility>
#include <vector>
namespace framework {
class Application {
public:
    using Hook = std::function<Result<bool>()>;
    void add_startup_hook(Hook hook) { startup_hooks_.push_back(std::move(hook)); }
    void add_shutdown_hook(Hook hook) { shutdown_hooks_.push_back(std::move(hook)); }
    [[nodiscard]] Result<bool> start() {
        if (lifecycle_.state() != LifecycleState::created)
            return Result<bool>::failure({ErrorCode::conflict, "Application can only start once."});
        auto transition = lifecycle_.transition(LifecycleState::starting);
        if (!transition) return Result<bool>::failure(transition.error());
        for (const auto& hook : startup_hooks_) {
            auto result = hook();
            if (!result) {
                (void)lifecycle_.transition(LifecycleState::failed);
                (void)stop();
                return Result<bool>::failure(result.error());
            }
        }
        auto ready = lifecycle_.transition(LifecycleState::ready);
        if (!ready) return Result<bool>::failure(ready.error());
        return Result<bool>::success(true);
    }
    [[nodiscard]] Result<bool> stop() {
        if (lifecycle_.state() == LifecycleState::stopped)
            return Result<bool>::success(true);
        if (lifecycle_.state() != LifecycleState::stopping) {
            auto transition = lifecycle_.transition(LifecycleState::stopping);
            if (!transition) return Result<bool>::failure(transition.error());
        }
        AppError first_error{ErrorCode::internal, ""};
        bool failed = false;
        for (auto it = shutdown_hooks_.rbegin(); it != shutdown_hooks_.rend(); ++it) {
            auto result = (*it)();
            if (!result && !failed) { first_error = result.error(); failed = true; }
        }
        auto stopped = lifecycle_.transition(LifecycleState::stopped);
        if (!stopped) return Result<bool>::failure(stopped.error());
        if (failed) return Result<bool>::failure(std::move(first_error));
        return Result<bool>::success(true);
    }
    [[nodiscard]] LifecycleState state() const noexcept { return lifecycle_.state(); }
private:
    Lifecycle lifecycle_;
    std::vector<Hook> startup_hooks_;
    std::vector<Hook> shutdown_hooks_;
};
} // namespace framework

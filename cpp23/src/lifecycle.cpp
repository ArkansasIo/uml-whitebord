#include "framework/lifecycle.hpp"

#include <array>

namespace framework {
namespace {

bool allowed(LifecycleState current, LifecycleState next) noexcept {
    switch (current) {
    case LifecycleState::created:
        return next == LifecycleState::starting || next == LifecycleState::stopping || next == LifecycleState::failed;
    case LifecycleState::starting:
        return next == LifecycleState::ready || next == LifecycleState::stopping || next == LifecycleState::failed;
    case LifecycleState::ready:
        return next == LifecycleState::stopping || next == LifecycleState::failed;
    case LifecycleState::stopping:
        return next == LifecycleState::stopped || next == LifecycleState::failed;
    case LifecycleState::stopped:
        return false;
    case LifecycleState::failed:
        return next == LifecycleState::stopping || next == LifecycleState::stopped;
    }
    return false;
}

} // namespace

Result<LifecycleState> Lifecycle::transition(LifecycleState next) {
    if (!allowed(state_, next)) {
        return Result<LifecycleState>::failure(
            {ErrorCode::conflict, "Invalid lifecycle transition from " +
                std::string(to_string(state_)) + " to " + std::string(to_string(next)) + "."});
    }
    state_ = next;
    return Result<LifecycleState>::success(state_);
}

std::string_view to_string(LifecycleState state) noexcept {
    switch (state) {
    case LifecycleState::created: return "created";
    case LifecycleState::starting: return "starting";
    case LifecycleState::ready: return "ready";
    case LifecycleState::stopping: return "stopping";
    case LifecycleState::stopped: return "stopped";
    case LifecycleState::failed: return "failed";
    }
    return "unknown";
}

} // namespace framework

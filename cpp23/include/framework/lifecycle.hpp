#pragma once

#include "framework/result.hpp"

#include <string_view>

namespace framework {

enum class LifecycleState { created, starting, ready, stopping, stopped, failed };

class Lifecycle {
public:
    [[nodiscard]] LifecycleState state() const noexcept { return state_; }
    [[nodiscard]] Result<LifecycleState> transition(LifecycleState next);

private:
    LifecycleState state_{LifecycleState::created};
};

[[nodiscard]] std::string_view to_string(LifecycleState state) noexcept;

} // namespace framework

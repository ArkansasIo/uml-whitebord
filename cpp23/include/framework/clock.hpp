#pragma once
#include <chrono>
namespace framework {
using SteadyClock = std::chrono::steady_clock;
using SystemClock = std::chrono::system_clock;
[[nodiscard]] inline SystemClock::time_point utc_now() noexcept { return SystemClock::now(); }
} // namespace framework

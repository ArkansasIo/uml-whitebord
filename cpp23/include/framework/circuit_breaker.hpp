#pragma once
#include <cstddef>
#include <mutex>
namespace framework {
enum class CircuitState { closed, open, half_open };
class CircuitBreaker {
public:
    explicit CircuitBreaker(std::size_t failure_threshold = 5, std::size_t half_open_successes = 2)
        : threshold_(failure_threshold == 0 ? 1 : failure_threshold),
          required_successes_(half_open_successes == 0 ? 1 : half_open_successes) {}
    [[nodiscard]] bool allow_request() const {
        std::lock_guard lock(mutex_);
        return state_ != CircuitState::open;
    }
    void record_success() {
        std::lock_guard lock(mutex_);
        failures_ = 0;
        if (state_ == CircuitState::half_open) {
            if (++successes_ >= required_successes_) { state_ = CircuitState::closed; successes_ = 0; }
        }
    }
    void record_failure() {
        std::lock_guard lock(mutex_);
        ++failures_;
        successes_ = 0;
        if (state_ == CircuitState::half_open || failures_ >= threshold_) state_ = CircuitState::open;
    }
    // Call only after a cooldown controlled by the host's clock/scheduler.
    void begin_half_open_probe() {
        std::lock_guard lock(mutex_);
        if (state_ == CircuitState::open) { state_ = CircuitState::half_open; successes_ = 0; }
    }
    [[nodiscard]] CircuitState state() const {
        std::lock_guard lock(mutex_);
        return state_;
    }
private:
    const std::size_t threshold_;
    const std::size_t required_successes_;
    mutable std::mutex mutex_;
    CircuitState state_{CircuitState::closed};
    std::size_t failures_{0};
    std::size_t successes_{0};
};
} // namespace framework

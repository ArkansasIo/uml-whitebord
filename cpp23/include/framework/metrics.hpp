#pragma once
#include <cstdint>
#include <mutex>
#include <string>
#include <unordered_map>
namespace framework {
// Minimal in-process counters. Export and persistence are adapter responsibilities.
class Metrics {
public:
    void increment(const std::string& name, std::uint64_t amount = 1) {
        std::lock_guard lock(mutex_);
        counters_[name] += amount;
    }
    [[nodiscard]] std::uint64_t counter(const std::string& name) const {
        std::lock_guard lock(mutex_);
        const auto it = counters_.find(name);
        return it == counters_.end() ? 0U : it->second;
    }
private:
    mutable std::mutex mutex_;
    std::unordered_map<std::string, std::uint64_t> counters_;
};
} // namespace framework

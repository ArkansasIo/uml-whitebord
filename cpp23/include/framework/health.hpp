#pragma once
#include <string>
#include <utility>
#include <vector>
namespace framework {
enum class HealthStatus { healthy, degraded, not_ready, unhealthy };
struct HealthCheck {
    std::string name;
    HealthStatus status{HealthStatus::healthy};
    std::string detail;
};
struct HealthReport {
    HealthStatus overall{HealthStatus::healthy};
    std::vector<HealthCheck> checks;
};
[[nodiscard]] inline HealthReport summarize_health(std::vector<HealthCheck> checks) {
    HealthStatus overall = HealthStatus::healthy;
    for (const auto& check : checks) {
        if (check.status == HealthStatus::unhealthy) { overall = HealthStatus::unhealthy; break; }
        if (check.status == HealthStatus::not_ready) overall = HealthStatus::not_ready;
        else if (check.status == HealthStatus::degraded && overall == HealthStatus::healthy)
            overall = HealthStatus::degraded;
    }
    return HealthReport{overall, std::move(checks)};
}
} // namespace framework

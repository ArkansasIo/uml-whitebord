#pragma once

#include "framework/result.hpp"

#include <cstdint>
#include <string>
#include <string_view>
#include <unordered_map>

namespace framework {

enum class Environment { development, test, production };
enum class LogLevel { debug, info, warn, error };

struct AppConfig {
    std::string app_name{"application"};
    Environment environment{Environment::development};
    std::uint16_t port{3000};
    LogLevel log_level{LogLevel::info};
};

using EnvironmentMap = std::unordered_map<std::string, std::string>;

[[nodiscard]] Result<AppConfig> load_config(const EnvironmentMap& input);
[[nodiscard]] std::string_view to_string(Environment value) noexcept;
[[nodiscard]] std::string_view to_string(LogLevel value) noexcept;

} // namespace framework

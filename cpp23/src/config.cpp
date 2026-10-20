#include "framework/config.hpp"

#include <charconv>
#include <system_error>

namespace framework {
namespace {

std::string get_or(const EnvironmentMap& input, const std::string& key, std::string fallback) {
    const auto it = input.find(key);
    return it == input.end() ? std::move(fallback) : it->second;
}

} // namespace

Result<AppConfig> load_config(const EnvironmentMap& input) {
    AppConfig config;
    config.app_name = get_or(input, "APP_NAME", "application");
    if (config.app_name.empty()) {
        config.app_name = "application";
    }

    const auto environment = get_or(input, "NODE_ENV", "development");
    if (environment == "development") {
        config.environment = Environment::development;
    } else if (environment == "test") {
        config.environment = Environment::test;
    } else if (environment == "production") {
        config.environment = Environment::production;
    } else {
        return Result<AppConfig>::failure({ErrorCode::validation, "NODE_ENV is invalid."});
    }

    const auto raw_port = get_or(input, "PORT", "3000");
    unsigned int port = 0;
    const auto* begin = raw_port.data();
    const auto* end = begin + raw_port.size();
    const auto parsed = std::from_chars(begin, end, port);
    if (raw_port.empty() || parsed.ec != std::errc{} || parsed.ptr != end || port < 1 || port > 65535) {
        return Result<AppConfig>::failure(
            {ErrorCode::validation, "PORT must be an integer from 1 to 65535."});
    }
    config.port = static_cast<std::uint16_t>(port);

    const auto log_level = get_or(input, "LOG_LEVEL", "info");
    if (log_level == "debug") {
        config.log_level = LogLevel::debug;
    } else if (log_level == "info") {
        config.log_level = LogLevel::info;
    } else if (log_level == "warn") {
        config.log_level = LogLevel::warn;
    } else if (log_level == "error") {
        config.log_level = LogLevel::error;
    } else {
        return Result<AppConfig>::failure({ErrorCode::validation, "LOG_LEVEL is invalid."});
    }

    return Result<AppConfig>::success(std::move(config));
}

std::string_view to_string(Environment value) noexcept {
    switch (value) {
    case Environment::development: return "development";
    case Environment::test: return "test";
    case Environment::production: return "production";
    }
    return "unknown";
}

std::string_view to_string(LogLevel value) noexcept {
    switch (value) {
    case LogLevel::debug: return "debug";
    case LogLevel::info: return "info";
    case LogLevel::warn: return "warn";
    case LogLevel::error: return "error";
    }
    return "unknown";
}

} // namespace framework

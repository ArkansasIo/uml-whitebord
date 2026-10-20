#pragma once
#include "framework/result.hpp"
#include <functional>
#include <map>
#include <string>
#include <string_view>
namespace framework {
struct ApiRequest {
    std::string method;
    std::string path;
    std::map<std::string, std::string, std::less<>> headers;
    std::string body;
    std::string principal_id;
};
struct ApiResponse {
    int status{200};
    std::map<std::string, std::string, std::less<>> headers;
    std::string body;
};
[[nodiscard]] inline ApiResponse error_response(int status, std::string_view code,
                                                std::string_view message) {
    return ApiResponse{status, {{"content-type", "text/plain; charset=utf-8"},
                                {"x-error-code", std::string(code)}},
                       std::string(message)};
}
} // namespace framework

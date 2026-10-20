#pragma once
#include "framework/http.hpp"
#include "framework/result.hpp"
#include <string>
namespace framework {
[[nodiscard]] inline ApiResponse map_error(const AppError& error) {
    switch (error.code) {
    case ErrorCode::validation: return error_response(400, "VALIDATION_ERROR", "The request is invalid.");
    case ErrorCode::not_found: return error_response(404, "NOT_FOUND", "Resource not found.");
    case ErrorCode::conflict: return error_response(409, "CONFLICT", "The operation conflicts with current state.");
    case ErrorCode::unauthenticated: return error_response(401, "UNAUTHENTICATED", "Authentication is required.");
    case ErrorCode::forbidden: return error_response(403, "FORBIDDEN", "The operation is not permitted.");
    case ErrorCode::rate_limited: return error_response(429, "RATE_LIMITED", "Too many requests.");
    case ErrorCode::dependency_failure: return error_response(503, "DEPENDENCY_FAILURE", "A required service is unavailable.");
    case ErrorCode::internal: return error_response(500, "INTERNAL_ERROR", "An unexpected error occurred.");
    }
    return error_response(500, "INTERNAL_ERROR", "An unexpected error occurred.");
}
} // namespace framework

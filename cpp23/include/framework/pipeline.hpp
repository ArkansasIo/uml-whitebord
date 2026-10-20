#pragma once
#include "framework/http.hpp"
#include "framework/router.hpp"
#include <cstddef>
namespace framework {
// Transport-neutral request guard. Authentication and authorization belong in trusted middleware.
struct RequestLimits {
    std::size_t max_body_bytes{1024U * 1024U};
};
[[nodiscard]] inline ApiResponse process_request(const ApiRequest& request,
                                                  const Router& router,
                                                  RequestLimits limits = {}) {
    if (request.method.empty() || request.path.empty() || request.path.front() != '/')
        return error_response(400, "INVALID_REQUEST", "Invalid request target.");
    if (request.body.size() > limits.max_body_bytes)
        return error_response(413, "REQUEST_TOO_LARGE", "Request body exceeds the configured limit.");
    return router.dispatch(request);
}
} // namespace framework

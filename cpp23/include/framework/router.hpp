#pragma once
#include "framework/http.hpp"
#include <functional>
#include <string>
#include <utility>
#include <vector>
namespace framework {
class Router {
public:
    using Handler = std::function<ApiResponse(const ApiRequest&)>;
    [[nodiscard]] Result<bool> add(std::string method, std::string path, Handler handler) {
        if (method.empty() || path.empty() || path.front() != '/' || !handler)
            return Result<bool>::failure({ErrorCode::validation, "Invalid route definition."});
        for (const auto& route : routes_) {
            if (route.method == method && route.path == path)
                return Result<bool>::failure({ErrorCode::conflict, "Duplicate route."});
        }
        routes_.push_back(Route{std::move(method), std::move(path), std::move(handler)});
        return Result<bool>::success(true);
    }
    [[nodiscard]] ApiResponse dispatch(const ApiRequest& request) const {
        for (const auto& route : routes_) {
            if (route.method == request.method && route.path == request.path)
                return route.handler(request);
        }
        return error_response(404, "NOT_FOUND", "Route not found.");
    }
    [[nodiscard]] std::size_t size() const noexcept { return routes_.size(); }
private:
    struct Route { std::string method; std::string path; Handler handler; };
    std::vector<Route> routes_;
};
} // namespace framework

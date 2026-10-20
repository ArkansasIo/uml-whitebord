#include "framework/framework.hpp"

#include <iostream>

int main() {
    framework::Application app;
    framework::Router router;
    const auto registered = router.add("GET", "/health", [](const framework::ApiRequest&) {
        return framework::ApiResponse{200, {{"content-type", "text/plain"}}, "healthy"};
    });
    if (!registered) { std::cerr << registered.error().message << '\n'; return 1; }
    app.add_startup_hook([] { return framework::Result<bool>::success(true); });
    const auto started = app.start();
    if (!started) { std::cerr << started.error().message << '\n'; return 1; }
    const framework::ApiRequest request{"GET", "/health", {}, "", ""};
    const auto response = framework::process_request(request, router);
    std::cout << response.status << " " << response.body << '\n';
    const auto stopped = app.stop();
    if (!stopped) { std::cerr << stopped.error().message << '\n'; return 1; }
    return response.status == 200 ? 0 : 1;
}

#include "framework/framework.hpp"

#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

namespace {
int failures = 0;
void check(bool condition, const char* name) {
    if (condition) std::cout << "[PASS] " << name << '\n';
    else { std::cerr << "[FAIL] " << name << '\n'; ++failures; }
}

void test_config() {
    const auto valid = framework::load_config({
        {"APP_NAME", "example"}, {"NODE_ENV", "test"},
        {"PORT", "4321"}, {"LOG_LEVEL", "debug"}
    });
    check(valid.has_value(), "valid configuration is accepted");
    if (valid) {
        check(valid.value().port == 4321, "port is parsed");
        check(valid.value().app_name == "example", "application name is parsed");
        check(valid.value().environment == framework::Environment::test, "environment is parsed");
    }
    check(!framework::load_config({{"PORT", "70000"}}), "out-of-range port is rejected");
    check(!framework::load_config({{"PORT", "12x"}}), "non-numeric port is rejected");
    check(!framework::load_config({{"NODE_ENV", "staging"}}), "unknown environment is rejected");
    check(!framework::load_config({{"LOG_LEVEL", "trace"}}), "unknown log level is rejected");
}
void test_validation() {
    const auto valid = framework::require_non_empty_string("hello", "name");
    check(valid && valid.value() == "hello", "non-empty string is accepted");
    check(!framework::require_non_empty_string("", "name"), "empty string is rejected");
    const auto trimmed = framework::require_non_empty_string("  hello  ", "name");
    check(trimmed && trimmed.value() == "hello", "string validation trims surrounding whitespace");
    check(!framework::require_non_empty_string("toolong", "name", 3), "overlong string is rejected");
    check(!framework::require_non_empty_string("bad\nvalue", "name"), "control characters are rejected");
}
void test_lifecycle() {
    framework::Lifecycle lifecycle;
    check(lifecycle.state() == framework::LifecycleState::created, "lifecycle starts in created");
    check(lifecycle.transition(framework::LifecycleState::starting).has_value(), "created -> starting");
    check(lifecycle.transition(framework::LifecycleState::ready).has_value(), "starting -> ready");
    check(lifecycle.transition(framework::LifecycleState::stopping).has_value(), "ready -> stopping");
    check(lifecycle.transition(framework::LifecycleState::stopped).has_value(), "stopping -> stopped");
    check(!lifecycle.transition(framework::LifecycleState::ready), "stopped cannot return to ready");
}
void test_router_and_request_pipeline() {
    framework::Router router;
    const auto added = router.add("GET", "/health", [](const framework::ApiRequest&) {
        return framework::ApiResponse{200, {{"content-type", "text/plain"}}, "ok"};
    });
    check(added.has_value(), "valid route registers");
    check(!router.add("GET", "/health", [](const framework::ApiRequest&) {
        return framework::ApiResponse{};
    }), "duplicate route is rejected");
    framework::ApiRequest request{"GET", "/health", {}, "", ""};
    check(framework::process_request(request, router).status == 200, "request dispatches to route");
    request.path = "/missing";
    check(framework::process_request(request, router).status == 404, "missing route returns 404");
    request.path = "/health";
    request.body = "oversized";
    check(framework::process_request(request, router, {3}).status == 413, "request body limit is enforced");
}
void test_security() {
    framework::AccessPolicy policy;
    framework::Principal guest{"guest", {"read"}, false};
    framework::Principal user{"user-1", {"read"}, true};
    check(!policy.allows(guest, "read"), "unauthenticated principal is denied");
    check(policy.allows(user, "read"), "explicit permission is allowed");
    check(!policy.allows(user, "write"), "missing permission is denied");
    check(framework::map_error({framework::ErrorCode::forbidden, "internal details"}).status == 403,
          "forbidden error maps to 403");
    check(framework::map_error({framework::ErrorCode::internal, "secret detail"}).body == "An unexpected error occurred.",
          "internal error details are not exposed");
}
void test_pagination_and_algorithms() {
    const std::vector<int> values{1, 2, 3, 4, 5};
    const auto page = framework::paginate(values, 1, 2);
    check(page && page.value().items == std::vector<int>({2, 3}), "pagination returns requested slice");
    check(page && page.value().total == 5, "pagination reports total count");
    check(!framework::paginate(values, 0, 0), "zero page size is rejected");
    const auto even = framework::filter_copy(values, [](int value) { return value % 2 == 0; });
    check(even == std::vector<int>({2, 4}), "filter algorithm returns matching values");
}
void test_event_bus() {
    framework::EventBus bus;
    int observed = 0;
    bus.subscribe<int>([&observed](const int& event) { observed += event; });
    bus.publish(4);
    check(observed == 4, "event bus dispatches typed event");
}
void test_retry_and_circuit_breaker() {
    int attempts = 0;
    const auto result = framework::retry_bounded<int>(
        [&attempts](std::size_t) {
            ++attempts;
            if (attempts < 3)
                return framework::Result<int>::failure({framework::ErrorCode::dependency_failure, "temporary"});
            return framework::Result<int>::success(42);
        },
        [](const framework::AppError& error) { return error.code == framework::ErrorCode::dependency_failure; },
        3);
    check(result && result.value() == 42 && attempts == 3, "bounded retry succeeds on third attempt");
    framework::CircuitBreaker breaker(2, 1);
    breaker.record_failure();
    breaker.record_failure();
    check(breaker.state() == framework::CircuitState::open, "circuit opens at failure threshold");
    check(!breaker.allow_request(), "open circuit rejects request");
    breaker.begin_half_open_probe();
    check(breaker.allow_request(), "half-open circuit permits probe");
    breaker.record_success();
    check(breaker.state() == framework::CircuitState::closed, "successful probe closes circuit");
}
void test_health_metrics_and_rate_limit() {
    auto health = framework::summarize_health({
        {"database", framework::HealthStatus::healthy, ""},
        {"search", framework::HealthStatus::degraded, "slow"}
    });
    check(health.overall == framework::HealthStatus::degraded, "health summary reports degraded dependency");
    framework::Metrics metrics;
    metrics.increment("requests");
    metrics.increment("requests", 2);
    check(metrics.counter("requests") == 3, "metrics counter accumulates");
    framework::TokenBucket bucket(2.0, 0.0);
    check(bucket.try_consume() && bucket.try_consume(), "token bucket permits capacity");
    check(!bucket.try_consume(), "token bucket rejects over-capacity request");
}
void test_dependency_graph_and_registries() {
    const framework::DependencyGraph graph{
        {"database", "service", "api"},
        {{"database", "service"}, {"service", "api"}}
    };
    const auto order = framework::resolve_dependencies(graph);
    check(order && order.value().front() == "database" && order.value().back() == "api",
          "dependency graph resolves topological order");
    const framework::DependencyGraph cycle{{"a", "b"}, {{"a", "b"}, {"b", "a"}}};
    check(!framework::resolve_dependencies(cycle), "dependency graph rejects cycles");

    struct Greeter { virtual ~Greeter() = default; virtual std::string greet() const = 0; };
    struct EnglishGreeter final : Greeter { std::string greet() const override { return "hello"; } };
    framework::ServiceRegistry services;
    check(services.add<Greeter>(std::make_shared<EnglishGreeter>()).has_value(),
          "service registry accepts implementation");
    const auto greeter = services.get<Greeter>();
    check(greeter && greeter.value()->greet() == "hello", "service registry resolves interface");
    check(!services.add<Greeter>(std::make_shared<EnglishGreeter>()),
          "service registry rejects duplicate registration");

    struct AddOne { int value; };
    framework::UseCaseRegistry use_cases;
    check(use_cases.add<AddOne, int>([](const AddOne& command) { return command.value + 1; }).has_value(),
          "use case handler registers");
    const auto response = use_cases.execute<AddOne, int>(AddOne{41});
    check(response && response.value() == 42, "use case registry dispatches typed command");
    struct MissingCommand { int value; };
    check(!use_cases.execute<MissingCommand, int>(MissingCommand{0}),
          "missing use case returns error");
}

void test_idempotency_and_application() {
    framework::IdempotencyStore store;
    const auto first = store.reserve("user", "key-1", "fingerprint-a");
    check(first.has_value(), "idempotency key can be reserved");
    const auto conflict = store.reserve("user", "key-1", "fingerprint-b");
    check(!conflict, "idempotency key cannot be reused with different request");
    const auto completed = store.complete("user", "key-1", "fingerprint-a", "saved-result");
    check(completed.has_value(), "idempotency result can be stored");
    const auto replay = store.reserve("user", "key-1", "fingerprint-a");
    check(replay && replay.value().completed && replay.value().result == "saved-result",
          "completed idempotency result is replayable");

    int started = 0;
    int stopped = 0;
    framework::Application app;
    app.add_startup_hook([&started] { ++started; return framework::Result<bool>::success(true); });
    app.add_shutdown_hook([&stopped] { ++stopped; return framework::Result<bool>::success(true); });
    check(app.start().has_value() && app.state() == framework::LifecycleState::ready,
          "application starts and becomes ready");
    check(app.stop().has_value() && app.state() == framework::LifecycleState::stopped,
          "application shuts down cleanly");
    check(started == 1 && stopped == 1, "application invokes lifecycle hooks");
}
} // namespace

int main() {
    test_config();
    test_validation();
    test_lifecycle();
    test_router_and_request_pipeline();
    test_security();
    test_pagination_and_algorithms();
    test_event_bus();
    test_retry_and_circuit_breaker();
    test_health_metrics_and_rate_limit();
    test_idempotency_and_application();
    test_dependency_graph_and_registries();
    if (failures != 0) {
        std::cerr << failures << " test(s) failed.\n";
        return EXIT_FAILURE;
    }
    std::cout << "All framework tests passed.\n";
    return EXIT_SUCCESS;
}

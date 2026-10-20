# Framework-temp — C++23 implementation

This directory contains a native C++23 implementation alongside the repository's TypeScript reference implementation. It is a dependency-free foundation intended to be extended with concrete application, API, storage, and platform adapters.

## Requirements

- CMake 3.25+
- A C++23 compiler (GCC 13+, Clang 16+, or a recent Visual Studio 2022 toolset)
- CTest (included with CMake)

## Build and test

From the repository root:

```sh
cmake -S cpp23 -B build/cpp23 -DCMAKE_BUILD_TYPE=Release
cmake --build build/cpp23 --config Release
ctest --test-dir build/cpp23 --output-on-failure
```

## Layout

- `include/framework/result.hpp`: typed success/error result and error codes
- `include/framework/config.hpp`, `src/config.cpp`: validated application configuration
- `include/framework/lifecycle.hpp`, `src/lifecycle.cpp`: explicit lifecycle state machine
- `include/framework/validation.hpp`, `src/validation.cpp`: reusable string validation
- `include/framework/dependency_graph.hpp`: topological dependency ordering and cycle detection
- `include/framework/service_registry.hpp`: typed service registration and lookup
- `include/framework/use_case.hpp`: typed command-to-handler dispatch
- `include/framework/application.hpp`: lifecycle hook orchestration
- `include/framework/http.hpp`, `router.hpp`, `pipeline.hpp`, `response_mapping.hpp`: transport-neutral request routing, size limits, and safe errors
- `include/framework/security.hpp`, `response_mapping.hpp`: deny-by-default permissions and safe error mapping
- `include/framework/repository.hpp`: storage adapter contract
- `include/framework/event_bus.hpp`: typed in-process event dispatch
- `include/framework/retry.hpp`, `circuit_breaker.hpp`, `rate_limiter.hpp`: resilience primitives
- `include/framework/idempotency.hpp`: process-local idempotency reference store
- `include/framework/pagination.hpp`, `algorithm.hpp`: generic data algorithms
- `include/framework/health.hpp`, `metrics.hpp`, `audit.hpp`, `logger.hpp`: operational interfaces and utilities
- `examples/basic_application.cpp`: runnable composition example
- `include/framework/framework.hpp`: umbrella include
- `tests/test_main.cpp`: dependency-free unit tests

## Configuration keys

| Key | Default | Accepted values |
| --- | --- | --- |
| `APP_NAME` | `application` | non-empty application name |
| `NODE_ENV` | `development` | `development`, `test`, `production` |
| `PORT` | `3000` | integer from 1 through 65535 |
| `LOG_LEVEL` | `info` | `debug`, `info`, `warn`, `error` |

The current configuration API accepts a map so callers can adapt environment variables, configuration files, or test fixtures without coupling the core library to process-global state.

## Example

CMake builds `framework_basic_example` by default. It demonstrates startup hooks, a health route, request dispatch, and shutdown.

## Available modules

The umbrella header `framework/framework.hpp` exports the public C++23 headers. See the root `ALGORITHM_CATALOG.md` and `docs/` for the language-neutral specifications, security rules, API contracts, test strategy, and release guidance.

## Design boundaries

The core is deliberately transport- and database-neutral. HTTP routing, authentication providers, persistence implementations, GUI frameworks, platform packaging, and production deployment integrations are extension points, not falsely represented as already implemented. Use adapters at those boundaries and keep domain rules independently testable.

# Algorithm Implementation Matrix

This matrix distinguishes executable, dependency-free reference code from specifications that require application-specific adapters.

## Implemented in the C++23 core

| Capability | Implementation | Boundary / limitation |
|---|---|---|
| Typed result and error codes | include/framework/result.hpp | No exception or HTTP transport policy imposed |
| Configuration validation | src/config.cpp | Input map supplied by caller; file/env loading is adapter work |
| Lifecycle state machine | src/lifecycle.cpp | Host owns process signals and deadlines |
| String validation | src/validation.cpp | ASCII whitespace trimming; domain schema validation remains app-specific |
| Dependency ordering | include/framework/dependency_graph.hpp | Topological sort and cycle/unknown-node detection |
| Service registry | include/framework/service_registry.hpp | In-process typed registration; composition roots control lifetime |
| Use-case dispatch | include/framework/use_case.hpp | Typed, in-process, copyable result types |
| Application startup/shutdown hooks | include/framework/application.hpp | Host provides event loop and signal handling |
| API request/response primitives | include/framework/http.hpp | Not a network server and does not parse raw HTTP |
| Literal route dispatch | include/framework/router.hpp | Exact method/path matching; no route parameters or wildcards |
| Request body limit | include/framework/pipeline.hpp | Transport adapter must enforce headers, TLS, and timeouts |
| Error-to-response mapping | include/framework/response_mapping.hpp | Plain-text body with stable error header; JSON adapter can replace it |
| Access policy | include/framework/security.hpp | In-memory permissions; production identity and policy providers are required |
| Repository contract | include/framework/repository.hpp | Concrete persistence and transactions are not included |
| Typed event bus | include/framework/event_bus.hpp | In-process only; no durable delivery or retry |
| Bounded retry | include/framework/retry.hpp | Caller defines retryable errors; scheduling/backoff is caller policy |
| Circuit breaker | include/framework/circuit_breaker.hpp | Host must schedule cooldown and coordinate half-open probes |
| Token bucket | include/framework/rate_limiter.hpp | Single-process state only |
| Pagination | include/framework/pagination.hpp | In-memory collection pagination; database cursor adapter is separate |
| Idempotency reference store | include/framework/idempotency.hpp | Process-local memory only; not durable/distributed |
| Health aggregation | include/framework/health.hpp | Application supplies checks |
| In-process metrics | include/framework/metrics.hpp | Exporter and retention are adapter work |
| Audit sink contract | include/framework/audit.hpp | Durable/tamper-evident sink must be implemented |
| Logger contract | include/framework/logger.hpp | Logging backend must be implemented |
| Generic filter/sort | include/framework/algorithm.hpp | Collection algorithms only |

## Specification-first algorithms

The root ALGORITHM_CATALOG.md indexes language-neutral .alg files for API authentication, authorization, rate limiting, schema validation, migrations, cache policy, transactions, event durability, idempotency recovery, security auditing, CI/release, backup/restore, and rollback. Treat those as design contracts until a concrete implementation and tests exist for the selected provider.

## Not bundled as a production integration

- HTTP server, TLS termination, REST/OpenAPI parser, GraphQL or RPC server
- Database drivers, durable queue, distributed cache, distributed idempotency
- User/password storage, OAuth/OIDC provider, token signing, secret manager
- Cloud deployment, backup storage, telemetry exporter, notification gateway
- GUI, web frontend, mobile UI, plugin sandbox, or language-specific code generator

These integrations are intentionally not faked. Select providers and implement adapters for the target application.

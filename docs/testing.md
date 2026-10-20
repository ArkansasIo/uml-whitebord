# Testing Strategy

## C++23 commands

    cmake -S cpp23 -B build/cpp23 -DCMAKE_BUILD_TYPE=Release
    cmake --build build/cpp23 --config Release
    ctest --test-dir build/cpp23 --output-on-failure

Tests use a dependency-free executable and CTest. Add isolated tests for every adapter, persistence transaction, permission policy, retry boundary, and concurrency invariant.

## TypeScript commands

    npm install
    npm run typecheck
    npm test
    npm run build

## Required test classes

- Unit tests for pure algorithms and domain rules.
- Integration tests against real adapters or faithful test doubles.
- Contract tests for request, response, and version compatibility.
- Security tests for unauthenticated access, object-level authorization, invalid input, and secret redaction.
- Failure-injection tests for timeouts, dependency outages, partial startup, and shutdown.
- Performance tests with documented datasets, concurrency, duration, and percentile thresholds.
- Recovery drills for backup restoration and rollback.

A configured CI workflow is not proof that checks passed. Review the actual run and preserve the test report.

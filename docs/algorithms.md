# Algorithm Catalog

Algorithm specifications live in `algorithms/`. They describe portable logic and are not directly executable source files.

## Implementation order

1. Initialization, configuration, lifecycle, dependency resolution, and error handling.
2. Input validation, domain invariants, serialization, repositories, transactions, and migrations.
3. Use-case dispatch, business rules, workflows, event handling, and idempotency.
4. Request routing, authentication, authorization, rate limiting, and response mapping.
5. Unit, contract, regression, health, and performance verification.
6. Secret handling, audit logging, build/release validation, backup/restore, rollback, and shutdown.

## Required specification sections

Every algorithm should define purpose, inputs, outputs, preconditions, invariants, steps, errors, complexity where relevant, security considerations, dependencies, and test cases.

## Important limitations

An algorithm specification is not proof of a working implementation. Validate concurrency behavior, transaction semantics, retry safety, access control, and recovery behavior in the chosen runtime and infrastructure.

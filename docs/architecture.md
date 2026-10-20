# Architecture

## Layers

1. **Core**: results/errors, configuration, lifecycle, logging contracts, and shared primitives.
2. **Domain**: entities, value objects, invariants, and domain interfaces.
3. **Application**: use cases and orchestration; depends on domain contracts.
4. **Infrastructure**: database, filesystem, network, and provider adapters.
5. **API/UI**: transport and presentation adapters; translate external input to application commands.

## Dependency direction

Outer layers may depend on inner layers. Domain logic must not depend on HTTP, UI frameworks, databases, or environment-specific APIs. Infrastructure implements interfaces owned by the domain or application layer.

## Security baseline

- Validate untrusted input at boundaries.
- Deny protected actions unless an explicit policy permits them.
- Keep secrets in a secret manager or protected environment configuration.
- Use parameterized database operations.
- Avoid logging credentials, tokens, or sensitive request bodies.
- Apply bounded timeouts and retries.

## Application-specific decisions

The template does not select a database, identity provider, HTTP framework, or UI framework. Choose these explicitly and implement adapters for them.

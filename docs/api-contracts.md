# API and Interface Contracts

## Transport-neutral request model

The C++23 core provides ApiRequest, ApiResponse, a literal-method/path Router, a body-size guard, and safe error mapping. It does not open a network socket or implement HTTP parsing/TLS. Add an HTTP server adapter for that.

## Request flow

1. Enforce transport, request size, and timeout limits in the adapter.
2. Match route and method.
3. Authenticate the caller using an established identity provider when required.
4. Authorize the action and target resource (default deny).
5. Parse and validate input against a schema.
6. Invoke application services.
7. Map typed results to documented response codes and public DTOs.
8. Emit redacted diagnostics and metrics.

## Compatibility

- Document request/response schemas and error codes.
- Version breaking changes explicitly.
- Do not expose internal exceptions or secrets in public errors.
- Keep route matching unambiguous and test duplicate routes.
- Apply object-level authorization to resources, not only route-level checks.

## Production adapters still required

The template's core is intentionally dependency-free. Select and implement an HTTP server, database driver, authentication provider, secret manager, telemetry exporter, and deployment strategy for the target application.

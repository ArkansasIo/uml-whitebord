# MLTA API Application Generator

The C++23 project generator creates a starter API application folder from an ApplicationSpec. It writes a CMake project, main.cpp, README, and OpenAPI 3.1 route contract.

## Safety and behavior

- Project slugs are limited to ASCII letters, digits, hyphens, and underscores, and are limited to 64 characters.
- Endpoint methods are checked against GET, POST, PUT, PATCH, and DELETE.
- Route paths must start with a slash.
- Files are written only under destination/slug; the destination is selected by the caller.
- Existing generated files with the same names are overwritten. Use a new directory or back up existing work if you need to preserve it.
- Generation does not start a network server. The generated app is a C++23 bootstrap and OpenAPI specification, not a production HTTP implementation.

## Example integration

    #include "mlta/generator.hpp"

    mlta::generator::ApplicationSpec spec;
    spec.name = "Inventory API";
    spec.slug = "inventory-api";
    spec.version = "1.0.0";
    spec.description = "Example inventory service";
    spec.endpoints = {
        {"GET", "/health", "Health check"},
        {"GET", "/v1/items", "List items"},
        {"POST", "/v1/items", "Create item"}
    };
    auto result = mlta::generator::generateApiApplication(spec, "./generated");
    if (!result.success) {
        // Inspect result.diagnostics before reporting failure.
    }

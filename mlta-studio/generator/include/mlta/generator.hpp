#pragma once
#include "mlta/diagnostic.hpp"
#include <filesystem>
#include <string>
#include <vector>
namespace mlta::generator {
struct ApiEndpointSpec { std::string method{"GET"}; std::string path{"/health"}; std::string summary{"Health check"}; };
struct ApplicationSpec { std::string name{"Generated MLTA API"}; std::string slug{"generated-mlta-api"}; std::string version{"0.1.0"}; std::string description{"Generated C++23 API application"}; std::vector<ApiEndpointSpec> endpoints{{"GET","/health","Health check"}}; };
struct GenerateResult { bool success{false}; std::filesystem::path projectDirectory; std::vector<std::filesystem::path> files; Diagnostics diagnostics; };
[[nodiscard]] GenerateResult generateApiApplication(const ApplicationSpec& spec,const std::filesystem::path& destination);
} // namespace mlta::generator

#pragma once
#include "mlta/diagnostic.hpp"
#include "mlta/logic_node.hpp"
#include <cstddef>
#include <functional>
#include <map>
#include <string>
#include <string_view>
#include <vector>
namespace mlta {
struct ResourceLimits { std::size_t maxDepth{128}; std::size_t maxInstructions{100000}; std::size_t maxSourceBytes{1024*1024}; std::size_t maxArrayElements{10000}; };
struct EngineConfig { std::string applicationName{"MLTA Studio"}; std::string version{"0.1.0"}; ResourceLimits limits{}; };
struct LogicContext { std::map<std::string,Value,std::less<>> variables; std::vector<std::string> trace; Diagnostics diagnostics; std::size_t instructionsUsed{0}; };
struct LogicResult { bool success{false}; Value value{}; Diagnostics diagnostics; std::vector<std::string> trace; std::size_t instructionsUsed{0}; };
struct ValidationResult { bool valid{false}; Diagnostics diagnostics; std::size_t expressionCount{0}; };
class MLTAEngine {
public:
 explicit MLTAEngine(EngineConfig config={});
 [[nodiscard]] const EngineConfig& config() const noexcept{return config_;}
 [[nodiscard]] ValidationResult validate(std::string_view source) const;
 [[nodiscard]] LogicResult execute(std::string_view source,const std::map<std::string,Value,std::less<>>& variables={}) const;
 [[nodiscard]] std::vector<std::string> capabilities() const;
private: EngineConfig config_;
};
} // namespace mlta

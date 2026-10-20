#pragma once
#include <string>
#include <vector>
namespace mlta::studio {
struct FieldDefinition { std::string name; std::string type; std::string description; bool required{false}; };
struct ComponentDefinition { std::string category; std::string name; std::string description; std::vector<FieldDefinition> fields; };
struct ToolDefinition { std::string name; std::string shortcut; std::string description; };
[[nodiscard]] std::vector<ComponentDefinition> componentCatalog();
[[nodiscard]] std::vector<ToolDefinition> toolCatalog();
} // namespace mlta::studio

#pragma once
#include "framework/result.hpp"
#include <cstddef>
#include <queue>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>
namespace framework {
struct DependencyGraph {
    std::vector<std::string> nodes;
    std::vector<std::pair<std::string, std::string>> edges; // prerequisite -> dependent
};
[[nodiscard]] inline Result<std::vector<std::string>> resolve_dependencies(const DependencyGraph& graph) {
    std::unordered_map<std::string, std::size_t> indegree;
    std::unordered_map<std::string, std::vector<std::string>> outgoing;
    for (const auto& node : graph.nodes) {
        if (!indegree.emplace(node, 0U).second)
            return Result<std::vector<std::string>>::failure({ErrorCode::conflict, "Duplicate dependency node."});
    }
    for (const auto& [prerequisite, dependent] : graph.edges) {
        if (!indegree.contains(prerequisite) || !indegree.contains(dependent))
            return Result<std::vector<std::string>>::failure({ErrorCode::validation, "Dependency edge references unknown node."});
        outgoing[prerequisite].push_back(dependent);
        ++indegree[dependent];
    }
    std::queue<std::string> ready;
    for (const auto& node : graph.nodes) if (indegree[node] == 0U) ready.push(node);
    std::vector<std::string> order;
    order.reserve(graph.nodes.size());
    while (!ready.empty()) {
        auto current = ready.front();
        ready.pop();
        order.push_back(current);
        for (const auto& dependent : outgoing[current]) {
            auto& degree = indegree[dependent];
            --degree;
            if (degree == 0U) ready.push(dependent);
        }
    }
    if (order.size() != graph.nodes.size())
        return Result<std::vector<std::string>>::failure({ErrorCode::conflict, "Dependency graph contains a cycle."});
    return Result<std::vector<std::string>>::success(std::move(order));
}
} // namespace framework

#pragma once
#include "mlta/value.hpp"
#include <cstdint>
#include <memory>
#include <string>
#include <utility>
#include <vector>
namespace mlta {
enum class NodeKind { Master, Statement, Branch, Module, Class, Type, Array, Operation, Function, Literal, Variable };
struct LogicNode {
 std::uint64_t id{0}; NodeKind kind{NodeKind::Literal}; std::string name; std::string operation; Value value; bool enabled{true};
 std::vector<std::shared_ptr<LogicNode>> children;
 void addChild(std::shared_ptr<LogicNode> child){if(child)children.push_back(std::move(child));}
};
} // namespace mlta

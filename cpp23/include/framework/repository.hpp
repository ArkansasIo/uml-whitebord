#pragma once
#include "framework/result.hpp"
#include <optional>
#include <string>
#include <string_view>
namespace framework {
template <typename Entity>
class Repository {
public:
    virtual ~Repository() = default;
    [[nodiscard]] virtual Result<std::optional<Entity>> find_by_id(std::string_view id) = 0;
    [[nodiscard]] virtual Result<Entity> insert(Entity entity) = 0;
    [[nodiscard]] virtual Result<Entity> update(Entity entity) = 0;
    [[nodiscard]] virtual Result<bool> erase(std::string_view id) = 0;
};
} // namespace framework

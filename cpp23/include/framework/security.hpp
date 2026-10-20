#pragma once
#include <string>
#include <string_view>
#include <unordered_set>
namespace framework {
struct Principal {
    std::string id;
    std::unordered_set<std::string> permissions;
    bool authenticated{false};
};
class AccessPolicy {
public:
    [[nodiscard]] bool allows(const Principal& principal, std::string_view permission) const {
        if (!principal.authenticated || principal.id.empty() || permission.empty()) return false;
        return principal.permissions.contains(std::string(permission));
    }
};
} // namespace framework

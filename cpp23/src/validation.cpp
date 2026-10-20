#include "framework/validation.hpp"

#include <cctype>

namespace framework {

Result<std::string> require_non_empty_string(
    std::string_view value,
    std::string_view field_name,
    std::size_t max_length) {
    while (!value.empty() && std::isspace(static_cast<unsigned char>(value.front())) != 0)
        value.remove_prefix(1);
    while (!value.empty() && std::isspace(static_cast<unsigned char>(value.back())) != 0)
        value.remove_suffix(1);

    if (value.empty() || value.size() > max_length) {
        return Result<std::string>::failure({
            ErrorCode::validation,
            std::string(field_name) + " must contain 1 to " + std::to_string(max_length) + " characters."
        });
    }
    for (const unsigned char character : value) {
        if (character < 0x20U && character != '\t') {
            return Result<std::string>::failure({
                ErrorCode::validation,
                std::string(field_name) + " contains a control character."
            });
        }
    }
    return Result<std::string>::success(std::string(value));
}

} // namespace framework

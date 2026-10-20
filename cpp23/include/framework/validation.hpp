#pragma once

#include "framework/result.hpp"

#include <cstddef>
#include <string>
#include <string_view>

namespace framework {

[[nodiscard]] Result<std::string> require_non_empty_string(
    std::string_view value,
    std::string_view field_name,
    std::size_t max_length = 200);

} // namespace framework

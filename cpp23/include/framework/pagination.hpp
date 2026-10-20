#pragma once
#include "framework/result.hpp"
#include <algorithm>
#include <cstddef>
#include <utility>
#include <vector>
namespace framework {
template <typename T>
struct Page {
    std::vector<T> items;
    std::size_t offset{0};
    std::size_t limit{0};
    std::size_t total{0};
};
template <typename T>
[[nodiscard]] Result<Page<T>> paginate(const std::vector<T>& values,
                                       std::size_t offset, std::size_t limit,
                                       std::size_t maximum_limit = 100) {
    if (limit == 0 || maximum_limit == 0 || limit > maximum_limit)
        return Result<Page<T>>::failure({ErrorCode::validation, "Page limit is outside allowed bounds."});
    const auto begin = offset < values.size() ? offset : values.size();
    const auto count = std::min(limit, values.size() - begin);
    std::vector<T> items(values.begin() + static_cast<std::ptrdiff_t>(begin),
                         values.begin() + static_cast<std::ptrdiff_t>(begin + count));
    return Result<Page<T>>::success(Page<T>{std::move(items), offset, limit, values.size()});
}
} // namespace framework

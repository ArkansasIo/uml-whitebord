#pragma once
#include <algorithm>
#include <iterator>
#include <vector>
namespace framework {
template <typename T, typename Predicate>
[[nodiscard]] std::vector<T> filter_copy(const std::vector<T>& values, Predicate predicate) {
    std::vector<T> result;
    result.reserve(values.size());
    std::copy_if(values.begin(), values.end(), std::back_inserter(result), predicate);
    return result;
}
template <typename T, typename Compare>
void stable_sort(std::vector<T>& values, Compare compare) {
    std::stable_sort(values.begin(), values.end(), compare);
}
} // namespace framework

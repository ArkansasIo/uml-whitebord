#pragma once
#include "framework/result.hpp"
#include <cstddef>
#include <functional>
#include <utility>
namespace framework {
template <typename T, typename Operation, typename Retryable>
[[nodiscard]] Result<T> retry_bounded(Operation&& operation, Retryable&& retryable,
                                      std::size_t max_attempts) {
    if (max_attempts == 0)
        return Result<T>::failure({ErrorCode::validation, "max_attempts must be greater than zero."});
    AppError last_error{ErrorCode::internal, "Operation did not execute."};
    for (std::size_t attempt = 0; attempt < max_attempts; ++attempt) {
        auto result = std::invoke(operation, attempt);
        if (result) return result;
        last_error = result.error();
        if (!std::invoke(retryable, last_error) || attempt + 1 == max_attempts) break;
    }
    return Result<T>::failure(std::move(last_error));
}
} // namespace framework

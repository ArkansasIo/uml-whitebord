#pragma once

#include <string>
#include <utility>
#include <variant>

namespace framework {

enum class ErrorCode {
    validation,
    not_found,
    conflict,
    unauthenticated,
    forbidden,
    rate_limited,
    dependency_failure,
    internal
};

struct AppError {
    ErrorCode code{ErrorCode::internal};
    std::string message;
};

template <typename T>
class Result {
public:
    static Result success(T value) {
        return Result(std::in_place_index<0>, std::move(value));
    }

    static Result failure(AppError error) {
        return Result(std::in_place_index<1>, std::move(error));
    }

    [[nodiscard]] bool has_value() const noexcept {
        return data_.index() == 0;
    }

    explicit operator bool() const noexcept {
        return has_value();
    }

    [[nodiscard]] const T& value() const& {
        return std::get<0>(data_);
    }

    [[nodiscard]] T& value() & {
        return std::get<0>(data_);
    }

    [[nodiscard]] T&& value() && {
        return std::get<0>(std::move(data_));
    }

    [[nodiscard]] const AppError& error() const& {
        return std::get<1>(data_);
    }

private:
    template <std::size_t Index, typename Value>
    explicit Result(std::in_place_index_t<Index> index, Value&& value)
        : data_(index, std::forward<Value>(value)) {}

    std::variant<T, AppError> data_;
};

} // namespace framework

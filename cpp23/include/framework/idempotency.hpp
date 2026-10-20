#pragma once
#include "framework/result.hpp"
#include <mutex>
#include <string>
#include <unordered_map>
namespace framework {
// Process-local reference store only. Production distributed services need durable atomic storage.
class IdempotencyStore {
public:
    struct Entry { std::string fingerprint; std::string result; bool completed{false}; };
    [[nodiscard]] Result<Entry> reserve(std::string principal, std::string key, std::string fingerprint) {
        if (principal.empty() || key.empty() || fingerprint.empty())
            return Result<Entry>::failure({ErrorCode::validation, "Principal, key, and fingerprint are required."});
        std::lock_guard lock(mutex_);
        const auto compound = make_key(principal, key);
        const auto it = entries_.find(compound);
        if (it != entries_.end()) {
            if (it->second.fingerprint != fingerprint)
                return Result<Entry>::failure({ErrorCode::conflict, "Idempotency key reused with different request."});
            return Result<Entry>::success(it->second);
        }
        Entry entry{std::move(fingerprint), {}, false};
        entries_.emplace(compound, entry);
        return Result<Entry>::success(std::move(entry));
    }
    [[nodiscard]] Result<bool> complete(std::string principal, std::string key,
                                        std::string fingerprint, std::string result) {
        std::lock_guard lock(mutex_);
        const auto it = entries_.find(make_key(principal, key));
        if (it == entries_.end() || it->second.fingerprint != fingerprint)
            return Result<bool>::failure({ErrorCode::not_found, "Idempotency reservation not found."});
        it->second.result = std::move(result);
        it->second.completed = true;
        return Result<bool>::success(true);
    }
private:
    [[nodiscard]] static std::string make_key(const std::string& principal, const std::string& key) {
        return std::to_string(principal.size()) + ":" + principal + key;
    }
    std::mutex mutex_;
    std::unordered_map<std::string, Entry> entries_;
};
} // namespace framework

#pragma once
#include <string>
#include <string_view>
namespace framework {
struct AuditEvent {
    std::string actor_id;
    std::string action;
    std::string resource_id;
    std::string outcome;
    std::string correlation_id;
};
class AuditSink {
public:
    virtual ~AuditSink() = default;
    // Implementations should persist records to an access-controlled, tamper-evident sink.
    virtual bool write(const AuditEvent& event) noexcept = 0;
};
[[nodiscard]] inline bool record_audit(AuditSink& sink, const AuditEvent& event) noexcept {
    if (event.action.empty() || event.outcome.empty()) return false;
    return sink.write(event);
}
} // namespace framework

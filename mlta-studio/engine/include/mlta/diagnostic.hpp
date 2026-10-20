#pragma once
#include <cstddef>
#include <string>
#include <utility>
#include <vector>
namespace mlta {
enum class Severity { Info, Warning, Error };
struct Diagnostic { Severity severity{Severity::Info}; std::string code; std::string message; std::size_t line{0}; std::size_t column{0}; };
struct Diagnostics {
 std::vector<Diagnostic> entries;
 [[nodiscard]] bool hasErrors() const { for(const auto& d:entries) if(d.severity==Severity::Error)return true; return false; }
 void error(std::string code,std::string message,std::size_t line=0,std::size_t column=0){entries.push_back({Severity::Error,std::move(code),std::move(message),line,column});}
 void warning(std::string code,std::string message,std::size_t line=0,std::size_t column=0){entries.push_back({Severity::Warning,std::move(code),std::move(message),line,column});}
};
} // namespace mlta

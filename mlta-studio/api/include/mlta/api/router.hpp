#pragma once
#include "mlta/engine.hpp"
#include <map>
#include <string>
namespace mlta::api {
struct Request { std::string method{"GET"}; std::string path{"/health"}; std::map<std::string,std::string,std::less<>> headers; std::string body; };
struct Response { int status{200}; std::string contentType{"application/json"}; std::string body; };
class Router { public: explicit Router(const MLTAEngine& engine):engine_(engine){} [[nodiscard]] Response handle(const Request& request) const; private: const MLTAEngine& engine_; };
} // namespace mlta::api

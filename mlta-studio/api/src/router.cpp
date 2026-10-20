#include "mlta/api/router.hpp"
#include <sstream>
#include <string>
#include <string_view>
#include <utility>
namespace mlta::api { namespace {
std::string esc(std::string_view s){std::string o;for(char c:s){switch(c){case '"':o+="\\\"";break;case '\\':o+="\\\\";break;case '\n':o+="\\n";break;case '\r':o+="\\r";break;case '\t':o+="\\t";break;default:if(static_cast<unsigned char>(c)<0x20U)o+=' ';else o+=c;}}return o;}
std::string diagnostics(const mlta::Diagnostics& ds){std::ostringstream o;o<<'[';bool first=true;for(const auto&d:ds.entries){if(!first)o<<',';first=false;const char*s=d.severity==mlta::Severity::Error?"error":d.severity==mlta::Severity::Warning?"warning":"info";o<<"{\"severity\":\""<<s<<"\",\"code\":\""<<esc(d.code)<<"\",\"message\":\""<<esc(d.message)<<"\",\"line\":"<<d.line<<",\"column\":"<<d.column<<'}';}o<<']';return o.str();}
mlta::api::Response json(int status,std::string body){return {status,"application/json; charset=utf-8",std::move(body)};}
}
Response Router::handle(const Request&r)const{
 if(r.method=="GET"&&r.path=="/health")return json(200,"{\"status\":\"ok\",\"service\":\"mlta-engine\"}");
 if(r.method=="GET"&&r.path=="/v1/capabilities"){std::ostringstream o;o<<"{\"capabilities\":[";auto c=engine_.capabilities();for(std::size_t i=0;i<c.size();++i){if(i)o<<',';o<<'\"'<<esc(c[i])<<'\"';}o<<"]}";return json(200,o.str());}
 if(r.method=="POST"&&r.path=="/v1/validate"){auto x=engine_.validate(r.body);return json(x.valid?200:422,std::string("{\"valid\":")+(x.valid?"true":"false")+",\"expressionCount\":"+std::to_string(x.expressionCount)+",\"diagnostics\":"+diagnostics(x.diagnostics)+"}");}
 if(r.method=="POST"&&r.path=="/v1/execute"){auto x=engine_.execute(r.body);std::string v="null";if(auto p=std::get_if<bool>(&x.value.data))v=*p?"true":"false";else if(auto p=std::get_if<std::int64_t>(&x.value.data))v=std::to_string(*p);else if(auto p=std::get_if<double>(&x.value.data))v=std::to_string(*p);else if(auto p=std::get_if<std::string>(&x.value.data))v="\""+esc(*p)+"\"";else if(!x.value.isNull())v="\"<"+x.value.typeName()+">\"";std::ostringstream t;t<<'[';for(std::size_t i=0;i<x.trace.size();++i){if(i)t<<',';t<<'\"'<<esc(x.trace[i])<<'\"';}t<<']';return json(x.success?200:422,std::string("{\"success\":")+(x.success?"true":"false")+",\"value\":"+v+",\"instructionsUsed\":"+std::to_string(x.instructionsUsed)+",\"trace\":"+t.str()+",\"diagnostics\":"+diagnostics(x.diagnostics)+"}");}
 return json(404,"{\"error\":\"route_not_found\",\"message\":\"No route matches this method and path\"}");
}
} // namespace mlta::api

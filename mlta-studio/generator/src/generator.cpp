#include "mlta/generator.hpp"
#include <cctype>
#include <fstream>
#include <sstream>
#include <string_view>
#include <utility>
namespace mlta::generator { namespace {
bool validSlug(std::string_view s){if(s.empty()||s.size()>64)return false;for(char c:s)if(!(std::isalnum(static_cast<unsigned char>(c))||c=='-'||c=='_'))return false;return true;}
std::string yamlEscape(std::string_view s){std::string o;for(char c:s){if(c=='"'||c=='\\')o+='\\';if(c=='\n'||c=='\r')o+=' ';else o+=c;}return o;}
std::string cppEscape(std::string_view s){std::string o;for(char c:s){if(c=='"'||c=='\\')o+='\\';if(c=='\n')o+="\\n";else if(c=='\r')o+="\\r";else o+=c;}return o;}
bool validVersion(std::string_view s){if(s.empty()||s.front()=='.'||s.back()=='.'||s.find("..")!=std::string_view::npos)return false;bool digit=false;for(char c:s){if(c>='0'&&c<='9')digit=true;else if(c!='.')return false;}return digit;}
bool writeFile(const std::filesystem::path& p,const std::string& c){std::ofstream out(p,std::ios::binary|std::ios::trunc);if(!out)return false;out<<c;return static_cast<bool>(out);}
}
GenerateResult generateApiApplication(const ApplicationSpec& spec,const std::filesystem::path& destination){
 GenerateResult r;
 if(!validSlug(spec.slug)){r.diagnostics.error("E_PROJECT_SLUG","Project slug must contain only letters, digits, hyphens, and underscores (max 64 characters)");return r;}
 if(spec.name.empty()||!validVersion(spec.version)){r.diagnostics.error("E_PROJECT_METADATA","Project name and version are required");return r;}
 for(const auto& e:spec.endpoints){if(e.method!="GET"&&e.method!="POST"&&e.method!="PUT"&&e.method!="PATCH"&&e.method!="DELETE"){r.diagnostics.error("E_HTTP_METHOD","Unsupported HTTP method: "+e.method);return r;}if(e.path.empty()||e.path.front()!='/'){r.diagnostics.error("E_ROUTE_PATH","API route paths must start with '/'");return r;}}
 try{
  r.projectDirectory=destination/spec.slug;
  std::filesystem::create_directories(r.projectDirectory/"src");
  std::filesystem::create_directories(r.projectDirectory/"api");
  std::ostringstream openapi;openapi<<"openapi: 3.1.0\ninfo:\n  title: \""<<yamlEscape(spec.name)<<"\"\n  version: \""<<yamlEscape(spec.version)<<"\"\n  description: \""<<yamlEscape(spec.description)<<"\"\npaths:\n";
  for(const auto&e:spec.endpoints)openapi<<"  \""<<yamlEscape(e.path)<<"\":\n    "<<e.method<<":\n      summary: \""<<yamlEscape(e.summary)<<"\"\n      responses:\n        '200':\n          description: Successful response\n";
  const std::string cmake="cmake_minimum_required(VERSION 3.25)\nproject("+spec.slug+" VERSION "+spec.version+" LANGUAGES CXX)\nset(CMAKE_CXX_STANDARD 23)\nset(CMAKE_CXX_STANDARD_REQUIRED ON)\nset(CMAKE_CXX_EXTENSIONS OFF)\nadd_executable(api_app src/main.cpp)\n";
  const std::string main="#include <iostream>\n\nint main() {\n    std::cout << \""+cppEscape(spec.name)+" API application scaffold\\n\";\n    std::cout << \"This generated starter documents API routes; add an HTTP adapter before network exposure.\\n\";\n    return 0;\n}\n";
  const std::string readme="# "+spec.name+"\n\n"+spec.description+"\n\n## Build\n\n    cmake -S . -B build -DCMAKE_BUILD_TYPE=Release\n    cmake --build build\n\nThe starter includes an OpenAPI contract in api/openapi.yaml. It does not start an HTTP server yet. Add a transport adapter, authentication, authorization, TLS, rate limiting, and request limits before exposing routes to a network.\n";
  const std::vector<std::pair<std::filesystem::path,std::string>> contents={{"CMakeLists.txt",cmake},{"src/main.cpp",main},{"README.md",readme},{"api/openapi.yaml",openapi.str()}};
  for(const auto& item:contents){const auto path=r.projectDirectory/item.first;if(!writeFile(path,item.second)){r.diagnostics.error("E_FILE_WRITE","Unable to write generated file: "+path.string());return r;}r.files.push_back(path);}
  r.success=true;
 }catch(const std::filesystem::filesystem_error& e){r.diagnostics.error("E_FILESYSTEM",e.what());}
 return r;
}
} // namespace mlta::generator

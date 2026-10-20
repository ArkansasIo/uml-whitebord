#pragma once
#include <cstdint>
#include <functional>
#include <map>
#include <string>
#include <variant>
#include <utility>
#include <vector>
namespace mlta {
struct Value {
 using Array=std::vector<Value>; using Object=std::map<std::string,Value,std::less<>>;
 using Storage=std::variant<std::monostate,bool,std::int64_t,double,std::string,Array,Object>;
 Storage data{};
 Value()=default; Value(bool v):data(v){} Value(std::int64_t v):data(v){} Value(int v):data(static_cast<std::int64_t>(v)){}
 Value(double v):data(v){} Value(const char* v):data(std::string(v)){} Value(std::string v):data(std::move(v)){}
 Value(Array v):data(std::move(v)){} Value(Object v):data(std::move(v)){}
 [[nodiscard]] bool isNull() const noexcept{return std::holds_alternative<std::monostate>(data);}
 [[nodiscard]] std::string typeName() const {switch(data.index()){case 0:return "null";case 1:return "boolean";case 2:return "integer";case 3:return "float";case 4:return "string";case 5:return "array";case 6:return "object";default:return "unknown";}}
};
} // namespace mlta

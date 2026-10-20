#include "mlta/engine.hpp"
#include <charconv>
#include <cctype>
#include <memory>
#include <sstream>
#include <stdexcept>
#include <utility>
namespace mlta { namespace {
struct ParseFailure:std::runtime_error{std::size_t column;ParseFailure(std::string m,std::size_t c):std::runtime_error(std::move(m)),column(c){}};
class Parser {
 std::string_view s_; std::size_t p_{0};
 void ws(){while(p_<s_.size()&&std::isspace(static_cast<unsigned char>(s_[p_])))++p_;}
 bool take(char c){ws();if(p_<s_.size()&&s_[p_]==c){++p_;return true;}return false;}
 std::string ident(){ws();auto b=p_;while(p_<s_.size()){auto c=static_cast<unsigned char>(s_[p_]);if(!(std::isalnum(c)||c=='_'||c=='-'))break;++p_;}if(b==p_)throw ParseFailure("Expected literal or operation",p_+1);return std::string(s_.substr(b,p_-b));}
 std::shared_ptr<LogicNode> make(NodeKind k,std::string name={}){auto n=std::make_shared<LogicNode>();n->id=++nextId_;n->kind=k;n->name=name;n->operation=name;return n;}
 inline static std::uint64_t nextId_{0};
 std::shared_ptr<LogicNode> expr(){
  ws();if(p_>=s_.size())throw ParseFailure("Expected expression",p_+1);
  if(s_[p_]=='"'){++p_;std::string v;while(p_<s_.size()&&s_[p_]!='"'){if(s_[p_]=='\\'&&p_+1<s_.size()){++p_;char c=s_[p_++];if(c=='n')v+='\n';else if(c=='t')v+='\t';else v+=c;}else v+=s_[p_++];}if(p_>=s_.size())throw ParseFailure("Unterminated string literal",p_+1);++p_;auto n=make(NodeKind::Literal,"string");n->value=Value(std::move(v));return n;}
  if(s_[p_]=='-'||std::isdigit(static_cast<unsigned char>(s_[p_]))){auto b=p_;if(s_[p_]=='-')++p_;while(p_<s_.size()&&std::isdigit(static_cast<unsigned char>(s_[p_])))++p_;bool fl=false;if(p_<s_.size()&&s_[p_]=='.'){fl=true;++p_;while(p_<s_.size()&&std::isdigit(static_cast<unsigned char>(s_[p_])))++p_;}std::string t(s_.substr(b,p_-b));auto n=make(NodeKind::Literal,fl?"float":"integer");if(fl){try{n->value=Value(std::stod(t));}catch(...){throw ParseFailure("Invalid float",b+1);}}else{std::int64_t v{};auto r=std::from_chars(t.data(),t.data()+t.size(),v);if(r.ec!=std::errc{})throw ParseFailure("Integer out of range",b+1);n->value=Value(v);}return n;}
  auto name=ident();if(name=="true"||name=="false"){auto n=make(NodeKind::Literal,"boolean");n->value=Value(name=="true");return n;}if(name=="null")return make(NodeKind::Literal,"null");if(!take('('))return make(NodeKind::Variable,name);auto n=make(NodeKind::Operation,name);if(!take(')')){do{n->addChild(expr());}while(take(','));if(!take(')'))throw ParseFailure("Expected closing ')'",p_+1);}return n;
 }
public: explicit Parser(std::string_view s):s_(s){} std::shared_ptr<LogicNode> parse(){auto n=expr();ws();if(p_!=s_.size())throw ParseFailure("Unexpected trailing input",p_+1);return n;}
};
bool truthy(const Value& v){if(auto p=std::get_if<bool>(&v.data))return *p;if(auto p=std::get_if<std::int64_t>(&v.data))return *p!=0;if(auto p=std::get_if<double>(&v.data))return *p!=0.0;if(auto p=std::get_if<std::string>(&v.data))return !p->empty();return !v.isNull();}
bool numeric(const Value& v,double& n){if(auto p=std::get_if<std::int64_t>(&v.data)){n=static_cast<double>(*p);return true;}if(auto p=std::get_if<double>(&v.data)){n=*p;return true;}return false;}
std::string display(const Value& v){if(v.isNull())return "null";if(auto p=std::get_if<bool>(&v.data))return *p?"true":"false";if(auto p=std::get_if<std::int64_t>(&v.data))return std::to_string(*p);if(auto p=std::get_if<double>(&v.data)){std::ostringstream o;o<<*p;return o.str();}if(auto p=std::get_if<std::string>(&v.data))return *p;return "<"+v.typeName()+">";}
Value evaluate(const LogicNode& n,LogicContext& c,const ResourceLimits& l,std::size_t depth){
 if(depth>l.maxDepth)throw std::runtime_error("Maximum expression depth exceeded");if(++c.instructionsUsed>l.maxInstructions)throw std::runtime_error("Instruction budget exceeded");if(!n.enabled)return {};
 if(n.kind==NodeKind::Literal)return n.value;if(n.kind==NodeKind::Variable){auto it=c.variables.find(n.name);if(it==c.variables.end())throw std::runtime_error("Undefined variable: "+n.name);return it->second;}
 std::vector<Value>a;for(const auto& ch:n.children)a.push_back(evaluate(*ch,c,l,depth+1));c.trace.push_back(n.operation+"("+std::to_string(a.size())+" args)");
 auto arity=[&](std::size_t x){if(a.size()!=x)throw std::runtime_error("Operation expects "+std::to_string(x)+" argument(s)");};
 if(n.operation=="not"){arity(1);return Value(!truthy(a[0]));}if(n.operation=="and"){bool v=true;for(auto&x:a)v=v&&truthy(x);return Value(v);}if(n.operation=="or"){bool v=false;for(auto&x:a)v=v||truthy(x);return Value(v);}
 if(n.operation=="eq"){arity(2);return Value(display(a[0])==display(a[1]));}if(n.operation=="concat"){std::string s;for(auto&x:a)s+=display(x);return Value(std::move(s));}
 if(n.operation=="add"||n.operation=="sub"||n.operation=="mul"||n.operation=="div"||n.operation=="gt"||n.operation=="lt"){arity(2);double x{},y{};if(!numeric(a[0],x)||!numeric(a[1],y))throw std::runtime_error("Numeric operation requires numbers");if(n.operation=="add")return Value(x+y);if(n.operation=="sub")return Value(x-y);if(n.operation=="mul")return Value(x*y);if(n.operation=="div"){if(y==0)throw std::runtime_error("Division by zero");return Value(x/y);}if(n.operation=="gt")return Value(x>y);return Value(x<y);}
 throw std::runtime_error("Unknown operation: "+n.operation);
}
} // namespace
MLTAEngine::MLTAEngine(EngineConfig c):config_(std::move(c)){if(!config_.limits.maxDepth)config_.limits.maxDepth=1;if(!config_.limits.maxInstructions)config_.limits.maxInstructions=1;}
ValidationResult MLTAEngine::validate(std::string_view s) const {ValidationResult r;if(s.size()>config_.limits.maxSourceBytes){r.diagnostics.error("E_SOURCE_LIMIT","Source exceeds configured byte limit");return r;}std::size_t start=0,line=0;while(start<=s.size()){++line;auto end=s.find('\n',start);auto len=(end==std::string_view::npos?s.size():end)-start;auto row=s.substr(start,len);auto first=row.find_first_not_of(" \t\r");if(first!=std::string_view::npos&&!row.substr(first).starts_with("#")){try{(void)Parser(row.substr(first)).parse();++r.expressionCount;}catch(const ParseFailure&e){r.diagnostics.error("E_PARSE",e.what(),line,e.column+first);}}if(end==std::string_view::npos)break;start=end+1;}if(!r.expressionCount&&!r.diagnostics.hasErrors())r.diagnostics.error("E_EMPTY","No expressions found");r.valid=!r.diagnostics.hasErrors();return r;}
LogicResult MLTAEngine::execute(std::string_view s,const std::map<std::string,Value,std::less<>>& vars) const {LogicResult r;if(s.size()>config_.limits.maxSourceBytes){r.diagnostics.error("E_SOURCE_LIMIT","Source exceeds configured byte limit");return r;}LogicContext c;c.variables=vars;std::size_t start=0;try{while(start<=s.size()){auto end=s.find('\n',start);auto len=(end==std::string_view::npos?s.size():end)-start;auto row=s.substr(start,len);auto first=row.find_first_not_of(" \t\r");if(first!=std::string_view::npos&&!row.substr(first).starts_with("#"))r.value=evaluate(*Parser(row.substr(first)).parse(),c,config_.limits,0);if(end==std::string_view::npos)break;start=end+1;}if(!c.instructionsUsed)throw std::runtime_error("No expressions found");r.success=true;}catch(const ParseFailure&e){c.diagnostics.error("E_PARSE",e.what(),0,e.column);}catch(const std::exception&e){c.diagnostics.error("E_EXECUTION",e.what());}r.diagnostics=std::move(c.diagnostics);r.trace=std::move(c.trace);r.instructionsUsed=c.instructionsUsed;return r;}
std::vector<std::string> MLTAEngine::capabilities() const{return {"expression-parser","tree-evaluator","typed-values","variables","diagnostics","execution-trace","resource-limits","validation-api"};}
} // namespace mlta

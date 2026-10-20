#include "mlta_studio/catalog.hpp"
namespace mlta::studio {
std::vector<ComponentDefinition> componentCatalog(){return {
{"Application","Application","Root application manifest",{{"id","string","Stable project identifier",true},{"name","string","Display name",true},{"version","semver","Application version",true},{"entryPoint","path","Startup page or module",true},{"environment","enum","development, test, production",true}}},
{"Logic","Master","Root node of a logic tree",{{"id","uint64","Unique node id",true},{"enabled","boolean","Whether the node executes",true},{"children","array<Node>","Child logic nodes",false}}},
{"Logic","Statement","Single expression or action",{{"expression","string","Expression source",true},{"resultType","type","Expected result type",false}}},
{"Logic","Branch","Conditional control flow",{{"condition","expression","Boolean condition",true},{"then","Node","True branch",false},{"else","Node","False branch",false}}},
{"Logic","Module","Reusable module boundary",{{"name","string","Module name",true},{"imports","array<string>","Imported modules",false},{"exports","array<string>","Public symbols",false}}},
{"Logic","Class","Class/type declaration",{{"name","string","Class name",true},{"base","string","Optional base class",false},{"members","array<Member>","Fields and methods",false}}},
{"Logic","Type","Type definition",{{"name","string","Type name",true},{"kind","enum","primitive, object, enum, alias",true},{"nullable","boolean","Whether null is allowed",false}}},
{"Logic","Array","Typed collection",{{"elementType","type","Element type",true},{"length","integer","Optional fixed length",false},{"maxElements","integer","Resource cap",false}}},
{"Logic","Operation","Built-in or registered operation",{{"operator","string","Operation name",true},{"arguments","array<Node>","Operand expressions",false}}},
{"Logic","Function","Reusable callable unit",{{"name","string","Function name",true},{"parameters","array<Parameter>","Typed parameters",false},{"returnType","type","Return type",false}}},
{"Data","Field","Typed field/property",{{"key","string","Stable field key",true},{"type","type","Field data type",true},{"default","Value","Default value",false},{"constraints","array<Constraint>","Validation rules",false}}},
{"UI","Page","Navigable application page",{{"id","string","Stable page id",true},{"title","string","Visible title",true},{"layout","string","Layout template",false},{"permissions","array<string>","Required permissions",false}}},
{"UI","Widget","Reusable interface element",{{"id","string","Stable widget id",true},{"kind","enum","text, button, input, table, tree, graph, panel",true},{"binding","path","Optional data binding",false}}},
{"API","Endpoint","API route definition",{{"method","enum","GET, POST, PUT, PATCH, DELETE",true},{"path","string","Route template",true},{"requestSchema","schema","Request body contract",false},{"responseSchema","schema","Response body contract",false},{"authPolicy","string","Authorization policy",false}}},
{"Data","Model","Persistent domain entity",{{"name","string","Model name",true},{"fields","array<Field>","Model properties",true},{"storage","enum","memory, file, sqlite, adapter",false}}},
{"Plugin","Plugin","Extension module",{{"id","string","Unique plugin id",true},{"version","semver","Plugin version",true},{"capabilities","array<string>","Declared capabilities",false},{"permissions","array<string>","Requested permissions",false}}}
};}
std::vector<ToolDefinition> toolCatalog(){return {
{"New Project","Ctrl+N","Create project manifest and source tree"},{"Open Project","Ctrl+O","Open existing project"},{"Save","Ctrl+S","Persist current document"},{"Validate","F7","Parse and validate source"},{"Run","F5","Execute current source"},{"Build","Ctrl+B","Build configured targets"},{"Debug","F9","Start a debug session"},{"Add Node","Insert","Add a logic tree node"},{"Connect Nodes","C","Connect selected nodes"},{"Delete Selection","Delete","Remove selected node or element"},{"Undo","Ctrl+Z","Undo the last edit"},{"Redo","Ctrl+Y","Redo the last undone edit"},{"Search","Ctrl+P","Search commands, files, and symbols"},{"API Explorer","","Inspect routes and API schemas"},{"Plugin Manager","","Inspect and manage extensions"},{"Settings","","Configure editor, engine, and project settings"},{"Export Diagnostics","","Export validation and execution reports"}
};}
} // namespace mlta::studio

#include "mlta/engine.hpp"
#include "mlta/api/router.hpp"
#include "mlta/generator.hpp"
#include <filesystem>
#include <cassert>
#include <iostream>
int main(){
 mlta::MLTAEngine engine;
 auto valid=engine.validate("add(2, 3)\nnot(false)");assert(valid.valid&&valid.expressionCount==2);
 auto sum=engine.execute("add(2, 3)");assert(sum.success);auto n=std::get_if<double>(&sum.value.data);assert(n&&*n==5.0);
 auto truth=engine.execute("and(true, not(false))");assert(truth.success);auto b=std::get_if<bool>(&truth.value.data);assert(b&&*b);
 auto missing=engine.execute("missingName");assert(!missing.success&&missing.diagnostics.hasErrors());
 assert(!engine.validate("add(1,").valid);
 mlta::api::Router router(engine);auto response=router.handle({"GET","/health",{}, {}});assert(response.status==200);
 response=router.handle({"POST","/v1/validate",{},"add(1, 2)"});assert(response.status==200);
 response=router.handle({"POST","/v1/execute",{},"add(1, 2)"});assert(response.status==200);
 response=router.handle({"DELETE","/unknown",{}, {}});assert(response.status==404);
 auto root=std::filesystem::temp_directory_path()/"mlta-generator-test";
 std::filesystem::remove_all(root);
 mlta::generator::ApplicationSpec spec;
 spec.name="Inventory API";spec.slug="inventory-api";spec.version="1.0.0";
 spec.endpoints={{"GET","/health","Health check"},{"GET","/v1/items","List items"}};
 auto generated=mlta::generator::generateApiApplication(spec,root);
 assert(generated.success&&generated.files.size()==4);
 assert(std::filesystem::exists(root/"inventory-api"/"api"/"openapi.yaml"));
 spec.slug="../bad";
 auto rejected=mlta::generator::generateApiApplication(spec,root);
 assert(!rejected.success&&rejected.diagnostics.hasErrors());
 std::filesystem::remove_all(root);
 std::cout<<"MLTA engine tests passed\n";
}

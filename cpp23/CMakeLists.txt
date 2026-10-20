cmake_minimum_required(VERSION 3.25)
project(FrameworkTempCpp23 VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

option(FRAMEWORK_BUILD_TESTS "Build framework tests" ON)
option(FRAMEWORK_BUILD_EXAMPLES "Build framework examples" ON)

add_library(framework_core
    src/config.cpp
    src/lifecycle.cpp
    src/validation.cpp
)
target_include_directories(framework_core PUBLIC include)
target_compile_features(framework_core PUBLIC cxx_std_23)

if(MSVC)
    target_compile_options(framework_core PRIVATE /W4 /permissive-)
else()
    target_compile_options(framework_core PRIVATE -Wall -Wextra -Wpedantic -Wconversion -Wshadow)
endif()

if(FRAMEWORK_BUILD_EXAMPLES)
    add_executable(framework_basic_example examples/basic_application.cpp)
    target_link_libraries(framework_basic_example PRIVATE framework_core)
endif()

if(FRAMEWORK_BUILD_TESTS)
    enable_testing()
    add_executable(framework_tests tests/test_main.cpp)
    target_link_libraries(framework_tests PRIVATE framework_core)
    add_test(NAME framework_tests COMMAND framework_tests)
endif()

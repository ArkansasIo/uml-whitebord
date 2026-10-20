# Development Setup

## TypeScript
Install Node.js 20+ and npm 10+. From the repository root:

    npm install
    npm run typecheck
    npm test
    npm run build

## C++23
Install CMake 3.25+ and a compiler with C++23 support. From the repository root:

    cmake -S cpp23 -B build/cpp23 -DCMAKE_BUILD_TYPE=Release
    cmake --build build/cpp23 --config Release
    ctest --test-dir build/cpp23 --output-on-failure

Run the example:

    ./build/cpp23/framework_basic_example

On multi-configuration generators such as Visual Studio, the executable may be under a Release subdirectory.

## Notes
- Build output belongs in ignored build directories.
- The C++ core has no third-party runtime dependency.
- Network servers, database adapters, and identity providers must be selected by the application.

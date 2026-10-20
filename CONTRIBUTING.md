# Contributing

## Workflow
1. Open an issue or describe the change before large refactors.
2. Create a focused branch and keep commits small.
3. Add or update tests for behavior changes.
4. Run TypeScript checks and tests when changing the TypeScript implementation.
5. Run the C++23 CMake build and CTest when changing C++ files.
6. Update relevant docs and algorithm specifications.
7. Open a pull request with scope, testing evidence, compatibility notes, and risks.

## Code rules
- Keep domain rules independent of transport and infrastructure.
- Validate untrusted inputs at boundaries.
- Avoid dependencies unless their value and maintenance costs are documented.
- Never commit secrets, credentials, generated build directories, or user data.
- Do not claim tests passed unless the commands or CI runs actually passed.

## Local verification
See docs/testing.md for commands.

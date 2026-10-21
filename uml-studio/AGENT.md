# UML Studio Local AI Chat Agent

UML Studio now includes an original, local-first chat-agent layer inspired by the architecture patterns used by open-source coding-agent platforms such as OpenHands, but it is not a fork or copy of OpenHands.

## Runtime

The browser UI talks to the existing Ollama adapter. Ollama runs the selected open-weight model locally, so no paid API is required.

Recommended starter models depend on the machine's available RAM/VRAM. The model name is configurable in the agent panel; `llama3.2` is the default compatibility value.

## Agent loop

```text
User message
    ↓
Local agent prompt/context
    ↓
Ollama model
    ↓
TOOL:<name> proposal
    ↓
UML tool registry
    ↓
Tool result
    ↓
Ollama follow-up
    ↓
Final answer
```

The loop is bounded by `maxSteps` to prevent runaway execution.

## Current tools

- `inspect_diagram` — read the saved UML model.
- `validate_diagram` — run structural UML validation.
- `auto_layout` — apply the deterministic grid layout tool.
- `duplicate_selection` — invoke the selection duplication tool.

The agent is not allowed to silently invent tool results.

## Security model

The browser agent does **not** execute arbitrary shell commands, install packages, modify the filesystem, or push Git commits. Those capabilities should be added only through explicit, permission-scoped adapters with human approval and an auditable command boundary.

## Future agent tools

- source search/read
- repository status
- Git diff inspection
- documentation generation
- Mermaid/PlantUML generation
- architecture smell analysis
- test-plan generation
- issue/PR proposal generation
- project memory retrieval
- MCP tool bridge
- sandboxed code execution
- human-approved Git operations

## Open-source reference

OpenHands is an MIT-licensed open-source agent platform with a broader execution environment. UML Studio uses the general agent concepts as architectural inspiration while keeping its own implementation and browser-first scope.

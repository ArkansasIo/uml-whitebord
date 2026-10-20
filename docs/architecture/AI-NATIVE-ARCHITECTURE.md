# AI-Native Architecture

UML Whiteboard is evolving into an offline-first AI-native development and knowledge environment. The browser workspace remains usable without Brain LLM, while the local runtime can connect Brain LLM to Ollama and other tools.

## Layers

1. **UI / Workspace** — VS Code-style navigation for UML, source, docs, agents, memory and runtime.
2. **AI Binder Runtime** — authoritative module registry, lifecycle, permissions, health and recovery.
3. **Brain LLM** — application-level LLM engine; Ollama is the default local inference adapter.
4. **BrainScript** — declarative orchestration/configuration language. It cannot bypass the registry.
5. **Project Memory** — persistent project graph, decisions, artifacts, tasks and verification records.
6. **Agent Workforce** — architect, UML, Blueprint, developer, documentation, testing, security, Git and verification agents.
7. **Integrations** — Git/GitHub/Ollama adapters with capability checks.

## Lifecycle

`register -> configure -> start -> execute -> verify -> self-verify -> recover/retry -> persist -> report -> stop`

The registry is the execution and permission boundary. AI-generated actions, plugins and UI commands must enter through the registry.

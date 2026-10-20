# AI Second Brain — Feature Inventory

This repository targets a full AI-native development and knowledge environment. The supplied feature inventory covers backend runtime services, AI/LLM infrastructure, agents, BrainScript, memory and knowledge, project services, code intelligence, Git/GitHub, data/API/security/plugin systems, build/DevOps, and a VS Code-style frontend.

## Core backend domains

- Runtime: module/plugin registry, dependencies, lifecycle, configuration, health, supervision, recovery, retry, events, jobs, workers, scheduling, telemetry and audit.
- AI: Brain LLM, Ollama, model management/routing, context, prompts, streaming, tools, structured output, agent execution, evaluation, verification and usage metrics.
- Agents: registry, profiles, roles, capabilities, permissions, memory, objectives, queues, workflows, teams, supervisor, sandbox, persistence, verification and recovery.
- BrainScript: lexer/tokenizer, AST, parser, interpreter, validation, execution, commands, conditions, variables, functions, events, permissions, sandboxing and debugging.
- Knowledge: persistent/short/long-term memory, project and conversation memory, semantic/episodic memory, embeddings, vector storage, knowledge graph, indexing, search, RAG, ranking, expiration, versioning and provenance.
- Development: project management, code parsing/indexing, symbols, navigation, dependency graphs, generation, completion, explanation, refactoring, static/type analysis, docs/tests and build diagnostics.
- Git/GitHub: repository management, clone/pull/push, commits, branches, merges, tags, releases, diffs, conflicts, authentication, repository browsing, issues, PRs, Actions and Pages.
- Security/extensibility: authentication, sessions, RBAC, permissions, secrets, sandboxing, network restrictions, audit, rate limits, plugin lifecycle and plugin permissions.

## Frontend domains

The target shell is VS Code-inspired: top menu, activity/navigation bar, primary and secondary sidebars, editor area, tabs, split panels, bottom panel, status bar, command palette, quick-open, breadcrumbs, docking and responsive layouts. The AI surface includes chat, model/context selection, project attachments, agent dashboards and an agent builder. Knowledge surfaces include memory explorer, knowledge graph and document center. Development surfaces include code editor, terminal, testing, UML/architecture and project management.

## Current implementation boundary

The GitHub Pages application remains offline-first. The existing UML editor is the first editor surface. Workspace navigation now exposes UML, Brain, Agents, Memory, Source, Docs, Git and Runtime so subsequent capabilities can be attached without replacing the editor.

The runtime registry remains authoritative for execution and permission checks. Browser UI must not embed GitHub credentials or execute arbitrary BrainScript.

## Build order

1. IDE foundation.
2. Brain LLM and agent runtime.
3. Memory, RAG and knowledge graph.
4. Code intelligence, testing, debugger and architecture synchronization.
5. Plugin SDK and marketplace metadata.
6. Production APIs, authentication, monitoring and packaging.

# BrainScript Specification

BrainScript is the declarative orchestration/configuration language for AI Binder. It describes modules, workflows, tasks, agents, events, dependencies and verification policies.

## Safety model

BrainScript is not JavaScript. Scripts are parsed into an AST and executed by a constrained runtime. Arbitrary source evaluation, unrestricted process execution, credential access and network access are capabilities that require explicit runtime permissions and are not granted by syntax alone.

## Core lifecycle

`register -> configure -> start -> execute -> verify -> self-verify -> recover/retry -> persist -> report -> stop`

## Example

```brainscript
workflow BuildFeature {
    agent = development

    inputs {
        project.memory
        uml.current
        repository.current
    }

    steps {
        analyze
        design
        implement
        test
        verify
        document
        persist
    }

    verification {
        contract = required
        tests = required
        self_verify = true
        recovery = bounded
        max_retries = 2
    }
}
```

## Runtime contract

The Module Registry is authoritative. A BrainScript operation must resolve its target module, validate dependencies, check permissions, execute through the registry, verify the result and persist an audit record.

## Planned grammar domains

- `module` declarations
- `agent` declarations
- `workflow` declarations
- `task` declarations
- `event` declarations
- `permissions` blocks
- `configuration` blocks
- `verification` blocks
- conditional expressions
- variables and immutable configuration values
- bounded loops for data/workflow processing

The first runtime should prefer a small grammar with strong validation over a large general-purpose language.

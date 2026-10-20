# BrainScript Specification

BrainScript is a constrained declarative language for workflows, module configuration and agent orchestration.

```brainscript
workflow BuildFeature {
  agent = development
  inputs = [project.memory, uml.current, repository.current]

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
    contract = true
    tests = true
    self_verify = true
    recovery = true
  }
}
```

The initial parser intentionally supports a small grammar. Future versions can add module declarations, triggers and typed inputs without permitting arbitrary JavaScript execution.

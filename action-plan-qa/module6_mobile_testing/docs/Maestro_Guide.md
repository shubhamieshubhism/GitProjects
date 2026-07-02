# Maestro Guide

Maestro is a YAML‑based mobile testing framework that is very easy to write and read.

## Key Concepts
- **Flows**: A sequence of actions (tap, input, assert).
- **Commands**: `tapOn`, `inputText`, `assertVisible`, `launchApp`.
- **YAML**: No coding required – ideal for smoke tests.

## Running Maestro Tests
Install Maestro CLI, then run:
```bash
maestro test tests/maestro/signup-flow.yaml
```

For interactive editing:
```bash
maestro studio
```

Maestro is great for fast feedback and non‑technical team members.

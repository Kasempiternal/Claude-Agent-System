# Claude Agent System Plugin

CAS gives Claude Code four focused capabilities:

| Command | Job |
|---|---|
| `/spectre` | Deep parallel research with synthesis and claim validation |
| `/gpt-architect` | Guarded delegation to a separately configured normal Codex MCP |
| `/hydra` | Explicit multi-task execution through native Claude Agent Teams |
| `/setup-hooks` | Verification of secret protection and rm/commit/push approval gates |

GPT Architect and native Agent Teams are intentionally separate modes. Run `/gpt-architect off` before Spectre or Hydra. Ordinary builds and tests stay automatic; secrets, every `rm`, `git commit`, and `git push` require approval.

Specialists including `/review`, `/cyberconan`, `/gonk-test`, `/cccontrol`, `/phoenix`, and `/l30` remain available. Earlier swarm and routing workflows are retained for compatibility and experimentation but are no longer the recommended default.

Install from Claude Code:

```text
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install cas
```

See the [repository README](../README.md) for execution modes, Codex model and effort routing, prerequisites, and the complete safety contract.

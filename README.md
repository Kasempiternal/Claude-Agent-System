# Claude Agent System

**Research deeply. Delegate precisely. Parallelize deliberately. Keep sensitive actions gated.**

Claude Agent System (CAS) is a focused Claude Code plugin built around four workflows that are useful in real sessions:

| Core capability | Command | Purpose |
|---|---|---|
| Deep research | `/spectre` | Parallel research, synthesis, and independent claim validation |
| Codex delegation | `/gpt-architect` | Claude keeps architectural control while a normal Codex MCP handles focused repository work |
| Explicit parallel execution | `/hydra` | Deterministic Claude Agent Teams for several coordinated tasks—without Dynamic Workflows |
| Safety perimeter | `/setup-hooks` | Verifies secret protection and approval gates for removal, commits, and pushes |

The rest of the plugin remains available as an optional toolbox, but these four capabilities define the recommended CAS experience.

## Install

Run these commands inside Claude Code:

```text
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install cas
```

After an upgrade, start a new Claude Code session so the current skill and hook definitions are loaded.

## Three execution modes

CAS keeps delegation modes explicit. They are tools for different jobs, not layers to stack indiscriminately.

### 1. Direct Claude

This is the default. Claude reads, edits, runs tools, and talks to you directly. Use it for normal work that does not benefit from delegation.

### 2. GPT Architect

Use `/gpt-architect` when Claude should remain the architect while Codex performs a focused implementation, diagnosis, or review.

```text
/gpt-architect investigate the failing synchronization tests and implement a verified fix
/gpt-architect on
/gpt-architect off
```

- One-shot form delegates only the supplied task.
- `on` makes Codex the exclusive delegation backend for the current conversation.
- `off` restores native Claude teammates immediately.
- New sessions always start OFF; no marker files, background workers, or global mode are created.
- Immediately before delegation, Claude shows `Codex → <model>/<effort>: <task>` so you can see what is running and why.

GPT Architect uses the separately configured **normal Codex MCP**. CAS does not install a wrapper service, approval window, watcher, fleet, or quota daemon.

### 3. Native Claude Agent Teams

Use `/spectre` or `/hydra` when the task genuinely benefits from coordinated native Claude teammates.

Agent Teams and GPT Architect are intentionally exclusive. If `GPT-A ON` is visible in your session, run:

```text
/gpt-architect off
```

Then invoke `/spectre` or `/hydra`. Both skills stop before launching teammates if GPT Architect is still ON, which prevents confusing hook failures and accidental mixed orchestration.

## GPT Architect routing

Claude selects both a model and an effort level for every Codex call. The goal is the lowest-cost route that still matches the task’s risk and ambiguity.

| Model | Default lane |
|---|---|
| `gpt-5.3-codex-spark` | Tiny, near-instant, low-risk edits on an already known surface |
| `gpt-5.6-luna` | Mechanical transformations, extraction, classification, and exact structured work |
| `gpt-5.6-terra` | Everyday implementation, debugging, tests, and focused code review |
| `gpt-5.6-sol` | Architecture, security, concurrency, performance, or ambiguous cross-system work |

| Effort | Meaning |
|---|---|
| `low` | Obvious and primarily mechanical |
| `medium` | Bounded work requiring ordinary planning and validation |
| `high` | Behavioral work with meaningful edge cases or tradeoffs |
| `xhigh` | Difficult work with interacting invariants or substantial uncertainty |
| `max` | The hardest single coherent problem |
| `ultra` | Explicitly authorized parallel delegation for genuinely independent branches |

Typical defaults are Spark `low` or `medium`, Luna `low` or `medium`, Terra `medium` or `high`, and Sol `high` or `xhigh`. `max` is exceptional. `ultra` is a parallelism mode, not a generic quality switch.

### Spark’s fast lane

Spark is deliberately narrow. It is appropriate only when the file or tiny surface is already known, the expected behavior is unambiguous, the change is low risk, and a focused check can validate it.

Do not use Spark for repository discovery, broad diagnosis, synchronization, networking reliability, authentication, permissions, security, privacy, persistence, migrations, dependencies, concurrency, or release behavior. Those go directly to Terra or Sol.

After Spark writes executable code, Claude inspects the diff and validation, then normally requests a separate read-only Terra `medium` review. A substantive review finding is corrected by Terra or Sol—not by repeatedly pushing Spark beyond its lane.

## Safety contract

CAS protects a narrow set of high-consequence actions without interrupting ordinary development.

| Action | Behavior |
|---|---|
| Read or alter `.env`, credentials, private keys, or secret-bearing data | Ask through the secret-protection hook |
| Any `rm` command | Ask |
| `git commit` or `git commit-tree` | Ask |
| `git push` | Ask |
| Builds, tests, formatters, package managers, ordinary edits, and read-only Git | Continue automatically |

The hook parser recognizes common wrappers, nested shell commands, assignments, and global Git options. It does not rely on a fragile substring check.

When GPT Architect delegates work, Codex must never execute `rm`, `git commit`, or `git push`. Codex stops and returns the proposed command to Claude; only Claude may invoke it, and the CAS hook becomes the single approval point. This keeps sensitive repository state changes visible without creating approval noise for every test command.

Run `/setup-hooks` to verify the installed contract and remove obsolete duplicate hooks from older CAS installations.

## `/spectre`: research with evidence

Spectre decomposes a research question into independent facets, sends parallel researchers across the web, codebase, and supplied documents, synthesizes their findings, and validates important claims before compiling a report.

```text
/spectre compare the current agentic coding models for large Swift repositories
/spectre investigate the sync architecture in this repo and current GitLab API guidance
```

Spectre classifies scope from a quick scan through a comprehensive investigation, shows the proposed facets, and asks for confirmation before spending the larger research budget.

Requirements:

- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- GPT Architect OFF for the current session
- Internet access when the research needs current external evidence

## `/hydra`: deliberate native parallelism

Hydra is the explicit alternative to opaque workflow routing. Give it several tasks; it explores them together, detects cross-task file conflicts, builds a dependency graph, and executes only safe branches in parallel waves.

```text
/hydra fix authentication; add the dashboard filters; harden the sync retries
/hydra 1. refactor models 2. add API endpoints 3. update tests
```

Hydra owns the workflow after invocation. It does not hand the request to Claude Dynamic Workflows, `/zk`, `/systemcc`, or another router.

Requirements:

- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- GPT Architect OFF for the current session

Use `/setup-swarm` once if Agent Teams is not enabled.

## Optional toolbox

CAS still ships specialized and historical workflows for users who need them. They are intentionally secondary to the core stack.

### Useful specialists

| Skill | Use it for |
|---|---|
| `/review` | Seven-perspective code review with an optional fix phase |
| `/cyberconan` | Security-focused repository assessment |
| `/gonk-test` | Headless browser testing through the bundled Spectra MCP server |
| `/cccontrol` | Fast native macOS UI control through Accessibility APIs |
| `/phoenix` | Recovery-oriented workflows |
| `/l30` | Session and project reporting |

### Compatibility and experimental workflows

`/faster`, `/legion`, `/orchestrate`, `/pcc`, `/pcc-opus`, `/siege`, `/systemcc`, and `/zk` remain installed for compatibility and experimentation. They preserve earlier CAS orchestration styles, but they are not the recommended default path for new sessions.

Several of these skills use native teammates. If GPT Architect is ON, turn it OFF before invoking them.

## Requirements

- Claude Code with plugin support
- Node.js for hook scripts and bundled Node-based integrations
- A normal Codex MCP configured separately for `/gpt-architect`
- Agent Teams enabled only for the native swarm skills that require it
- Optional platform dependencies documented by specialist skills such as `/cccontrol` and `/gonk-test`

## Repository map

```text
.claude-plugin/                     marketplace manifest
claude-agent-system-plugin/
  hooks/                            automatic safety and mode guards
  skills/                           Claude Code skills
  agents/                           bundled review agents
  cccontrol-mcp/                    native macOS control bridge
docs/                               GitHub Pages site
spectra-mcp-server/                 headless browser MCP server
```

## Contributing

CAS favors a small number of clear execution modes over overlapping routers. Before proposing a new skill, check whether the behavior belongs in Spectre, GPT Architect, Hydra, a safety hook, or an existing specialist.

See [CONTRIBUTING.md](CONTRIBUTING.md) for validation and pull-request expectations.

## License

[MIT](LICENSE) © Kasempiternal

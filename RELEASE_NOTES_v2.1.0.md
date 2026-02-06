## v2.1.0 - /review v2: Self-Contained Agents + Fix Phase

### Highlights

The `/review` skill is now fully self-contained (no external plugin dependencies) and can automatically fix the issues it finds.

---

### What Changed

#### Self-Contained Review Agents

`/review` previously required `feature-dev` and `pr-review-toolkit` plugins to be installed. Now all 6 review agents are defined as `.md` files in `.claude/agents/` and run via `general-purpose` subagents. The plugin works standalone.

| Agent | File |
|-------|------|
| Bug & Logic Reviewer | `.claude/agents/review-bug-logic.md` |
| Project Guidelines Reviewer | `.claude/agents/review-guidelines.md` |
| Silent Failure Hunter | `.claude/agents/review-silent-failures.md` |
| Comment Analyzer | `.claude/agents/review-comments.md` |
| Type Design Analyzer | `.claude/agents/review-type-design.md` |
| Test Coverage Analyzer | `.claude/agents/review-test-coverage.md` |

#### Fix Phase (Replaces Simplification)

Phase 2 is no longer "simplification" - it's targeted fixes. After the review report, you choose:

- **Fix CRITICAL and MAJOR** - parallel fix agents resolve high-severity findings
- **Fix ALL** - also addresses MINOR findings
- **Report only** - keep the report, don't touch code

Fix agents are grouped by file (exclusive ownership, no merge conflicts) and make minimum changes to resolve each specific finding.

#### Improved Agent Prompts

All 6 agent prompts were improved over the originals:

- **Swarm awareness** - each agent knows it's one of 6 with explicit "stay in your lane" boundaries
- **De-overlapped** - bug-logic no longer checks conventions; guidelines no longer checks bugs
- **Standardized output** - all agents produce consistent `file:line` + severity + suggested fix format
- **Language-specific patterns** - silent-failures flags Go `_ = err`, Rust `.unwrap()`, Swift `try?`, Python `except: pass`
- **Priority filter** - comment agent filters out trivial findings
- **Type-design dual output** - per-type 1-10 ratings for report + per-finding `file:line` for fix agents

---

### Upgrade

```bash
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install pcc
```

---

**Full Changelog**: https://github.com/Kasempiternal/Claude-Agent-System/compare/v2.0.0...v2.1.0

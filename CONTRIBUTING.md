# Contributing to Claude Agent System

CAS is a Claude Code plugin for evidence-driven research, guarded Codex delegation, deliberate native parallelism, and focused safety controls.

## Design principles

1. **Prefer clear modes over more routers.** A new behavior should usually strengthen Spectre, GPT Architect, Hydra, the safety hooks, or an existing specialist.
2. **Keep expensive orchestration explicit.** Do not silently launch teammates, Dynamic Workflows, external workers, or parallel branches.
3. **Make safety narrow and predictable.** High-consequence actions should be gated; builds, tests, and ordinary development should stay automatic.
4. **Validate claims and changes.** Skills must say how completion is checked. Documentation must match the active manifests and scripts.
5. **Preserve user ownership.** Do not remove files, commit, push, publish, or alter unrelated configuration without explicit authority.

## Repository layout

```text
.claude-plugin/                     marketplace manifest
claude-agent-system-plugin/
  skills/{skill}/SKILL.md           skill definitions
  hooks/                            automatic hook scripts and manifest
  agents/                           bundled review agents
  plugin.yaml                       plugin metadata
docs/index.html                     GitHub Pages site
spectra-mcp-server/                 bundled browser MCP implementation
```

## Proposing a change

Open an issue or pull request that explains:

- the concrete session problem;
- why an existing core workflow cannot express it cleanly;
- the expected token, latency, and permission behavior;
- failure modes and recovery behavior;
- how you tested it in a real Claude Code session.

New top-level skills need a distinct job. Overlapping catch-all routers, model aliases without guardrails, and unverified autonomous loops are unlikely to be accepted.

## Development workflow

```bash
gh repo fork Kasempiternal/Claude-Agent-System --clone
cd Claude-Agent-System
git switch -c feature/short-description
```

Make focused changes and preserve unrelated work. Use conventional, imperative commit subjects such as `Fix hook registration` or `Document Hydra mode isolation`.

## Validation

Run checks appropriate to the files you changed. At minimum:

```bash
jq empty .claude-plugin/marketplace.json claude-agent-system-plugin/hooks/hooks.json
node --check claude-agent-system-plugin/hooks/*.js
node --check claude-agent-system-plugin/hooks/*.cjs
git diff --check
claude plugin validate .
```

For hook changes, feed representative `PreToolUse` JSON into the script. Never execute the sample command itself. Include both positive and negative cases so a safety fix does not create prompt noise.

For skill changes:

- validate YAML frontmatter;
- exercise the intended route in a fresh Claude Code session;
- test missing prerequisites and mode conflicts;
- verify the skill does not silently invoke a different router;
- document any model, MCP, platform, or Agent Teams requirement.

For documentation or metadata changes, search for stale versions, obsolete hooks, removed infrastructure, and contradictory installation instructions.

## Pull-request checklist

- [ ] The change solves one clear problem.
- [ ] README, plugin metadata, and active behavior agree.
- [ ] Expensive or parallel execution is visible before launch.
- [ ] Sensitive commands remain approval-gated.
- [ ] Ordinary builds and tests do not gain new prompts.
- [ ] Failure and fallback behavior are explicit.
- [ ] Relevant syntax, fixtures, and live-session checks pass.
- [ ] No credentials, private paths, or generated state are included.

## License

Contributions are licensed under the repository's [MIT License](LICENSE).

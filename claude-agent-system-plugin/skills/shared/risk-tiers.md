# Risk Tier Classification

## Decision Tree

Assign EXACTLY ONE tier per task. Walk top-down — first match wins:

| Tier | Criteria | Examples |
|------|----------|---------|
| **T3** | Irreversible OR regulated (compliance, billing, auth tokens) | Database migration without rollback, payment flow changes, credential rotation |
| **T2** | Security, privacy, or data integrity implications | Auth middleware, PII handling, encryption changes, access control |
| **T1** | User-visible behavior change OR tightly coupled to multiple modules | UI flow changes, API contract modifications, shared utility refactors |
| **T0** | Low blast radius — isolated, internal, easily reverted | Adding tests, config tweaks, documentation, internal refactors |

## Required Controls by Tier

| Tier | Validation | Review | Verification | Approval |
|------|-----------|--------|-------------|----------|
| T0 | Basic (tests pass) | Self | Relevant tests only | Auto |
| T1 | Full (tests + integration) | Independent review | Full suite + integration | Auto |
| T2 | Full + security check | Security-focused review | Full suite + auth flow review | Auto |
| T3 | Full + rollback plan | Security + human review | Full suite + rollback documented | **Human confirmation** |

## Failure-Mode Checklist (Tier 1+ only)

For every Tier 1, 2, or 3 task, the analyst MUST answer these four questions in the plan file:

| # | Question | Answer |
|---|----------|--------|
| 1 | What could fail? | {specific failure scenario} |
| 2 | How would we detect it? | {signal: test failure, runtime error, user report} |
| 3 | What is the fastest rollback? | {revert commit, feature flag, config change} |
| 4 | What is our weakest assumption? | {assumption most likely to be wrong} |

## How to Apply

- **Analysts**: Assign tiers during synthesis/CTO analysis using the decision tree above
- **Wave-prep**: Include `tier={0-3}` in each agent spec
- **Impl agents**: Tier 1+ agents see "Elevated risk" notice and verify assumptions before changes
- **Verifiers**: Scale verification depth by tier (see verification templates)
- **Orchestrator**: Display tier in briefing summaries (`Risk: Tier {0-3} — {description}`)

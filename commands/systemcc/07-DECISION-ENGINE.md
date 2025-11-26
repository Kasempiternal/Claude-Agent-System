# DECISION ENGINE MODULE

Simplified workflow selection using 3 dimensions, skill-rules, and clear decision tables.

## Skill-Rules Integration (NEW - Phase 2.4)

**Priority 1**: Check skill-rules.json for declarative matches

```python
# Before running decision engine
skill_match = match_skill_rules(user_request, loaded_files, pattern_results)

if skill_match:
    priority = skill_match["priority"]

    if priority == "critical":
        # Critical priority - always use skill-rule preference
        return skill_match["preferred_workflow"]

    elif priority == "high" and skill_match["confidence"] > 0.7:
        # High priority + high confidence - use skill-rule
        return skill_match["preferred_workflow"]

    elif priority in ["medium", "low"]:
        # Lower priority - use as hint for decision engine
        decision_hint = skill_match["preferred_workflow"]

# Continue to standard decision engine...
```

**Skill-Rules Location**: `middleware/skill-rules/skill-rules.json`

**Benefits**:
- Project-specific workflow preferences
- Declarative configuration (no code changes)
- Override-able via priority system

## Three-Dimensional Analysis

| Dimension | Description | Values |
|-----------|-------------|--------|
| **Complexity** | How complex is the task? | simple / moderate / complex |
| **Risk** | What's the risk level? | low / high |
| **Scope** | How many files affected? | single / multi / system |

## Workflow Decision Table

| Complexity | Risk | Scope | Workflow | Confidence |
|------------|------|-------|----------|------------|
| simple | low | single | orchestrated | 0.9 |
| simple | low | multi | orchestrated | 0.85 |
| simple | high | any | complete_system | 0.85 |
| moderate | low | single | orchestrated | 0.8 |
| moderate | low | multi | complete_system | 0.75 |
| moderate | high | any | complete_system | 0.85 |
| complex | any | any | complete_system | 0.8 |
| any | any | system | taskit | 0.9 |

## Priority Order

1. **Context Size** - If >30k tokens, use `taskit` (phase-based)
2. **Security Keywords** - If detected, enable security scan
3. **Web Detection** - If web app intent, use `anti-yolo-web`
4. **Risk Level** - High risk always uses `complete_system`
5. **Complexity** - Complex tasks use `complete_system`
6. **Default** - Simple/moderate tasks use `orchestrated`

## Complexity Detection

**Simple indicators** (any match = simple):
- fix, update, change, small, simple, typo, rename, style

**Complex indicators** (2+ matches = complex):
- architecture, refactor, system, integration, migration, security, database

**Moderate**: anything else

## Risk Detection

**High risk indicators**:
- critical, production, breaking, delete, remove, security
- database, authentication, payment, encryption

## Scope Detection

**System scope** (triggers `taskit`):
- "entire", "all files", "across", "throughout", "migrate all"
- Token count >30k
- More than 10 files mentioned

**Multi-file scope**:
- "multiple", "several", "files", specific file list

**Single scope**:
- Specific file mentioned, "this file", "the function"

## Security Scan Triggers

Auto-enable security scanning when task mentions:

| Category | Keywords |
|----------|----------|
| Database | sql, query, database, migration, schema |
| Auth | auth, login, password, token, jwt, session |
| Security | encrypt, decrypt, permission, role, certificate |

## Fallback Logic

If decision engine fails:
1. Check task for "fix/update/simple" → `orchestrated`
2. Check for "complex/system/architecture" → `complete_system`
3. Default → `complete_system` with 0.7 confidence

## Example Decisions

```
Task: "fix typo in readme"
→ Complexity: simple (fix, typo)
→ Risk: low
→ Scope: single
→ Workflow: orchestrated (0.9)

Task: "refactor authentication system"
→ Complexity: complex (refactor, system)
→ Risk: high (authentication)
→ Scope: multi
→ Workflow: complete_system (0.85)
→ Security scan: enabled

Task: "migrate all models to new ORM"
→ Complexity: complex (migrate)
→ Risk: high (database)
→ Scope: system (all)
→ Workflow: taskit (0.9)
→ Security scan: enabled
```

## Integration

Links to:
- `02-LYRA-OPTIMIZATION.md` - Prompt optimization
- `04-WORKFLOW-SELECTION.md` - Workflow indicators
- `05-IMPLEMENTATION-STEPS.md` - Execution flow
- `08-ERROR-HANDLING.md` - Fallback strategies

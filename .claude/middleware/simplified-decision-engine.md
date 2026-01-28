# Simplified Decision Engine

Workflow selection using 3 core dimensions and clear decision tables.

## Core Philosophy

- **Minimal complexity** - 3 dimensions instead of 8
- **Clear rules** - Decision tables, not algorithms
- **Fast decisions** - Keyword matching, no calculations
- **Predictable routing** - Same input = same workflow

## Three-Dimensional Analysis

### 1. Complexity

| Level | Keywords | Description |
|-------|----------|-------------|
| simple | fix, update, change, typo, rename, style, small, simple | Single-concern changes |
| moderate | add, feature, implement, create | New functionality |
| complex | architecture, refactor, system, integration, migration, security, database | Multi-system changes |

**Detection**: Count matches. 2+ complex keywords = complex. Any simple keyword without complex = simple. Otherwise moderate.

### 2. Risk

| Level | Keywords | Description |
|-------|----------|-------------|
| low | styling, docs, config, test, development | Non-production changes |
| high | critical, production, breaking, delete, remove, security, database, authentication, payment, encryption | Production/security impact |

**Detection**: Any high-risk keyword = high risk. Otherwise low risk.

### 3. Scope

| Level | Indicators | Description |
|-------|------------|-------------|
| single | "this file", "the function", specific file name | One file |
| multi | "multiple", "several", "files", file list | 2-10 files |
| system | "entire", "all", "across", "throughout", "migrate" | System-wide |

**Detection**: Keywords or token count >30k = system. Otherwise infer from task.

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
| any | any | system | complete_system | 0.9 |

## Priority Overrides

These override the decision table:

1. **Context >30k tokens** → `complete_system` with phase-based planning (via plan-opus)
2. **Web project detected** → `anti-yolo-web`
3. **Setup/initialize keywords** → `agetos`
4. **Feature development** → `aidevtasks`

## Security Scan Triggers

Auto-enable security scanning for these keywords:

| Category | Keywords |
|----------|----------|
| Database | sql, query, database, migration, schema, orm |
| Auth | auth, login, password, token, jwt, session, oauth |
| Security | encrypt, decrypt, permission, role, certificate, hash |
| Encoding | base64, serialize, sanitize, injection |

## Example Decisions

```
Task: "fix typo in config"
→ Complexity: simple (fix, typo)
→ Risk: low (config)
→ Scope: single
→ Workflow: orchestrated (0.9)

Task: "refactor authentication"
→ Complexity: complex (refactor)
→ Risk: high (authentication)
→ Scope: multi
→ Workflow: complete_system (0.85)
→ Security scan: enabled

Task: "migrate all database models"
→ Complexity: complex (migrate)
→ Risk: high (database)
→ Scope: system (all)
→ Workflow: complete_system (0.9)
→ Security scan: enabled
```

## Code Minimalism Standards

Always prefer:
1. **Configuration change** - Solve with settings
2. **Modify existing** - Extend current code
3. **Compose existing** - Combine utilities
4. **Create minimal** - Only when necessary

## Integration

This engine is used by:
- `commands/systemcc/07-DECISION-ENGINE.md` - Module documentation
- `middleware/lyra-universal.md` - Prompt optimization
- `middleware/workflow-enforcement.md` - Execution rules

## Confidence Levels

- **0.9+**: Very confident (clear indicators)
- **0.8-0.89**: Confident (multiple matches)
- **0.7-0.79**: Moderate (some indicators)
- **0.6-0.69**: Low (unclear)
- **<0.6**: Fallback mode

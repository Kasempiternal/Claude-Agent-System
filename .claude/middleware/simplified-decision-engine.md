# Simplified Decision Engine

Two-phase workflow selection: Domain Detection first, then Complexity Scoring fallback.

## Core Philosophy

- **Domain-first** - Specialized workflows for matching domains
- **All 6 workflows available** - Not just 3
- **Clear rules** - Decision tables, not algorithms
- **Predictable routing** - Same input = same workflow

---

## Phase 1: Domain Detection (CHECK FIRST)

Before scoring, detect if task matches a specialized domain:

| Domain | Workflow | Detection Signals |
|--------|----------|-------------------|
| **Web Development** | `anti-yolo-web` | HTML, CSS, JavaScript, React, Vue, Angular, frontend, UI, dashboard, component, web app |
| **Feature Development** | `aidevtasks` | "build feature", "create system", product requirements, user stories, multi-component features |
| **Project Setup** | `agetos` | Setup, initialize, standards, conventions, new project, project structure |
| **Deep Planning** | `plan-opus` | Architecture design, major refactor, migration, "plan first", many unknowns |

**Decision**:
- Domain match with HIGH confidence → Use specialized workflow (skip Phase 2)
- No domain match → Proceed to Phase 2

---

## Phase 2: Complexity Scoring (FALLBACK)

Only when no specialized domain detected.

### Three-Dimensional Analysis

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

## Phase 1 Priority Overrides

These domain matches ALWAYS override the complexity decision table:

| Priority | Domain | Workflow |
|----------|--------|----------|
| 1 | Web Development | `anti-yolo-web` |
| 2 | Feature Development | `aidevtasks` |
| 3 | Project Setup | `agetos` |
| 4 | Deep Planning / Architecture | `plan-opus` |
| 5 | Context >30k tokens | `plan-opus` (phase-based) |

## Security Scan Triggers

Auto-enable security scanning for these keywords:

| Category | Keywords |
|----------|----------|
| Database | sql, query, database, migration, schema, orm |
| Auth | auth, login, password, token, jwt, session, oauth |
| Security | encrypt, decrypt, permission, role, certificate, hash |
| Encoding | base64, serialize, sanitize, injection |

## Example Decisions

### Phase 1 Match (Domain Detected)
```
Task: "create a React dashboard with charts"
→ Phase 1: Web Development detected (React, dashboard, frontend)
→ Workflow: anti-yolo-web (0.95)

Task: "build a complete user authentication feature"
→ Phase 1: Feature Development detected (build feature, multi-component)
→ Workflow: aidevtasks (0.9)

Task: "setup a new TypeScript project with standards"
→ Phase 1: Project Setup detected (setup, standards)
→ Workflow: agetos (0.9)

Task: "plan the migration from REST to GraphQL"
→ Phase 1: Deep Planning detected (migration, architecture)
→ Workflow: plan-opus (0.95)
```

### Phase 2 Fallback (No Domain Match)
```
Task: "fix typo in config"
→ Phase 1: No domain match
→ Phase 2: Complexity=simple, Risk=low, Scope=single
→ Workflow: orchestrated (0.9)

Task: "refactor the payment module"
→ Phase 1: No domain match (internal refactor)
→ Phase 2: Complexity=complex, Risk=high, Scope=multi
→ Workflow: complete_system (0.85)
→ Security scan: enabled

Task: "add pagination to user list API"
→ Phase 1: No domain match (general backend)
→ Phase 2: Complexity=moderate, Risk=low, Scope=single
→ Workflow: orchestrated (0.8)
```

## Code Minimalism Standards

Always prefer:
1. **Configuration change** - Solve with settings
2. **Modify existing** - Extend current code
3. **Compose existing** - Combine utilities
4. **Create minimal** - Only when necessary

## All Available Workflows

| Workflow | Type | Best For |
|----------|------|----------|
| `anti-yolo-web` | Phase 1 | Web/frontend development |
| `aidevtasks` | Phase 1 | PRD-based feature development |
| `agetos` | Phase 1 | Project setup and standards |
| `plan-opus` | Phase 1 + Phase 2 | Planning, architecture, complex tasks |
| `complete_system` | Phase 2 | Moderate features with validation |
| `orchestrated` | Phase 2 | Simple fixes and changes |

## Integration

This engine is used by:
- `commands/systemcc/07-DECISION-ENGINE.md` - Two-phase decision logic
- `middleware/lyra-universal.md` - Prompt optimization
- `middleware/workflow-enforcement.md` - Execution rules

## Confidence Levels

- **0.9+**: Very confident (clear indicators)
- **0.8-0.89**: Confident (multiple matches)
- **0.7-0.79**: Moderate (some indicators)
- **0.6-0.69**: Low (unclear)
- **<0.6**: Fallback mode

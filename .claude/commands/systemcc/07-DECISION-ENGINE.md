# DECISION ENGINE MODULE

Two-phase workflow selection: Domain Detection first, then Complexity Scoring fallback.

## Two-Phase Decision System

**Critical**: This engine uses ALL 6 available workflows, not just 3.

### Available Workflows

| Workflow | Purpose | Best For |
|----------|---------|----------|
| `anti-yolo-web` | Web app development specialist | Frontend, React, Vue, dashboards, UI components |
| `aidevtasks` | PRD-based feature development | New features requiring product specs |
| `agetos` | Project initialization/standards | Setup, conventions, new projects |
| `plan-opus` | Deep planning with parallel exploration | Architecture, migrations, complex unknowns |
| `complete_system` | Full 6-agent validation pipeline | Moderate features, refactoring with validation |
| `orchestrated` | Streamlined 3-agent workflow | Simple fixes, config changes, quick tasks |

---

## Phase 1: Domain Detection (CHECK FIRST)

Before any scoring, Claude semantically analyzes if the task matches a specialized domain.

### Domain Detection Matrix

| Domain | Workflow | Detection Signals (Semantic, Not Keywords) |
|--------|----------|-------------------------------------------|
| **Web Development** | `anti-yolo-web` | Building/modifying web interfaces, React/Vue/Angular components, HTML/CSS/JavaScript, dashboards, forms, buttons, frontend UI, responsive design, web apps |
| **Feature Development** | `aidevtasks` | "build feature", "create system", product requirements needed, user stories, new functionality with multiple components, detailed specs beneficial |
| **Project Setup** | `agetos` | Initialize project, setup standards, establish conventions, new project structure, team coding standards, project configuration |
| **Deep Planning** | `plan-opus` | Architecture design, major refactoring, system migration, "plan first" requests, exploration needed, multiple valid approaches, significant unknowns |

### Phase 1 Decision Logic

```
IF task clearly matches a specialized domain with HIGH confidence:
   → Use that specialized workflow directly
   → Skip Phase 2

IF no domain matches OR confidence is LOW:
   → Proceed to Phase 2 (Complexity Scoring)
```

---

## Phase 2: Complexity Scoring (FALLBACK)

Only when NO specialized domain is detected, use 3-dimensional assessment.

### The Three Dimensions

| Dimension | What to Assess | Scale |
|-----------|----------------|-------|
| **Complexity** | How intricate is the implementation? | 1 (trivial) to 5 (very complex) |
| **Risk** | What could go wrong? Data loss? Breaking changes? | 1 (safe) to 5 (high stakes) |
| **Scope** | How much of the codebase is affected? | 1 (single file) to 5 (system-wide) |

### Complexity-Based Workflow Selection

| Combined Score | Workflow | Use Case |
|----------------|----------|----------|
| 1.0 - 2.0 | `orchestrated` | Bug fixes, small changes, config updates, typos |
| 2.1 - 3.5 | `complete_system` | Moderate features, refactoring, validation needed |
| 3.6 - 5.0 | `plan-opus` | Complex multi-system changes, high risk |

## Display Format

Always show the decision transparently with phase indication:

### Phase 1 Match (Domain Detected)

```
🧠 DECISION ENGINE
━━━━━━━━━━━━━━━━━━

Task: "create a React dashboard with charts"

Phase 1 - Domain Detection:
✓ Web Development detected
  → React components, dashboard UI, frontend work

→ Using **anti-yolo-web** workflow
```

### Phase 2 Fallback (No Domain Match)

```
🧠 DECISION ENGINE
━━━━━━━━━━━━━━━━━━

Task: "fix the login button color"

Phase 1 - Domain Detection:
✗ No specialized domain detected (simple CSS fix)

Phase 2 - Complexity Assessment:
• Complexity: 1/5 - Single CSS property change
• Risk: 1/5 - UI only, no logic affected
• Scope: 1/5 - One file

Combined: 1.0 → Using **orchestrated** workflow
```

---

## Example Assessments

### Example 1: Web Development → anti-yolo-web
```
Task: "build a React admin dashboard with user management"

Phase 1 - Domain Detection:
✓ Web Development detected
  → React, dashboard, user management UI

→ Using **anti-yolo-web** workflow
```

### Example 2: Feature Development → aidevtasks
```
Task: "build a complete user authentication feature with login, registration, and password reset"

Phase 1 - Domain Detection:
✓ Feature Development detected
  → Multi-component feature needing product specs

→ Using **aidevtasks** workflow
```

### Example 3: Project Setup → agetos
```
Task: "setup a new TypeScript project with proper standards and conventions"

Phase 1 - Domain Detection:
✓ Project Setup detected
  → New project, standards, conventions

→ Using **agetos** workflow
```

### Example 4: Deep Planning → plan-opus
```
Task: "plan the migration from REST API to GraphQL"

Phase 1 - Domain Detection:
✓ Deep Planning detected
  → Major migration, architecture shift, many unknowns

→ Using **plan-opus** workflow
```

### Example 5: No Domain → Complexity Fallback
```
Task: "fix typo in readme"

Phase 1 - Domain Detection:
✗ No specialized domain detected

Phase 2 - Complexity Assessment:
• Complexity: 1/5 - Single character change
• Risk: 1/5 - Documentation only
• Scope: 1/5 - One file

Combined: 1.0 → Using **orchestrated** workflow
```

### Example 6: No Domain → Moderate Complexity
```
Task: "add pagination to the user list API"

Phase 1 - Domain Detection:
✗ No specialized domain (general backend work)

Phase 2 - Complexity Assessment:
• Complexity: 2/5 - Standard pagination pattern
• Risk: 2/5 - Could affect API consumers
• Scope: 2/5 - API endpoint + tests

Combined: 2.0 → Using **orchestrated** workflow
```

### Example 7: No Domain → Higher Complexity
```
Task: "refactor the payment processing module"

Phase 1 - Domain Detection:
✗ No specialized domain (internal refactor)

Phase 2 - Complexity Assessment:
• Complexity: 3/5 - Multiple interconnected functions
• Risk: 4/5 - Payment is business-critical
• Scope: 3/5 - Payment module + integrations

Combined: 3.3 → Using **complete_system** workflow
```

---

## Security Scan Triggers

Auto-enable security scanning when task mentions:

| Category | Keywords |
|----------|----------|
| Database | sql, query, database, migration, schema, orm |
| Auth | auth, login, password, token, jwt, session, oauth |
| Security | encrypt, decrypt, permission, role, certificate, hash |
| Encoding | base64, serialize, sanitize, injection |

---

## Why Two-Phase Over Single Scoring

**Old approach (score-only)**:
- All tasks scored 1-5 on complexity/risk/scope
- Only 3 workflows available based on score
- **Problem**: Specialized workflows like `anti-yolo-web` were never selected

**New approach (domain-first)**:
- Phase 1 detects if task matches a specialized domain
- Specialized workflows get used when appropriate
- Phase 2 handles general tasks that don't fit domains
- **Benefit**: Full utilization of all 6 powerful workflows

## Semantic Analysis (Not Keyword Matching)

**Critical**: Both phases use genuine semantic understanding, not keyword detection.

Claude understands:
- "fix security vulnerability" is high-risk (not just "fix")
- "refactor CSS" is low-risk (not just "refactor")
- "create dashboard" is web development (semantic domain match)
- "build feature" may need PRD flow (semantic intent detection)

## Integration

This module integrates with:
- `02-LYRA-OPTIMIZATION.md` - Task understanding before decision
- `04-WORKFLOW-SELECTION.md` - Available workflow definitions
- `05-IMPLEMENTATION-STEPS.md` - Execution after selection

## Confidence Reporting

After assessment, Claude reports confidence:

| Confidence | Meaning | Action |
|------------|---------|--------|
| **High** (0.9+) | Clear domain match or obvious scoring | Proceed immediately |
| **Medium** (0.7-0.9) | Reasonable selection with some ambiguity | Proceed with note |
| **Low** (<0.7) | Task unclear, multiple workflows possible | Ask clarifying questions |

## Quick Reference

```
Task comes in
    │
    ▼
┌─────────────────────────┐
│  PHASE 1: Domain Check  │
│                         │
│  Web Dev? → anti-yolo   │
│  Feature? → aidevtasks  │
│  Setup?   → agetos      │
│  Planning? → plan-opus  │
└─────────────────────────┘
    │
    │ No domain match?
    ▼
┌─────────────────────────┐
│  PHASE 2: Score Tasks   │
│                         │
│  1.0-2.0 → orchestrated │
│  2.1-3.5 → complete_sys │
│  3.6-5.0 → plan-opus    │
└─────────────────────────┘
```

---

*Domain detection first, complexity scoring as fallback. All 6 workflows available.*

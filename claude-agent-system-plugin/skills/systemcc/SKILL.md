---
name: systemcc
description: "Intelligent workflow router with Lyra AI optimization, build config detection, and triple code review. Auto-analyzes complexity, risk, and scope to execute the optimal workflow automatically."
model: opus
argument-hint: <task description>
---

# SystemCC - Master Command Router

**User types:** `/systemcc "any task"`
**Claude does:** EVERYTHING automatically

---

## Phase 1: CRITICAL DETECTION (MANDATORY)

When `/systemcc` is detected, you MUST IMMEDIATELY show:

```
🎯 SYSTEMCC DETECTED - Command acknowledged and workflow initiated
✅ Following SYSTEMCC workflow instructions
```

This message MUST appear:
- **IMMEDIATELY** when /systemcc is detected
- **BEFORE** any other processing
- **CANNOT BE SKIPPED** under any circumstances

---

## Phase 2: LYRA AI PROMPT OPTIMIZATION (MANDATORY)

After detection, ALWAYS show Lyra optimization with this EXACT format:

```
═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════

📝 Original Request:
"$ARGUMENTS"

🔍 Analysis Phase:
- Deconstructing intent...
- Diagnosing gaps...
- Developing enhancements...
- Delivering optimized prompt...

✨ Optimized Prompt:
"[enhanced prompt with complete specifications]"

📊 Optimization Details:
- Mode: [BASIC/DETAIL]
- Complexity Score: [1-10]
- Improvements Applied: [number]

🔧 Key Enhancements:
• [Enhancement 1]
• [Enhancement 2]
• [Enhancement 3]

═══════════════════════════════════════════════════════════════
```

### The 4-D Methodology

1. **DECONSTRUCT**: Extract coding intent, feature requirements, technical context
2. **DIAGNOSE**: Audit for technical clarity and specification gaps
3. **DEVELOP**: Select optimal techniques based on request type:
   - Bug Fixes → Precise error context + systematic debugging
   - Feature Development → Clear requirements + implementation scope
   - Refactoring → Architecture goals + code quality standards
   - UI/UX → Design principles + user experience objectives
4. **DELIVER**: Construct development-focused prompt with complete specs

### Mode Detection

- **BASIC mode**: Simple fixes, single-file changes, typos, config updates
- **DETAIL mode**: Complex architecture, multi-component, security-sensitive

---

## Phase 3: BUILD CONFIGURATION DETECTION

Scan for and apply project build configuration rules automatically.

### Files to Scan (Priority Order)

1. `Makefile` / `makefile`
2. `.gitlab-ci.yml` / `.github/workflows/*.yml`
3. `pyproject.toml` / `setup.cfg` / `tox.ini`
4. `package.json` / `.eslintrc*` / `.prettierrc*`
5. `.pre-commit-config.yaml`
6. `.editorconfig`

### When Configuration Found, Display:

```
📋 BUILD CONFIGURATION DETECTED
═══════════════════════════════════════════════════════════════
Source: [Makefile/CI config/etc.]

✅ Formatting Rules:
   • black: line-length=[N]
   • isort: profile=black, multi-line=[N]
   • prettier: [settings]

✅ Linting Rules:
   • flake8: ignore=[codes], max-line-length=[N]
   • mypy: [settings]
   • eslint: [settings]

✅ Test Requirements:
   • [test framework] with coverage
   • minimum coverage: [N]%

═══════════════════════════════════════════════════════════════
🎯 All generated code will automatically follow these standards!
```

### When No Configuration Found:

```
📋 No build configuration detected - using best practices
```

### Apply Rules to All Generated Code

- Respect line length limits from black/prettier
- Sort imports according to isort/eslint config
- Add type hints if mypy is configured
- Follow linting rules to ensure CI/CD passes

---

## Phase 4: TWO-PHASE WORKFLOW SELECTION

**Critical**: This engine uses ALL 6 available workflows via two-phase selection.

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

### PHASE 1: Domain Detection (CHECK FIRST)

Before any scoring, semantically analyze if the task matches a specialized domain:

| Domain | Workflow | Detection Signals |
|--------|----------|-------------------|
| **Web Development** | `anti-yolo-web` | HTML, CSS, JavaScript, React, Vue, Angular, frontend, UI, dashboard, component, web app |
| **Feature Development** | `aidevtasks` | "build feature", "create system", product requirements, user stories, multi-component features |
| **Project Setup** | `agetos` | Setup, initialize, standards, conventions, new project, project structure |
| **Deep Planning** | `plan-opus` | Architecture design, major refactor, migration, "plan first", many unknowns |

**Decision Logic**:
- Domain match with HIGH confidence → Use specialized workflow (skip Phase 2)
- No domain match → Proceed to Phase 2

---

### PHASE 2: Complexity Scoring (FALLBACK)

Only when NO specialized domain is detected, use 3-dimensional assessment:

#### Dimension 1: Complexity

| Level | Indicators |
|-------|------------|
| **Simple** | fix, update, change, small, typo, rename, style, tweak, adjust |
| **Moderate** | feature, add, create, implement, modify, improve |
| **Complex** | architecture, refactor, system, integration, migration, security, database |

#### Dimension 2: Risk

| Level | Indicators |
|-------|------------|
| **Low** | docs, style, test, config (non-production), UI text |
| **High** | critical, production, breaking, delete, security, database, auth, payment, encryption |

#### Dimension 3: Scope

| Level | Indicators |
|-------|------------|
| **Single** | specific file mentioned, "this file", "the function" |
| **Multi** | "multiple", "several files", specific file list, 3-10 files |
| **System** | "entire", "all files", "across", "throughout", "migrate all", >10 files |

#### Complexity-Based Workflow Selection

| Combined Score | Workflow | Use Case |
|----------------|----------|----------|
| 1.0 - 2.0 | `orchestrated` | Bug fixes, small changes, config updates, typos |
| 2.1 - 3.5 | `complete_system` | Moderate features, refactoring, validation needed |
| 3.6 - 5.0 | `plan-opus` | Complex multi-system changes, high risk |

---

### Display Decision:

#### Phase 1 Match (Domain Detected)
```
🧠 DECISION ENGINE
━━━━━━━━━━━━━━━━━━

Task: "[task description]"

Phase 1 - Domain Detection:
✓ [Domain] detected
  → [Reasons]

→ Using **[workflow]** workflow
```

#### Phase 2 Fallback (No Domain Match)
```
🧠 DECISION ENGINE
━━━━━━━━━━━━━━━━━━

Task: "[task description]"

Phase 1 - Domain Detection:
✗ No specialized domain detected

Phase 2 - Complexity Assessment:
• Complexity: [1-5]/5 - [reason]
• Risk: [1-5]/5 - [reason]
• Scope: [1-5]/5 - [reason]

Combined: [score] → Using **[workflow]** workflow
```

---

## Phase 5: SECURITY & SPECIAL HANDLING

### Security Auto-Detection

Enable security scanning when task mentions:

| Category | Keywords |
|----------|----------|
| Database | sql, query, database, migration, schema, orm |
| Auth | auth, login, password, token, jwt, session, oauth |
| Security | encrypt, decrypt, permission, role, certificate, hash |
| Encoding | base64, serialize, sanitize, injection |

When triggered:
```
🔐 Security scan auto-enabled: [reason]
```

---

## Phase 6: AUTOMATIC EXECUTION

**CRITICAL: Execute ALL phases automatically. NEVER ask user to run commands.**

### Orchestrated Workflow (3-Agent)

```
🔄 Phase 1/3: Analysis
   └─ Orchestrator analyzing code...
🔄 Phase 2/3: Implementation
   └─ Developer implementing changes...
🔄 Phase 3/3: Review
   └─ Reviewer validating...
✅ Complete!
```

### Complete System Workflow (6-Agent)

```
🔄 Phase 1/6: Strategic Analysis
   └─ Planner analyzing architecture...
🔄 Phase 2/6: Implementation Planning
   └─ Designing implementation approach...
🔄 Phase 3/6: Code Implementation
   └─ Executer writing code...
🔄 Phase 4/6: Verification
   └─ Verifier testing logic...
🔄 Phase 5/6: Quality Assurance
   └─ Tester checking edge cases...
🔄 Phase 6/6: Documentation
   └─ Documenter updating docs...
✅ Implementation complete! Starting review...
```

### Plan-Opus Workflow (Phased Execution)

For system-wide changes, decompose into phases:

```
🔄 Decomposing task into manageable phases...

📦 Phase 1: [Component A]
   ├─ Files: [list]
   └─ Status: Pending

📦 Phase 2: [Component B]
   ├─ Files: [list]
   └─ Status: Pending

📦 Phase 3: [Component C]
   ├─ Files: [list]
   └─ Status: Pending

Executing phases sequentially to manage context...
```

### Anti-YOLO Web Development

For web/UI tasks, create ASCII wireframe first:

```
🎨 Creating ASCII Wireframe...

┌─ [Page Title] ───────────────────────────┐
│ [Header description]                      │
├───────────────────────────────────────────┤
│ [Content layout]                          │
│ [________________] ← Input field          │
│ [▼ Dropdown     ] ← Select               │
│ [Button Label]    ← Action button        │
└───────────────────────────────────────────┘

Does this layout look right?
Type 'yes' to build HTML/CSS, or request changes.
```

---

## Phase 7: TRIPLE CODE REVIEW (MANDATORY)

After implementation, run parallel code reviews:

```
🔍 POST-EXECUTION REVIEW INITIATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Running 3 parallel reviews (5 min max)...

[PARALLEL EXECUTION]
├─ 👨‍💻 Senior Engineer → Code quality, best practices
├─ 👩‍💼 Lead Engineer → Architecture, scalability
└─ 🏗️ Architect → System integration, patterns
```

### The Three Reviewers

1. **Senior Software Engineer**
   - Focus: Code quality, readability, best practices
   - Checks: Clean code, DRY, SOLID, error handling
   - Output: PASSED / NEEDS_WORK

2. **Lead Software Engineer**
   - Focus: Architecture, design patterns, technical debt
   - Checks: Scalability, maintainability, team impact
   - Output: APPROVED / REFACTOR_NEEDED

3. **Software Architect**
   - Focus: System integration, enterprise patterns
   - Checks: API contracts, resilience, security
   - Output: CERTIFIED / REDESIGN_NEEDED

### Decision Matrix

- **All Pass** → Proceed to summary
- **Senior: NEEDS_WORK** → Auto-fix code quality issues
- **Lead: REFACTOR_NEEDED** → Auto-fix design issues
- **Architect: REDESIGN_NEEDED** → BLOCKED - explain issue to user

### Auto-Fix Protocol

Critical issues are fixed immediately:
- Security vulnerabilities (password plaintext, SQL injection, XSS)
- Data loss risks
- Memory leaks
- Missing error handling

```
⚠️ POST-EXECUTION REVIEW - FIXING ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Critical fixes applied:**
• `api/auth.ts:45` - Encrypting passwords
• `services/payment.ts:112` - Adding input validation

🔧 Auto-fixing critical issues...
✅ Issues resolved!
```

### All Reviews Pass

```
✅ POST-EXECUTION REVIEW COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 All 3 reviewers approved the implementation!

Review Summary:
• 👨‍💻 Senior: PASSED (clean code, good patterns)
• 👩‍💼 Lead: APPROVED (scalable design)
• 🏗️ Architect: CERTIFIED (proper integration)

Minor suggestions logged for future improvement.
```

---

## Phase 8: FINAL SUMMARY

```
✅ TASK COMPLETE
━━━━━━━━━━━━━━━

What changed:
• [Brief point 1]
• [Brief point 2]
• [Brief point 3]

Files modified: [count]
Tests: [status]
Build config: [applied/not applicable]
```

---

## Critical Rules

1. **NEVER ask user to run another command** - you handle everything
2. **NEVER ask user to continue** - proceed automatically through all phases
3. **NEVER ask user to choose workflow** - you decide based on analysis
4. **ALWAYS show Lyra optimization** - it's mandatory
5. **ALWAYS show build config** - if detected
6. **ALWAYS run triple review** - unless user says "skip review"
7. **ALWAYS complete the task** - don't stop mid-workflow

## User Interaction Rules

### ONLY Ask User For:
- **Specifications**: "Which authentication method do you prefer?"
- **Clarifications**: "Should this work on mobile devices?"
- **Decisions**: "Database choice: PostgreSQL or MySQL?"
- **Wireframe approval**: "Does this layout look right?"

### NEVER Ask User To:
- Run another command
- Execute a specific agent
- Continue with next phase
- Choose workflow manually

## Interruption Handling

When user says "no", "stop", "don't do that":
1. **IMMEDIATELY STOP** current action
2. Acknowledge: "Got it! Stopping [action]"
3. Ask: "What would you prefer instead?"

## Error Handling

If something fails:
```
⚠️ Issue encountered: [description]
🔄 Attempting recovery...
[Either: ✅ Recovered! Continuing...]
[Or: ❌ Manual intervention needed: [specific action]]
```

---

## Available Workflows Summary

| Workflow | Type | Agents | Best For |
|----------|------|--------|----------|
| `anti-yolo-web` | Phase 1 | 3 + wireframe | Web/frontend, React, Vue, dashboards |
| `aidevtasks` | Phase 1 | PRD-based | Features requiring product specs |
| `agetos` | Phase 1 | Setup | Project initialization, standards |
| `plan-opus` | Phase 1 + 2 | Variable | Architecture, migrations, complex tasks |
| `complete_system` | Phase 2 | 6 | Moderate features, validation needed |
| `orchestrated` | Phase 2 | 3 | Simple fixes, config changes |

---

## Quick Reference: Two-Phase Flow

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

**Remember**: SystemCC is the ONLY command users need.

Detection → Lyra → Build Config → Two-Phase Analysis → Workflow → Execute → Review → Complete

All automatic. All quality-gated. All in one command.

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

## Phase 4: TASK ANALYSIS (3-Dimensional)

Analyze the task across three dimensions:

### Dimension 1: Complexity

| Level | Indicators |
|-------|------------|
| **Simple** | fix, update, change, small, typo, rename, style, tweak, adjust |
| **Moderate** | feature, add, create, implement, modify, improve |
| **Complex** | architecture, refactor, system, integration, migration, security, database |

### Dimension 2: Risk

| Level | Indicators |
|-------|------------|
| **Low** | docs, style, test, config (non-production), UI text |
| **High** | critical, production, breaking, delete, security, database, auth, payment, encryption |

### Dimension 3: Scope

| Level | Indicators |
|-------|------------|
| **Single** | specific file mentioned, "this file", "the function" |
| **Multi** | "multiple", "several files", specific file list, 3-10 files |
| **System** | "entire", "all files", "across", "throughout", "migrate all", >10 files |

### Display Analysis:

```
📊 Task Analysis:
   - Complexity: [Simple/Moderate/Complex] ([score]/1.0)
   - Risk: [Low/High] ([score]/1.0)
   - Scope: [Single/Multi/System]
   - Context Load: [current tokens/30k]

📋 Selected Workflow: [Workflow Name]
   ↳ Reason: [Brief explanation]
   ↳ Security Scan: [Enabled/Disabled]
```

---

## Phase 5: WORKFLOW SELECTION

### Decision Table

| Complexity | Risk | Scope | Workflow | Confidence |
|------------|------|-------|----------|------------|
| Simple | Low | Single | **Quick Fix (3-agent)** | 0.9 |
| Simple | Low | Multi | **Quick Fix (3-agent)** | 0.85 |
| Simple | High | Any | **Full Validation (6-agent)** | 0.85 |
| Moderate | Low | Single | **Standard (3-agent)** | 0.8 |
| Moderate | Low | Multi | **Full Validation (6-agent)** | 0.75 |
| Moderate | High | Any | **Full Validation (6-agent)** | 0.85 |
| Complex | Any | Any | **Full Validation (6-agent)** | 0.8 |
| Any | Any | System | **Phased Execution** | 0.9 |

### Priority Overrides

1. **Context >30k tokens** → Phased Execution
2. **Security keywords detected** → Enable security scan + Full Validation
3. **Web/UI task detected** → Include wireframe phase (Anti-YOLO)
4. **Batch potential detected** → Enable batch optimization

### Security Auto-Detection

Enable security scanning when task mentions:

| Category | Keywords |
|----------|----------|
| Database | sql, query, database, migration, schema |
| Auth | auth, login, password, token, jwt, session, permission |
| Security | encrypt, decrypt, certificate, credentials, secrets |
| Encoding | base64, serialize, deserialize, decode |

When triggered:
```
🔐 Security scan auto-enabled: [reason]
```

---

## Phase 6: AUTOMATIC EXECUTION

**CRITICAL: Execute ALL phases automatically. NEVER ask user to run commands.**

### Quick Fix Workflow (3-Agent)

```
🔄 Phase 1/3: Analysis
   └─ Orchestrator analyzing code...
🔄 Phase 2/3: Implementation
   └─ Developer implementing changes...
🔄 Phase 3/3: Review
   └─ Reviewer validating...
✅ Complete!
```

### Full Validation Workflow (6-Agent)

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

### Phased Execution (Large Tasks)

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

| Workflow | Agents | Best For |
|----------|--------|----------|
| Quick Fix | 3 | Bug fixes, simple features, config changes |
| Full Validation | 6 | New features, complex changes, security-sensitive |
| Phased | Variable | Enterprise codebases, migrations, system-wide |
| Anti-YOLO Web | 3 + wireframe | UI components, forms, dashboards |

---

**Remember**: SystemCC is the ONLY command users need.

Detection → Lyra → Build Config → Analysis → Workflow → Execute → Review → Complete

All automatic. All quality-gated. All in one command.

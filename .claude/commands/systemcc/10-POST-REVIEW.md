# POST-REVIEW MODULE - Triple Code Review System

## 🎯 Purpose
Execute three parallel code reviews after main workflow completion for fast quality validation.

## ⚡ LEVEL 1 ENFORCEMENT
This review phase is **MANDATORY** for all code changes unless:
- Emergency hotfix mode
- User explicitly says "skip review"
- Documentation-only changes

## 🔄 Execution Flow

### Trigger Conditions
```python
def should_trigger_review(task_context):
    # Skip conditions
    if task_context.get("emergency_mode"):
        return False
    if "skip review" in task_context.get("user_input", "").lower():
        return False
    if task_context.get("changes_type") == "documentation_only":
        return False

    # Trigger for any code changes
    return task_context.get("code_modified", False)
```

### Review Initiation
```
🔍 POST-EXECUTION REVIEW INITIATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Running 3 parallel reviews...

[PARALLEL EXECUTION]
├─ 👨‍💻 Senior Engineer → Code quality
├─ 👩‍💼 Lead Engineer → Architecture
└─ 🏗️ Architect → System design

⏱️ Reviews complete in: [X] minutes
```

## 👥 The Three Reviewers

### 1. Senior Software Engineer
- **Focus**: Code quality, readability, best practices
- **Checks**: Clean code, DRY, SOLID, error handling
- **Time**: 5 minutes max
- **Output**: PASSED/NEEDS_WORK

### 2. Lead Software Engineer
- **Focus**: Architecture, design patterns, technical debt
- **Checks**: Scalability, maintainability, team impact
- **Time**: 5 minutes max
- **Output**: APPROVED/REFACTOR_NEEDED

### 3. Software Architect
- **Focus**: System integration, enterprise patterns
- **Checks**: API contracts, microservices, resilience
- **Time**: 5 minutes max
- **Output**: CERTIFIED/REDESIGN_NEEDED

## 📊 Decision Matrix

```python
def determine_final_verdict(senior_result, lead_result, architect_result):
    results = {
        "senior": senior_result,
        "lead": lead_result,
        "architect": architect_result
    }

    # Critical failures
    if results["senior"] == "NEEDS_WORK":
        return "NEEDS_FIXES", "Code quality issues must be fixed"
    if results["architect"] == "REDESIGN_NEEDED":
        return "BLOCKED", "Major architectural redesign required"
    if results["lead"] == "REFACTOR_NEEDED":
        return "NEEDS_FIXES", "Design refactoring required"

    # All pass
    return "READY", "All reviews passed!"
```

## 🔧 Auto-Fix Protocol

### Critical Issues (Immediate Fix)
```python
CRITICAL_PATTERNS = [
    "password.*plain.*text",
    "sql.*injection",
    "xss.*vulnerability",
    "data.*loss.*risk",
    "memory.*leak"
]

def handle_critical_issues(issues):
    for issue in issues:
        if any(pattern in issue.lower() for pattern in CRITICAL_PATTERNS):
            auto_fix_critical(issue)
            log_to_troubleshooting(issue)
```

### Issue Priority Levels
1. **🔴 CRITICAL** - Fix immediately (security, data loss)
2. **🟡 MAJOR** - Fix in session (bugs, performance)
3. **🟢 MINOR** - Log for later (style, optimization)

## 📝 Output Formats

### All Reviews Pass
```markdown
✅ POST-EXECUTION REVIEW COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 All 3 reviewers approved the implementation!

**Excellence noted:**
• Clean, maintainable code structure
• Scalable architecture design
• Proper system integration

Minor suggestions logged for future sessions.
```

### Issues Found
```markdown
⚠️ POST-EXECUTION REVIEW - FIXING ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Critical fixes required:**
• `api/auth.ts:45` - Encrypting passwords
• `services/payment.ts:112` - Adding circuit breaker

🔧 Auto-fixing critical issues...
✅ Issues resolved!
```

### Blocked by Architecture
```markdown
🛑 POST-EXECUTION REVIEW - BLOCKED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Architectural redesign needed:**
• Current approach violates microservice boundaries
• Recommended: Implement event-driven pattern

Please approve redesign or provide alternative approach.
```

## 🎯 Integration with Workflows

### Complete System (6-agent)
```
Phase 6: UPDATER completes
Phase 7: POST-REVIEW (NEW) ← Automatic trigger
Phase 8: MEMORY-UPDATE
```

### Orchestrated (3-agent)
```
Phase 3: Testing completes
Phase 4: POST-REVIEW (NEW) ← Automatic trigger
Phase 5: MEMORY-UPDATE
```

### AI Dev Tasks
```
Task implementation completes
POST-REVIEW (NEW) ← Automatic trigger
MEMORY-UPDATE
```

## 💾 Memory Integration

Reviews contribute to memory:
```python
def update_memory_from_reviews(review_results):
    # Patterns discovered
    if review_results.get("patterns"):
        update_patterns_md(review_results["patterns"])

    # Anti-patterns found
    if review_results.get("anti_patterns"):
        update_dont_dos_md(review_results["anti_patterns"])

    # Architecture decisions
    if review_results.get("decisions"):
        update_decisions_md(review_results["decisions"])
```

## 🚨 User Override

User can skip reviews:
```
User: "skip review"
Claude: Skipping post-execution review as requested.
        Proceeding to memory update...
```

## 📈 Review Metrics

Track for improvement:
- Average review time
- Issues found per review
- False positive rate
- Auto-fix success rate
- Most common issues

## 🔄 Parallel Execution Details

```python
async def execute_reviews_parallel():
    # Launch all three simultaneously via Task tool
    reviews = await asyncio.gather(
        senior_engineer_review(),
        lead_engineer_review(),
        architect_review()
    )

    # Aggregate results
    return {
        "senior": reviews[0],
        "lead": reviews[1],
        "architect": reviews[2],
        "time_taken": max([r.time for r in reviews])
    }
```

## ⏱️ Time Management

- **Target**: 5 minutes total (all parallel)
- **Max**: 7 minutes with auto-fixes
- **Timeout**: 10 minutes hard limit

## 🎯 Quality Gates

### Must Pass
- No security vulnerabilities
- No data corruption risks
- No breaking changes
- Core functionality intact

### Should Pass
- Follows coding standards
- Maintains test coverage
- Proper error handling
- Clean architecture

### Nice to Have
- Optimized performance
- Enhanced documentation
- Improved test coverage
- Reduced complexity

## 📝 Example Full Execution

```bash
/systemcc "implement user authentication"

[... main workflow executes ...]

🔍 POST-EXECUTION REVIEW INITIATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Running 3 parallel reviews...

[5 minutes later]

✅ POST-EXECUTION REVIEW COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Review Summary:
• 👨‍💻 Senior: PASSED (clean code, good patterns)
• 👩‍💼 Lead: APPROVED (scalable design)
• 🏗️ Architect: CERTIFIED (proper integration)

One minor issue auto-fixed:
• Added rate limiting to login endpoint

🏆 Your authentication system is production-ready!

[Continues to memory update...]
```

## 🔗 Related Modules
- `workflows/post-execution-review/triple-review-orchestrator.md`
- `.claude/agents/code-reviewer-*.md`
- `11-MEMORY-UPDATE.md`

---

*Fast, parallel, comprehensive - quality without delays.*
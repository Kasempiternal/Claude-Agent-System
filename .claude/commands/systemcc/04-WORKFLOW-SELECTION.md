# WORKFLOW SELECTION MODULE

## Pattern Detection Integration (NEW - Phase 1.3)

**Input**: Pattern detection results from `01-CRITICAL-DETECTION.md`

If pattern detection ran and found patterns:
```javascript
{
  "detected_patterns": ["authentication", "security"],
  "confidence": 0.85,
  "suggested_workflow": "complete_system",
  "enable_security_scan": true,
  "hints": ["🔒 Authentication task detected"]
}
```

### Using Pattern Hints

1. **High Confidence (>0.7)**: Use suggested workflow directly
   - Pattern: "authentication" → complete_system
   - Pattern: "bugfix" → orchestrated
   - Pattern: "security" → complete_system + security scan

2. **Medium Confidence (0.4-0.7)**: Use as hint for decision engine
   - Pattern suggestion influences decision
   - Combined with other factors (context, complexity, risk)

3. **Low Confidence (<0.4)**: Informational only
   - Display pattern to user
   - Decision engine proceeds normally

4. **No Pattern Detected**: Standard decision process
   - Use enhanced decision matrix below
   - No pattern bias

### Security Scan Auto-Enable

If `enable_security_scan: true` in pattern results:
- Automatically enable security scanning
- Add security-focused code review
- Check for vulnerabilities in changes
- Validate input sanitization

## Enhanced Decision Matrix

### Priority Order for Workflow Selection

1. **Pattern Detection Results** (NEW - HIGHEST WHEN CONFIDENCE >0.7)
   - Auto-detected workflow from user request patterns
   - Keyword and file pattern matching
   - Session history context
   - Security feature auto-enabling

2. **Code Minimalism Analysis** (HIGHEST PRIORITY)
   - Existing code reuse potential
   - Modification vs creation ratio
   - Configuration-based solutions
   - Surgical change opportunities

3. **Context Size Analysis** (HIGH PRIORITY)
   - Current conversation token count
   - Number of files already loaded
   - Project size and complexity
   - Predicted context growth

4. **Task Complexity Analysis**
   - Scope of changes (single file vs multi-file)
   - Type of task (bug fix, feature, architecture change)
   - Risk level and dependencies
   - Required validation depth

## Workflow Indicators

### Code Minimalism Optimized Selection (NEW - HIGHEST PRIORITY)
**Keywords:**
- "fix", "update", "modify", "change", "adjust", "patch"
- "refactor", "improve", "optimize", "clean up"
- "config", "setting", "environment variable"

**Indicators for Minimal Code:**
- Working with existing codebase
- Modifying rather than creating
- Single-concern changes
- Configuration-based solutions

**Process:** Analyze existing → Modify surgically → Validate minimally

### Anti-YOLO Web Workflow (HIGH PRIORITY)
**Keywords:**
- "HTML", "CSS", "JavaScript", "webpage", "website", "frontend", "UI"
- "form", "button", "modal", "dashboard", "page", "component"
- "React", "Vue", "Angular", "Svelte", "Bootstrap", "Tailwind"
- "web app", "application", "app", "full stack app", "frontend app"
- "table", "data table", "tracking table", "tracker", "interface"

**Patterns:**
- "[platform] application", "create app", "build app"
- "LinkedIn tracker", "tracking system"
- "create [page/form/component/app]", "build [login/contact/tracker] page"

**Project Indicators:**
- package.json with frontend frameworks
- *.html files, CSS files
- Empty project + web development intent

**Process:** ASCII Wireframe → User Approval → HTML Implementation → Testing

### Agent OS Integration (Complete System + Agent OS)
**Keywords:**
- "setup", "initialize", "standards", "conventions", "project structure"
- "plan product", "analyze codebase", "create spec", "mission", "roadmap"
- "tech stack", "coding standards", "best practices", "team conventions"

**Use Cases:**
- New project initialization with comprehensive standards
- Existing project standardization and analysis
- Product planning and specification creation
- Architecture documentation and decision recording
- Development workflow and tool configuration setup

**Process:** Agent OS Analysis → Strategic Plan → Architecture → Implementation → Standards → Validation → Testing → Documentation → Deployment

### AI Dev Tasks (/aidevtasks)
**Keywords:**
- "build feature", "create system", "product", "user story"

**Use Cases:**
- Feature development from scratch (without standards focus)
- Complex user-facing functionality
- Needs detailed requirements via PRD approach
- Multi-component features
- User-centric development

**Process:** Create PRD → Generate Tasks → Implement

### Phase-Based (via /plan-opus)
**Triggers:**
- Context already > 30,000 tokens
- More than 10 files loaded
- Project has 100+ files
- Task touches 5+ modules
- Estimated time > 60 minutes
- Keywords: "entire", "all", "across", "throughout", "migrate"

**Process:** Plan → Explore → Execute Phases → Verify

### Complete System (Standard)
**Keywords:**
- "architecture", "refactor", "security", "performance"

**Use Cases:**
- Multi-system integration (< 5 modules)
- Database schema changes
- API design changes
- High-risk modifications requiring validation
- Complex technical implementations

**Process:** Strategic Plan → Implementation → Validation → Testing → Documentation → Deployment

### Orchestrated-Only
**Keywords:**
- "fix", "update", "tweak", "adjust", "simple"

**Use Cases:**
- Single component changes
- UI text updates
- Configuration changes
- Style adjustments
- Bug fixes

**Process:** Analyze → Implement → Review

## Workflow Selection Transparency

Show this to user after selection:

```
🧠 Analyzing: "[task description]"

📊 Task Analysis:
   - Code Minimalism: [High/Medium/Low] ([score]/1.0)
   - Complexity: [High/Medium/Low] ([score]/1.0)
   - Scope: [X files, Y components affected]
   - Risk Level: [High/Medium/Low]
   - Context Load: [current tokens/30k]

💡 Code Generation Approach:
   - Strategy: [Modify existing/Create minimal new/Config change]
   - Files to modify: [estimated count]
   - New files needed: [Yes/No - avoid if possible]
   - Reuse potential: [High/Medium/Low]

📋 Selected Workflow: [Workflow Name]
   ↳ Why: [Clear reasoning focusing on minimal changes]
   ↳ Process: [Brief overview emphasizing surgical changes]
   ↳ Goal: [Minimal, reviewable, professional code]

Ready to proceed? (yes/adjust/explain more)
```

## Decision Logic Flow (Two-Phase System)

**See `07-DECISION-ENGINE.md` for complete two-phase workflow selection.**

### Quick Reference

```
PHASE 1: Domain Detection (CHECK FIRST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If task matches specialized domain with HIGH confidence:

  Web Development    → anti-yolo-web
  Feature Dev        → aidevtasks
  Project Setup      → agetos
  Deep Planning      → plan-opus

If no domain match → proceed to Phase 2

PHASE 2: Complexity Scoring (FALLBACK)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score = (Complexity + Risk + Scope) / 3

  1.0 - 2.0  → orchestrated (simple)
  2.1 - 3.5  → complete_system (moderate)
  3.6 - 5.0  → plan-opus (complex)
```

### All Available Workflows

| Workflow | Type | Best For |
|----------|------|----------|
| `anti-yolo-web` | Domain-specific | Web/frontend development |
| `aidevtasks` | Domain-specific | PRD-based feature development |
| `agetos` | Domain-specific | Project setup and standards |
| `plan-opus` | Domain + Fallback | Planning, architecture, complex tasks |
| `complete_system` | Fallback | Moderate features with validation |
| `orchestrated` | Fallback | Simple fixes and changes |

## Next Steps

After workflow selection:
- Continue to `05-IMPLEMENTATION-STEPS.md`
- Execute selected workflow automatically
# WORKFLOW SELECTION MODULE

## Enhanced Decision Matrix

### Priority Order for Workflow Selection

1. **Code Minimalism Analysis** (HIGHEST PRIORITY - NEW)
   - Existing code reuse potential
   - Modification vs creation ratio
   - Configuration-based solutions
   - Surgical change opportunities

2. **Context Size Analysis** (HIGH PRIORITY)
   - Current conversation token count
   - Number of files already loaded
   - Project size and complexity
   - Predicted context growth

3. **Task Complexity Analysis**
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

### Phase-Based (/taskit)
**Triggers:**
- Context already > 30,000 tokens
- More than 10 files loaded
- Project has 100+ files
- Task touches 5+ modules
- Estimated time > 60 minutes
- Keywords: "entire", "all", "across", "throughout", "migrate"

**Process:** Decompose → Execute Phases → Integrate

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

## CCPM Integration

### When to Recommend CCPM
```python
def ccpm_would_be_beneficial(analysis):
    return (
        analysis.complexity_score > 6 AND 
        analysis.estimated_time > 60_minutes AND
        (
            analysis.independent_components >= 3 OR
            "parallel" in analysis.keywords OR
            "concurrent" in analysis.keywords OR
            "multiple systems" in analysis.description
        )
    )
```

### CCPM Triggers
- Explicit --pm flag
- Complex parallel tasks
- Multiple independent components
- Tasks benefiting from project management

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

## Decision Logic Flow

```python
# Priority order for selection
IF web_detection.is_web_project:
    → Anti-YOLO Web Workflow
    → Check for batch opportunities in components
ELIF user_confirmed_ccpm OR explicit_pm_flag:
    → CCPM Integration
    → Automatic task decomposition
ELIF batch_potential == 'high' AND independent_components > 3:
    → Enable batch optimization for ANY workflow
    → Group similar operations together
ELIF detected_type == 'agent_os_integration':
    → Complete System with Agent OS
    → Check for batch setup tasks
ELIF detected_type == 'feature_development':
    → AI Dev Tasks
    → Analyze for batch component creation
ELIF context_size > 30000:
    → Phase-based workflow
    → Use batch operations within phases
ELIF complexity_score > 5:
    → Complete 6-agent workflow
    → Optimize with batched phases
ELSE:
    → Streamlined 3-agent workflow
    → Still check for batch opportunities
```

## Next Steps

After workflow selection:
- Continue to `04-IMPLEMENTATION-STEPS.md`
- Execute selected workflow automatically
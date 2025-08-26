# /systemcc - The ONLY Command You Need

⚠️ **CRITICAL IMPLEMENTATION NOTE**: When executing /systemcc, you MUST visibly show the Lyra AI Prompt Optimization process to the user with the formatted output box. This is not optional - it's a core feature that demonstrates the value of the optimization process.

## Purpose

The `/systemcc` command is the master router that:
1. **Automatically analyzes your project on first run** (no need for /analyze!)
2. Optimizes your request using Lyra AI (ALWAYS SHOW THIS)
3. Intelligently routes to the most appropriate subsystem
4. Provides access to all workflows: Agent OS, AI Dev Tasks, Complete System, Orchestrated, and Phase-based
5. Automatically selects the best workflow
6. Executes EVERYTHING internally - no more manual commands
7. Completes your task end-to-end

**YOU NEVER NEED TO RUN**: `/analyze`, `/planner`, `/executer`, `/verifier`, `/agetos`, `/aidevtasks`, etc. 
**Everything is handled automatically by /systemcc!**

## How It Works

When you use `/systemcc "your task description"`, the system will:

1. **Universal Lyra Optimization**:
   - Apply Lyra middleware from `middleware/lyra-universal.md`
   - Transform vague requests into precision-crafted prompts
   - Generate complexity score and workflow suggestions
   - Ensure complete specifications for any workflow

2. **Analyze Context Size** (HIGHEST PRIORITY):
   - Current conversation token count
   - Number of files already loaded
   - Project size and complexity
   - Predicted context growth

3. **Analyze Task Complexity**:
   - Scope of changes (single file vs multi-file)
   - Type of task (bug fix, feature, architecture change)
   - Risk level and dependencies
   - Required validation depth

4. **Auto-Select Workflow**:
   - **CCPM Integration** for parallel execution and project management (--pm flag or complex parallel tasks)
   - **Agent OS (/agetos)** for project initialization and standards
   - **AI Dev Tasks (/aidevtasks)** for PRD-based feature development
   - **Phase-Based (/taskit)** for large contexts or complex multi-hour tasks
   - **Complete System** for complex, multi-phase validation tasks
   - **Orchestrated-Only** for simpler, focused tasks

5. **Automatically Execute Selected Workflow** with the **Automated Workflow Executor**:
   - All agents run sequentially without manual commands
   - Real-time progress updates
   - User input only when needed
   - Complete end-to-end execution

## Usage

### The ONLY Way to Use This:
```bash
# Just use this for EVERYTHING:
/systemcc "what you want done"

# That's it! First run will auto-analyze, then proceed with your task
```

### Examples:
```bash
/systemcc "fix the login button color"
/systemcc "add user authentication system"
/systemcc "refactor the payment module"
/systemcc "create a dashboard for analytics"
/systemcc "optimize database queries"

# NEW: Project Management Mode with CCPM Integration
/systemcc --pm "build complete e-commerce checkout system"
/systemcc --pm "implement microservices architecture"
```

**That's it!** Claude figures out:
- Simple fix? → Runs 3-agent workflow internally
- Complex feature? → Runs 6-agent workflow internally
- New feature? → Creates PRD, tasks, implements internally
- Large codebase? → Uses phase-based approach internally
- **NEW:** Complex parallel work? → Activates CCMP integration internally
- **NEW:** --pm flag? → Always uses project management mode

**YOU DON'T NEED TO KNOW OR SPECIFY THE WORKFLOW!**

## Lyra Prompt Optimization (First Step)

When `/systemcc` is invoked, Lyra first optimizes the user's prompt using the 4-D methodology:

### The 4-D Methodology for Claude Code

1. **DECONSTRUCT**
   - Extract coding intent, feature requirements, and technical context
   - Identify implementation scope and code deliverables needed
   - Map existing codebase knowledge vs. new requirements

2. **DIAGNOSE**
   - Audit for technical clarity and specification gaps
   - Check implementation completeness and constraint clarity
   - Assess complexity for single vs. multi-agent approach

3. **DEVELOP**
   - Select optimal techniques based on request type:
     - Bug Fixes → Precise error context + systematic debugging
     - Feature Development → Clear requirements + implementation scope
     - Refactoring → Architecture goals + code quality standards
     - UI/UX → Design principles + user experience objectives
   - Assign appropriate developer expertise level
   - Structure for Claude Code's agentic capabilities

4. **DELIVER**
   - Construct development-focused prompt
   - Specify complete code delivery expectations
   - Provide implementation and testing guidance

### Optimization Techniques
- **Foundation**: Developer role assignment, technical context, deliverable specs, implementation scope
- **Advanced**: Multi-agent workflows, systematic debugging, architecture planning, code quality frameworks
- **Claude Code Specific**:
  - Leverage existing project context awareness
  - Specify complete code delivery (never partial implementations)
  - Structure multi-step development processes
  - Enable parallel agent generation when beneficial

### Auto-Detection Logic
```python
def detect_prompt_mode(task_description):
    # Simple fixes/features → BASIC mode
    if is_simple_task(task_description):
        return "BASIC"
    # Complex architecture/multi-component → DETAIL mode
    elif is_complex_task(task_description):
        return "DETAIL"
    else:
        # Inform user with override option
        return prompt_user_for_mode()
```

### Lyra Response Formats

**For Simple Tasks (BASIC mode):**
```
**Your Optimized Prompt:**
[Development-focused prompt with specific requirements]

**What Changed:** [Key technical improvements made]
```

**For Complex Tasks (DETAIL mode):**
```
**Your Optimized Prompt:**
[Comprehensive development prompt with detailed specifications]

**Key Improvements:**
- [Technical clarity enhancements]
- [Specification additions]
- [Context leveraging]

**Techniques Applied:** [Development methodologies used]

**Pro Tip:** [Claude Code specific guidance]
```

## Implementation Instructions

When this command is invoked:

1. **Memory Bank Initialization**:
   ```
   - Check for ClaudeFiles/memory/CLAUDE-activeContext.md
   - If exists:
     → Load previous session context
     → Update with current date/task
   - If not exists:
     → Initialize memory bank structure
     → Create core memory files
   
   - Load relevant memory:
     → Read CLAUDE-patterns.md for known patterns
     → Check CLAUDE-troubleshooting.md for solutions
     → Review CLAUDE-decisions.md for architecture
   ```

2. **Security Pre-Scan** (Optional):
   ```
   - If --secure flag or suspicious input detected:
     → Run PromptSecure-Ultra scanner
     → Check for injection attempts
     → Decode any encoded content
     → Block if CRITICAL risk found
     → Warn if HIGH risk detected
   ```

3. **First-Run Detection**:
   ```
   - Check for ClaudeFiles/.analysis-status file
   - If not exists:
     → Display: "🔍 First time in this project - running analysis first..."
     → Execute lightweight project analysis
     → Create .analysis-status with project info
     → Update memory bank with project structure
     → Display: "✅ Analysis complete! Now proceeding with your task..."
   - If exists:
     → Skip analysis and proceed normally
   ```

4. **Prompt Optimization with Lyra** (ALWAYS SHOW THIS TO USER):
   ```
   CRITICAL: You MUST show the Lyra optimization process to the user with proper formatting.
   
   Display Format:
   ═══════════════════════════════════════════════════════════════
   🎯 LYRA AI PROMPT OPTIMIZATION
   ═══════════════════════════════════════════════════════════════
   
   📝 Original Request:
   "[user's raw prompt]"
   
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
   
   Implementation steps:
   - Analyze user's raw prompt
   - Apply 4-D methodology (Deconstruct, Diagnose, Develop, Deliver)
   - Auto-detect complexity for BASIC or DETAIL mode
   - Transform into precision-crafted development prompt
   - ALWAYS present the formatted output above to user
   ```

5. **Workflow Selection Transparency**:
   ```
   🧠 Analyzing: "[task description]"
   
   📊 Task Analysis:
      - Complexity: [High/Medium/Low] ([score]/10)
      - Scope: [X files, Y components affected]
      - Risk Level: [High/Medium/Low] (security/breaking changes)
      - Estimated Time: [15-30min/45-60min/2+ hours]
   
   📋 Selected Approach: [Workflow Name]
      ↳ Why: [Clear reasoning for selection]
      ↳ Process: [Brief overview of phases]
   
   Ready to proceed? (yes/adjust/explain more)
   ```

6. **Context Analysis** (Second Priority):
   ```
   - Check current context size (tokens)
   - Count loaded files and their sizes
   - Evaluate project size (file count)
   - Assess conversation history length
   - Predict context growth for the task
   ```

7. **Task Analysis** (Using Optimized Prompt):
   ```
   - Parse the optimized task description
   - Check for keywords indicating complexity
   - Evaluate scope indicators
   - Consider risk factors
   - Estimate time requirements
   ```

8. **Specification Gathering** (When Needed):
   ```
   - Use middleware/specification-gatherer.md
   - Collect all requirements upfront
   - Show only relevant question categories
   - Provide smart defaults
   - Pass complete specs to workflow
   ```

9. **Enhanced Decision Matrix**:
   ```
   Agent OS Integration (Complete System + Agent OS) Indicators:
   - Keywords: "setup", "initialize", "standards", "conventions", "project structure"
   - Keywords: "plan product", "analyze codebase", "create spec", "mission", "roadmap"
   - Keywords: "tech stack", "coding standards", "best practices", "team conventions"
   - New project initialization with comprehensive standards
   - Existing project standardization and analysis
   - Product planning and specification creation
   - Architecture documentation and decision recording
   - Development workflow and tool configuration setup
   
   AI Dev Tasks (/aidevtasks) Indicators:
   - Keywords: "build feature", "create system", "product", "user story"
   - Feature development from scratch (without standards focus)
   - Complex user-facing functionality
   - Needs detailed requirements via PRD approach
   - Multi-component features
   - User-centric development
   
   Phase-Based (/taskit) Indicators:
   - Context already > 30,000 tokens
   - More than 10 files loaded
   - Project has 100+ files
   - Task touches 5+ modules
   - Estimated time > 60 minutes
   - Keywords: "entire", "all", "across", "throughout", "migrate"
   
   Complete System (Standard) Indicators:
   - Keywords: "architecture", "refactor", "security", "performance"
   - Multi-system integration (< 5 modules)
   - Database schema changes
   - API design changes
   - High-risk modifications requiring validation
   - Complex technical implementations
   
   Orchestrated-Only Indicators:
   - Keywords: "fix", "update", "tweak", "adjust", "simple"
   - Single component changes
   - UI text updates
   - Configuration changes
   - Style adjustments
   - Bug fixes
   ```

10. **CCPM Recommendation Logic** (Before Workflow Execution):
   ```
   # Check if CCPM would be beneficial (recommendation only)
   IF --pm flag explicitly provided:
     → Skip recommendation, go directly to CCPM Integration
   
   ELIF ccpm_would_be_beneficial(task_analysis):
     → Display CCPM recommendation prompt to user
     → Wait for user confirmation (y/n)
     → IF user confirms: Route to CCPM Integration
     → IF user declines: Continue with standard workflow selection
   
   # CCPM Recommendation Triggers:
   def ccmp_would_be_beneficial(analysis):
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

11. **Execute Workflow Automatically** (With Optimized Prompt):
   ```
   # Claude executes everything internally - no exposed commands!
   
   IF user_confirmed_ccpm OR explicit_pm_flag:
     Internal: CCPM Integration workflow
     Process: Environment Detection → Epic Creation → Task Decomposition → Parallel Execution → Progress Tracking → Integration
   ELIF detected_type == 'agent_os_integration':
     Internal: Complete System with Agent OS phases
     Process: Agent OS Analysis → Strategic Plan → Agent OS Architecture → Implementation → Standards Creation → Validation → Testing → Documentation → Deployment
   ELIF detected_type == 'feature_development':
     Internal: AI Dev Tasks workflow
     Process: Create PRD → Generate Tasks → Implement
   ELIF context_size > 30000 OR predicted_context_large:
     Internal: Phase-based workflow
     Process: Decompose → Execute Phases → Integrate
   ELIF estimated_time > 60_minutes:
     Internal: Phase-based workflow
     Process: Break into manageable phases
   ELIF complexity_score > 5:
     Internal: Complete 6-agent workflow
     Process: Strategic Plan → Implementation → Validation → Testing → Documentation → Deployment
   ELSE:
     Internal: Streamlined 3-agent workflow
     Process: Analyze → Implement → Review
   
   # User sees progress but NEVER needs to run commands!
   
   # Update memory bank after completion
   → Update CLAUDE-activeContext.md with results
   → Document any new patterns in CLAUDE-patterns.md
   → Record decisions made in CLAUDE-decisions.md
   → Add any issues/solutions to CLAUDE-troubleshooting.md
   → Create/update Agent OS standards files when applicable
   ```

12. **Memory Bank Persistence**:
   ```
   After workflow completion:
   - Save session summary to activeContext.md
   - Document discovered patterns
   - Record architectural decisions
   - Update troubleshooting database
   - Document CCPM recommendations and user choices
   - Run memory-bank-synchronizer if needed
   ```

## Enhanced Decision Engine

The `/systemcc` command includes intelligent workflow selection:

```python
def analyze_for_workflow_selection(task_description, context_info, user_preferences=None):
    """Rule-based workflow selection engine"""
    
    # Load memory bank context
    memory_context = load_memory_bank()
    
    # Check for security threats if enabled
    if should_run_security_scan(task_description):
        security_report = run_prompt_security_scan(task_description)
        if security_report.risk_level == "CRITICAL":
            return abort_with_security_warning(security_report)
    
    # Use Lyra universal middleware first
    lyra_result = lyra_optimize({
        'command': 'systemcc',
        'prompt': task_description,
        'context': context_info
    })
    
    # Apply rule-based workflow selection
    return get_workflow_decision(task_description, context_info, memory_context)

def get_workflow_decision(task_desc, context, memory_context):
    """Rule-based workflow selection logic"""
    
    # PRIORITY 1: Context-based routing (overrides everything)
    if context.get('current_tokens', 0) > 30000:
        return {
            'workflow': 'taskit',
            'reasoning': 'Context size exceeds optimal threshold',
            'confidence': 0.9
        }
    
    if context.get('loaded_files', 0) > 10:
        return {
            'workflow': 'taskit', 
            'reasoning': 'Too many files in context',
            'confidence': 0.8
        }
    
    # Calculate basic complexity
    complexity_score = calculate_working_complexity(task_desc, lyra_result)
    
    # Apply working decision rules
    if complexity_score <= 3:
        return {
            'workflow': 'orchestrated',
            'reasoning': f'Low complexity task (score: {complexity_score})',
            'confidence': 0.8
        }
    elif complexity_score <= 6:
        return {
            'workflow': 'complete_system',
            'reasoning': f'Medium complexity task (score: {complexity_score})',
            'confidence': 0.7
        }
    else:
        return {
            'workflow': 'taskit',
            'reasoning': f'High complexity task (score: {complexity_score})',
            'confidence': 0.8
        }

def calculate_working_complexity(task_desc, lyra_result):
    """Actually working complexity calculation"""
    
    score = 1
    desc_lower = task_desc.lower()
    
    # Scope indicators
    if any(word in desc_lower for word in ['all', 'entire', 'across', 'system']):
        score += 2
    if any(word in desc_lower for word in ['multiple', 'several', 'various']):
        score += 1
    
    # Technical complexity
    if any(word in desc_lower for word in ['architecture', 'refactor', 'migrate']):
        score += 2
    if any(word in desc_lower for word in ['security', 'auth', 'critical']):
        score += 1
    if any(word in desc_lower for word in ['integration', 'api', 'service']):
        score += 1
    
    # Simple indicators (reduce score)
    if any(word in desc_lower for word in ['fix', 'update', 'change', 'small']):
        score -= 1
    
    # Add Lyra complexity if available
    if hasattr(lyra_result, 'metadata') and hasattr(lyra_result.metadata, 'complexity_score'):
        score += lyra_result.metadata.complexity_score // 2
    
    return max(1, min(10, score))


## Examples

### Example 0: CCPM Integration Detection (NEW!)
```
User: /systemcc --pm "build complete e-commerce checkout system"

═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════

📝 Original Request:
"build complete e-commerce checkout system"

🔍 Analysis Phase:
- Deconstructing intent...
- Diagnosing gaps...
- Developing enhancements...
- Delivering optimized prompt...

✨ Optimized Prompt:
"Build comprehensive e-commerce checkout system with parallel development approach. Requirements: 1) Payment processing with multiple gateways (Stripe, PayPal), 2) Cart management with session persistence, 3) Order validation and inventory checks, 4) Email notifications system, 5) Admin dashboard for order management, 6) Mobile-responsive UI/UX, 7) Security: PCI compliance and fraud detection. Implement as independent, parallel-safe components with clear interfaces."

📊 Optimization Details:
- Mode: DETAIL
- Complexity Score: 9
- Improvements Applied: 12

🔧 Key Enhancements:
• Added parallel development structure
• Specified multiple payment gateways
• Included security requirements (PCI compliance)
• Added mobile responsiveness requirement
• Structured for independent component development

═══════════════════════════════════════════════════════════════

🔍 Environment Detection:
├─ GitHub Repository: ✅ Detected (user/ecommerce-app)
├─ GitHub CLI: ✅ Available
├─ gh-sub-issue extension: ⏳ Installing...
└─ CCPM Mode: ✅ Activated

🎯 Creating Epic: E-commerce Checkout System
├─ Epic Issue #156 created on GitHub
├─ 6 parallel-safe tasks identified
└─ 4 specialized agents ready for deployment

🚀 Parallel Execution Started:
Agent 1: Payment Processing (Issue #157) 🔄 In Progress
Agent 2: Cart Management (Issue #158) 🔄 In Progress  
Agent 3: Order Validation (Issue #159) ⏳ Queued
Agent 4: Email Notifications (Issue #160) ⏳ Queued

📊 Progress Dashboard: https://github.com/user/ecommerce-app/issues/156
📋 Project Management: ClaudeFiles/pm/dashboard.md

Expected completion: 2.5 hours → 45 minutes (parallel execution)
```

### Example 0b: CCPM Local Mode (No GitHub)
```
User: /systemcc --pm "refactor authentication across all services"

🔍 Environment Detection:
├─ GitHub Repository: ❌ Not detected
├─ Local PM Mode: ✅ Activated
└─ CCPM-Inspired Workflow: ✅ Ready

📁 Created Local PM Structure:
├─ ClaudeFiles/pm/epics/epic-20240822-103045.json
├─ ClaudeFiles/pm/dashboard.md
└─ 5 parallel-safe tasks identified

🔄 Simulated Parallel Execution:
Phase 1: Database Schema Updates ✅ Complete (15 min)
Phase 2: Service A + Service B 🔄 Parallel Phase (est. 30 min)
Phase 3: Service C + Testing 🔄 Parallel Phase (est. 25 min)

📊 Local Dashboard: ClaudeFiles/pm/dashboard.md
Expected completion: 3 hours → 1.2 hours (parallel simulation)
```

### Example 1: Agent OS Integration Detection
```
User: /systemcc "setup coding standards for our Python project"

═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════

📝 Original Request:
"setup coding standards for our Python project"

🔍 Analysis Phase:
- Deconstructing intent...
- Diagnosing gaps...
- Developing enhancements...
- Delivering optimized prompt...

✨ Optimized Prompt:
"Initialize comprehensive coding standards for Python project including: Black formatter configuration, Flake8 linting rules with custom exceptions, pre-commit hooks for code quality, pytest configuration with coverage requirements, type checking with mypy, documentation standards with docstring conventions, and CI/CD integration. Create team-specific style guide aligned with PEP 8."

📊 Optimization Details:
- Mode: DETAIL
- Complexity Score: 6
- Improvements Applied: 8

🔧 Key Enhancements:
• Added specific Python tooling (Black, Flake8, mypy)
• Included pre-commit hooks for enforcement
• Specified documentation standards
• Added CI/CD integration requirements

═══════════════════════════════════════════════════════════════

🧠 Workflow Detection:
- Keywords detected: "setup", "coding standards"
- Agent OS methodology identified
→ Routing to Complete System with Agent OS Integration

🚀 Executing Agent OS Enhanced Workflow:
✅ Phase 1/9: AGENT_OS_ANALYZER - Project analysis complete
✅ Phase 2/9: AGENT_OS_ARCHITECT - Standards framework designed  
✅ Phase 3/9: PLANNER - Implementation strategy complete
🔄 Phase 4/9: EXECUTER - Implementing configurations...
✅ Phase 4/9: EXECUTER - Configuration files generated
✅ Phase 5/9: STANDARDS_CREATOR - All standards files created
✅ Phase 6/9: VERIFIER - Quality validation passed
✅ Phase 7/9: TESTER - Standards testing complete
✅ Phase 8/9: DOCUMENTER - Team documentation ready
✅ Phase 9/9: UPDATER - Project fully standardized

✨ Agent OS Integration Complete!
📁 Created: tech-stack.md, code-style.md, best-practices.md
🔧 Generated: .flake8, pyproject.toml, pre-commit config
📚 Documented: Team onboarding guide and development workflow
```

### Example 2: Agent OS Product Planning Detection
```
User: /systemcc "analyze our codebase and create a product roadmap"

═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION  
═══════════════════════════════════════════════════════════════

📝 Original Request:
"analyze our codebase and create a product roadmap"

✨ Optimized Prompt:
"Conduct comprehensive codebase analysis and create strategic product roadmap including: 1) Technology stack assessment with upgrade recommendations, 2) Code quality metrics and improvement areas, 3) Architecture decisions documentation, 4) Feature development priorities, 5) Technical debt roadmap, 6) Team capability assessment, 7) 6-month development timeline with milestones."

📊 Optimization Details:
- Mode: DETAIL
- Complexity Score: 8
- Improvements Applied: 7

═══════════════════════════════════════════════════════════════

🧠 Workflow Detection:
- Keywords detected: "analyze codebase", "product roadmap"  
- Agent OS product planning scenario identified
→ Routing to Complete System with Agent OS Integration

🚀 Executing Agent OS Enhanced Workflow:
✅ Phase 1/9: AGENT_OS_ANALYZER - Codebase analysis complete
    • Technology stack: React, Node.js, PostgreSQL
    • Standards score: 3/5 (needs improvement)
    • 47 improvement opportunities identified
✅ Phase 2/9: AGENT_OS_ARCHITECT - Product framework designed
    • Mission statement defined
    • Technical roadmap structured
    • Standards framework outlined
🔄 Phase 3/9: PLANNER - Strategic roadmap creation...
```

### Example 3: AI Dev Tasks Detection (Standard Feature)
```
User: /systemcc "build a user dashboard with analytics"

Step 1 - Lyra Universal Optimization:
Original: "build a user dashboard with analytics" 
Optimized: "Build comprehensive user dashboard feature with real-time analytics. Requirements: 1) Dashboard layout with customizable widgets, 2) Analytics visualizations using Chart.js for metrics like user activity, revenue, engagement, 3) Date range filtering, 4) Export functionality for reports, 5) Responsive design for mobile/tablet, 6) Performance: <2s load time with lazy loading, 7) Role-based widget visibility. Deliver complete frontend components and backend APIs with tests."

Step 2 - Workflow Detection:
- Keywords detected: "build feature", "dashboard"
- Complex user-facing feature (no standards focus)
→ Routing to AI Dev Tasks for PRD approach

Executing: /aidevtasks create-prd "[optimized prompt]"
Reason: Complex feature benefits from PRD-based development
```

### Example 3: Large Context Detection
```
User: /systemcc "refactor authentication across all services"

Step 1 - Lyra Prompt Optimization:
Original: "refactor authentication across all services"
Optimized: "As a senior fullstack engineer, refactor the authentication system across all microservices to implement OAuth 2.0 with JWT tokens. Requirements: 1) Maintain backward compatibility during migration, 2) Implement centralized auth service, 3) Update all service endpoints with new auth middleware, 4) Add comprehensive tests for auth flows. Deliver complete, production-ready code with proper error handling and logging."

Step 2 - Context Analysis:
- Current context: 42,000 tokens ✓
- Project size: 250+ files ✓
- Cross-cutting changes ✓
→ Using Phase-Based Approach for optimal context management

Executing: /taskit "[optimized prompt]"
Reason: Large context requires phase decomposition
```

### Example 4: Complex Task (Normal Context)
```
User: /systemcc "implement real-time chat with WebSocket support"

Step 1 - Lyra Prompt Optimization:
Original: "implement real-time chat with WebSocket support"
Optimized: "As a senior fullstack developer, implement a production-ready real-time chat system using WebSocket. Requirements: 1) Client-side: React component with message UI, typing indicators, online status, 2) Server-side: WebSocket server with Socket.io, message persistence, room management, 3) Features: 1-to-1 and group chat, message history, reconnection handling, 4) Security: Authentication, rate limiting, input sanitization. Deliver complete implementation with both frontend and backend code, including error handling and tests."

Step 2 - Context Analysis:
- Current context: 8,000 tokens
- Estimated duration: 45 minutes

Step 3 - Task Analysis:
- Multi-file changes required ✓
- New technology integration ✓
- Security considerations ✓
→ Selecting Complete System Workflow

Executing: /planner "[optimized prompt]"
```

### Example 5: Simple Task (Any Context)
```
User: /systemcc "update button color to match new brand guidelines"

═══════════════════════════════════════════════════════════════
🎯 LYRA AI PROMPT OPTIMIZATION
═══════════════════════════════════════════════════════════════

📝 Original Request:
"update button color to match new brand guidelines"

🔍 Analysis Phase:
- Deconstructing intent...
- Diagnosing gaps...
- Developing enhancements...
- Delivering optimized prompt...

✨ Optimized Prompt:
"Update all button components to use the new brand color palette. Primary buttons: #007AFF, Secondary: #5856D6, Destructive: #FF3B30. Ensure proper hover states, disabled states, and maintain WCAG AA contrast ratios. Update any related CSS variables and theme configurations."

📊 Optimization Details:
- Mode: BASIC
- Complexity Score: 2
- Improvements Applied: 4

🔧 Key Enhancements:
• Added specific color values for clarity
• Included accessibility requirements (WCAG)
• Specified button states to update
• Added CSS variable update reminder

═══════════════════════════════════════════════════════════════

Step 2 - Context Analysis:
- Task scope: Single file
- No context accumulation

Step 3 - Task Analysis:
- Style-only modification ✓
- Low risk ✓
- Minimal testing ✓
→ Selecting Orchestrated-Only Workflow

Executing: /orchestrated "[optimized prompt]"
```

### Example 6: Growing Context Trigger
```
User: /systemcc "add export functionality to all data tables"

Step 1 - Lyra Universal Optimization:
Original: "add export functionality to all data tables"
Optimized: "Add comprehensive export functionality to all data tables across the application. Requirements: 1) Support formats: CSV, Excel, PDF, JSON, 2) Handle large datasets with streaming, 3) Preserve formatting and filters, 4) Include column selection UI, 5) Background job processing for large exports, 6) Email delivery option, 7) Apply to all existing table components. Maintain consistent UX across all tables."

Step 2 - Context Analysis:
- Current context: 28,000 tokens (near limit)
- Task touches 8 different modules ✓
- Predicted final context: 50,000+ tokens ✓
→ Using Phase-Based Approach to prevent context overload

Executing: /taskit "[optimized prompt]"
Reason: Predicted context growth requires phases
```

### Example 7: CCPM Recommendation (NEW!)
```
User: /systemcc "build microservices architecture with user service, payment service, and notification service"

Step 1 - Lyra Universal Optimization:
Original: "build microservices architecture with user service, payment service, and notification service"
Optimized: "Build comprehensive microservices architecture with three independent services: 1) User Service with authentication and profile management, 2) Payment Service with Stripe integration and transaction handling, 3) Notification Service with email/SMS capabilities. Include API gateway, service discovery, and inter-service communication. Deliver complete implementation with Docker containers, tests, and documentation."

Step 2 - Task Analysis:
- Complexity: High (8/10)
- Independent Components: 3 services ✓
- Estimated Time: 4+ hours ✓
- Parallel Potential: High ✓

💡 CCPM RECOMMENDATION:
This task has 3 independent components that could benefit from parallel execution and project management tracking.

Recommended approach: CCPM (Code Change Project Manager)
Benefits: 3x faster development, better progress tracking, parallel execution

🔍 Environment detected: GitHub repository
Mode: GitHub integration with Issues (gh-sub-issue extension)

Do you want to use CCPM for this task? (y/n)
If no, I'll use the standard Complete System workflow.

User: y

🚀 Activating CCPM Integration...
✅ GitHub CCPM mode selected
📋 Creating Epic: Microservices Architecture
[Continues with CCPM workflow...]
```

### Example 8: CCPM Declined
```
User: /systemcc "refactor authentication across all microservices"

[Same analysis showing CCPM would be beneficial...]

Do you want to use CCPM for this task? (y/n)
If no, I'll use the standard Complete System workflow.

User: n

✅ Continuing with standard workflow selection
📊 Task Analysis indicates: Complete System Workflow
Reason: High complexity requiring comprehensive validation

Executing: /planner "[optimized prompt]"
```

### Example 9: Explicit PM Flag
```
User: /systemcc --pm "add search functionality"

Step 1 - Lyra Universal Optimization:
[Optimization process...]

Step 2 - CCPM Detection:
- Explicit --pm flag detected
→ Skipping recommendation, activating CCPM directly

🚀 Activating CCPM Integration...
🔍 Environment detected: GitLab repository  
✅ GitLab CCPM mode selected (native Epics!)
[Continues with CCPM workflow...]
```

## Error Handling

If the system cannot determine complexity:
1. Present analysis to user
2. Ask for workflow preference
3. Provide recommendation based on partial analysis

## Future Enhancements

- Machine learning-based complexity detection
- Historical task analysis for better predictions
- Custom complexity rules per project
- Integration with /taskit for phase-based execution
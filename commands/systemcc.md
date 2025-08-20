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
```

**That's it!** Claude figures out:
- Simple fix? → Runs 3-agent workflow internally
- Complex feature? → Runs 6-agent workflow internally
- New feature? → Creates PRD, tasks, implements internally
- Large codebase? → Uses phase-based approach internally

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

10. **Execute Workflow Automatically** (With Optimized Prompt):
   ```
   # Claude executes everything internally - no exposed commands!
   
   IF detected_type == 'agent_os_integration':
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

11. **Memory Bank Persistence**:
   ```
   After workflow completion:
   - Save session summary to activeContext.md
   - Document discovered patterns
   - Record architectural decisions
   - Update troubleshooting database
   - Run memory-bank-synchronizer if needed
   ```

## Enhanced Context-Aware Decision Engine

```python
def analyze_for_workflow_selection(task_description, context_info, kase_metadata):
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
    
    # Initialize scoring system
    scores = {
        'complexity': 0,
        'risk': 0,
        'scope': 0,
        'context_size': 0,
        'time_estimate': 0
    }
    
    # Multi-factor analysis
    analysis = perform_comprehensive_analysis(task_description, context_info, lyra_result)
    
    # PRIORITY 1: Context-based routing (overrides everything)
    if context_info['current_tokens'] > 30000:
        return ('taskit', 'Context size exceeds optimal threshold', analysis)
    
    if context_info['loaded_files'] > 10:
        return ('taskit', 'Too many files in context', analysis)
    
    # PRIORITY 2: Pattern-based detection
    detected_patterns = detect_patterns(task_description, context_info)
    
    # PRIORITY 3: Risk assessment
    risk_level = assess_risk(task_description, detected_patterns)
    
    # PRIORITY 4: Intelligent workflow selection
    workflow = select_optimal_workflow(analysis, detected_patterns, risk_level)
    
    return (workflow.name, workflow.reason, analysis)

def perform_comprehensive_analysis(task_desc, context, lyra_result):
    """Multi-dimensional task analysis"""
    return {
        'complexity_score': calculate_complexity(task_desc, lyra_result),
        'affected_components': identify_affected_components(task_desc),
        'risk_factors': identify_risks(task_desc),
        'estimated_duration': estimate_duration(task_desc, context),
        'pattern_matches': find_codebase_patterns(task_desc),
        'security_implications': check_security_impact(task_desc),
        'breaking_changes': detect_breaking_changes(task_desc)
    }

def calculate_complexity(task_desc, lyra_result):
    """Advanced complexity scoring beyond keywords"""
    factors = {
        'technical_depth': analyze_technical_requirements(task_desc),
        'integration_points': count_integration_points(task_desc),
        'data_complexity': assess_data_operations(task_desc),
        'ui_complexity': assess_ui_requirements(task_desc),
        'testing_needs': evaluate_testing_requirements(task_desc)
    }
    
    # Weight and combine factors
    weighted_score = sum(factors[k] * WEIGHTS[k] for k in factors)
    return min(10, weighted_score + lyra_result.metadata.complexity_score)

def select_optimal_workflow(analysis, patterns, risk):
    """Intelligent workflow selection based on multiple factors"""
    
    # PRIORITY 1: Agent OS Integration Detection
    agent_os_keywords = [
        'setup', 'initialize', 'standards', 'conventions', 'project structure',
        'plan product', 'analyze codebase', 'create spec', 'mission', 'roadmap',
        'tech stack', 'coding standards', 'best practices', 'team conventions',
        'code style', 'development workflow', 'tool configuration'
    ]
    
    agent_os_scenarios = [
        'new project initialization',
        'existing project standardization',
        'product planning and specification',
        'architecture documentation',
        'development workflow setup'
    ]
    
    if any(keyword in analysis['task_description'].lower() for keyword in agent_os_keywords):
        return Workflow('agent_os_integration', 
                       'Agent OS methodology detected - comprehensive standards and specification approach')
    
    if any(scenario in analysis['context_hints'] for scenario in agent_os_scenarios):
        return Workflow('agent_os_integration',
                       'Agent OS workflow patterns detected')
    
    # PRIORITY 2: High risk always gets full validation
    if risk.level == 'HIGH':
        return Workflow('complete_system', 
                       f'High-risk changes require comprehensive validation: {risk.reasons}')
    
    # PRIORITY 3: Feature development with unclear requirements
    if analysis['complexity_score'] > 6 and 'feature' in patterns:
        return Workflow('aidevtasks', 
                       'Complex feature benefits from PRD-based approach')
    
    # PRIORITY 4: Large scope but well-defined
    if analysis['affected_components'] > 5 and analysis['complexity_score'] < 7:
        return Workflow('taskit', 
                       'Large scope benefits from phase-based execution')
    
    # PRIORITY 5: Simple, low-risk changes
    if analysis['complexity_score'] < 4 and risk.level == 'LOW':
        return Workflow('orchestrated', 
                       'Simple task suitable for streamlined execution')
    
    # Default to complete system for safety
    return Workflow('complete_system', 
                   'Comprehensive approach for balanced risk/complexity')
```

## Integration with Unified System

This master router integrates all subsystems:

### Workflows Available
1. **Agent OS** (`workflows/agent-os/`) - Project initialization and standards
2. **AI Dev Tasks** (`workflows/ai-dev-tasks/`) - PRD-based development
3. **Complete System** (`workflows/complete-system/`) - 6-agent validation
4. **Orchestrated** (`workflows/orchestrated-only/`) - Streamlined execution
5. **Phase-Based** (`workflows/phase-based-workflow/`) - Context management

### Universal Components
- **Lyra Middleware** (`middleware/lyra-universal.md`) - Applied to all commands
- **ClaudeFiles Organization** - Unified output structure
- **Git Integration** - Consistent across all workflows

### Internal Workflow Handling
**These happen automatically inside Claude - you never run these:**
- Agent OS workflow - For project setup and standards
- AI Dev Tasks - For feature development with PRDs
- Phase-based execution - For large contexts
- Complete system - For complex validations
- Orchestrated workflow - For quick fixes

**Claude runs these internally based on your task!**

## Automated Workflow Execution

All workflows now use the **Automated Workflow Executor** (`middleware/automated-workflow-executor.md`) to provide:

### Automatic Agent Sequencing
- **Complete System**: PLANNER → EXECUTER → VERIFIER → TESTER → DOCUMENTER → UPDATER
- **Orchestrated**: Orchestrator → Developer → Reviewer
- **Agent OS**: Analyze → Architect → Build → Document
- **AI Dev Tasks**: Create PRD → Generate Tasks → Process Tasks
- **Phase-Based**: Decompose → Execute Phases → Integrate Results

### Progress Tracking
```
🚀 Starting Complete System Workflow...
✅ PLANNER: Strategic analysis complete (1/6)
🔄 EXECUTER: Implementing solution... (2/6)
✅ EXECUTER: Implementation complete (2/6)
🔄 VERIFIER: Running quality checks... (3/6)
```

### Smart User Interactions
The system only pauses for input when:
1. **Specifications Needed**: "What fields should the form have?"
2. **Technical Choices**: "PostgreSQL or MySQL for database?"
3. **Feature Clarification**: "Should this work offline?"
4. **Context Required**: "What's your authentication system?"

**NEVER asks you to run commands!**

Example:
```
User: /systemcc "add product search"

Claude: 🚀 Analyzing your request...

❓ I need some details about the search functionality:
1. What fields should be searchable? (name, description, tags, etc.)
2. Do you need filters? (price range, category, etc.)
3. Should it support fuzzy matching?

User: Name and description, yes filters for price and category, yes fuzzy matching

Claude: 🔄 Phase 1/6: Designing search architecture...
[Continues automatically through ALL phases]
```

## Benefits of Unified System

1. **Universal Prompt Optimization** - Lyra enhances all commands
2. **Intelligent Routing** - Automatically selects best workflow
3. **Complete Integration** - Access to all tools from one command
4. **Flexibility** - Force specific workflows when needed
5. **Backward Compatible** - All existing commands still work
6. **Context Aware** - Manages large codebases efficiently
7. **Quality First** - Right validation level for each task
8. **Fully Automated** - All workflows execute end-to-end without manual commands
9. **Smart Interactions** - Only asks for input when truly needed
10. **Seamless Experience** - Focus on requirements, not process

## Examples

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

### Example 7: Forced Workflow Selection
```
User: /systemcc --workflow=complete "add user preferences"

Step 1 - Lyra Universal Optimization:
[Optimization happens regardless of forced workflow]

Step 2 - Workflow Detection:
- Forced workflow flag detected: --workflow=complete
→ Bypassing auto-detection

Executing: /planner "[optimized prompt]"
Reason: User specified complete system workflow
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
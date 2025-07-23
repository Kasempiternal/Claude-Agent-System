# /systemcc - Master Router for Unified Claude Agent System

⚠️ **CRITICAL IMPLEMENTATION NOTE**: When executing /systemcc, you MUST visibly show the Lyra AI Prompt Optimization process to the user with the formatted output box. This is not optional - it's a core feature that demonstrates the value of the optimization process.

## Purpose
The `/systemcc` command is the master router that:
1. Optimizes all prompts using Lyra universal middleware (ALWAYS SHOW THIS)
2. Intelligently routes to the most appropriate subsystem
3. Provides access to all workflows: Agent OS, AI Dev Tasks, Complete System, Orchestrated, and Phase-based
4. Allows manual workflow selection when needed

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

5. **Execute Selected Workflow** with optimized prompt and appropriate configuration

## Usage

### Basic Usage
```bash
/systemcc "your task description"
```

### Force Specific Workflow
```bash
/systemcc --workflow=agetos "setup project standards"
/systemcc --workflow=aidevtasks "build user dashboard feature"
/systemcc --workflow=taskit "refactor entire application"
/systemcc --workflow=complete "implement payment system"
/systemcc --workflow=orchestrated "fix button styling"
```

### Direct Subsystem Access
```bash
/agetos init                    # Initialize Agent OS directly
/aidevtasks create-prd          # Start PRD workflow directly
/taskit "large refactoring"     # Use phase-based directly
/planner "complex feature"      # Start complete system directly
/orchestrated "simple fix"      # Use streamlined workflow directly
```

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

1. **Prompt Optimization with Lyra** (ALWAYS SHOW THIS TO USER):
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

2. **Context Analysis** (Second Priority):
   ```
   - Check current context size (tokens)
   - Count loaded files and their sizes
   - Evaluate project size (file count)
   - Assess conversation history length
   - Predict context growth for the task
   ```

3. **Task Analysis** (Using Optimized Prompt):
   ```
   - Parse the optimized task description
   - Check for keywords indicating complexity
   - Evaluate scope indicators
   - Consider risk factors
   - Estimate time requirements
   ```

4. **Enhanced Decision Matrix**:
   ```
   Agent OS (/agetos) Indicators:
   - Keywords: "setup", "initialize", "standards", "conventions", "project structure"
   - New project initialization
   - Coding standards establishment
   - Development workflow setup
   - Tool configuration
   - Team conventions
   
   AI Dev Tasks (/aidevtasks) Indicators:
   - Keywords: "build feature", "create system", "product", "user story"
   - Feature development from scratch
   - Complex user-facing functionality
   - Needs detailed requirements
   - Benefits from PRD approach
   - Multi-component features
   
   Phase-Based (/taskit) Indicators:
   - Context already > 30,000 tokens
   - More than 10 files loaded
   - Project has 100+ files
   - Task touches 5+ modules
   - Estimated time > 60 minutes
   - Keywords: "entire", "all", "across", "throughout", "migrate"
   
   Complete System Indicators:
   - Keywords: "architecture", "refactor", "security", "performance"
   - Multi-system integration (< 5 modules)
   - Database schema changes
   - API design changes
   - High-risk modifications
   - Needs thorough validation
   
   Orchestrated-Only Indicators:
   - Keywords: "fix", "update", "tweak", "adjust", "simple"
   - Single component changes
   - UI text updates
   - Configuration changes
   - Style adjustments
   - Bug fixes
   ```

5. **Execute Workflow** (With Optimized Prompt):
   ```
   # Note: {optimized_prompt} is the Lyra-enhanced version
   
   IF forced_workflow:
     Execute: /{forced_workflow} "{optimized_prompt}"
   ELIF detected_type == 'project_setup':
     Execute: /agetos "{optimized_prompt}"
     Reason: "Project initialization and standards"
   ELIF detected_type == 'feature_development':
     Execute: /aidevtasks create-prd "{optimized_prompt}"
     Reason: "Complex feature benefits from PRD approach"
   ELIF context_size > 30000 OR predicted_context_large:
     Execute: /taskit "{optimized_prompt}"
     Reason: "Large context requires phase-based approach"
   ELIF estimated_time > 60_minutes:
     Execute: /taskit "{optimized_prompt}"
     Reason: "Complex task benefits from phase decomposition"
   ELIF complexity_score > 5:
     Execute: /planner "{optimized_prompt}"
     Follow with: /executer, /verifier, /tester, /documenter, /updater
   ELSE:
     Execute: /orchestrated "{optimized_prompt}"
   ```

## Context-Aware Scoring Algorithm

```python
def analyze_for_workflow_selection(task_description, context_info, lyra_metadata):
    # Use Lyra universal middleware first
    lyra_result = lyra_optimize({
        'command': 'systemcc',
        'prompt': task_description,
        'context': context_info
    })
    
    # Check for forced workflow
    if '--workflow=' in task_description:
        workflow = extract_workflow_flag(task_description)
        return (workflow, 'User specified workflow')
    
    # PRIORITY 1: Task type detection
    # Agent OS detection
    agetos_keywords = ['setup', 'initialize', 'standards', 'conventions', 
                      'project structure', 'coding style', 'team practices']
    if any(keyword in task_description.lower() for keyword in agetos_keywords):
        return ('agetos', 'Project initialization and standards')
    
    # AI Dev Tasks detection
    aidevtasks_keywords = ['build feature', 'create system', 'product requirement',
                          'user story', 'new functionality', 'from scratch']
    if any(keyword in task_description.lower() for keyword in aidevtasks_keywords):
        return ('aidevtasks', 'Feature development with PRD approach')
    
    # PRIORITY 2: Context-based routing
    if context_info['current_tokens'] > 30000:
        return ('taskit', 'Context size exceeds optimal threshold')
    
    if context_info['loaded_files'] > 10:
        return ('taskit', 'Too many files in context')
    
    # PRIORITY 3: Complexity from Lyra metadata
    complexity = lyra_result.metadata.complexity_score
    
    if complexity >= 9:
        return ('taskit', 'Very complex task requiring phases')
    elif complexity >= 7:
        return ('aidevtasks', 'Complex feature needing PRD')
    elif complexity >= 5:
        return ('complete_system', 'Multi-step task with validation')
    else:
        return ('orchestrated', 'Simple task for quick execution')
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

### Direct Access Commands
While `/systemcc` provides intelligent routing, users can directly access:
- `/agetos` - Agent OS workflow
- `/aidevtasks` - PRD-based development
- `/taskit` - Phase-based execution
- `/planner` - Complete system start
- `/orchestrated` - Streamlined workflow

## Benefits of Unified System

1. **Universal Prompt Optimization** - Lyra enhances all commands
2. **Intelligent Routing** - Automatically selects best workflow
3. **Complete Integration** - Access to all tools from one command
4. **Flexibility** - Force specific workflows when needed
5. **Backward Compatible** - All existing commands still work
6. **Context Aware** - Manages large codebases efficiently
7. **Quality First** - Right validation level for each task

## Examples

### Example 1: Agent OS Detection
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

Step 2 - Workflow Detection:
- Keywords detected: "setup", "standards"
- Project initialization task identified
→ Routing to Agent OS workflow

Executing: /agetos "[optimized prompt]"
Reason: Project standards and initialization
```

### Example 2: AI Dev Tasks Detection
```
User: /systemcc "build a user dashboard with analytics"

Step 1 - Lyra Universal Optimization:
Original: "build a user dashboard with analytics"
Optimized: "Build comprehensive user dashboard feature with real-time analytics. Requirements: 1) Dashboard layout with customizable widgets, 2) Analytics visualizations using Chart.js for metrics like user activity, revenue, engagement, 3) Date range filtering, 4) Export functionality for reports, 5) Responsive design for mobile/tablet, 6) Performance: <2s load time with lazy loading, 7) Role-based widget visibility. Deliver complete frontend components and backend APIs with tests."

Step 2 - Workflow Detection:
- Keywords detected: "build feature", "dashboard"
- Complex user-facing feature identified
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

### Example 2: Complex Task (Normal Context)
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

### Example 3: Simple Task (Any Context)
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
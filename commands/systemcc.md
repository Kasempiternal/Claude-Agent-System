# /systemcc - Unified Claude Code System Command with AI Prompt Optimization

## Purpose
The `/systemcc` command is a unified entry point that first optimizes your prompt using Lyra (AI prompt specialist), then automatically analyzes task complexity and selects the appropriate workflow - either the complete six-agent system or the streamlined orchestrated workflow.

## How It Works

When you use `/systemcc "your task description"`, the system will:

1. **Optimize Your Prompt with Lyra** (NEW FIRST STEP):
   - Transform vague requests into precision-crafted prompts
   - Apply 4-D methodology: Deconstruct, Diagnose, Develop, Deliver
   - Ensure complete code delivery specifications
   - Leverage Claude Code's project context awareness

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
   - **Phase-Based (/taskit)** for large contexts or complex multi-hour tasks
   - **Complete System** for complex, multi-phase tasks
   - **Orchestrated-Only** for simpler, focused tasks

5. **Execute Selected Workflow** with optimized prompt and appropriate configuration

## Usage

```bash
/systemcc "implement user authentication with JWT tokens"
# Analyzes: Multi-file, security-critical → Selects Complete System

/systemcc "fix typo in header component"  
# Analyzes: Single file, low risk → Selects Orchestrated-Only

/systemcc "refactor entire data layer to use Redux Toolkit"
# Analyzes: Architecture change, high risk → Selects Complete System
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

1. **Prompt Optimization with Lyra**:
   ```
   - Analyze user's raw prompt
   - Apply 4-D methodology (Deconstruct, Diagnose, Develop, Deliver)
   - Auto-detect complexity for BASIC or DETAIL mode
   - Transform into precision-crafted development prompt
   - Present optimized prompt to user
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

4. **Decision Matrix**:
   ```
   Phase-Based (/taskit) Indicators:
   - Context already > 30,000 tokens
   - More than 10 files loaded
   - Project has 100+ files
   - Task touches 5+ modules
   - Estimated time > 60 minutes
   - Multiple system integrations
   - Keywords: "entire", "all", "across", "throughout", "migrate"
   
   Complete System Indicators:
   - Keywords: "architecture", "refactor", "security", "performance"
   - Multi-system integration (< 5 modules)
   - Database schema changes
   - API design changes
   - Cross-functional features
   - High-risk modifications
   
   Orchestrated-Only Indicators:
   - Keywords: "fix", "update", "tweak", "adjust", "simple"
   - Single component changes
   - UI text updates
   - Configuration changes
   - Style adjustments
   - Small context footprint
   ```

5. **Execute Workflow** (With Optimized Prompt):
   ```
   # Note: {optimized_prompt} is the Lyra-enhanced version
   
   IF context_size > 30000 OR predicted_context_large:
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
def analyze_for_workflow_selection(task_description, context_info):
    # PRIORITY 1: Context-based routing
    if context_info['current_tokens'] > 30000:
        return ('taskit', 'Context size exceeds optimal threshold')
    
    if context_info['loaded_files'] > 10:
        return ('taskit', 'Too many files in context')
    
    if context_info['project_files'] > 100 and mentions_cross_cutting_changes(task):
        return ('taskit', 'Large project with broad changes')
    
    # PRIORITY 2: Time/complexity routing
    estimated_time = estimate_task_duration(task_description)
    if estimated_time > 60:
        return ('taskit', 'Complex task requiring phases')
    
    # PRIORITY 3: Standard complexity scoring
    score = 0
    
    # Check for complex keywords (+2 each)
    complex_keywords = ["architecture", "refactor", "security", "performance", 
                       "migration", "integration", "system", "database", "api"]
    
    # Check for simple keywords (-1 each)
    simple_keywords = ["fix", "typo", "update", "tweak", "adjust", "simple",
                      "minor", "small", "quick"]
    
    # Scope and risk assessment
    if mentions_multiple_files: score += 3
    if mentions_testing_required: score += 2
    if involves_auth_or_security: score += 5
    if involves_data_layer: score += 3
    
    # Decision
    if score > 5:
        return ('complete_system', 'Complex task requiring full validation')
    else:
        return ('orchestrated', 'Simple task suitable for streamlined workflow')
```

## Integration with Existing System

This command integrates seamlessly with:
- `README-AGENT-SYSTEM.md` guidelines
- Existing agent workflows
- Git worktree management
- Project documentation standards
- `ClaudeFiles/` directory structure for organized output

## Benefits

1. **Eliminates Manual Decision** - No need to read README-AGENT-SYSTEM.md each time
2. **Optimizes Resource Usage** - Uses lighter workflow when appropriate
3. **Maintains Quality** - Always applies the right level of validation
4. **Speeds Development** - Reduces decision overhead

## Examples

### Example 1: Large Context Detection
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

Step 1 - Lyra Prompt Optimization (BASIC mode detected):
Original: "update button color to match new brand guidelines"
Optimized: "Update all button components to use the new brand color palette. Primary buttons: #007AFF, Secondary: #5856D6, Destructive: #FF3B30. Ensure proper hover states, disabled states, and maintain WCAG AA contrast ratios. Update any related CSS variables and theme configurations."

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

### Example 4: Growing Context Trigger
```
User: /systemcc "add export functionality to all data tables"

Context Analysis:
- Current context: 28,000 tokens (near limit)
- Task touches 8 different modules ✓
- Predicted final context: 50,000+ tokens ✓
→ Using Phase-Based Approach to prevent context overload

Executing: /taskit "add export functionality to all data tables"
Reason: Predicted context growth requires phases
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
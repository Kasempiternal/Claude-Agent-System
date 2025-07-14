# /systemcc - Unified Claude Code System Command

## Purpose
The `/systemcc` command is a unified entry point that automatically analyzes your task complexity and selects the appropriate workflow - either the complete six-agent system or the streamlined orchestrated workflow.

## How It Works

When you use `/systemcc "your task description"`, the system will:

1. **Analyze Context Size** (HIGHEST PRIORITY):
   - Current conversation token count
   - Number of files already loaded
   - Project size and complexity
   - Predicted context growth

2. **Analyze Task Complexity**:
   - Scope of changes (single file vs multi-file)
   - Type of task (bug fix, feature, architecture change)
   - Risk level and dependencies
   - Required validation depth

3. **Auto-Select Workflow**:
   - **Phase-Based (/taskit)** for large contexts or complex multi-hour tasks
   - **Complete System** for complex, multi-phase tasks
   - **Orchestrated-Only** for simpler, focused tasks

4. **Execute Selected Workflow** with appropriate configuration

## Usage

```bash
/systemcc "implement user authentication with JWT tokens"
# Analyzes: Multi-file, security-critical → Selects Complete System

/systemcc "fix typo in header component"  
# Analyzes: Single file, low risk → Selects Orchestrated-Only

/systemcc "refactor entire data layer to use Redux Toolkit"
# Analyzes: Architecture change, high risk → Selects Complete System
```

## Implementation Instructions

When this command is invoked:

1. **Context Analysis** (First Priority):
   ```
   - Check current context size (tokens)
   - Count loaded files and their sizes
   - Evaluate project size (file count)
   - Assess conversation history length
   - Predict context growth for the task
   ```

2. **Task Analysis**:
   ```
   - Parse the task description
   - Check for keywords indicating complexity
   - Evaluate scope indicators
   - Consider risk factors
   - Estimate time requirements
   ```

3. **Decision Matrix**:
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

4. **Execute Workflow**:
   ```
   IF context_size > 30000 OR predicted_context_large:
     Execute: /taskit "{task_description}"
     Reason: "Large context requires phase-based approach"
   ELIF estimated_time > 60_minutes:
     Execute: /taskit "{task_description}"
     Reason: "Complex task benefits from phase decomposition"
   ELIF complexity_score > 5:
     Execute: /planner "{task_description}"
     Follow with: /executer, /verifier, /tester, /documenter, /updater
   ELSE:
     Execute: /orchestrated "{task_description}"
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

## Benefits

1. **Eliminates Manual Decision** - No need to read README-AGENT-SYSTEM.md each time
2. **Optimizes Resource Usage** - Uses lighter workflow when appropriate
3. **Maintains Quality** - Always applies the right level of validation
4. **Speeds Development** - Reduces decision overhead

## Examples

### Example 1: Large Context Detection
```
User: /systemcc "refactor authentication across all services"

Context Analysis:
- Current context: 42,000 tokens ✓
- Project size: 250+ files ✓
- Cross-cutting changes ✓
→ Using Phase-Based Approach for optimal context management

Executing: /taskit "refactor authentication across all services"
Reason: Large context requires phase decomposition
```

### Example 2: Complex Task (Normal Context)
```
User: /systemcc "implement real-time chat with WebSocket support"

Context Analysis:
- Current context: 8,000 tokens
- Estimated duration: 45 minutes

Task Analysis:
- Multi-file changes required ✓
- New technology integration ✓
- Security considerations ✓
→ Selecting Complete System Workflow

Executing: /planner "implement real-time chat with WebSocket support"
```

### Example 3: Simple Task (Any Context)
```
User: /systemcc "update button color to match new brand guidelines"

Context Analysis:
- Task scope: Single file
- No context accumulation

Task Analysis:
- Style-only modification ✓
- Low risk ✓
- Minimal testing ✓
→ Selecting Orchestrated-Only Workflow

Executing: /orchestrated "update button color to match new brand guidelines"
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
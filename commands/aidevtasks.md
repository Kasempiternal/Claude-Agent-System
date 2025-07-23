# /aidevtasks - PRD-Based Feature Development

## Purpose
Structured feature development using Product Requirement Documents (PRDs) and hierarchical task decomposition. This command integrates the AI Dev Tasks workflow for systematic, high-quality feature implementation.

## How It Works

When you use `/aidevtasks`, the system will:

1. **Apply Lyra Universal Optimization** to enhance your request
2. **Create a PRD** with clarifying questions for comprehensive requirements
3. **Generate hierarchical tasks** from the approved PRD
4. **Process tasks one at a time** with user approval checkpoints
5. **Commit completed parent tasks** with proper git management

## Usage

### Basic Commands
```bash
/aidevtasks create-prd "feature description"    # Start PRD creation
/aidevtasks generate-tasks @prd-file.md         # Generate tasks from PRD
/aidevtasks process-tasks @task-list.md         # Execute task list
```

### Shorthand
```bash
/aidevtasks "build user notification system"     # Auto-starts PRD creation
```

### Through Master Router
```bash
/systemcc "build a new feature for user management"  # Auto-routes to aidevtasks
```

## Workflow Phases

### Phase 1: PRD Creation
Uses `workflows/ai-dev-tasks/create-prd.md`:
1. Receive feature request
2. Ask clarifying questions
3. Generate comprehensive PRD
4. Save to `ClaudeFiles/workflows/ai-dev-tasks/prds/`

### Phase 2: Task Generation
Uses `workflows/ai-dev-tasks/generate-tasks.md`:
1. Analyze PRD requirements
2. Assess current codebase
3. Generate parent tasks (high-level)
4. Wait for user approval
5. Generate detailed sub-tasks
6. Save task list

### Phase 3: Task Processing
Uses `workflows/ai-dev-tasks/process-task-list.md`:
1. Work on one sub-task at a time
2. Mark sub-tasks complete
3. Run tests when parent task done
4. Commit completed parent tasks
5. Continue with user approval

## PRD Structure

Generated PRDs include:
- **Introduction/Overview** - Problem and solution summary
- **Goals** - Measurable objectives
- **User Stories** - Feature usage scenarios
- **Functional Requirements** - Numbered specifications
- **Non-Goals** - Out of scope items
- **Design Considerations** - UI/UX requirements
- **Technical Considerations** - Implementation notes
- **Success Metrics** - Measurement criteria
- **Open Questions** - Items needing clarification

## Task List Structure

```markdown
## Relevant Files
- path/to/file.ts - Component to be modified
- path/to/file.test.ts - Test file

## Tasks
- [ ] 1.0 Parent Task Title
  - [ ] 1.1 Specific sub-task
  - [ ] 1.2 Another sub-task
- [ ] 2.0 Second Parent Task
  - [ ] 2.1 Sub-task detail
```

## Implementation Instructions

When invoked:

1. **Command Parsing**:
   ```python
   if command == "create-prd":
       start_prd_creation(optimized_prompt)
   elif command == "generate-tasks":
       generate_from_prd(prd_file)
   elif command == "process-tasks":
       process_task_list(task_file)
   else:
       # Default to PRD creation
       start_prd_creation(optimized_prompt)
   ```

2. **PRD Creation Flow**:
   ```
   - Apply Lyra optimization
   - Ask clarifying questions
   - Wait for user responses
   - Generate PRD document
   - Save to ClaudeFiles/workflows/ai-dev-tasks/prds/
   ```

3. **Task Generation Flow**:
   ```
   - Read specified PRD
   - Analyze current codebase
   - Generate parent tasks
   - Get user approval ("Go")
   - Generate detailed sub-tasks
   - Save task list
   ```

4. **Task Processing Flow**:
   ```
   - Read task list
   - Find next incomplete sub-task
   - Implement the sub-task
   - Mark as complete
   - If parent task done: test & commit
   - Ask user to continue
   ```

## Integration Points

### With Lyra Middleware
- All prompts optimized before PRD creation
- Feature requests enhanced with technical details
- Clarity improvements for better PRDs

### With Agent System
- Can hand off to Complete System for validation
- VERIFIER can check completed tasks
- DOCUMENTER can update based on PRD

### With Git Workflow
- Automatic commits after parent tasks
- Conventional commit messages
- Clean working directory maintained

## Output Structure

```
ClaudeFiles/
└── workflows/
    └── ai-dev-tasks/
        ├── prds/
        │   ├── prd-user-auth.md
        │   └── prd-dashboard.md
        └── tasks/
            ├── tasks-prd-user-auth.md
            └── tasks-prd-dashboard.md
```

## Examples

### Example 1: Complete Feature Flow
```
User: /aidevtasks "build user profile editing"

Step 1 - Lyra optimizes request
Step 2 - PRD Creation:
  AI: "I'll help create a PRD. Let me ask some questions:
       1. What fields should be editable?
       2. Should changes require email verification?
       3. What validation is needed?"
  User: [provides answers]
  AI: [generates comprehensive PRD]

Step 3 - Task Generation:
  User: /aidevtasks generate-tasks @prd-user-profile-editing.md
  AI: [generates parent tasks, waits for "Go", then sub-tasks]

Step 4 - Implementation:
  User: /aidevtasks process-tasks @tasks-prd-user-profile-editing.md
  AI: [implements one sub-task at a time with approvals]
```

### Example 2: Quick Feature Start
```
User: /aidevtasks "notification system with email and in-app"

Lyra Enhancement: Adds technical requirements for scalability,
delivery guarantees, and user preferences.

AI: Starts PRD creation with relevant questions about:
- Notification types and priorities
- Delivery preferences and scheduling  
- Template management
- Analytics requirements
```

## Benefits

1. **Comprehensive Requirements** - Nothing missed through clarifying questions
2. **Systematic Approach** - Step-by-step implementation
3. **Quality Control** - Tests before commits
4. **User Control** - Approval at each step
5. **Progress Tracking** - Visual task completion
6. **Knowledge Capture** - PRDs document decisions

## Best Practices

1. **Answer clarifying questions thoroughly** - Better PRDs lead to better code
2. **Review parent tasks before approving** - Ensure logical breakdown
3. **Test manually after commits** - Automated tests may miss UX issues
4. **Keep PRDs updated** - Modify if requirements change
5. **Use for complex features** - Simple fixes may not need full PRD

## When to Use

Ideal for:
- New feature development
- Complex user-facing functionality
- Features needing detailed specifications
- Multi-component implementations
- When requirements aren't fully clear

Not needed for:
- Simple bug fixes
- Style updates
- Configuration changes
- Minor text updates
- Emergency hotfixes

Remember: The goal is systematic, high-quality feature development with clear requirements and controlled implementation.
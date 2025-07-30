# /aidevtasks - PRD-Based Feature Development

## Purpose
Structured feature development using Product Requirement Documents (PRDs) and hierarchical task decomposition. This command integrates the AI Dev Tasks workflow for systematic, high-quality feature implementation.

## How It Works

When you use `/aidevtasks`, the system will **automatically execute all phases**:

1. **Apply Lyra Universal Optimization** to enhance your request
2. **Automatically run the PRD workflow**:
   - ✅ CREATE PRD with clarifying questions
   - 🔄 GENERATE hierarchical tasks from approved PRD
   - 🔄 PROCESS tasks systematically with checkpoints
   - 🔄 COMMIT completed features with git management
3. **Deliver complete feature** with minimal manual intervention

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

## Automated Workflow Execution

The system uses the **Automated Workflow Executor** to seamlessly progress through all phases:

### Automatic Phase Progression
```
🚀 Starting AI Dev Tasks Workflow...

✅ PRD CREATION: Gathering requirements
   ❓ What user roles will access this feature?
   ❓ Should there be audit logging?
   [User provides answers]
✅ PRD CREATION: Comprehensive PRD generated

🔄 TASK GENERATION: Analyzing PRD...
✅ TASK GENERATION: Parent tasks created
   - 5 parent tasks identified
   - Awaiting approval to generate sub-tasks
   
   Ready to proceed? (Type 'Go' to continue)
   
🔄 TASK GENERATION: Creating detailed sub-tasks...
✅ TASK GENERATION: Complete task hierarchy ready

🔄 TASK PROCESSING: Starting implementation...
   Working on: 1.1 Create user model schema
✅ Sub-task 1.1 complete

🔄 Continue with next sub-task? (yes/no)

[Process continues automatically with checkpoints]

✨ Feature Complete! All tasks implemented and tested.
```

## Workflow Phases (Automated)

### Phase 1: PRD Creation (Interactive)
Uses `workflows/ai-dev-tasks/create-prd.md`:
1. Receive feature request
2. Ask clarifying questions **[User Input Required]**
3. Generate comprehensive PRD automatically
4. Save to `ClaudeFiles/workflows/ai-dev-tasks/prds/`

### Phase 2: Task Generation (Semi-Automatic)
Uses `workflows/ai-dev-tasks/generate-tasks.md`:
1. Analyze PRD requirements automatically
2. Assess current codebase
3. Generate parent tasks (high-level)
4. **[User Approval: "Go" to continue]**
5. Generate detailed sub-tasks automatically
6. Save task list

### Phase 3: Task Processing (Checkpoint-Based)
Uses `workflows/ai-dev-tasks/process-task-list.md`:
1. Work on one sub-task at a time
2. Mark sub-tasks complete automatically
3. Run tests when parent task done
4. Commit completed parent tasks
5. **[User Checkpoint: Continue yes/no]**

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

## User Interaction Points

The automated workflow pauses only for:

1. **PRD Clarifying Questions**: Feature requirements and specifications
2. **Task Generation Approval**: "Go" to proceed with sub-task generation
3. **Processing Checkpoints**: Continue after each parent task completion
4. **Critical Decisions**: Architecture choices or breaking changes

Example interactions:
```
❓ PRD Creation: What authentication methods should be supported?
   1. Email/password only
   2. Email/password + OAuth
   3. Full SSO integration
   
Your choice (1-3): _

✅ Parent tasks generated. Type 'Go' to generate detailed sub-tasks.

🔄 Parent task 1.0 complete. Continue with task 2.0? (yes/no): _
```

## Implementation Instructions

When invoked, the automated executor will:

1. **Command Routing**:
   ```python
   # All commands now trigger full automated workflow
   if command == "create-prd" or no_command:
       auto_execute_full_workflow(optimized_prompt)
   elif command == "generate-tasks":
       auto_continue_from_prd(prd_file)
   elif command == "process-tasks":
       auto_continue_from_tasks(task_file)
   ```

2. **Automated Flow**:
   ```
   Phase 1: PRD Creation
   - Apply Lyra optimization
   - Ask clarifying questions [PAUSE FOR USER]
   - Generate PRD document
   - Auto-proceed to Phase 2
   
   Phase 2: Task Generation  
   - Analyze PRD automatically
   - Generate parent tasks
   - Get approval [PAUSE FOR USER: "Go"]
   - Generate sub-tasks
   - Auto-proceed to Phase 3
   
   Phase 3: Task Processing
   - Implement sub-tasks sequentially
   - Test and commit parent tasks
   - Checkpoint after parents [PAUSE FOR USER]
   - Continue until complete
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
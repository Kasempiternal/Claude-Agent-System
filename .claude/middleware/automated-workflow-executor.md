# Automated Workflow Executor

## Purpose
This middleware powers the fully automated agent system where users ONLY use `/analyze` and `/systemcc`. All agent workflows execute internally without any manual commands.

## Core Principle
**Users NEVER run**: `/planner`, `/executer`, `/verifier`, `/tester`, `/documenter`, `/updater`, `/orchestrated`, `/agetos`, `/aidevtasks`, etc.

**Users ONLY run**:
1. `/analyze` - First time in a project
2. `/systemcc "task"` - For EVERYTHING else

## How It Works

When `/systemcc` is invoked:
1. Lyra optimizes the request
2. System detects appropriate workflow
3. ALL agents execute automatically in sequence
4. User only provides input for decisions/specifications
5. Complete end-to-end execution

## Internal Workflow Patterns (Hidden from Users)

### When systemcc detects "Complex Task":
```
Internal Process:
1. Strategic analysis (like old PLANNER)
2. Implementation (like old EXECUTER)
3. Quality validation (like old VERIFIER)
4. Functional testing (like old TESTER)
5. Documentation updates (like old DOCUMENTER)
6. Version control (like old UPDATER)

User sees: Progress updates, not commands!
```

### When systemcc detects "Simple Task":
```
Internal Process:
1. Quick analysis
2. Implementation
3. Review and validation

User sees: Fast completion, no manual steps!
```

### When systemcc detects "Feature Development":
```
Internal Process:
1. PRD creation with user Q&A
2. Task hierarchy generation
3. Systematic implementation

User sees: Feature built end-to-end!
```

### When systemcc detects "Project Setup":
```
Internal Process:
1. Analyze current state
2. Design standards
3. Generate configurations
4. Create documentation

User sees: Project configured automatically!
```

## User Interaction Points

The system ONLY pauses for:
1. **Specifications**: "What features should this include?"
2. **Technical Decisions**: "Which database should I use?"
3. **Clarifications**: "Should this support mobile?"
4. **Project Context**: "What's your current API structure?"

**NEVER for command instructions!**

Example - CORRECT interaction:
```
User: /systemcc "add user profiles"

Claude: I need some specifications for the user profiles:
1. What information should profiles contain?
2. Should profiles be public or private?
3. Do you need profile images?

User: Name, bio, avatar. Public profiles with optional privacy. Yes, with image uploads.

Claude: [Continues ALL phases automatically - no more commands needed]
```

Example - WRONG (never do this):
```
❌ Claude: "Now run /executer to continue"
❌ Claude: "Use /verifier to check the code"
❌ Claude: "Type /planner to start the workflow"
```

## Implementation Instructions

### For Command Handlers
When implementing this automated execution:

1. **Workflow Detection**:
   ```python
   def execute_workflow(command, args):
       workflow_type = detect_workflow_type(command)
       agent_sequence = get_agent_sequence(workflow_type)
       
       for agent in agent_sequence:
           result = execute_agent(agent, context)
           if result.needs_user_input:
               response = prompt_user(result.question)
               context.update(response)
           update_progress(agent, result)
   ```

2. **Rich Progress Reporting**:
   ```
   🚀 Starting Complete System Workflow
   
   🔄 Phase 1/6: Strategic Analysis (5-10 min)
      📍 Current: Analyzing root causes and dependencies
      🎯 Goal: Comprehensive solution architecture
   
   ✅ Phase 1/6: Strategic Analysis Complete (7 min)
      📦 Created: Detailed implementation plan
      📝 Identified: 5 components to modify
      ⏭️ Next: Implementation phase
   
   🔄 Phase 2/6: Implementation (15-20 min remaining)
      📍 Current: Building authentication service
      ✓ Completed: Database schema, API contracts
      🔨 Active: Implementing JWT integration...
      📊 Progress: ████████░░ 80%
   
   ✅ Phase 2/6: Implementation Complete (18 min)
      📦 Created:
         - AuthService with JWT support
         - Login/logout API endpoints
         - User session management
      📝 Modified: 8 files
      🧪 Ready for: Quality validation
   ```

3. **Context Preservation**:
   - Maintain context across all agents in session
   - Pass results between agents automatically
   - Accumulate learnings and patterns

## Workflow Sequences

### Complete System Sequence
```yaml
agents:
  - name: PLANNER
    output: session_context
    auto_continue: true
  - name: EXECUTER
    input: session_context
    auto_continue: true
  - name: VERIFIER
    input: Previous implementation
    auto_continue: true
  - name: TESTER
    input: Verified code
    auto_continue: true
  - name: DOCUMENTER
    input: Test results
    auto_continue: true
  - name: UPDATER
    input: All changes
    auto_continue: false  # Final step
```

### Orchestrated Sequence
```yaml
agents:
  - name: ORCHESTRATOR
    analyze: true
    auto_continue: true
  - name: DEVELOPER
    implement: true
    auto_continue: true
  - name: REVIEWER
    validate: true
    auto_continue: false  # Final step
```

## Benefits

1. **Efficiency**: No manual command entry between agents
2. **Consistency**: Agents always run in correct order
3. **Focus**: Users focus on requirements, not process
4. **Speed**: Reduced time from problem to solution
5. **Quality**: All validation steps always executed
6. **Transparency**: Rich progress updates with context
7. **Intelligence**: Smart workflow selection based on analysis

## Error Handling

If an agent fails:
1. Pause execution
2. Show error to user
3. Offer options:
   - Retry with modifications
   - Skip to next agent
   - Abort workflow
   - Manual intervention

## Example Execution

### The Old Way (NEVER DO THIS)
```
❌ User: /planner "add authentication"
❌ Claude: "Run /executer next"
❌ User: /executer
❌ Claude: "Now run /verifier"
❌ User: /verifier
[...and so on - TIME CONSUMING BULLSHIT]
```

### The NEW Way (ALWAYS DO THIS)
```
User: /systemcc "add user authentication"

Claude: 🚀 Analyzing your request...
✅ This requires a comprehensive security implementation.

🔄 Phase 1/6: Analyzing authentication requirements...

❓ I need some specifications:
1. Authentication methods to support?
   - Email/password
   - Social login (Google, GitHub, etc.)
   - Magic links
   - Multi-factor authentication

2. Session management approach?
   - JWT tokens
   - Server sessions
   - Hybrid approach

User: Email/password with optional Google login. Use JWT tokens.

Claude: 🔄 Phase 1/6: Designing authentication architecture...
✅ Phase 1/6: Architecture planned

🔄 Phase 2/6: Implementing authentication system...
[ALL PHASES CONTINUE AUTOMATICALLY]

✨ Complete! Full authentication system implemented:
- JWT-based auth with refresh tokens
- Email/password + Google OAuth
- Secure password hashing
- Login/logout/register endpoints
- Frontend auth components
- Tests and documentation
```

## Integration Points

1. **Command Handlers**: Update to use automated execution
2. **Progress Tracking**: Show real-time status
3. **Context Management**: Maintain state between agents
4. **Error Recovery**: Handle failures gracefully
5. **User Prompts**: Clear, contextual questions only

Remember: The goal is to make the agent system feel like a single, intelligent assistant rather than multiple separate commands.
# /planner - Strategic Analysis & Solution Architecture

## Purpose
Start the complete six-agent workflow system with the PLANNER agent. This command initiates comprehensive strategic analysis and solution design for complex development tasks. **The system will automatically execute all subsequent agents without requiring manual commands.**

## How It Works

When you use `/planner "problem or idea"`, the system will:

1. **Apply Lyra Universal Optimization** to enhance your request
2. **Perform root cause analysis** to understand the real problem
3. **Design a comprehensive solution** with clear phases
4. **Create detailed instructions** for subsequent agents
5. **Automatically execute the complete workflow**:
   - ✅ PLANNER creates strategic plan
   - 🔄 EXECUTER implements solution (automatic)
   - 🔄 VERIFIER validates quality (automatic)
   - 🔄 TESTER runs functional tests (automatic)
   - 🔄 DOCUMENTER updates docs (automatic)
   - 🔄 UPDATER commits changes (automatic)

## Usage

### Direct Access
```bash
/planner "users report slow dashboard loading"
/planner "need to add real-time notifications"
/planner "refactor authentication to use OAuth 2.0"
```

### Through Master Router
```bash
/systemcc "complex feature requiring validation"  # May route to planner
```

## Automated Execution

The system now uses the **Automated Workflow Executor** (middleware/automated-workflow-executor.md) to:

1. **Execute Agents Sequentially**: Each agent runs automatically after the previous one completes
2. **Provide Progress Updates**: Real-time status of each agent's execution
3. **Handle User Interactions**: Only pauses when clarification or choices are needed
4. **Maintain Context**: Preserves WORK.md and results across all agents
5. **Complete End-to-End**: From problem analysis to committed code

### Example Automated Flow
```
User: /planner "add user authentication"

Claude: 🚀 Starting Complete System Workflow...

✅ PLANNER: Root cause analysis complete
   - Created comprehensive plan in WORK.md
   - Identified 5 implementation phases

🔄 EXECUTER: Implementing authentication system...
✅ EXECUTER: Implementation complete
   - Created AuthController.js
   - Added JWT middleware
   - Set up user sessions

🔄 VERIFIER: Running quality checks...
✅ VERIFIER: All checks passed
   - TypeScript: No errors
   - ESLint: Clean
   - Tests: Ready

🔄 TESTER: Running functional tests...
✅ TESTER: All scenarios validated
   - Login/logout flows working
   - Token validation correct
   - Error handling robust

🔄 DOCUMENTER: Updating documentation...
✅ DOCUMENTER: Documentation complete
   - Updated LEARNINGS.md
   - Added API docs
   - Created user guide

🔄 UPDATER: Preparing commit...
✅ UPDATER: Changes committed
   - Branch: feature/auth-system
   - Commit: "feat: Add JWT-based authentication"

✨ Workflow Complete! Authentication system fully implemented.
```

## User Interaction Points

The automated workflow will only pause for user input when:

1. **Clarification Needed**: Ambiguous requirements need specification
2. **Choice Required**: Multiple valid implementation approaches
3. **Approval Needed**: High-risk or breaking changes
4. **Context Missing**: Additional project-specific information required

Example:
```
🔄 EXECUTER: I need clarification on the session storage approach:
   1. Redis (recommended for production)
   2. In-memory (simpler, for development)
   3. Database sessions
   
Please choose (1-3): _
```

## Integration with Complete System

The PLANNER creates a WORK.md file that includes:
- **Phase 1: Problem Analysis** - Deep understanding
- **Phase 2-5: Agent Instructions** - What each agent should do
- **Success Criteria** - How to measure completion
- **Parallel Execution Notes** - Which phases can run simultaneously

## Benefits of Automation

1. **No Manual Commands**: All agents execute automatically
2. **Faster Delivery**: Reduced time from problem to solution
3. **Consistent Quality**: All validation steps always run
4. **Better UX**: Focus on requirements, not process
5. **Complete Execution**: No forgotten steps

## Manual Override

If you need to run agents individually:
```bash
/planner "task" --manual
# Then manually run each agent:
/executer
/verifier
# etc.
```

## Example

```
User: /planner "payment processing fails intermittently"

Lyra Optimization: "Investigate intermittent payment processing failures. 
Analyze error patterns, identify root causes in payment gateway integration, 
network timeouts, and race conditions. Design robust solution with retry 
logic, circuit breakers, and comprehensive error handling."

PLANNER Output: Creates comprehensive plan addressing:
- Root cause analysis of payment failures
- Solution design with resilience patterns
- Implementation phases for each agent
- Testing strategies for reliability
```

Remember: PLANNER sets the foundation for the entire workflow. A good plan leads to successful implementation.
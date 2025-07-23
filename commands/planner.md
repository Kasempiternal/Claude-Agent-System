# /planner - Strategic Analysis & Solution Architecture

## Purpose
Start the complete six-agent workflow system with the PLANNER agent. This command initiates comprehensive strategic analysis and solution design for complex development tasks.

## How It Works

When you use `/planner "problem or idea"`, the system will:

1. **Apply Lyra Universal Optimization** to enhance your request
2. **Perform root cause analysis** to understand the real problem
3. **Design a comprehensive solution** with clear phases
4. **Create detailed instructions** for subsequent agents
5. **Save the plan** for the execution workflow

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

## Implementation

When invoked, follow these steps:

1. **Lyra Optimization**:
   ```
   Apply middleware/lyra-universal.md
   - Enhance problem description
   - Add technical context
   - Clarify success criteria
   ```

2. **Execute PLANNER Agent**:
   ```
   Use workflows/complete-system/planner-agent.md
   - Perform root cause analysis
   - Create phased solution
   - Generate WORK.md file
   ```

3. **Prepare for Next Phase**:
   ```
   Save to: ClaudeFiles/temp/WORK.md
   Ready for: /executer command
   ```

## Integration with Complete System

The PLANNER creates a WORK.md file that includes:
- **Phase 1: Problem Analysis** - Deep understanding
- **Phase 2-5: Agent Instructions** - What each agent should do
- **Success Criteria** - How to measure completion
- **Parallel Execution Notes** - Which phases can run simultaneously

## Next Steps

After running /planner:
1. Review the generated plan in WORK.md
2. Run `/executer` to implement Phase 2
3. Continue with `/verifier`, `/tester`, `/documenter`, `/updater`

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
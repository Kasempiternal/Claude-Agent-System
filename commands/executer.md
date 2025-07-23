# /executer - Implementation Specialist

## Purpose
Continue the complete system workflow by implementing the solution designed by PLANNER. This command activates the EXECUTER agent to build the actual code based on the strategic plan.

## Prerequisites
Must run `/planner` first to generate the WORK.md file with implementation instructions.

## How It Works

When you use `/executer`, the system will:

1. **Read the WORK.md** file created by PLANNER
2. **Apply Lyra optimization** to any additional context
3. **Implement Phase 2** instructions precisely
4. **Follow established patterns** from the codebase
5. **Update WORK.md** with completion status

## Usage

### Standard Flow
```bash
/planner "design user authentication system"
# Review WORK.md
/executer  # Implements the solution
```

### With Additional Context
```bash
/executer "prioritize mobile responsiveness"
/executer "use existing auth middleware"
```

## Implementation

The EXECUTER agent:

1. **Reads Phase 2 Instructions** from ClaudeFiles/temp/WORK.md
2. **Analyzes Existing Code** to maintain patterns
3. **Implements Solution** following the plan
4. **Creates/Updates Files** as specified
5. **Documents Progress** in WORK.md

## Integration with Workflow

### Input Required
- WORK.md with Phase 2 instructions
- Clear implementation requirements
- Success criteria from PLANNER

### Output Produced
- Implemented code files
- Updated WORK.md with status
- Ready for VERIFIER phase

## Best Practices

1. **Follow the Plan** - Stick to PLANNER's design
2. **Maintain Patterns** - Use existing code style
3. **Complete Implementation** - No partial solutions
4. **Document Changes** - Update WORK.md
5. **Prepare for Verification** - Clean, testable code

## Example Execution

```
After PLANNER creates WORK.md:

Phase 2 Instructions:
- Create AuthController with login/logout
- Implement JWT token generation
- Add middleware for route protection
- Create user session management

EXECUTER:
1. Creates controllers/AuthController.js
2. Implements JWT with secure configuration
3. Adds middleware/authMiddleware.js
4. Sets up session store with Redis
5. Updates WORK.md with completion

Ready for: /verifier
```

## Next Steps

After successful execution:
1. Review implemented code
2. Run `/verifier` for quality checks
3. Continue workflow sequence

## Error Handling

If EXECUTER encounters issues:
- Documents blockers in WORK.md
- Suggests solutions
- May need PLANNER revision

Remember: EXECUTER brings the plan to life with production-ready code.
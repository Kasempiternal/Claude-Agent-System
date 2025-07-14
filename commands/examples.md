# Command Examples and Scenarios

## /systemcc Examples - Context-Aware Routing

### Example 1: Large Context Auto-Detection
```
User: /systemcc "add user profile editing across all pages"
[Context already has 35,000 tokens from previous work]

Context Analysis:
- Current context: 35,000 tokens ⚠️
- Task touches multiple pages: ✓
- Predicted growth: +20,000 tokens ⚠️

→ Automatically routing to Phase-Based Approach

Executing: /taskit "add user profile editing across all pages"
Reason: Large context requires phase decomposition to maintain quality
```

### Example 2: Simple Task (Auto-selects Orchestrated)
```
User: /systemcc "fix the typo in the login button text"

System Analysis:
- Single file change: ✓
- Low complexity: ✓  
- No architectural impact: ✓
- Minimal testing needed: ✓
Score: 2/10

→ Executing Orchestrated-Only Workflow

Agent O: Planning to fix login button typo...
Agent D: Locating and fixing the typo...
Agent R: Reviewing the change...
✓ Task completed successfully
```

### Example 2: Complex Task (Auto-selects Complete System)
```
User: /systemcc "implement role-based access control with permissions"

System Analysis:
- Multiple file changes: ✓
- Security critical: ✓
- Database changes: ✓
- API modifications: ✓
- Complex testing: ✓
Score: 12/10

→ Executing Complete System Workflow

PLANNER: Creating WORK.md with 5 phases...
Phase 1: Database schema for roles and permissions
Phase 2: Backend authorization middleware
Phase 3: API endpoint protection
Phase 4: Frontend permission checks
Phase 5: Testing and documentation

EXECUTER: Implementing Phase 1...
[continues through all agents]
```

### Example 3: Large Project Detection
```
User: /systemcc "update all API endpoints to use new error format"

Context Analysis:
- Project size: 180 files ⚠️
- API endpoints across 12 modules ⚠️
- Estimated time: 90+ minutes ⚠️

→ Using Phase-Based Approach for large project

Executing: /taskit "update all API endpoints to use new error format"
Reason: Large project with cross-cutting changes benefits from phases
```

### Example 4: Medium Complexity (Normal Context)
```
User: /systemcc "add pagination to the user list"

Context Analysis:
- Current context: 12,000 tokens ✓
- Limited scope: 2-3 files ✓

Task Analysis:
- Backend changes: ✓
- Frontend changes: ✓
- Database queries: ✓
- Moderate testing: ✓
Score: 6/10 (threshold is 5)

→ Executing Complete System Workflow
Note: Context is manageable, using Complete System for thoroughness.
```

## /taskit Examples

### Example 1: Full-Stack Feature
```
User: /taskit "build a real-time notification system with websockets"

Creating TASK-PLAN.md...

Task: Build a real-time notification system with websockets
Complexity: High
Total Phases: 6

Phase 1: Architecture & Database Schema
- Design notification data model
- Create database migrations
- Set up WebSocket server structure

Phase 2: Backend Notification Service  
- Implement notification creation logic
- Build notification queue system
- Create notification persistence layer

Phase 3: WebSocket Integration
- Set up Socket.io/WebSocket server
- Implement authentication for connections
- Create event handlers and rooms

Phase 4: Frontend Integration
- Create notification store/context
- Build WebSocket client connection
- Implement reconnection logic

Phase 5: UI Components
- Build notification bell component
- Create notification dropdown
- Add notification toasts

Phase 6: Validation & Optimization
- Manual validation for all components
- Integration validation for real-time flow
- Performance optimization

Executing Phase 1: Architecture & Database Schema...
[Each phase executes with focused context]
```

### Example 2: Complex Refactoring
```
User: /taskit "refactor the entire authentication system to use JWT instead of sessions"

Creating TASK-PLAN.md...

Task: Refactor authentication system from sessions to JWT
Complexity: Critical
Total Phases: 7

Phase 1: Analysis & Planning
- Document current session implementation
- Map all authentication touchpoints
- Design JWT token structure

Phase 2: JWT Infrastructure
- Implement token generation
- Create token validation middleware
- Set up refresh token logic

Phase 3: Backend Migration
- Update login endpoint
- Modify protected routes
- Implement logout/token invalidation

Phase 4: Frontend Token Management
- Create token storage service
- Update API client for token headers
- Implement token refresh interceptor

Phase 5: Migration Strategy
- Create session-to-JWT bridge
- Implement gradual rollout logic
- Build rollback procedures

Phase 6: Security Hardening
- Implement token rotation
- Add rate limiting
- Set up monitoring

Phase 7: Testing & Deployment
- Full regression testing
- Load testing token endpoints
- Documentation updates

[Phases execute sequentially with handoffs]
```

### Example 3: Database Migration
```
User: /taskit "migrate user data from MySQL to PostgreSQL with zero downtime"

Creating TASK-PLAN.md...

Task: Migrate user data from MySQL to PostgreSQL with zero downtime
Complexity: Critical
Total Phases: 8

Phase 1: Schema Analysis
- Analyze MySQL schema structure
- Map to PostgreSQL equivalents
- Identify incompatibilities

Phase 2: PostgreSQL Setup
- Create PostgreSQL schema
- Set up replication user
- Configure connections

Phase 3: Dual-Write Implementation
- Implement dual-write logic
- Create write queuing system
- Add failure handling

Phase 4: Historical Data Migration
- Build batch migration scripts
- Implement verification logic
- Create progress tracking

Phase 5: Read Migration
- Implement read routing logic
- Create fallback mechanisms
- Add performance monitoring

Phase 6: Cutover Preparation
- Final data sync verification
- Create rollback procedures
- Document cutover steps

Phase 7: Cutover Execution
- Execute primary database switch
- Monitor for issues
- Verify all systems operational

Phase 8: Cleanup & Optimization
- Remove MySQL dependencies
- Optimize PostgreSQL queries
- Update documentation

[Each phase builds on previous outcomes]
```

## Combining Commands

### Scenario: Using /taskit then /systemcc for phases
```
User: /taskit "build complete e-commerce checkout flow"

[Creates 5 phases]

Then for Phase 2:
User: /systemcc "implement payment processing integration"

System: Analyzing Phase 2 requirements...
- Payment security critical: ✓
- Third-party API integration: ✓
- Complex error handling: ✓
→ Using Complete System for this phase
```

### Scenario: Using /systemcc with phase-based thinking
```
User: /systemcc "quick fix for dashboard chart colors"

System: Simple task identified
→ Using Orchestrated-Only

However, if this were part of:
/taskit "redesign entire dashboard UI"
It would be Phase 3 of a larger plan
```

## Error Scenarios

### /systemcc Ambiguous Complexity
```
User: /systemcc "update the system"

System: Unable to determine complexity from description.
Please provide more specific details:
- What system component?
- What type of update?
- Expected scope of changes?

Or manually select:
- /orchestrated "update the system" (for simple updates)
- /planner "update the system" (for complex updates)
```

### /taskit Too Simple
```
User: /taskit "change button color"

System: This task appears too simple for phase-based execution.
Recommended approach:
/systemcc "change button color"
or
/orchestrated "change button color"

Phase-based workflow is optimal for tasks requiring 1+ hours.
```

## Integration Patterns

### Pattern 1: Discovery → Planning → Execution
```
1. /epct "explore authentication options"
2. /taskit "implement chosen auth system"  
3. /systemcc (auto-executes each phase)
```

### Pattern 2: Prototype → Production
```
1. /orchestrated "quick auth prototype"
2. /taskit "productionize authentication"
3. Each phase uses Complete System
```

### Pattern 3: Incremental Complexity
```
1. /systemcc "basic user list" → Orchestrated
2. /systemcc "add sorting" → Orchestrated
3. /taskit "add advanced filters, search, and export"
```

## Context Degradation Examples

### Without Phase-Based Approach
```
Task: "Implement complete e-commerce checkout"
Start: 10k tokens
After exploring code: 25k tokens
After implementing cart: 45k tokens
After payment integration: 65k tokens
After shipping logic: 85k tokens (context compressed)
Result: Rushed testing, missed edge cases, poor documentation
```

### With Phase-Based Approach (/taskit)
```
Same task via /systemcc → auto-routes to /taskit
Phase 1 (Cart): 15k tokens → High quality
Phase 2 (Payment): 12k tokens → High quality  
Phase 3 (Shipping): 14k tokens → High quality
Phase 4 (Integration): 16k tokens → High quality
Result: Thorough implementation, all edge cases handled
```

## Success Metrics

### /systemcc Performance
- Correct workflow selection: 95%+
- Auto-detects context issues: 100%
- Time saved on decision: 2-3 minutes per task
- Quality consistency: High across all workflows

### /taskit Performance  
- Context reduction: 60-80%
- Quality improvement: 2-3x
- Complex task success rate: 95%+
- Documentation completeness: 100%
- Prevents context compression: 100%
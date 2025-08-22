# CCPM Integration Workflow

## Overview

This workflow integrates Code Change Project Manager (CCPM) methodology with the `/systemcc` command, enabling parallel task execution and GitHub-native project management when available, with robust local fallbacks for non-GitHub environments.

## Core Philosophy

CCPM introduces "No Vibe Coding" - every line of code traces back to a specification, enabling:
- **Parallel Task Execution**: 5-8 concurrent tasks instead of sequential
- **Context Switching Reduction**: 89% improvement in focus
- **Spec-Driven Development**: Complete traceability from idea to implementation
- **GitHub-Native Workflow**: Uses Issues as single source of truth

## Activation Triggers

The CCPM workflow activates when `/systemcc` detects:

1. **Explicit PM Mode**: `--pm` flag used
2. **GitHub + Complexity**: GitHub repo detected AND complexity score >6
3. **Parallel Keywords**: "parallel", "concurrent", "multiple teams", "simultaneous"
4. **Complex Feature Development**: Multi-component features requiring coordination
5. **Team Collaboration Context**: Multiple developers mentioned or team-focused language

## Workflow Phases

### Phase 1: Environment Detection & Setup
```
🔍 Detecting project management environment...
├─ GitHub Repository: [✓/✗]
├─ GitHub CLI: [✓/✗] 
├─ gh-sub-issue extension: [✓/✗]
└─ Team collaboration indicators: [✓/✗]
```

**GitHub Available Path:**
- Install gh-sub-issue extension if missing
- Verify GitHub permissions
- Set up CCPM directory structure in `.claude/`
- Configure GitHub Issue templates

**Local-Only Path:**  
- Create `ClaudeFiles/pm/` directory structure
- Initialize JSON-based issue tracking system
- Set up local progress dashboard
- Configure parallel execution simulation

### Phase 2: Epic Creation & Decomposition

**Step 2.1: Epic Definition**
```
🎯 Epic Creation: [Task Description]
├─ Problem Statement: [Clear definition]
├─ Success Criteria: [Measurable outcomes] 
├─ Technical Scope: [Affected components]
└─ Complexity Assessment: [1-10 scale]
```

**Step 2.2: Task Decomposition** 
Using CCPM methodology to break epic into:
- **Granular Issues**: Each 15-45 minutes of work
- **Parallel-Safe Tasks**: Independent execution paths
- **Dependency Mapping**: Clear prerequisite relationships
- **Acceptance Criteria**: Specific, testable outcomes

### Phase 3: Issue Management

**GitHub Path:**
```bash
# Create parent epic issue
gh issue create --title "Epic: [Description]" --body "[Epic PRD]" --label "epic:feature"

# Create child issues with relationships  
gh issue create --title "[Task 1]" --body "[Detailed spec]" --label "task:feature"
gh-sub-issue --parent [epic-number] --child [task-number]
```

**Local Path:**
```json
// ClaudeFiles/pm/issues/epic-[timestamp].json
{
  "id": "epic-001",
  "title": "[Epic Title]",
  "type": "epic", 
  "status": "in_progress",
  "tasks": [
    {
      "id": "task-001",
      "title": "[Task 1]",
      "status": "pending",
      "parallel_safe": true,
      "estimated_minutes": 30,
      "dependencies": []
    }
  ]
}
```

### Phase 4: Parallel Execution Strategy

**GitHub Multi-Agent Mode:**
```
🚀 Deploying Specialized Agents:
├─ Agent 1: Frontend Components (Issue #123)
├─ Agent 2: Backend APIs (Issue #124) 
├─ Agent 3: Database Schema (Issue #125)
└─ Agent 4: Tests & Documentation (Issue #126)

Each agent maintains isolated context and reports back to GitHub Issues.
```

**Local Simulation Mode:**
```
🔄 Phase-Based Parallel Simulation:
├─ Phase 1: Independent Component A
├─ Phase 2: Independent Component B  
├─ Phase 3: Independent Component C
└─ Phase 4: Integration & Testing

Each phase simulates parallel work with focused context.
```

### Phase 5: Progress Tracking & Synchronization

**Real-time Progress Updates:**
- GitHub Issues auto-update with completion status
- Local dashboard shows current progress across all tasks
- Context switching alerts when dependencies are ready
- Automatic handoff preparation between related tasks

### Phase 6: Integration & Validation

**Final Integration Phase:**
- Merge all parallel work streams
- Run comprehensive validation
- Update all documentation
- Close GitHub Issues or mark local tasks complete

## Implementation Details

### GitHub Detection Logic
```python
def detect_github_environment():
    github_available = {
        'repo': check_git_remote_github(),
        'gh_cli': check_command('gh'),
        'gh_sub_issue': check_gh_extension('gh-sub-issue'),
        'permissions': check_github_permissions()
    }
    
    return {
        'mode': 'github' if all(github_available.values()) else 'local',
        'capabilities': github_available,
        'setup_needed': [k for k, v in github_available.items() if not v]
    }
```

### Local PM System Structure
```
ClaudeFiles/pm/
├─ config.json              # PM system configuration
├─ dashboard.md             # Current status overview
├─ epics/
│  ├─ epic-[id].json       # Epic definitions
│  └─ epic-[id]-prd.md     # Epic PRD documents
├─ issues/
│  ├─ task-[id].json       # Individual task specs
│  └─ task-[id]-notes.md   # Implementation notes
├─ progress/
│  ├─ daily-standup.md     # Progress summaries
│  └─ completion-log.json  # Task completion history
└─ templates/
   ├─ epic-template.json
   └─ task-template.json
```

### Parallel Execution Coordination
```python
def coordinate_parallel_execution(tasks):
    if github_mode:
        # True parallel with multiple Claude instances
        return deploy_github_agents(tasks)
    else:
        # Simulated parallel with optimized phase sequencing
        return execute_parallel_phases(tasks)
```

## Integration with Existing Workflows

### Enhanced Decision Matrix
CCPM mode takes priority when:
1. **Explicit Request**: `--pm` flag overrides other detection
2. **Complex + GitHub**: complexity >6 AND GitHub available
3. **Team Context**: Multi-developer or team-focused requirements
4. **Large Scope**: >5 components affected with parallelizable work

### Fallback Integration
- **Simple Tasks**: Still route to orchestrated workflow
- **Non-Parallel Complex**: Route to complete-system workflow  
- **Large Context**: Can combine with /taskit for optimal execution
- **Standards Focus**: Can enhance Agent OS workflows with CCPM tracking

## Success Metrics

**Expected Improvements:**
- **Development Speed**: 2-3x faster for complex features
- **Context Efficiency**: 60-89% reduction in context switching  
- **Code Quality**: Improved through spec-driven development
- **Project Visibility**: Complete traceability and progress tracking
- **Team Coordination**: Better collaboration through structured approach

## Usage Examples

### Example 1: GitHub-Enhanced Complex Feature
```bash
User: /systemcc --pm "build complete e-commerce checkout system"

Claude: 🔍 GitHub repository detected!
        ✅ Installing gh-sub-issue extension...
        ✅ CCPM mode activated
        
        🎯 Creating Epic: E-commerce Checkout System
        ├─ Epic Issue #156 created
        ├─ 6 parallel tasks identified
        └─ 4 agents deployed simultaneously
        
        🚀 Parallel Execution Started:
        Agent 1: Payment Processing (Issue #157) ✓ Complete
        Agent 2: Cart Management (Issue #158) 🔄 In Progress  
        Agent 3: Order Validation (Issue #159) 🔄 In Progress
        Agent 4: Email Notifications (Issue #160) ⏳ Waiting
```

### Example 2: Local PM System
```bash  
User: /systemcc --pm "refactor authentication across all services"

Claude: 🔍 No GitHub detected - activating Local PM mode
        ✅ Created ClaudeFiles/pm/ structure
        ✅ CCPM-inspired workflow ready
        
        📋 Epic: Authentication Refactor
        ├─ Epic epic-001 created locally
        ├─ 5 parallel-safe tasks identified  
        └─ Phase-based parallel simulation ready
        
        🔄 Simulated Parallel Execution:
        Phase 1: Database Schema Updates ✅ Complete
        Phase 2: Service A + B (parallel) 🔄 In Progress
        Phase 3: Service C + Testing 🔄 In Progress  
        
        📊 Progress Dashboard: ClaudeFiles/pm/dashboard.md
```

This integration transforms `/systemcc` into a professional project management system while maintaining backward compatibility and providing value regardless of the user's GitHub situation.
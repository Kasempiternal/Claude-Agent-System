# Session State Tracker

## Purpose
Tracks file modifications, workflow usage, and context across multiple `/systemcc` command invocations, enabling context-aware operations and better resumability.

## Integration Point
This middleware is called during Phase 11 (Memory Update) of the systemcc workflow.

## Overview

The session state tracker maintains a persistent record of:
- Commands executed in the current session
- Files modified and their change history
- Patterns detected across commands
- Workflows used
- Active tasks and next steps
- Context snapshots for resumability

## Session Lifecycle

### Session Creation
A new session starts when:
1. First `/systemcc` command after Claude Code restart
2. No existing session file found
3. Session older than 24 hours (auto-expires)

### Session Updates
Session is updated after each `/systemcc` command execution:
1. Append command to history
2. Record file modifications
3. Update pattern detections
4. Capture context snapshot

### Session Termination
Session ends when:
- Claude Code is closed
- 24 hours of inactivity
- User explicitly runs `/systemcc-reset-session`

## Session State Schema

```json
{
  "session_id": "uuid-v4-string",
  "created_at": "2025-01-26T10:30:00Z",
  "last_updated": "2025-01-26T14:45:00Z",
  "commands_executed": [
    {
      "timestamp": "2025-01-26T10:30:00Z",
      "command": "add authentication to API",
      "workflow": "complete_system",
      "duration_seconds": 420,
      "status": "completed"
    },
    {
      "timestamp": "2025-01-26T11:15:00Z",
      "command": "fix login endpoint bug",
      "workflow": "orchestrated",
      "duration_seconds": 180,
      "status": "completed"
    }
  ],
  "files_modified": {
    "src/auth/middleware.ts": {
      "first_modified": "2025-01-26T10:35:00Z",
      "last_modified": "2025-01-26T11:18:00Z",
      "modification_count": 2,
      "changes_summary": "Added JWT validation, fixed cookie parsing",
      "workflows": ["complete_system", "orchestrated"]
    },
    "src/routes/auth.ts": {
      "first_modified": "2025-01-26T10:40:00Z",
      "last_modified": "2025-01-26T10:40:00Z",
      "modification_count": 1,
      "changes_summary": "Created login/logout endpoints",
      "workflows": ["complete_system"]
    }
  },
  "patterns_detected": [
    "authentication",
    "jwt",
    "middleware",
    "api-endpoints"
  ],
  "workflows_used": {
    "complete_system": 1,
    "orchestrated": 1
  },
  "context_snapshot": {
    "active_task": "Building authentication system",
    "completed_steps": [
      "Created auth middleware",
      "Added JWT validation",
      "Fixed login endpoint"
    ],
    "next_steps": [
      "Add refresh token mechanism",
      "Implement rate limiting",
      "Add auth tests"
    ],
    "key_files": [
      "src/auth/middleware.ts",
      "src/routes/auth.ts",
      "src/utils/jwt.ts"
    ],
    "blocking_issues": []
  },
  "statistics": {
    "total_commands": 2,
    "total_files_modified": 2,
    "total_workflows": 2,
    "session_duration_minutes": 255
  }
}
```

## Implementation

### Loading Session State

```markdown
## Load Session State

Session state is tracked in conversation context:

1. Check if session exists in current conversation context

2. If session exists:
   - Use existing session data
   - Display session context to user:
     ```
     📋 SESSION CONTEXT (Started 2h ago)
     Last task: Building authentication system
     Files modified: 2 (src/auth/middleware.ts, src/routes/auth.ts)
     Next steps: Add refresh token, implement rate limiting
     ```

3. If new session:
   - Generate new session_id
   - Create session structure in context
   - Set created_at to current timestamp

4. Return session object for use in workflow
```

### Tracking File Modifications

```markdown
## Track File Modifications

During workflow execution, track all file changes:

1. **After each Edit/Write operation**:
   - Extract file path
   - Capture change description from workflow context
   - Update files_modified object:
     ```javascript
     if (file_path in session.files_modified) {
       // Existing file - increment count
       session.files_modified[file_path].modification_count++;
       session.files_modified[file_path].last_modified = now();
       session.files_modified[file_path].changes_summary += ", " + change_description;
     } else {
       // New file - create entry
       session.files_modified[file_path] = {
         first_modified: now(),
         last_modified: now(),
         modification_count: 1,
         changes_summary: change_description,
         workflows: [current_workflow]
       };
     }
     ```

2. **Track workflow association**:
   - Add current workflow to file's workflow list if not present
   - Helps identify which workflows touched which files

3. **Aggregate statistics**:
   - Increment total_files_modified
   - Update session duration
```

### Recording Commands

```markdown
## Record Command Execution

After each `/systemcc` command:

1. Capture command details:
   - User's original request
   - Selected workflow
   - Start and end timestamps
   - Final status (completed, partial, failed)

2. Append to commands_executed array:
   ```javascript
   session.commands_executed.push({
     timestamp: command_start_time,
     command: user_request,
     workflow: selected_workflow,
     duration_seconds: elapsed_time,
     status: final_status
   });
   ```

3. Update statistics:
   - Increment total_commands
   - Calculate session_duration_minutes
```

### Pattern Detection

```markdown
## Detect Patterns Across Commands

Analyze commands and files to detect recurring patterns:

1. **Keyword Extraction**:
   - Extract keywords from user commands
   - Common patterns: "auth", "database", "api", "component", "testing"
   - Add to patterns_detected array (deduplicated)

2. **File Path Patterns**:
   - Detect working areas: "src/auth/*", "src/components/*"
   - Identify focus areas: backend vs frontend

3. **Workflow Patterns**:
   - Track workflow usage frequency
   - Helps auto-suggest workflows in future commands

Pattern detection helps with:
- Auto-activation (Phase 1.3)
- Workflow suggestions
- Context-aware assistance
```

### Context Snapshot

```markdown
## Capture Context Snapshot

At end of each command, update context snapshot:

1. **Active Task**:
   - Infer from command history
   - Example: "Building authentication system" if multiple auth-related commands

2. **Completed Steps**:
   - List major accomplishments from current session
   - Extract from workflow summaries

3. **Next Steps**:
   - Capture TODOs or remaining tasks
   - Extract from workflow plans

4. **Key Files**:
   - List most frequently modified files
   - Files central to current task

5. **Blocking Issues**:
   - Capture any errors or blockers encountered
   - Helps resume after interruption

This snapshot enables:
- Context restoration after Claude Code restart
- Quick resumption of work
- Handoff to other developers
```

### Saving Session State

```markdown
## Save Session State

Session state is maintained in conversation context:

1. Update last_updated timestamp

2. Recalculate statistics:
   - total_commands: count of commands_executed
   - total_files_modified: count of files_modified keys
   - total_workflows: count of workflows_used keys
   - session_duration_minutes: time since created_at

3. Keep in memory:
   - State tracked in conversation context
   - No persistent files created
   - Fresh session on new conversation

4. Graceful handling:
   - Session tracking is enhancement, not critical path
```

## Usage Examples

### Example 1: Multi-Command Session

```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2025-01-26T09:00:00Z",
  "last_updated": "2025-01-26T12:30:00Z",
  "commands_executed": [
    {
      "timestamp": "2025-01-26T09:00:00Z",
      "command": "create user registration API",
      "workflow": "complete_system",
      "duration_seconds": 600,
      "status": "completed"
    },
    {
      "timestamp": "2025-01-26T10:15:00Z",
      "command": "add email validation",
      "workflow": "orchestrated",
      "duration_seconds": 180,
      "status": "completed"
    },
    {
      "timestamp": "2025-01-26T11:00:00Z",
      "command": "fix registration endpoint error",
      "workflow": "orchestrated",
      "duration_seconds": 240,
      "status": "completed"
    }
  ],
  "files_modified": {
    "src/routes/users.ts": {
      "first_modified": "2025-01-26T09:10:00Z",
      "last_modified": "2025-01-26T11:04:00Z",
      "modification_count": 2,
      "changes_summary": "Created registration endpoint, Fixed validation error",
      "workflows": ["complete_system", "orchestrated"]
    },
    "src/validators/email.ts": {
      "first_modified": "2025-01-26T10:17:00Z",
      "last_modified": "2025-01-26T10:17:00Z",
      "modification_count": 1,
      "changes_summary": "Added email validation utility",
      "workflows": ["orchestrated"]
    }
  },
  "patterns_detected": [
    "registration",
    "validation",
    "api-endpoints",
    "user-management"
  ],
  "workflows_used": {
    "complete_system": 1,
    "orchestrated": 2
  },
  "context_snapshot": {
    "active_task": "User registration system",
    "completed_steps": [
      "Created registration API endpoint",
      "Added email validation",
      "Fixed validation errors"
    ],
    "next_steps": [
      "Add password strength validation",
      "Implement email verification",
      "Add rate limiting to registration"
    ],
    "key_files": [
      "src/routes/users.ts",
      "src/validators/email.ts"
    ],
    "blocking_issues": []
  },
  "statistics": {
    "total_commands": 3,
    "total_files_modified": 2,
    "total_workflows": 2,
    "session_duration_minutes": 210
  }
}
```

### Example 2: Context-Aware Resumption

When starting a new command, display session context:

```
📋 SESSION CONTEXT (Active for 3h 30m)

🎯 Current Focus: User registration system

✅ Completed (3 tasks):
   • Created registration API endpoint
   • Added email validation
   • Fixed validation errors

📝 Modified Files (2):
   • src/routes/users.ts (2 changes)
   • src/validators/email.ts (1 change)

🔜 Next Steps:
   • Add password strength validation
   • Implement email verification
   • Add rate limiting to registration

💡 Patterns Detected: registration, validation, api-endpoints, user-management
```

## Session-Based Design

All session state is tracked in conversation context:

### Session Context (In-Memory)
- Active task and next steps
- File modification history
- Command history
- Patterns detected
- User preferences

**Relationship**: Session state is ephemeral and resets with each new conversation.

## Benefits

1. **Context Preservation**: Resume work after interruptions
2. **Pattern Recognition**: Detect recurring themes across commands
3. **Workflow Optimization**: Suggest workflows based on patterns
4. **Progress Tracking**: See what's been accomplished in session
5. **Better Assistance**: Context-aware responses based on recent work

## Privacy & Security

- Session state stored locally only
- No sensitive data captured (passwords, tokens, secrets)
- Automatic expiration after 24h
- Can be manually cleared with `/systemcc-reset-session`

## Performance Considerations

- Lightweight JSON structure (typically < 50KB)
- Async file writes (non-blocking)
- Graceful degradation if write fails
- No impact on workflow execution speed

## Future Enhancements (Phase 2)

When hook infrastructure is implemented:
- Real-time tracking via PostToolUse hooks
- More granular file change tracking
- Automatic pattern detection via UserPromptSubmit hooks
- Enhanced context analysis

## Error Handling

```markdown
## Error Handling Strategy

1. **File Read Errors**:
   - If session file corrupted: Create new session
   - If file permissions issue: Log warning, continue without session

2. **File Write Errors**:
   - If write fails: Log error but continue workflow
   - Session tracking is enhancement, not critical

3. **Invalid Session Data**:
   - If JSON parse fails: Treat as new session
   - If schema mismatch: Migrate or create new

4. **Graceful Degradation**:
   - Systemcc works perfectly without session tracking
   - Session is additive enhancement only
```

## Testing Session Tracking

To test session state tracking:

```bash
# Command 1: Start new session
/systemcc "create hello world function"

# Command 2: Modify same area
/systemcc "add error handling to hello world"

# Verify session context updated:
# - 2 commands in history
# - Files modified tracked
# - Context snapshot updated

# Command 3: Different area
/systemcc "create user model"

# Verify patterns detected:
# - Mixed patterns tracked
# - File groups identified
```

---

**Version**: 1.0.0
**Last Updated**: 2025-01-26
**Integration Phase**: Phase 1.2 (Week 2)
**Dependencies**: None (standalone middleware)
**Breaking Changes**: None (additive only)

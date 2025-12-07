# PARALLEL OPERATIONS MODULE

Optimize execution through intelligent batching and parallel operations.

## When to Use Parallel Operations

| Scenario | Batch? | Reason |
|----------|--------|--------|
| Multiple similar files (3+) | Yes | Reduces tool overhead |
| Independent shell commands | Yes | Non-blocking execution |
| Multiple read/search operations | Yes | Single round-trip |
| Operations with dependencies | No | Must be sequential |
| Single file debugging | No | Needs validation |

## Detection Rules

```
CAN_BATCH when:
- files_affected > 3
- operations are similar (create, edit, read)
- no interdependencies between files
- same directory or file type
```

## Execution Strategies

### 1. Multi-File Operations
Use multiple tool calls in single message for file creation/editing:
- Single round-trip for multiple files
- Maintains context across operations

### 2. Background Commands
Use `run_in_background` for:
- `npm install`, `pip install`
- Build commands
- Test runners
- Monitor with BashOutput tool

### 3. Batched Analysis
Group similar operations:
- Multiple Read calls in one message
- Multiple Grep calls in one message
- Glob patterns for file discovery

## Progress Display

```
🔄 Batch Operation: Creating files
├─ models/user.js
├─ models/post.js
└─ models/comment.js
✅ 3 files created

🔄 Background: Running npm install
└─ Monitoring...
✅ Dependencies installed
```

## Error Recovery

If batch operation fails:
1. Identify successful parts
2. Retry failed portions individually
3. Report specific failures

## Integration

- Workflow selection enables batch mode automatically
- Implementation groups similar operations
- Progress tracking shows batch status

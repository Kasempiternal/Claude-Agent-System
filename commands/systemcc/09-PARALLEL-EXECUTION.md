# BATCH EXECUTION ENGINE

⚡ **Execute batched operations efficiently using available tools**

## Execution Framework

Claude can optimize execution through:
1. **Planning** - Identify all similar operations upfront
2. **Batching** - Group operations by type
3. **Execution** - Use appropriate batch tools
4. **Monitoring** - Track batch progress

## Batch Operation Types

### 1. Multi-File Operations with MultiEdit

```python
# Creating multiple files at once
edits = [
    {
        "file_path": "models/user.js",
        "old_string": "",  # Empty for new file
        "new_string": user_model_content
    },
    {
        "file_path": "models/post.js", 
        "old_string": "",
        "new_string": post_model_content
    },
    {
        "file_path": "models/comment.js",
        "old_string": "",
        "new_string": comment_model_content
    }
]
# Single MultiEdit call creates all files
```

### 2. Background Command Execution

```python
# Run commands in background
bash("npm install", run_in_background=True)
bash("npm run build", run_in_background=True)

# Continue other work while commands run
# Check output later with BashOutput tool
```

### 3. Batched Tool Calls

```python
# Multiple operations in single message
- Read file A
- Read file B  
- Grep pattern X
- Grep pattern Y
# All execute in one round trip
```

## Execution Phases

### Phase Organization
1. **Group by operation type** - Files, commands, analysis
2. **Order by dependencies** - Independent first, dependent last
3. **Execute in batches** - Same type operations together

### Batch Execution Flow
```
1. Identify all operations needed
2. Group similar operations
3. Check for dependencies
4. Execute independent batches first
5. Execute dependent operations after
```

## Progress Tracking

### Batch Operations Display
```
🔄 Batch Operation: Creating multiple files
├─ models/user.js
├─ models/post.js
├─ models/comment.js
└─ controllers/auth.js
✅ 4 files created in single operation

🔄 Background Tasks: Running installations
├─ npm install (background)
├─ database setup (background)
└─ Monitoring output...
✅ All tasks complete
```

## Optimization Strategies

### When to Batch
- Multiple similar files (models, controllers, tests)
- Independent shell commands (installs, builds)
- Multiple read/search operations
- Configuration updates across files

### When NOT to Batch
- Operations with dependencies
- Debugging single issues
- Complex refactoring requiring validation
- Operations needing intermediate checks

## Error Handling

### Batch Failure Recovery
If batch operation fails:
1. Identify which parts succeeded
2. Retry failed portions individually
3. Report specific failures clearly

### Partial Success Handling
- MultiEdit may partially succeed
- Background commands may fail independently
- Continue with successful operations
- Address failures separately

## Available Batch Tools

### MultiEdit
- Primary tool for batch file operations
- Handles both creation and modification
- Single tool call for multiple files

### Bash with run_in_background
- Non-blocking command execution
- Can run multiple commands simultaneously
- Monitor with BashOutput tool

### Multiple Tool Invocations
- Send multiple tool calls in one message
- Reduces round-trip overhead
- Useful for analysis operations

## Integration

- Optimizer module identifies batch opportunities
- Workflow selection enables batch mode when beneficial
- Implementation executes using appropriate batch tools
- Progress tracking shows batch operations clearly
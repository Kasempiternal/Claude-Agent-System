# PARALLEL EXECUTION ENGINE

⚡ **Execute multiple operations simultaneously for maximum efficiency**

## Execution Framework

### Core Principle
While Claude processes sequentially, we can:
1. **Plan** all parallel work upfront
2. **Batch** similar operations together
3. **Execute** multiple tools in single calls
4. **Track** parallel progress visually

## Parallel Execution Phases

### Phase 1: Analysis & Planning
```python
def plan_parallel_execution(task, files_affected):
    """
    Create optimal execution plan
    """
    
    # Identify independent components
    components = identify_components(files_affected)
    
    # Build dependency graph
    dependencies = analyze_dependencies(components)
    
    # Create parallel phases
    phases = []
    while components:
        # Find all components with no dependencies
        parallel_batch = [c for c in components 
                         if not has_dependencies(c, dependencies)]
        
        if parallel_batch:
            phases.append({
                'type': 'parallel',
                'operations': parallel_batch,
                'estimated_time': max_time(parallel_batch)
            })
            # Remove completed components
            components = remove_completed(components, parallel_batch)
            dependencies = update_dependencies(dependencies, parallel_batch)
        else:
            # Handle circular dependencies
            phases.append({
                'type': 'sequential',
                'operations': components[0],
                'reason': 'dependency_resolution'
            })
            components.pop(0)
    
    return phases
```

### Phase 2: Batch Execution
```python
def execute_parallel_phase(phase):
    """
    Execute all operations in phase simultaneously
    """
    
    if phase['type'] == 'parallel':
        # Prepare all operations
        operations = prepare_batch_operations(phase['operations'])
        
        # Execute based on operation type
        if all_are_file_operations(operations):
            execute_multi_edit(operations)
        elif all_are_shell_commands(operations):
            execute_parallel_bash(operations)
        else:
            execute_mixed_batch(operations)
    
    else:
        # Sequential fallback
        execute_sequential(phase['operations'])
```

## Parallel Operation Types

### 1. File Operations (Most Common)
```python
# PARALLEL FILE CREATION
def create_auth_system_parallel():
    """
    Create entire auth system in one operation
    """
    
    files_to_create = {
        'models/user.js': generate_user_model(),
        'controllers/auth.controller.js': generate_auth_controller(),
        'services/auth.service.js': generate_auth_service(),
        'middleware/auth.middleware.js': generate_auth_middleware(),
        'routes/auth.routes.js': generate_auth_routes(),
        'config/jwt.config.js': generate_jwt_config(),
        'validators/auth.validator.js': generate_validators(),
        'tests/auth.test.js': generate_tests()
    }
    
    # Single MultiEdit call creates all files
    multi_edit(files_to_create)
    
    print("✅ Created 8 auth files in single operation")
```

### 2. Shell Commands
```python
# PARALLEL COMMAND EXECUTION
def install_dependencies_parallel():
    """
    Install multiple packages simultaneously
    """
    
    commands = [
        "npm install express",
        "npm install jsonwebtoken", 
        "npm install bcrypt",
        "npm install express-validator",
        "npm install cors"
    ]
    
    # Run all in background
    processes = []
    for cmd in commands:
        proc_id = bash(cmd, run_in_background=True)
        processes.append((cmd, proc_id))
    
    # Monitor completion
    for cmd, proc_id in processes:
        wait_for_completion(proc_id)
        print(f"✅ {cmd} complete")
```

### 3. Mixed Operations
```python
# COMBINED PARALLEL OPERATIONS
def setup_feature_parallel():
    """
    Files + Commands + Configs in parallel phases
    """
    
    # Phase 1: Create all files
    create_files_batch([...])
    
    # Phase 2: Parallel setup
    parallel_tasks = [
        ('bash', 'npm install dependencies'),
        ('bash', 'createdb testdb'),
        ('edit', 'package.json', add_scripts)
    ]
    
    execute_parallel_tasks(parallel_tasks)
```

## Visual Progress Tracking

### Standard Progress Display
```
⚡ PARALLEL EXECUTION ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Execution Plan:
├─ Phase 1: Core Components (4 files)
├─ Phase 2: Configuration (3 files)
├─ Phase 3: Tests (5 files)
└─ Total Operations: 12 (3 parallel phases)

🔄 Phase 1/3: Core Components [PARALLEL]
┌────────────────────────────────────────┐
│ Creating 4 files simultaneously...     │
├────────────────────────────────────────┤
│ ▶ user.model.js         ████████ 100% │
│ ▶ auth.controller.js    ████████ 100% │
│ ▶ auth.service.js       ████████ 100% │
│ ▶ auth.middleware.js    ████████ 100% │
└────────────────────────────────────────┘
✅ Phase 1 complete: 4 files in 2.3s

🔄 Phase 2/3: Configuration [PARALLEL]
┌────────────────────────────────────────┐
│ Configuring 3 components...            │
├────────────────────────────────────────┤
│ ▶ jwt.config.js         ████████ 100% │
│ ▶ database.config.js    ████████ 100% │
│ ▶ cors.config.js        ████████ 100% │
└────────────────────────────────────────┘
✅ Phase 2 complete: 3 files in 1.8s

Performance: 40% faster than sequential
```

### Detailed Progress Mode
```
⚡ PARALLEL MODE: --verbose

Phase 1/3 Analysis:
├─ Independent Files: 4
├─ Shared Dependencies: None
├─ Batch Strategy: MultiEdit
└─ Expected Time: 2-3 seconds

Execution:
[00:00] Planning batch operations...
[00:01] Generating file contents...
[00:02] Executing MultiEdit (4 files)...
[00:03] ✓ All files created successfully

Metrics:
├─ Tool Calls: 1 (vs 4 sequential)
├─ Context Switches: 0 (vs 3 sequential)
├─ Time Saved: ~5 seconds
└─ Efficiency Gain: 40%
```

## Intelligent Batching Rules

### When to Batch
✅ **ALWAYS BATCH**:
- Multiple file creations
- Similar file modifications
- Independent test files
- Configuration updates
- Documentation changes

### When NOT to Batch
❌ **KEEP SEQUENTIAL**:
- Dependent operations (B needs A)
- Complex refactoring
- Debugging/fixing errors
- Operations needing validation between steps

### Smart Grouping
```python
def group_operations_intelligently(operations):
    """
    Group operations for maximum efficiency
    """
    
    groups = {
        'models': [],
        'controllers': [],
        'services': [],
        'tests': [],
        'configs': [],
        'other': []
    }
    
    # Group by type
    for op in operations:
        file_type = detect_file_type(op.path)
        groups[file_type].append(op)
    
    # Create optimal phases
    phases = []
    
    # Phase 1: All models (they're usually independent)
    if groups['models']:
        phases.append(('Models', groups['models']))
    
    # Phase 2: Services + Controllers (often independent)
    if groups['services'] or groups['controllers']:
        phases.append(('Logic', 
                      groups['services'] + groups['controllers']))
    
    # Phase 3: Configs (usually independent)
    if groups['configs']:
        phases.append(('Configuration', groups['configs']))
    
    # Phase 4: Tests (always last, can be parallel)
    if groups['tests']:
        phases.append(('Tests', groups['tests']))
    
    return phases
```

## Performance Monitoring

### Metrics Collection
```python
parallel_metrics = {
    'phases_executed': 0,
    'operations_batched': 0,
    'time_saved': 0,
    'tool_calls_saved': 0,
    'efficiency_percentage': 0
}

def track_performance(phase_result):
    """
    Track parallel execution performance
    """
    
    sequential_time = sum(op.estimated_time 
                         for op in phase_result.operations)
    actual_time = phase_result.elapsed_time
    
    time_saved = sequential_time - actual_time
    efficiency = (time_saved / sequential_time) * 100
    
    parallel_metrics['time_saved'] += time_saved
    parallel_metrics['efficiency_percentage'] = efficiency
    
    return {
        'time_saved': time_saved,
        'efficiency': f"{efficiency:.1f}%",
        'operations': len(phase_result.operations)
    }
```

### Performance Report
```
📊 PARALLEL EXECUTION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Execution Statistics:
├─ Total Phases: 4 (3 parallel, 1 sequential)
├─ Operations Batched: 12
├─ Tool Calls: 4 (vs 12 sequential)
└─ Context Switches: 3 (vs 11 sequential)

Time Analysis:
├─ Sequential Estimate: 25 minutes
├─ Parallel Actual: 15 minutes
├─ Time Saved: 10 minutes
└─ Efficiency Gain: 40%

Optimization Breakdown:
├─ File Operations: 45% faster
├─ Shell Commands: 60% faster
├─ Config Updates: 30% faster
└─ Overall: 40% improvement

Recommendations:
✓ Continue using parallel mode for similar tasks
✓ Consider batching test file generation
✓ Group related configuration changes
```

## Error Handling in Parallel Mode

### Batch Failure Recovery
```python
def handle_batch_failure(batch_operation, error):
    """
    Gracefully handle parallel operation failures
    """
    
    print(f"⚠️ Batch operation partially failed")
    print(f"Error: {error}")
    
    # Identify successful vs failed
    successful = identify_successful_operations(batch_operation)
    failed = identify_failed_operations(batch_operation)
    
    print(f"✅ Successful: {len(successful)} operations")
    print(f"❌ Failed: {len(failed)} operations")
    
    # Retry failed operations individually
    print("🔄 Retrying failed operations sequentially...")
    
    for op in failed:
        try:
            execute_single_operation(op)
            print(f"✅ Retry successful: {op.name}")
        except Exception as e:
            print(f"❌ Still failing: {op.name} - {e}")
            
    return {
        'successful': successful,
        'failed': failed,
        'recovery': 'partial'
    }
```

## Integration with Existing Workflows

### Automatic Parallel Detection
```python
# In workflow selection
if task_complexity > 5 and independent_components > 3:
    enable_parallel_mode()
```

### Manual Parallel Mode
```bash
/systemcc --parallel "create CRUD for users, posts, comments"
# Forces parallel optimization
```

### Hybrid Mode
```bash
/systemcc "complex refactoring"
# Auto-detects: Some parallel, some sequential
```

## Next Steps

After parallel execution:
- Continue to main workflow
- Show performance summary
- Update memory bank with patterns learned
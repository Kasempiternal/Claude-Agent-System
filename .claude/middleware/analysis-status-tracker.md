# Analysis Status Tracker

## Purpose
This middleware tracks whether a project has been analyzed, using persistent caching to avoid re-analyzing unchanged projects. The cache is stored in `~/.claude/cache/` - never in the target repository.

## How It Works

1. **Cache Check**: On `/systemcc` start, check for cached analysis
2. **Validation**: Verify cache is still valid (git HEAD, file count, age)
3. **Cache Hit**: Use cached analysis for instant startup
4. **Cache Miss**: Run analysis and cache results
5. **Smart Refresh**: Auto-refresh when project changes significantly

## Cache Location

```
~/.claude/cache/{repo-hash}/
├── analysis.json       # Project analysis results
├── patterns.json       # Extracted code patterns
└── conventions.json    # Detected conventions
```

See `persistent-cache.md` for full cache system documentation.

## Implementation Logic

```python
def check_analysis_status(repo_path):
    """Check if project analysis exists and is valid"""

    # Try to load cached analysis
    cached = read_cache(repo_path, 'analysis')

    if cached and is_cache_valid(repo_path, cached):
        # Cache hit - use cached analysis
        print("✅ Loaded cached analysis")
        print(f"   Project: {cached['framework']} + {cached['language']}")
        return cached

    # Cache miss or invalid - run fresh analysis
    print("🔍 Running project analysis...")
    analysis_results = run_project_analysis(repo_path)

    # Cache the results
    write_cache(repo_path, 'analysis', analysis_results)
    print("💾 Analysis cached for future sessions")

    return analysis_results


def is_cache_valid(repo_path, cached_data):
    """Check if cached analysis is still valid"""

    metadata = cached_data.get('_cache_metadata', {})

    # 1. Age check (max 7 days)
    cached_at = parse_datetime(metadata.get('cached_at'))
    if days_since(cached_at) > 7:
        print("⚠️ Cache expired (older than 7 days)")
        return False

    # 2. Git HEAD check (new commits invalidate)
    current_head = get_git_head(repo_path)
    cached_head = metadata.get('git_head')
    if current_head != cached_head:
        print("⚠️ Cache invalidated (new commits detected)")
        return False

    # 3. File count check (>20% change invalidates)
    current_count = count_source_files(repo_path)
    cached_count = metadata.get('file_count', 0)
    if cached_count > 0:
        change = abs(current_count - cached_count) / cached_count
        if change > 0.20:
            print(f"⚠️ Cache invalidated (file count changed by {change:.0%})")
            return False

    return True
```

## Analysis Data Format

```json
{
  "project_type": "web-application",
  "language": "TypeScript",
  "framework": "React",
  "build_tool": "Vite",
  "test_framework": "Jest",
  "package_manager": "npm",
  "metrics": {
    "total_files": 156,
    "source_files": 89,
    "test_files": 34,
    "config_files": 12
  },
  "tech_stack": {
    "frontend": ["React", "TypeScript", "Tailwind"],
    "backend": ["Node.js", "Express"],
    "database": ["PostgreSQL"]
  },
  "conventions": {
    "naming": "PascalCase components, camelCase functions",
    "structure": "feature-based organization",
    "testing": "test files alongside source"
  },
  "_cache_metadata": {
    "repo_path": "/home/user/my-project",
    "git_head": "abc123def456",
    "file_count": 156,
    "cached_at": "2024-01-30T10:00:00Z",
    "version": "1.0"
  }
}
```

## User Experience

### First Run (No Cache)

```
User: /systemcc "add user authentication"

Claude: 🔍 No cached analysis found
        📊 Running project analysis...

        📊 Analysis Results:
        - Language: TypeScript
        - Framework: React 18.2
        - Build Tool: Vite
        - Testing: Jest + React Testing Library

        💾 Cached to ~/.claude/cache/

        ✅ Analysis complete! Now working on authentication...
```

### Subsequent Runs (Cache Hit)

```
User: /systemcc "fix navigation menu"

Claude: ✅ Loaded cached analysis (2 days old)
           Project: React + TypeScript

        🚀 Proceeding with task...
```

### Cache Invalidation (New Commits)

```
User: /systemcc "add new feature"

Claude: ⚠️ Cache invalidated (new commits detected)
        🔄 Refreshing analysis...
           ✓ File count: 178 (+22 new)
           ✓ New dependencies detected

        💾 Cache updated

        ✅ Proceeding with task...
```

### Force Re-analysis

```
User: /systemcc --reanalyze "update to new standards"

Claude: 🔄 Force re-analyzing project...

        📊 Updated Analysis:
        - 15 new files detected
        - 3 new patterns found
        - Dependencies updated

        💾 Cache refreshed

        ✅ Applying new standards...
```

## Cache Bypass Options

```bash
# Force fresh analysis
/systemcc --reanalyze "your task"

# Clear cache for current repo
/systemcc --clear-cache

# Skip cache entirely (one-time)
/systemcc --no-cache "your task"
```

## Integration Points

- **persistent-cache.md**: Uses cache read/write operations
- **deep-project-analyzer.md**: Provides analysis results to cache
- **pattern-recognition-engine.md**: Caches extracted patterns separately
- **project-memory.md**: Caches learned conventions

## Benefits

1. **Instant Startup**: Cached analysis loads in milliseconds
2. **Cross-Session**: Analysis persists across Claude Code sessions
3. **Smart Refresh**: Automatically updates when project changes
4. **Zero Pollution**: No files created in target repository
5. **Transparent**: Users see cache status in output

## Error Handling

```python
def safe_cache_operation(operation, fallback):
    """Gracefully handle cache failures"""
    try:
        return operation()
    except (IOError, json.JSONDecodeError, KeyError) as e:
        print(f"⚠️ Cache operation failed: {e}")
        print("   Continuing with fresh analysis...")
        return fallback()
```

Cache operations are non-critical - if they fail, the system falls back to fresh analysis without interrupting the workflow.

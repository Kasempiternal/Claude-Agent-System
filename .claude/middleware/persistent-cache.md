# Persistent Cache System

## Purpose
Provides persistent per-repository caching without creating files in target repositories. All cache data is stored in the user's home directory at `~/.claude/cache/`.

## Directory Structure

```
~/.claude/
├── cache/                          # Persistent per-repo cache
│   ├── {repo-hash}/
│   │   ├── analysis.json           # Project analysis results
│   │   ├── patterns.json           # Extracted patterns
│   │   ├── conventions.json        # Detected conventions
│   │   └── metadata.json           # Cache metadata (git HEAD, timestamps)
│   └── ...
├── checkpoints/                    # Session resumption
│   ├── {repo-hash}/
│   │   └── {checkpoint-id}.json    # Checkpoint data
│   └── ...
└── temp/                           # Inter-agent communication (auto-deleted)
    └── WORK.md
```

## Cache Key Generation

The cache key is a hash of the repository's absolute path:

```python
import hashlib
import os

def get_cache_key(repo_path):
    """Generate unique cache key for a repository"""
    # Normalize path (resolve symlinks, remove trailing slashes)
    normalized_path = os.path.realpath(repo_path).rstrip(os.sep)

    # Create SHA256 hash (first 16 chars for readability)
    hash_object = hashlib.sha256(normalized_path.encode())
    return hash_object.hexdigest()[:16]

# Example:
# /home/user/my-project → "a1b2c3d4e5f6g7h8"
# C:\Users\user\my-project → "i9j0k1l2m3n4o5p6"
```

## Cache Operations

### Read Cache

```python
def read_cache(repo_path, cache_type):
    """
    Read cached data for a repository

    Args:
        repo_path: Absolute path to repository
        cache_type: 'analysis', 'patterns', 'conventions', or 'checkpoint'

    Returns:
        Cached data dict or None if not found/expired
    """
    cache_key = get_cache_key(repo_path)
    cache_dir = os.path.expanduser(f"~/.claude/cache/{cache_key}")
    cache_file = os.path.join(cache_dir, f"{cache_type}.json")

    if not os.path.exists(cache_file):
        return None

    with open(cache_file, 'r') as f:
        data = json.load(f)

    # Check if cache is valid
    if not is_cache_valid(repo_path, data):
        return None

    return data
```

### Write Cache

```python
def write_cache(repo_path, cache_type, data):
    """
    Write data to cache

    Args:
        repo_path: Absolute path to repository
        cache_type: 'analysis', 'patterns', 'conventions', or 'checkpoint'
        data: Data to cache (dict)
    """
    cache_key = get_cache_key(repo_path)
    cache_dir = os.path.expanduser(f"~/.claude/cache/{cache_key}")

    # Create directory if needed
    os.makedirs(cache_dir, exist_ok=True)

    # Add metadata
    data['_cache_metadata'] = {
        'repo_path': repo_path,
        'git_head': get_git_head(repo_path),
        'file_count': count_files(repo_path),
        'cached_at': datetime.now().isoformat(),
        'version': '1.0'
    }

    cache_file = os.path.join(cache_dir, f"{cache_type}.json")
    with open(cache_file, 'w') as f:
        json.dump(data, f, indent=2)
```

## Cache Invalidation

### Automatic Invalidation Triggers

```python
def is_cache_valid(repo_path, cached_data):
    """Check if cached data is still valid"""

    metadata = cached_data.get('_cache_metadata', {})

    # 1. Check age (max 7 days)
    cached_at = datetime.fromisoformat(metadata.get('cached_at', '2000-01-01'))
    if (datetime.now() - cached_at).days > 7:
        return False

    # 2. Check git HEAD (new commits invalidate cache)
    current_head = get_git_head(repo_path)
    cached_head = metadata.get('git_head')
    if current_head != cached_head:
        return False

    # 3. Check file count (>20% change invalidates)
    current_count = count_files(repo_path)
    cached_count = metadata.get('file_count', 0)
    if cached_count > 0:
        change_percent = abs(current_count - cached_count) / cached_count
        if change_percent > 0.20:
            return False

    return True
```

### Force Invalidation

```bash
# Via command flag
/systemcc --reanalyze "your task"

# Clear all cache for a repo
/systemcc --clear-cache
```

## Cache Types

### 1. Analysis Cache (`analysis.json`)

Stores project analysis results from deep-project-analyzer:

```json
{
  "project_type": "web-application",
  "language": "TypeScript",
  "framework": "React",
  "build_tool": "Vite",
  "test_framework": "Jest",
  "package_manager": "npm",
  "total_files": 156,
  "source_files": 89,
  "tech_stack": {
    "frontend": ["React", "TypeScript", "Tailwind"],
    "backend": ["Node.js", "Express"],
    "database": ["PostgreSQL"]
  },
  "_cache_metadata": { ... }
}
```

### 2. Patterns Cache (`patterns.json`)

Stores extracted code patterns:

```json
{
  "naming_conventions": {
    "components": "PascalCase",
    "hooks": "use* prefix",
    "services": "camelCase"
  },
  "structural_patterns": [
    {"type": "repository", "location": "src/repositories/"},
    {"type": "service", "location": "src/services/"}
  ],
  "code_patterns": [
    {"type": "error_handling", "approach": "try-catch with logger"},
    {"type": "async", "approach": "async/await"}
  ],
  "_cache_metadata": { ... }
}
```

### 3. Conventions Cache (`conventions.json`)

Stores detected project conventions:

```json
{
  "file_structure": {
    "components": "src/components/{Component}/{Component}.tsx",
    "tests": "__tests__/{component}.test.ts",
    "styles": "CSS Modules"
  },
  "coding_style": {
    "indentation": "2 spaces",
    "quotes": "single",
    "semicolons": true
  },
  "preferences": {
    "database": "PostgreSQL",
    "auth": "JWT",
    "state_management": "Redux Toolkit"
  },
  "_cache_metadata": { ... }
}
```

## Checkpoint System

### Save Checkpoint

```python
def save_checkpoint(repo_path, checkpoint_data):
    """Save workflow checkpoint for later resumption"""

    cache_key = get_cache_key(repo_path)
    checkpoint_dir = os.path.expanduser(f"~/.claude/checkpoints/{cache_key}")
    os.makedirs(checkpoint_dir, exist_ok=True)

    checkpoint_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    checkpoint_file = os.path.join(checkpoint_dir, f"{checkpoint_id}.json")

    checkpoint_data['_checkpoint_metadata'] = {
        'id': checkpoint_id,
        'repo_path': repo_path,
        'created_at': datetime.now().isoformat(),
        'git_head': get_git_head(repo_path)
    }

    with open(checkpoint_file, 'w') as f:
        json.dump(checkpoint_data, f, indent=2)

    # Keep only last 5 checkpoints
    cleanup_old_checkpoints(checkpoint_dir, keep=5)

    return checkpoint_id
```

### Load Checkpoint

```python
def load_latest_checkpoint(repo_path):
    """Load most recent checkpoint for repository"""

    cache_key = get_cache_key(repo_path)
    checkpoint_dir = os.path.expanduser(f"~/.claude/checkpoints/{cache_key}")

    if not os.path.exists(checkpoint_dir):
        return None

    # Get latest checkpoint file
    checkpoints = sorted(os.listdir(checkpoint_dir), reverse=True)
    if not checkpoints:
        return None

    checkpoint_file = os.path.join(checkpoint_dir, checkpoints[0])
    with open(checkpoint_file, 'r') as f:
        return json.load(f)
```

## Integration with systemcc

### On First Run (No Cache)

```
User: /systemcc "add authentication"

System:
🔍 No cached analysis found for this repository
📊 Running deep project analysis...
   ✓ File structure analyzed
   ✓ Tech stack detected
   ✓ Patterns extracted
   ✓ Conventions identified
💾 Analysis cached to ~/.claude/cache/

✅ Analysis complete! Proceeding with task...
```

### On Subsequent Runs (Cache Hit)

```
User: /systemcc "fix login bug"

System:
✅ Loaded cached analysis (from 2 days ago)
   Project: React + TypeScript + PostgreSQL
   Patterns: 15 cached, conventions: 23 cached

🚀 Proceeding with task...
```

### On Cache Invalidation

```
User: /systemcc "add new feature"

System:
⚠️ Cache invalidated (new commits detected)
🔄 Refreshing analysis...
   ✓ Updated file count: 178 (+22 files)
   ✓ New dependencies detected
   ✓ Patterns re-extracted
💾 Cache updated

✅ Analysis refreshed! Proceeding with task...
```

## Cache Cleanup

### Automatic Cleanup

```python
def cleanup_stale_caches():
    """Remove caches older than 30 days or for deleted repos"""

    cache_root = os.path.expanduser("~/.claude/cache")

    for cache_key in os.listdir(cache_root):
        cache_dir = os.path.join(cache_root, cache_key)
        metadata_file = os.path.join(cache_dir, "metadata.json")

        if os.path.exists(metadata_file):
            with open(metadata_file) as f:
                metadata = json.load(f)

            # Remove if older than 30 days
            cached_at = datetime.fromisoformat(metadata.get('cached_at', '2000-01-01'))
            if (datetime.now() - cached_at).days > 30:
                shutil.rmtree(cache_dir)
                continue

            # Remove if repo no longer exists
            repo_path = metadata.get('repo_path')
            if repo_path and not os.path.exists(repo_path):
                shutil.rmtree(cache_dir)
```

### Manual Cleanup

```bash
# Clear cache for current repo
/systemcc --clear-cache

# Clear all caches (via shell)
rm -rf ~/.claude/cache/*
rm -rf ~/.claude/checkpoints/*
```

## Benefits

1. **Fast Startup** - Instant project context on subsequent sessions
2. **No Pollution** - Target repos stay clean (no .claude/files/ clutter)
3. **Smart Invalidation** - Auto-refreshes when project changes
4. **Cross-Session** - Remember patterns and conventions across sessions
5. **Resumable** - Checkpoints enable work resumption after interruptions
6. **Privacy** - All data stays in user's home directory

## Implementation Notes

- Cache directory: `~/.claude/cache/`
- Checkpoint directory: `~/.claude/checkpoints/`
- Temp directory: `~/.claude/temp/` (for inter-agent communication)
- All paths use `os.path.expanduser()` for cross-platform compatibility
- JSON format for human-readable cache inspection
- Graceful degradation if cache operations fail

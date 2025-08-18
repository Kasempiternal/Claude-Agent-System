# /cleanup-context

## Purpose
Memory bank optimization specialist for reducing token usage in documentation and context files. Achieves 15-25% token reduction through systematic optimization.

## Usage
```bash
/cleanup-context
```

## Features
- Removes duplicate content across memory files
- Eliminates obsolete documentation
- Consolidates overlapping information
- Archives historical data
- Optimizes file structure for token efficiency
- Preserves essential information

## Implementation Instructions

When this command is invoked:

1. **Analyze Current Memory Bank**
   ```python
   memory_files = [
       "ClaudeFiles/memory/CLAUDE-activeContext.md",
       "ClaudeFiles/memory/CLAUDE-patterns.md",
       "ClaudeFiles/memory/CLAUDE-decisions.md",
       "ClaudeFiles/memory/CLAUDE-troubleshooting.md",
       "ClaudeFiles/memory/CLAUDE-config-variables.md",
       "ClaudeFiles/memory/CLAUDE-temp.md"
   ]
   
   total_tokens_before = calculate_token_count(memory_files)
   ```

2. **Identify Optimization Opportunities**
   ```python
   optimizations = {
       'duplicates': find_duplicate_content(memory_files),
       'obsolete': find_obsolete_entries(memory_files),
       'overlapping': find_overlapping_info(memory_files),
       'verbose': find_verbose_sections(memory_files),
       'outdated': find_outdated_references(memory_files)
   }
   ```

3. **Perform Cleanup Operations**

   ### Remove Duplicates
   ```python
   # Find identical or near-identical content
   for file in memory_files:
       content = read_file(file)
       unique_content = remove_duplicates(content)
       if len(unique_content) < len(content):
           write_file(file, unique_content)
   ```

   ### Archive Old Context
   ```python
   # Move completed/old entries to archive
   archive_dir = "ClaudeFiles/memory/archive/"
   
   # From activeContext.md
   completed_goals = extract_completed_goals()
   if completed_goals:
       archive_file = f"{archive_dir}context_{timestamp}.md"
       save_to_archive(completed_goals, archive_file)
       update_active_context(remove_completed=True)
   ```

   ### Consolidate Patterns
   ```python
   # Merge similar patterns
   patterns = read_patterns_file()
   consolidated = consolidate_similar_patterns(patterns)
   write_patterns_file(consolidated)
   ```

   ### Compress Troubleshooting
   ```python
   # Keep only most recent/relevant solutions
   issues = read_troubleshooting()
   relevant = filter_by_recency_and_usage(issues)
   write_troubleshooting(relevant)
   ```

4. **Optimization Techniques**

   ### Content Compression
   ```python
   def compress_content(text):
       # Remove excessive whitespace
       text = re.sub(r'\n{3,}', '\n\n', text)
       
       # Compress lists
       text = convert_verbose_lists_to_compact(text)
       
       # Remove redundant headers
       text = consolidate_headers(text)
       
       # Shorten verbose descriptions
       text = summarize_verbose_sections(text)
       
       return text
   ```

   ### Smart Archiving
   ```python
   def archive_strategy(content, age, usage_frequency):
       if age > 30 and usage_frequency < 2:
           return 'archive'
       elif age > 14 and usage_frequency < 5:
           return 'compress'
       else:
           return 'keep'
   ```

5. **Generate Cleanup Report**
   ```markdown
   ## Context Cleanup Report
   
   ### Token Reduction Summary
   - **Before**: [X] tokens
   - **After**: [Y] tokens  
   - **Saved**: [Z] tokens ([%] reduction)
   
   ### Actions Taken
   - ✅ Removed [N] duplicate entries
   - ✅ Archived [M] completed items
   - ✅ Consolidated [P] similar patterns
   - ✅ Compressed [Q] verbose sections
   - ✅ Eliminated [R] obsolete references
   
   ### Files Optimized
   - activeContext.md: [X]% reduction
   - patterns.md: [Y]% reduction
   - troubleshooting.md: [Z]% reduction
   
   ### Archived Items
   - Created archive file: archive/context_[timestamp].md
   - Moved [N] completed goals
   - Preserved [M] historical decisions
   
   ### Recommendations
   - [Next cleanup suggested in X days]
   - [Consider removing unused patterns]
   - [Update references in Y files]
   ```

## Cleanup Strategies

### 1. Duplicate Detection
- MD5 hash comparison for exact matches
- Fuzzy matching for near-duplicates (>85% similarity)
- Semantic similarity for conceptual duplicates

### 2. Obsolescence Rules
- Unused patterns (>30 days)
- Completed goals (>14 days)
- Resolved issues (>60 days)
- Deprecated decisions

### 3. Consolidation Patterns
- Merge similar troubleshooting entries
- Combine related patterns
- Unify overlapping decisions
- Group related context items

### 4. Compression Techniques
- Convert verbose bullets to compact lists
- Replace long descriptions with summaries
- Use abbreviations for common terms
- Remove redundant explanations

## Safe Cleanup Guarantees

### Always Preserve
- Active session context
- Recent decisions (<7 days)
- Frequently referenced patterns
- Critical troubleshooting solutions
- Security-related information

### Never Delete Without Archive
- Architecture decisions
- Historical context
- Resolved but important issues
- Deprecated but referenced patterns

## Integration with Memory Bank

### Pre-Cleanup Backup
```bash
cp -r ClaudeFiles/memory ClaudeFiles/memory.backup
```

### Post-Cleanup Validation
```python
# Ensure no critical data lost
validate_essential_content(memory_files)
verify_references_intact(memory_files)
check_file_integrity(memory_files)
```

## Examples

### Example 1: Routine Cleanup
```bash
/cleanup-context

Result:
✨ Context Cleanup Complete
- Reduced tokens by 18% (2,450 tokens saved)
- Archived 8 completed goals
- Consolidated 5 duplicate patterns
- Compressed 12 verbose sections
```

### Example 2: Heavy Cleanup
```bash
/cleanup-context

Result:
✨ Major Cleanup Performed
- Reduced tokens by 24% (5,200 tokens saved)
- Archived 3 old context files
- Removed 15 obsolete patterns
- Consolidated 20 troubleshooting entries
⚠️ Please review archive for any needed items
```

## Scheduling Recommendations

- **Daily**: Clean CLAUDE-temp.md
- **Weekly**: Clean activeContext.md
- **Bi-weekly**: Consolidate patterns.md
- **Monthly**: Full memory bank cleanup
- **Quarterly**: Archive old decisions

## Configuration Options

```json
{
  "auto_archive_days": 30,
  "duplicate_threshold": 0.85,
  "compression_level": "medium",
  "preserve_recent_days": 7,
  "backup_before_cleanup": true,
  "verbose_output": false
}
```

---
*Efficient context management for optimal token usage*
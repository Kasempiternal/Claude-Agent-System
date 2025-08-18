# CLAUDE-troubleshooting.md
*Common Issues and Proven Solutions*

## Common Issues & Solutions

### Issue: Context Overflow During Large Operations
**Symptoms**: Claude stops mid-task, context limit reached
**Root Cause**: Too many files loaded, excessive token usage
**Solution**:
1. Use phase-based workflow (/taskit) for large operations
2. Clean context with /cleanup-context command
3. Use Chain of Draft mode for searches
4. Leverage memory bank instead of re-reading files
**Prevention**: Monitor context size, use subagents for searches

### Issue: Memory Bank Files Not Persisting
**Symptoms**: Previous session context lost
**Root Cause**: Files not in correct directory
**Solution**:
1. Ensure files are in `/ClaudeFiles/memory/`
2. Check file permissions
3. Verify .gitignore includes ClaudeFiles
**Prevention**: Always use designated memory directory

### Issue: Workflow Selection Incorrect
**Symptoms**: Simple task uses complex workflow or vice versa
**Root Cause**: Complexity scoring inaccurate
**Solution**:
1. Use `--workflow=` flag to force specific workflow
2. Adjust complexity keywords in systemcc.md
3. Check context size influence
**Prevention**: Provide clear task descriptions

### Issue: Security Scanner False Positives
**Symptoms**: Legitimate input flagged as malicious
**Root Cause**: Overly aggressive patterns
**Solution**:
1. Review security report details
2. Adjust sensitivity thresholds
3. Whitelist known safe patterns
**Prevention**: Test with known safe inputs first

### Issue: Subagent Failures
**Symptoms**: Task tool returns errors
**Root Cause**: Subagent file missing or malformed
**Solution**:
1. Verify subagent file exists in `.claude/agents/`
2. Check subagent markdown formatting
3. Ensure subagent_type matches filename
**Prevention**: Test subagents individually first

## Performance Issues

### Slow Workflow Execution
**Diagnosis Steps**:
1. Check context size
2. Monitor file read operations
3. Review agent sequencing
**Solutions**:
- Enable parallel processing where possible
- Use memory bank cache
- Implement Chain of Draft for searches
- Clean up unnecessary files

### High Token Usage
**Diagnosis Steps**:
1. Run /ccusage-daily
2. Check for redundant file reads
3. Review agent outputs
**Solutions**:
- Use /cleanup-context regularly
- Enable CoD mode for searches
- Leverage memory bank
- Batch similar operations

## Error Messages

### "Context limit exceeded"
**Meaning**: Token limit reached
**Fix**: Use phase-based workflow or cleanup context

### "Workflow not found"
**Meaning**: Invalid workflow specified
**Fix**: Check workflow name, use available options

### "Memory bank corrupted"
**Meaning**: Memory file malformed
**Fix**: Delete corrupted file, will regenerate

### "Security scan timeout"
**Meaning**: Input too large for scanner
**Fix**: Break input into smaller chunks

## Best Practices for Troubleshooting

1. **Check Memory Bank First**
   - Often contains previous solutions
   - Shows recent context and decisions

2. **Enable Verbose Mode**
   - Add --verbose flag for detailed output
   - Shows internal decision process

3. **Test in Isolation**
   - Test individual components separately
   - Use simple inputs first

4. **Monitor Resources**
   - Track token usage with /ccusage-daily
   - Watch context growth
   - Check file operations

5. **Incremental Approach**
   - Start with simple workflow
   - Add complexity gradually
   - Validate each step

## Recovery Procedures

### Corrupted Memory Bank
```bash
# Backup existing memory
cp -r ClaudeFiles/memory ClaudeFiles/memory.backup

# Remove corrupted files
rm ClaudeFiles/memory/CLAUDE-*.md

# Reinitialize
/systemcc --init-memory
```

### Stuck Workflow
```bash
# Force stop current workflow
Ctrl+C

# Clean context
/cleanup-context

# Retry with simpler workflow
/systemcc --workflow=orchestrated "task"
```

### Performance Recovery
```bash
# Check current usage
/ccusage-daily

# Clean up context
/cleanup-context

# Optimize memory bank
/systemcc --optimize-memory

# Use CoD mode for searches
/systemcc --cod-mode "search task"
```

---
*This file contains solutions to common problems. Update with new issues and solutions.*
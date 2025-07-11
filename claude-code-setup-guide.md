# Claude Code Setup Guide

## Overview
This guide explains how to configure Claude Code to automatically read your agent workflow system and apply it across all projects.

## How Claude Code Auto-Reads Files

Claude Code automatically reads `CLAUDE.md` files from three locations (in order of precedence):

1. **Global**: `~/.claude/CLAUDE.md` - Applies to ALL projects
2. **Project Root**: `/your-project/CLAUDE.md` - Project-specific instructions  
3. **Subdirectories**: `/your-project/subdir/CLAUDE.md` - Context-specific instructions

## Setting Up Global Configuration

### 1. Create Global CLAUDE.md
The global configuration file has already been created at `~/.claude/CLAUDE.md`. This file:
- Instructs Claude to look for agent workflow files
- Provides default development practices
- Sets up standard task management approaches

### 2. Verify Installation
```bash
# Check if global CLAUDE.md exists
ls -la ~/.claude/CLAUDE.md

# View the contents
cat ~/.claude/CLAUDE.md
```

## Using the Agent System

### For New Projects

1. **Copy the agent system** to your project:
```bash
# Option 1: Full system for complex projects
cp -r /path/to/Claude-Agent-System/complete-system /your-project/
cp /path/to/Claude-Agent-System/README-AGENT-SYSTEM.md /your-project/

# Option 2: Just the orchestrated workflow for simpler projects  
cp -r /path/to/Claude-Agent-System/orchestrated-only /your-project/
```

2. **Create project CLAUDE.md** referencing the system:
```bash
# Create a project-specific CLAUDE.md that points to your workflow files
echo "See README-AGENT-SYSTEM.md for workflow selection" > /your-project/CLAUDE.md
```

### For Existing Projects

Add a CLAUDE.md file to any existing project:

```markdown
# CLAUDE.md

## Workflow System
This project uses the Claude Agent System. Check for:
- `README-AGENT-SYSTEM.md` - Workflow selection guide
- `complete-system/` - Full agent workflow
- `orchestrated-only/` - Streamlined workflow

Use appropriate workflow based on task complexity.
```

## Team Setup Instructions

### For Team Members

1. **Install Global Configuration**:
```bash
# Create .claude directory if it doesn't exist
mkdir -p ~/.claude

# Download or copy the global CLAUDE.md
# Option 1: If you have the file
cp /path/to/global-CLAUDE.md ~/.claude/CLAUDE.md

# Option 2: Create from this guide
cat > ~/.claude/CLAUDE.md << 'EOF'
[Insert global CLAUDE.md content here]
EOF
```

2. **Verify Claude Code Settings**:
```bash
# Check Claude Code configuration directory
ls -la ~/.claude/

# Should see:
# CLAUDE.md - Global instructions
# claude.json - Project configurations
# settings.json - Additional settings
```

### For Project Maintainers

1. **Include setup instructions** in your project README:
```markdown
## Claude Code Setup
This project uses the Claude Agent System. Claude Code will automatically
read our workflow configuration from CLAUDE.md and README-AGENT-SYSTEM.md.

No additional setup required if you have the global configuration installed.
```

2. **Version control** the workflow files:
```bash
# Always commit your workflow configuration
git add CLAUDE.md README-AGENT-SYSTEM.md
git add complete-system/ orchestrated-only/  # if included
git commit -m "Add Claude Agent System configuration"
```

## Customization Options

### Project-Specific Overrides
Your project CLAUDE.md can override global settings:

```markdown
# CLAUDE.md

## Project Overrides
- Always use complete-system workflow (even for small tasks)
- Custom lint command: `npm run lint:strict`
- Required PR reviews: 2 approvals minimum
```

### Subdirectory Instructions
Add CLAUDE.md files in subdirectories for context-specific guidance:

```bash
/your-project/
  CLAUDE.md                    # Project-wide instructions
  /frontend/
    CLAUDE.md                  # Frontend-specific instructions
  /backend/
    CLAUDE.md                  # Backend-specific instructions
```

## Best Practices

1. **Keep instructions concise** - Claude reads these files for every interaction
2. **Reference documentation** rather than duplicating it
3. **Use clear section headers** for easy scanning
4. **Include examples** of workflow usage
5. **Update regularly** as your project evolves

## Troubleshooting

### Claude not reading instructions?
1. Check file locations are correct
2. Ensure file permissions allow reading
3. Restart Claude Code session
4. Verify no syntax errors in CLAUDE.md

### Instructions not being followed?
1. Check precedence - project files override global
2. Ensure instructions are clear and specific
3. Avoid contradictory instructions
4. Use explicit commands rather than suggestions

## Summary

With this setup:
- Claude Code automatically knows about your agent workflow system
- No manual instruction needed for each session
- Consistent behavior across all team members
- Easy to maintain and update workflows

The system is now configured to automatically guide Claude Code in using the appropriate workflow based on task complexity!
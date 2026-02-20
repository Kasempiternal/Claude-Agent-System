# Contributing to Claude Agent System

Thank you for your interest in contributing! This project is a Claude Code plugin that spawns parallel agent swarms for planning, implementation, and code review.

## How to Contribute

### 1. New Skills
- Created a useful skill for Claude Code? We'd love to include it!
- Skills live in `claude-agent-system-plugin/skills/{skill-name}/SKILL.md`

### 2. Review Agents
- Improved an existing review agent or created a new one?
- Agents live in `claude-agent-system-plugin/agents/{agent-name}.md`

### 3. Documentation Improvements
- Fix typos or clarify existing documentation
- Add examples for complex scenarios

### 4. Bug Fixes
- Found an issue with a skill? Help us fix it!

## Contribution Process

### 1. Fork and Clone
```bash
git fork https://github.com/Kasempiternal/Claude-Agent-System
git clone https://github.com/yourusername/Claude-Agent-System
cd Claude-Agent-System
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Plugin code lives in `claude-agent-system-plugin/`
- Skills: `claude-agent-system-plugin/skills/{name}/SKILL.md`
- Agents: `claude-agent-system-plugin/agents/{name}.md`
- Plugin manifest: `claude-agent-system-plugin/plugin.yaml`

### 4. Commit Your Changes
```bash
git add .
git commit -m "Add: Brief description of your contribution"
```

Follow conventional commit messages:
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for improvements
- `Docs:` for documentation changes

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title describing the change
- Detailed description of what and why
- Examples of the skill/agent in action

## Contribution Guidelines

### Code Style
- Use clear, descriptive file names
- Follow the existing markdown formatting
- Include practical examples
- Keep skills focused and single-purpose

### Testing Requirements
- Test skills with multiple project types
- Verify skills work with latest Claude Code version
- Document any limitations discovered

### Quality Checklist
Before submitting, ensure your contribution:
- [ ] Follows existing naming conventions
- [ ] Includes clear documentation
- [ ] Has been tested thoroughly
- [ ] Adds value without duplicating existing skills

## What We're Looking For

### High Priority
- Domain-specific skills (mobile dev, data science, DevOps, etc.)
- Performance improvements to existing skills
- New review agents for specialized analysis

### Always Welcome
- Real-world case studies
- Tips and best practices
- Community success stories

## What We Don't Accept

- Skills that violate Claude's usage policies
- Malicious or harmful patterns
- Plagiarized content without attribution
- Low-quality or untested submissions

## Questions?

- Open an issue for clarification
- Join the discussion on r/ClaudeAI
- Check existing issues and PRs to avoid duplication

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers this project.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## System Overview

This repository implements a structured multi-agent workflow system for web development projects. The system uses specialized agents that work sequentially to ensure high-quality code implementation, proper documentation, and safe version control practices.

## Agent System Architecture

### Core Agents
- **PLANNER**: Strategic analysis and solution architecture
- **EXECUTER**: Code implementation and building  
- **VERIFIER**: Code quality and standards enforcement
- **TESTER**: Functional validation and user experience testing
- **DOCUMENTER**: Knowledge capture and pattern documentation
- **UPDATER**: Version control and deployment management

### Workflow Execution
```bash
/planner "describe your problem or idea"  # Start with root cause analysis
/executer   # Implement solution based on Phase 1
/verifier   # Validate code quality from Phase 2  
/tester     # Test functionality from Phase 3
/documenter # Update documentation from Phase 4
/updater    # Commit changes from Phase 5
```

## Development Commands

Since this is a documentation-focused system without a traditional build process, the following patterns apply:

### Documentation Validation
- No automated build commands - this is a markdown-based documentation system
- Agents work with markdown files and workflow documentation
- Validation happens through agent review processes rather than automated tools

### Agent Workflow Commands
- Use agent-specific commands to trigger different phases
- Each agent has specific responsibilities and outputs
- Sequential execution ensures quality and completeness

## Code Quality Standards

### Documentation Standards
- All agent documentation follows established markdown patterns
- Clear section headers and structured content organization
- Comprehensive examples with both correct and incorrect patterns
- Cross-referencing between related documentation files

### Anti-Patterns to Avoid
- Skipping the PLANNER phase - always start with root cause analysis
- Ignoring documentation compliance - patterns must be followed exactly
- Direct commits to main branch - use development branch workflow
- Incomplete phase execution - each agent must complete their tasks

### Pattern Compliance
- Follow exact patterns documented in agent specification files
- Use established templates for WORK.md file structure
- Implement proper phase delegation and parallel execution planning
- Maintain comprehensive documentation of decisions and implementations

## File Structure and Organization

### Core Documentation Files
- `claude-agents-workflow.md` - Main system overview and principles
- `planner-agent.md` - Strategic analysis and solution architecture
- `executer-agent.md` - Implementation specialist patterns
- `verifier-agent.md` - Code quality and standards enforcement
- `tester-agent.md` - Functional validation and testing protocols
- `documenter-agent.md` - Knowledge capture and documentation patterns
- `m-orchestrated-dev.md` - Multi-agent orchestration workflow

### Workflow Patterns
- Each agent maintains specific responsibilities and outputs
- Sequential execution with optional parallel phases
- Comprehensive documentation of all decisions and implementations
- Quality gates at each phase to ensure standards compliance

## Development Best Practices

### Agent Coordination
- Always begin with PLANNER agent for problem analysis
- Follow the documented phase sequence unless parallel execution is specified
- Each agent must read and follow linked documentation exactly
- Complete all phases before proceeding to deployment

### Quality Assurance
- VERIFIER agent enforces all code quality standards
- TESTER agent validates functionality across scenarios and user types
- DOCUMENTER agent captures all patterns and learnings
- No phase should be skipped or abbreviated

### Documentation Requirements
- All new patterns must be documented in LEARNINGS.md
- Critical rules updates require CLAUDE.md modifications
- Cross-reference related documentation for context
- Include both positive examples and anti-patterns

## Project-Specific Considerations

### Web Development Focus
The system is optimized for modern web development projects including:
- React/Vue/Angular applications
- Three.js/WebGL projects  
- JavaScript/TypeScript packages
- Progressive Web Apps
- Full-stack applications

### Performance and Security
- Performance optimization patterns for web applications
- Security best practices for client-side and server-side code
- Cross-browser compatibility requirements
- Accessibility compliance (WCAG 2.1 AA standards)

### Multi-Environment Support
- Development, staging, and production environment considerations
- Browser compatibility matrix support
- Mobile and desktop responsive design patterns
- Progressive enhancement strategies

This system emphasizes quality over speed, systematic problem-solving, and comprehensive documentation to ensure maintainable and scalable web applications.
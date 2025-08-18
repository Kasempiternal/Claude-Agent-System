# CLAUDE-decisions.md
*Architecture Decisions and Rationale*

## Architecture Decision Records (ADRs)

### ADR-001: Memory Bank System Implementation
**Date**: 2025-01-18
**Status**: Accepted
**Context**: Need persistent context across Claude sessions
**Decision**: Implement file-based memory bank in ClaudeFiles/memory/
**Rationale**: 
- Simple file-based approach avoids external dependencies
- ClaudeFiles already ignored in git
- Easy to backup and version
**Consequences**: 
- Manual cleanup may be needed
- No automatic conflict resolution
- Simple but effective for single-user

### ADR-002: Security Scanner Integration
**Date**: 2025-01-18
**Status**: Proposed
**Context**: Need to detect prompt injection attacks
**Decision**: Port PromptSecure-Ultra as middleware
**Rationale**:
- Enterprise-grade security needed
- Can detect multiple encoding types
- Generates audit trails
**Consequences**:
- Additional processing overhead
- May have false positives
- Requires maintenance

### ADR-003: Workflow Selection Strategy
**Date**: 2025-01-18
**Status**: Accepted
**Context**: Multiple workflows available, need intelligent routing
**Decision**: Context-aware selection with complexity scoring
**Rationale**:
- Context size is primary constraint
- Task complexity determines validation needs
- User shouldn't need to specify workflow
**Consequences**:
- More complex decision logic
- Better user experience
- Optimal resource usage

### ADR-004: Subagent Architecture
**Date**: 2025-01-18
**Status**: Accepted
**Context**: Main context gets polluted with searches
**Decision**: Use specialized subagents with isolated contexts
**Rationale**:
- Preserves main context for important work
- Allows parallel processing
- Specialized prompts per agent
**Consequences**:
- More complex agent management
- Better performance
- Cleaner main context

### ADR-005: Chain of Draft Mode
**Date**: 2025-01-18
**Status**: Proposed
**Context**: Code searches consume excessive tokens
**Decision**: Implement CoD mode for 80% token reduction
**Rationale**:
- Significant cost savings
- Faster processing
- Optional for when detail needed
**Consequences**:
- Less detailed responses in CoD mode
- User must explicitly request for detail
- Major efficiency gain

## Design Principles

### 1. Progressive Enhancement
- Start with basic functionality
- Add features incrementally
- Maintain backward compatibility
- Graceful degradation

### 2. Context First
- Monitor token usage constantly
- Optimize for context preservation
- Use memory bank for persistence
- Clean up aggressively

### 3. Security by Default
- Scan all user input
- Validate all operations
- Generate audit trails
- Fail securely

### 4. User Experience
- Single command interface (/systemcc)
- Automatic workflow selection
- Minimal user intervention
- Clear progress feedback

### 5. Maintainability
- Clear file organization
- Comprehensive documentation
- Consistent patterns
- Version control friendly

## Technology Choices

### Storage: File-based
- **Why**: Simple, portable, version-controllable
- **Alternative considered**: Database
- **Decision**: Files for simplicity

### Security: PromptSecure-Ultra
- **Why**: Comprehensive, proven, enterprise-ready
- **Alternative considered**: Simple regex
- **Decision**: Full scanner for robustness

### Workflow: Markdown-based
- **Why**: Human-readable, git-friendly, easy to edit
- **Alternative considered**: JSON/YAML
- **Decision**: Markdown for accessibility

### Context Management: Memory Bank
- **Why**: Persistent, organized, searchable
- **Alternative considered**: Session-only
- **Decision**: Memory bank for continuity

---
*This file records important decisions. Add new ADRs as decisions are made.*
# Technology Stack Standards - Agent OS Enhanced

## Purpose

This file defines comprehensive technology stack standards for Agent OS integration. Applied when `/systemcc` detects Agent OS scenarios like project setup, standards establishment, or tech stack analysis.

## Core Technology Decisions

### Primary Language: JavaScript/TypeScript
**Version**: TypeScript 5.0+, Node.js 18+
**Rationale**: Strong ecosystem, type safety, excellent tooling support, widespread adoption
**Migration Path**: Gradual TypeScript adoption for new files, maintain JavaScript for existing

### Framework Selection Matrix

#### Frontend Frameworks (Auto-detected by Agent OS)
| Framework | Detection File | Use Case | Recommendation |
|-----------|----------------|----------|----------------|
| React | package.json → "react" | Component-based UIs | ✅ Primary choice |
| Vue.js | package.json → "vue" | Rapid prototyping | 🟡 Alternative |
| Svelte | package.json → "svelte" | Performance critical | 🟡 Specialized |
| Next.js | package.json → "next" | Full-stack React | ✅ Recommended |

#### Backend Frameworks
| Framework | Detection | Language | Recommendation |
|-----------|-----------|----------|----------------|
| Express.js | package.json → "express" | JavaScript/TypeScript | ✅ Primary |
| FastAPI | requirements.txt → "fastapi" | Python | ✅ Primary |
| NestJS | package.json → "@nestjs/core" | TypeScript | 🟡 Enterprise |
| Django | requirements.txt → "django" | Python | 🟡 Traditional |
| Rails | Gemfile → "rails" | Ruby | 🟡 Ruby projects |

### Build and Development Tools
| Tool | Version | Auto-Detection | Purpose | Priority |
|------|---------|----------------|---------|----------|
| Vite | 5.0+ | vite.config.js | Fast builds | High |
| Webpack | 5.0+ | webpack.config.js | Complex builds | Medium |
| ESLint | 8.0+ | .eslintrc.* | Code linting | High |
| Prettier | 3.0+ | .prettierrc | Formatting | High |
| Jest | 29.0+ | jest.config.js | Testing | High |
| Cypress | 12.0+ | cypress.config.js | E2E testing | Medium |

## Language-Specific Standards

### JavaScript/TypeScript Projects
**Detection**: `package.json` file present
**Standards Applied**:
- ESLint configuration with TypeScript support
- Prettier formatting rules
- Jest testing setup
- Husky pre-commit hooks
- TypeScript strict mode configuration

### Python Projects  
**Detection**: `requirements.txt` or `pyproject.toml` present
**Standards Applied**:
- Black formatting
- Flake8 linting with custom rules
- pytest testing framework
- mypy type checking
- pre-commit hooks configuration

### Ruby Projects
**Detection**: `Gemfile` present
**Standards Applied**:
- RuboCop linting and formatting
- RSpec testing framework
- Bundler for dependency management
- Rails conventions (if Rails detected)

## Database and Data Layer

### Primary Choices by Use Case
| Database | Use Case | ORM/Client | Recommendation |
|----------|----------|------------|----------------|
| PostgreSQL | Relational data, JSON support | Prisma, Sequelize | ✅ Primary |
| MongoDB | Document store, flexible schema | Mongoose | 🟡 Document-heavy |
| Redis | Caching, session storage | ioredis | ✅ Caching layer |
| SQLite | Development, small projects | Built-in clients | 🟡 Development |

## Agent OS Detection Logic

### Technology Stack Analysis Process
1. **File Scanning**: Detect configuration files in project root
2. **Dependency Analysis**: Parse package.json, requirements.txt, Gemfile
3. **Framework Identification**: Identify primary and secondary frameworks
4. **Tool Configuration**: Detect existing development tools
5. **Standards Gap Analysis**: Identify missing standards and configurations

### Auto-Detection Patterns
```javascript
// Agent OS detection patterns
const detectionPatterns = {
  javascript: ['package.json'],
  python: ['requirements.txt', 'pyproject.toml', 'setup.py'],
  ruby: ['Gemfile', 'Rakefile'],
  rust: ['Cargo.toml'],
  go: ['go.mod'],
  java: ['pom.xml', 'build.gradle']
};
```

## Standards Implementation Strategy

### Phase 1: Core Setup (Immediate)
- Language and framework detection
- Basic linting and formatting setup
- Git hooks configuration
- Essential development scripts

### Phase 2: Quality Standards (Week 1)
- Comprehensive testing setup
- Pre-commit hook configuration
- CI/CD pipeline templates
- Documentation standards

### Phase 3: Advanced Configuration (Week 2+)
- Performance monitoring
- Security scanning
- Advanced build optimization
- Team workflow integration

## Technology Upgrade Policy

### Automated Updates
- **Security patches**: Immediate (within 24 hours)
- **Minor versions**: Monthly evaluation
- **Major versions**: Quarterly planning

### Manual Review Required
- Framework version changes
- Breaking API changes
- Performance impact assessments
- Team training needs

## Integration Points

### Used by `/systemcc` Workflow
- Project initialization and setup
- Standards establishment
- Technology gap analysis
- Configuration generation

### Agent OS Workflow Integration
- **ANALYZER**: Technology stack detection and analysis
- **ARCHITECT**: Standards framework design based on stack
- **STANDARDS_CREATOR**: Configuration file generation
- **VERIFIER**: Technology compatibility validation

## Customization and Overrides

### Project-Specific Configuration
```yaml
# .agent-os.yml (project root)
tech_stack:
  primary_language: typescript
  framework: next
  database: postgresql
  testing: jest
  styling: tailwind
  overrides:
    eslint_rules: strict
    prettier_config: custom
```

### Team Preferences
Team-specific preferences can be defined in:
- Project CLAUDE.md file
- .agent-os.yml configuration
- Environment-specific overrides

Remember: Technology choices should align with project goals, team expertise, and long-term maintainability. Agent OS adapts these standards to your specific project context.
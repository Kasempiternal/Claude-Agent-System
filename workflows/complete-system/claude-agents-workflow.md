# CLAUDE Agents Workflow System

## 🎯 Overview

The CLAUDE Agents System is a structured workflow for implementing features and fixing problems in web development projects. It uses 6 specialized agents that work sequentially to ensure high-quality code, proper documentation, and safe version control. PLANNER needs to specify which phases can be done simultaneously!

## 🤖 The Agents

### 1. PLANNER - The Strategist
- **Role**: Investigates problems and designs solutions
- **Analyzes**: Root causes, not symptoms
- **Creates**: Detailed phases for other agents
- **Command**: `/planner "describe your problem or idea"`

### 2. EXECUTER - The Builder
- **Role**: Implements the solution
- **Follows**: Phase 1 instructions from PLANNER
- **Uses**: Established patterns from docs/
- **Output**: Clean, working code

### 3. VERIFIER - The Guardian
- **Role**: Ensures code quality
- **Checks**: CLAUDE.md compliance
- **Runs**: Validation commands
- **Output**: Pass/fail report

### 4. TESTER - The Validator
- **Role**: Tests functionality
- **Validates**: User flows and edge cases
- **Tests**: Different scenarios and devices
- **Output**: Test results

### 5. DOCUMENTER - The Historian
- **Role**: Updates documentation
- **Updates**: CLAUDE.md with new patterns
- **Maintains**: PROJECT_DOCUMENTATION.md
- **Output**: Updated docs

### 6. UPDATER - The Deployer
- **Role**: Handles version control
- **Creates**: Detailed commit messages
- **Pushes**: To development branch only
- **Output**: Commit confirmation

## ⚙️ How It Works

### Step 1: Identify Problem
User reports an issue or proposes a feature:
```bash
/planner "Bundle size too large, app loading slowly"
```

### Step 2: PLANNER Investigation
PLANNER analyzes:
- Current code implementation
- Documentation in docs/
- Recent reports/
- Build configuration
- CLAUDE.md patterns

Output: 5 phases with specific instructions for each agent

### Step 3: Sequential Execution
Each agent reads their phase and executes:
```bash
/executer   # Implements fix based on Phase 1
/verifier   # Validates code quality from Phase 2
/tester     # Tests functionality from Phase 3
/documenter # Updates documentation from Phase 4
/updater    # Commits changes from Phase 5
```

### Step 4: Safe Deployment
- Changes committed to `development` branch
- User prompted about PR to `main`
- No automatic merges to production

## 🎯 Key Principles

### 1. Root Cause Focus
- Don't fix symptoms, fix the actual problem
- No workarounds or quick patches
- Follow established patterns

### 2. Documentation First
- Check docs/ before implementing
- Update docs/ after implementing
- Keep CLAUDE.md current

### 3. Quality Gates
- Each agent must complete successfully
- Validation must pass (including violation checks)
- Tests must pass
- Docs must be updated
- No console.log without `process.env.NODE_ENV === 'development'` checks
- No 'any' types or catch(error: any)
- No hardcoded text (must use i18n when applicable)
- All error handlers must use logger
- ARIA attributes for accessibility
- Cross-browser compatibility validated
- Performance impact assessed

### 4. Safety First
- Never push directly to main
- Always work on development branch
- Manual approval for production

## 📋 Example Workflow

### Problem: "Bundle size too large"

**PLANNER Output:**
```
Root Cause: Importing entire libraries instead of tree-shaking
Solution: Implement code splitting and optimize imports

Phase 1 - EXECUTER (⚡ PARALLEL: NO):
- Configure dynamic imports for large components
- Optimize library imports for tree-shaking
- Update webpack/vite config for better chunking
- Pattern: docs/performance/CODE-SPLITTING.md
- Estimated: 45min

Phase 2 - VERIFIER (⚡ PARALLEL: NO):
- Run bundle analyzer and compare sizes
- Verify TypeScript compliance
- Validate build performance metrics
- Check lighthouse scores
- Estimated: 20min

Phase 3 - TESTER (⚡ PARALLEL: NO):
- Test loading performance on slow networks
- Test lazy-loaded components functionality
- Verify functionality across target browsers
- Test mobile performance
- Estimated: 30min

Phase 4 - DOCUMENTER (⚡ PARALLEL: NO):
- Add bundle optimization pattern to CLAUDE.md
- Update performance documentation
- Document new bundle size limits
- Estimated: 15min

Phase 5 - UPDATER (⚡ PARALLEL: NO):
- Commit as perf(build): implement code splitting and tree-shaking
- Include bundle size metrics in commit message
- Estimated: 5min

Total Time: 115min sequential
```

**Result**: Problem solved systematically with documentation

## 💡 Project Type Examples

### React/Vue Application Issue
**Problem**: "Components re-rendering unnecessarily"
```
Root Cause: Missing memoization and unstable dependencies
Solution: Implement React.memo and useCallback patterns

Phase 1 - EXECUTER (⚡ PARALLEL: NO - 40min):
- Wrap expensive components in React.memo
- Add useCallback for event handlers
- Implement useMemo for expensive calculations
- Pattern: docs/react/PERFORMANCE-OPTIMIZATION.md

Phase 2 - VERIFIER (⚡ PARALLEL: NO - 15min):
- Validate React DevTools profiler results
- Check TypeScript compliance
- Verify no new ESLint warnings

Phase 3 - TESTER (⚡ PARALLEL: NO - 25min):
- Test render counts with React Profiler
- Test user interactions and responsiveness
- Verify no functionality regressions

Phase 4 - DOCUMENTER (⚡ PARALLEL: NO - 15min):
- Document memoization patterns
- Update performance benchmarks

Phase 5 - UPDATER (⚡ PARALLEL: NO - 5min):
- Commit as perf(react): optimize component re-renders
```

### Three.js Performance Issue
**Problem**: "Frame rate drops on mobile devices"
```
Root Cause: Complex geometry updates on every frame
Solution: Implement object pooling and LOD systems

Phase 1 - EXECUTER (⚡ PARALLEL: NO - 60min):
- Implement geometry object pooling
- Add Level of Detail (LOD) system
- Optimize render loop with frustum culling
- Pattern: docs/graphics/THREEJS-OPTIMIZATION.md

Phase 2 - VERIFIER (⚡ PARALLEL: NO - 20min):
- Check FPS with stats.js integration
- Validate memory usage patterns
- Verify WebGL error handling

Phase 3 - TESTER (⚡ PARALLEL: NO - 40min):
- Test on various mobile devices
- Test different scene complexities
- Verify cross-browser WebGL support
- Test memory leak prevention

Phase 4 - DOCUMENTER (⚡ PARALLEL: NO - 20min):
- Document Three.js optimization patterns
- Update performance benchmarks
- Add mobile-specific guidelines

Phase 5 - UPDATER (⚡ PARALLEL: NO - 5min):
- Commit as perf(graphics): implement object pooling and LOD
```

### JavaScript Package Issue
**Problem**: "TypeScript definitions not exported correctly"
```
Root Cause: Build configuration missing declaration generation
Solution: Fix build pipeline and export structure

Phase 1 - EXECUTER (⚡ PARALLEL: NO - 35min):
- Update rollup/webpack config for .d.ts generation
- Fix package.json exports field
- Ensure proper index.ts barrel exports
- Pattern: docs/packages/TYPESCRIPT-SETUP.md

Phase 2 - VERIFIER (⚡ PARALLEL: NO - 15min):
- Validate generated type definitions
- Check package.json structure
- Verify build output integrity

Phase 3 - TESTER (⚡ PARALLEL: NO - 25min):
- Test package consumption in React project
- Test package consumption in Node.js project
- Test package consumption in vanilla JS
- Verify tree-shaking works correctly

Phase 4 - DOCUMENTER (⚡ PARALLEL: NO - 15min):
- Document package development patterns
- Update TypeScript configuration guide
- Add export best practices

Phase 5 - UPDATER (⚡ PARALLEL: NO - 5min):
- Commit as fix(build): correct TypeScript definition exports
- Version bump for package release
```

## 📚 Best Practices

### For Users
1. Describe problems clearly
2. Include error messages or performance metrics
3. Wait for each agent to complete
4. Review changes before deployment

### For Development
1. Always start with PLANNER
2. Never skip agents
3. Fix failures before proceeding
4. Document everything

## ⚠️ Common Mistakes

1. **Skipping PLANNER**: Going straight to implementation
2. **Ignoring VERIFIER**: Pushing code that doesn't pass validation
3. **Skipping DOCUMENTER**: Not updating documentation
4. **Direct to main**: Pushing without review

## ✅ Success Metrics
- ✅ All validations passing
- ✅ No TypeScript errors
- ✅ Tests passing
- ✅ Bundle size within limits
- ✅ Performance benchmarks met
- ✅ Accessibility compliance
- ✅ Documentation updated
- ✅ Clean commit history
- ✅ Safe deployment process

## 🛠️ Tools Used

### Code Quality
- **TypeScript**: Type checking
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Husky**: Git hooks

### Testing
- **Jest/Vitest**: Unit testing
- **Cypress/Playwright**: E2E testing
- **Lighthouse**: Performance testing
- **axe-core**: Accessibility testing

### Build & Deployment
- **Webpack/Vite/Rollup**: Bundling
- **Git**: Version control
- **npm/yarn/pnpm**: Package management
- **CI/CD**: Automated pipelines

### Performance
- **webpack-bundle-analyzer**: Bundle analysis
- **Chrome DevTools**: Performance profiling
- **Web Vitals**: Performance metrics

### Development Tools
- **Database tools**: Various (PostgreSQL, MongoDB, etc.)
- **API tools**: Postman, Insomnia
- **Graphics tools**: Three.js Inspector (for WebGL projects)

## 🔄 Continuous Improvement

The system learns from each problem:
1. **New patterns** → CLAUDE.md
2. **New solutions** → docs/
3. **New anti-patterns** → Documentation
4. **Better workflows** → Agent updates
5. **Performance benchmarks** → Baseline documentation
6. **Browser compatibility** → Support matrix updates
7. **Accessibility patterns** → A11y guidelines
8. **Security practices** → Security documentation

### Learning Feedback Loop
```
Problem Solved → Pattern Identified → Documentation Updated → Future Prevention
     ↑                                                           ↓
Monitoring ← Production Deployment ← Testing ← Implementation
```

## 🚀 Project-Specific Adaptations

### React/Vue/Angular Projects
- Focus on component patterns and state management
- Include performance profiling and bundle analysis
- Test responsive design and accessibility

### Three.js/WebGL Projects
- Emphasize graphics performance and memory management
- Include cross-browser and device testing
- Focus on render optimization patterns

### JavaScript/TypeScript Packages
- Prioritize API design and type definitions
- Include package size and tree-shaking validation
- Test consumption in different environments

### Full-Stack Applications
- Coordinate frontend and backend changes
- Include API contract validation
- Test data consistency across layers

---

## Quick Start

1. Install Claude.ai desktop app
2. Enable Claude Code features
3. Open project in Claude
4. Use `/planner "your problem"` to start
5. Follow agent sequence
6. Deploy safely

## Advanced Usage

### Parallel Execution
PLANNER can specify phases that run simultaneously:
```
Phase 1a & 1b - EXECUTER (⚡ PARALLEL):
- 1a: Update React components with new state logic (35min)
- 1b: Update API endpoints with new validation (30min)

Phase 2a & 2b - VERIFIER (⚡ PARALLEL - after Phase 1 complete):
- 2a: Frontend validation (TypeScript, ESLint, tests) (20min)
- 2b: Backend validation (API tests, type checking) (15min)

Phase 3 - TESTER (after all verification complete):
- End-to-end integration testing (25min)
- Cross-browser and device testing (20min)

Phase 4 - DOCUMENTER:
- Update patterns and documentation (15min)

Phase 5 - UPDATER:
- Coordinated commit of all changes (5min)

Total Time: 70min (parallel) vs 130min (sequential)
```

### Complex Multi-Track Projects
```
Track 1: Frontend optimization (⚡ PARALLEL)
- Phase 1a-EXECUTER: React component optimization (45min)
- Phase 2a-VERIFIER: Frontend validation (20min)
- Phase 3a-TESTER: UI/UX testing (30min)

Track 2: Backend performance (⚡ PARALLEL)
- Phase 1b-EXECUTER: API optimization (50min)
- Phase 2b-VERIFIER: Backend validation (15min)
- Phase 3b-TESTER: API performance testing (25min)

Track 3: Build optimization (⚡ PARALLEL)
- Phase 1c-EXECUTER: Webpack/Vite configuration (30min)
- Phase 2c-VERIFIER: Build validation (10min)
- Phase 3c-TESTER: Bundle size and loading tests (20min)

Synchronization Phase:
- Phase 4-DOCUMENTER: Coordinate all documentation (25min)
- Phase 5-UPDATER: Atomic commit with all changes (10min)

Total Time: 95min (parallel) vs 245min (sequential)
```

### Emergency Hotfixes
For critical production issues:
```
Fast-track workflow:
1. PLANNER (⚡ EMERGENCY MODE - 10min):
   - Minimal root cause analysis
   - Quick solution design
   - Hotfix-specific patterns

2. EXECUTER (⚡ HOTFIX MODE - 20min):
   - Implement minimal viable fix
   - Follow hotfix patterns only
   - Skip non-critical optimizations

3. VERIFIER (⚡ CRITICAL CHECKS - 10min):
   - TypeScript errors only
   - Critical functionality tests
   - Security vulnerability scan

4. TESTER (⚡ SMOKE TESTS - 15min):
   - Core functionality validation
   - Production environment tests
   - Rollback plan verification

5. UPDATER (⚡ HOTFIX DEPLOY - 5min):
   - Hotfix branch creation
   - Immediate deployment pipeline
   - Post-deployment monitoring

Total Emergency Time: 60min maximum
```

Remember: **Quality over speed. Fix it right the first time.**
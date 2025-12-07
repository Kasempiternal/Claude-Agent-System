# Deep Project Analyzer

## Purpose
This module provides comprehensive project analysis for first-run in `/systemcc`, performing in-depth pattern recognition and knowledge extraction to establish a complete understanding of the project's architecture, conventions, and patterns.

## Core Philosophy
Unlike the lightweight analyzer that provides quick insights, this deep analyzer performs thorough analysis to:
- Extract reusable patterns and anti-patterns
- Map complete dependency graphs
- Identify security postures and vulnerabilities
- Build comprehensive convention profiles
- Cache insights in session context

## Analysis Phases (Parallel Execution)

### Phase 1: Comprehensive File System Analysis (5-10 seconds)
```python
def deep_file_analysis():
    """Complete project structure and organization analysis"""
    return {
        'project_metrics': {
            'total_files': count_all_files(),
            'lines_of_code': count_loc_by_language(),
            'complexity_score': calculate_complexity(),
            'tech_debt_indicators': find_debt_patterns(),
            'file_organization': analyze_structure_quality()
        },
        'architecture_map': {
            'layers': detect_architecture_layers(),
            'modules': map_module_boundaries(),
            'entry_points': find_main_entries(),
            'data_flow': trace_data_paths()
        },
        'resource_analysis': {
            'assets': catalog_static_resources(),
            'configs': find_all_configs(),
            'environments': detect_environments(),
            'secrets_scan': check_for_exposed_secrets()
        }
    }
```

### Phase 2: Pattern Recognition & Extraction (10-15 seconds)
```python
def extract_code_patterns():
    """Mine codebase for reusable patterns and conventions"""

    # Sample 20-30 representative files
    sample_files = get_diverse_sample_files(count=30)

    patterns = {
        'coding_conventions': {
            'naming': extract_naming_patterns(sample_files),
            'structure': extract_structural_patterns(sample_files),
            'comments': analyze_documentation_style(sample_files),
            'formatting': detect_code_formatting(sample_files)
        },
        'design_patterns': {
            'architectural': find_architectural_patterns(),
            'creational': detect_factory_singleton_patterns(),
            'behavioral': detect_observer_strategy_patterns(),
            'structural': detect_adapter_decorator_patterns()
        },
        'error_patterns': {
            'handling': analyze_error_handling_approaches(),
            'logging': detect_logging_patterns(),
            'validation': find_validation_patterns(),
            'recovery': identify_recovery_strategies()
        },
        'testing_patterns': {
            'structure': analyze_test_organization(),
            'assertions': detect_assertion_patterns(),
            'mocking': identify_mocking_approaches(),
            'coverage': estimate_test_coverage()
        }
    }

    return patterns
```

### Phase 3: Security & Database Analysis (5-8 seconds)
```python
def security_and_database_analysis():
    """Deep security posture and database usage analysis"""

    security_analysis = {
        'authentication': {
            'methods': detect_auth_implementations(),
            'providers': find_auth_providers(),
            'token_usage': analyze_token_patterns(),
            'session_management': check_session_handling()
        },
        'authorization': {
            'role_based': detect_rbac_patterns(),
            'permissions': find_permission_checks(),
            'access_control': analyze_access_patterns()
        },
        'data_protection': {
            'encryption': find_encryption_usage(),
            'sanitization': detect_input_sanitization(),
            'validation': analyze_validation_layers(),
            'sensitive_data': identify_sensitive_fields()
        },
        'vulnerabilities': {
            'sql_injection_risks': scan_for_sql_injection(),
            'xss_risks': scan_for_xss_vulnerabilities(),
            'csrf_protection': check_csrf_tokens(),
            'exposed_secrets': deep_secret_scan()
        }
    }

    database_analysis = {
        'type': detect_database_type(),
        'orm_odm': identify_data_mapper(),
        'migration_system': find_migration_tools(),
        'query_patterns': extract_query_patterns(),
        'connection_management': analyze_db_connections(),
        'transaction_patterns': detect_transaction_usage(),
        'indexes': infer_indexing_strategy(),
        'relationships': map_data_relationships()
    }

    return {
        'security': security_analysis,
        'database': database_analysis
    }
```

### Phase 4: Dependency & Integration Analysis (3-5 seconds)
```python
def analyze_dependencies_and_integrations():
    """Map all internal and external dependencies"""

    return {
        'external_dependencies': {
            'packages': analyze_package_dependencies(),
            'versions': check_version_compatibility(),
            'licenses': scan_license_compliance(),
            'security_advisories': check_known_vulnerabilities()
        },
        'internal_dependencies': {
            'module_graph': build_dependency_graph(),
            'circular_deps': detect_circular_dependencies(),
            'coupling_metrics': calculate_coupling_scores(),
            'cohesion_metrics': measure_module_cohesion()
        },
        'integrations': {
            'apis': find_api_integrations(),
            'services': detect_service_connections(),
            'webhooks': identify_webhook_handlers(),
            'message_queues': find_queue_implementations()
        },
        'build_system': {
            'tools': detect_build_tools(),
            'scripts': analyze_build_scripts(),
            'ci_cd': find_ci_configurations(),
            'deployment': detect_deployment_configs()
        }
    }
```

### Phase 5: Performance & Optimization Patterns (3-5 seconds)
```python
def analyze_performance_patterns():
    """Identify performance optimizations and bottlenecks"""

    return {
        'caching': {
            'strategies': detect_caching_layers(),
            'implementations': find_cache_usage(),
            'invalidation': analyze_cache_invalidation()
        },
        'async_patterns': {
            'promises': detect_promise_patterns(),
            'async_await': find_async_implementations(),
            'concurrency': analyze_concurrent_operations(),
            'rate_limiting': find_rate_limiters()
        },
        'optimization_techniques': {
            'lazy_loading': detect_lazy_patterns(),
            'memoization': find_memoization_usage(),
            'debouncing': identify_debounce_throttle(),
            'pagination': analyze_pagination_approaches()
        },
        'bottleneck_indicators': {
            'n_plus_one': scan_for_n_plus_one(),
            'large_loops': find_nested_iterations(),
            'blocking_io': detect_blocking_operations(),
            'memory_leaks': identify_leak_patterns()
        }
    }
```

## Session Context Population

The deep analyzer caches discovered knowledge in session context for use during workflows:

### Patterns Discovered
```markdown
## Coding Conventions
- **Naming**: [discovered patterns]
- **File Structure**: [organization patterns]
- **Component Patterns**: [common structures]

## Design Patterns In Use
- [List of identified patterns with examples]
```

### Architecture Insights
```markdown
## Technology Stack
- **Language**: [detected]
- **Framework**: [identified]
- **Database**: [type and version]
- **Key Libraries**: [list]

## Architecture Patterns
- **Style**: [microservices/monolith/etc]
- **Layers**: [presentation/business/data]
- **Communication**: [REST/GraphQL/gRPC]
```

All insights are cached in session context - no files created in target repo.

## Enhanced Decision Support

The deep analyzer provides rich context for better workflow selection:

```python
def provide_decision_context(analysis_results):
    """Generate decision support data from analysis"""

    return {
        'complexity_indicators': {
            'architectural_complexity': analysis_results['architecture_score'],
            'code_complexity': analysis_results['cyclomatic_complexity'],
            'dependency_complexity': analysis_results['coupling_metrics'],
            'security_complexity': analysis_results['security_score']
        },
        'risk_factors': {
            'security_risks': analysis_results['vulnerability_count'],
            'technical_debt': analysis_results['debt_score'],
            'test_coverage': analysis_results['coverage_percentage'],
            'dependency_risks': analysis_results['outdated_packages']
        },
        'optimization_opportunities': {
            'pattern_reuse': len(analysis_results['reusable_patterns']),
            'refactoring_candidates': analysis_results['refactor_opportunities'],
            'performance_gains': analysis_results['optimization_potential']
        },
        'workflow_recommendations': {
            'needs_security_scan': analysis_results['has_database'] or
                                  analysis_results['has_auth'],
            'needs_deep_validation': analysis_results['high_risk'],
            'can_reuse_patterns': analysis_results['pattern_matches'] > 5,
            'requires_phased_approach': analysis_results['complexity'] > 0.7
        }
    }
```

## Integration with systemcc

```python
def handle_deep_analysis():
    """Execute deep analysis on first run"""

    print("🔬 Performing deep project analysis...")
    print("━" * 50)

    # Run all analyzers in parallel
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {
            'files': executor.submit(deep_file_analysis),
            'patterns': executor.submit(extract_code_patterns),
            'security': executor.submit(security_and_database_analysis),
            'dependencies': executor.submit(analyze_dependencies_and_integrations),
            'performance': executor.submit(analyze_performance_patterns)
        }

        # Show progress
        completed = 0
        total = len(futures)

        for future in as_completed(futures.values()):
            completed += 1
            print(f"✓ Analysis phase {completed}/{total} complete")

    # Consolidate results
    results = consolidate_analysis_results(futures)

    # Cache in session context
    session.cache_analysis(results)

    # Generate insights
    insights = generate_project_insights(results)

    # Display comprehensive summary
    display_deep_analysis_summary(insights)

    return results
```

## Output Format

```
🔬 Deep Project Analysis Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Project Profile:
├─ Type: Full-Stack Web Application
├─ Size: Large (2,847 files, 156K LOC)
├─ Complexity: Medium-High (score: 7.2/10)
└─ Tech Stack: TypeScript, React, Node.js, PostgreSQL

🏗️ Architecture Insights:
├─ Pattern: Microservices with API Gateway
├─ Layers: Presentation → Business → Data
├─ Communication: REST + WebSocket
└─ State Management: Redux with Redux Toolkit

🔐 Security Profile:
├─ Authentication: JWT with refresh tokens
├─ Authorization: Role-based (RBAC)
├─ Data Protection: Input sanitization detected
⚠️ Vulnerabilities: 2 medium-risk SQL injection points

🎯 Code Patterns Discovered:
├─ Naming: camelCase functions, PascalCase components
├─ Testing: Jest with 73% coverage
├─ Error Handling: Try-catch with central logger
└─ 15 reusable patterns extracted

💾 Database Analysis:
├─ Type: PostgreSQL 14
├─ ORM: TypeORM with migrations
├─ Query Patterns: Repository pattern
└─ Relationships: 23 entities mapped

⚡ Performance Insights:
├─ Caching: Redis for session storage
├─ Async: Extensive Promise/async-await usage
├─ Optimizations: Lazy loading, memoization
⚠️ Bottlenecks: 3 N+1 query patterns detected

📚 Session Context Updated:
✅ Patterns: 45 patterns cached
✅ Decisions: 12 decisions noted
✅ Issues: 8 potential problems identified
✅ Config: 23 variables mapped

🎯 Workflow Recommendation:
Based on analysis, recommended approach:
→ Security scan: REQUIRED (database + auth detected)
→ Pattern reuse: HIGH (15 matching patterns)
→ Validation depth: COMPREHENSIVE (medium-high complexity)
```

## Benefits Over Lightweight Analyzer

1. **Complete Understanding**: 30+ files analyzed vs 10
2. **Pattern Extraction**: Discovers and stores reusable patterns
3. **Security Awareness**: Deep vulnerability scanning
4. **Memory Population**: Pre-fills knowledge base
5. **Intelligent Recommendations**: Data-driven workflow selection
6. **Dependency Mapping**: Full internal/external dependency graph
7. **Performance Insights**: Identifies optimization opportunities
8. **Risk Assessment**: Quantifies technical debt and risks

## Configuration

```yaml
deep_analysis_config:
  sample_size: 30  # Files to sample
  parallel_workers: 5  # Concurrent analyzers
  timeout_seconds: 30  # Maximum analysis time
  security_scan: true  # Include security analysis
  performance_analysis: true  # Include performance patterns
  cache_in_session: true  # Cache results in session context
```

This deep analyzer ensures Claude has comprehensive project understanding from the first interaction, leading to better decisions and more accurate implementations!
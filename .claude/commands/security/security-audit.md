# /security-audit

## Purpose
Perform comprehensive security audit of the codebase, identifying vulnerabilities using OWASP guidelines and providing specific remediation steps.

## Usage
```bash
/security-audit
```

## Features
- Identifies potential vulnerabilities using OWASP guidelines
- Checks authentication, input validation, data protection, and API security
- Categorizes issues by severity (Critical, High, Medium, Low)
- Provides specific remediation steps with code examples
- Generates detailed security report

## Implementation Instructions

When this command is invoked:

1. **Initialize Security Audit**
   ```python
   audit_categories = [
       'authentication',
       'authorization',
       'input_validation',
       'data_protection',
       'api_security',
       'dependency_vulnerabilities',
       'configuration_security',
       'logging_monitoring',
       'session_management',
       'cryptography'
   ]
   
   findings = []
   ```

2. **Scan for Security Issues**

   ### Authentication Checks
   ```python
   def audit_authentication():
       checks = [
           'password_complexity_requirements',
           'multi_factor_authentication',
           'account_lockout_mechanisms',
           'password_reset_security',
           'credential_storage'
       ]
       
       # Search for auth-related files
       auth_files = glob("**/auth*", "**/login*", "**/password*")
       
       for file in auth_files:
           # Check for hardcoded credentials
           if contains_hardcoded_secrets(file):
               add_finding("CRITICAL", "Hardcoded credentials", file)
           
           # Check for weak password policies
           if has_weak_password_policy(file):
               add_finding("HIGH", "Weak password requirements", file)
   ```

   ### Input Validation
   ```python
   def audit_input_validation():
       # Check for SQL injection vulnerabilities
       sql_patterns = [
           r'query\s*\(\s*["\'].*\+.*["\']',  # String concatenation in queries
           r'exec\s*\(\s*["\'].*\%s.*["\']',   # Unparameterized queries
       ]
       
       # Check for XSS vulnerabilities
       xss_patterns = [
           r'innerHTML\s*=',                    # Direct HTML injection
           r'document\.write\(',                 # Unsafe document writes
           r'eval\(',                           # Code evaluation
       ]
       
       # Check for command injection
       cmd_patterns = [
           r'exec\s*\([^)]*\+',                # String concat in exec
           r'system\s*\([^)]*\$',              # Variable in system calls
       ]
   ```

   ### API Security
   ```python
   def audit_api_security():
       checks = [
           'rate_limiting',
           'api_authentication',
           'cors_configuration',
           'api_versioning',
           'input_sanitization'
       ]
       
       # Find API endpoints
       api_files = glob("**/api*", "**/routes*", "**/controllers*")
       
       for file in api_files:
           # Check for missing rate limiting
           if not has_rate_limiting(file):
               add_finding("MEDIUM", "No rate limiting", file)
           
           # Check for open CORS
           if has_permissive_cors(file):
               add_finding("HIGH", "Permissive CORS policy", file)
   ```

   ### Data Protection
   ```python
   def audit_data_protection():
       # Check for sensitive data exposure
       sensitive_patterns = [
           r'(api[_-]?key|apikey)',
           r'(secret|token|password)',
           r'(ssn|social.?security)',
           r'(credit.?card|cc.?number)'
       ]
       
       # Check encryption usage
       encryption_checks = [
           'tls_configuration',
           'data_at_rest_encryption',
           'key_management'
       ]
   ```

3. **Generate Security Report**
   ```markdown
   # Security Audit Report
   
   **Date**: [timestamp]
   **Total Issues Found**: [count]
   **Critical**: [N] | **High**: [N] | **Medium**: [N] | **Low**: [N]
   
   ## Executive Summary
   [Overview of security posture and main concerns]
   
   ## Critical Findings
   
   ### CRIT-001: [Issue Title]
   **Severity**: Critical
   **Category**: [Authentication/Input Validation/etc]
   **File(s)**: [affected files]
   **Line(s)**: [specific lines]
   
   **Description**:
   [Detailed description of the vulnerability]
   
   **Impact**:
   [Potential impact if exploited]
   
   **Remediation**:
   [Step-by-step fix with code examples]
   
   ```[language]
   // Before (vulnerable)
   [vulnerable code]
   
   // After (secure)
   [fixed code]
   ```
   
   ## Recommendations
   
   ### Immediate Actions
   1. [Critical fixes needed now]
   2. [High priority remediations]
   
   ### Short-term Improvements
   1. [Medium priority fixes]
   2. [Security enhancements]
   
   ### Long-term Strategy
   1. [Security architecture improvements]
   2. [Process and training recommendations]
   ```

4. **Report Results**

   Display audit results directly in the conversation. Only save to file if user explicitly requests:
   ```python
   # Display in conversation (default)
   display_audit_report(audit_report)

   # Save to file only if requested
   if user_requested_file_output:
       report_path = "~/.claude/temp/security-audit.md"
       save_report(report_path, audit_report)
       # Note: temp files are deleted after workflow
   ```

## Security Categories

### OWASP Top 10 Coverage
1. **Injection** - SQL, NoSQL, Command, LDAP
2. **Broken Authentication** - Weak passwords, session issues
3. **Sensitive Data Exposure** - Unencrypted data, weak crypto
4. **XML External Entities (XXE)** - XML parser issues
5. **Broken Access Control** - Authorization flaws
6. **Security Misconfiguration** - Default configs, verbose errors
7. **XSS** - Reflected, Stored, DOM-based
8. **Insecure Deserialization** - Object injection
9. **Using Components with Known Vulnerabilities** - Outdated deps
10. **Insufficient Logging & Monitoring** - Audit trail gaps

## Severity Definitions

### Critical
- Remote code execution
- Authentication bypass
- Hardcoded credentials
- Unencrypted sensitive data transmission

### High
- SQL injection
- Cross-site scripting (XSS)
- Broken authentication
- Sensitive data exposure

### Medium
- Missing rate limiting
- Weak password policies
- Permissive CORS
- Information disclosure

### Low
- Missing security headers
- Verbose error messages
- Outdated dependencies
- Code quality issues

## Integration with CI/CD

```yaml
# GitHub Actions example
- name: Security Audit
  run: |
    claude code --command "/security-audit"
    # Check exit code for security issues
```

## Examples

### Example Output
```bash
/security-audit

🔍 Starting Security Audit...
Scanning authentication systems...
Checking input validation...
Analyzing API security...
Reviewing data protection...

⚠️ Security Audit Complete

**Issues Found**: 12
🔴 Critical: 2 | 🟠 High: 3 | 🟡 Medium: 4 | 🟢 Low: 3

## Critical Issues Requiring Immediate Action:

1. **Hardcoded API Key** in config/api.js:42
   Fix: Move to environment variables
   
2. **SQL Injection** in controllers/user.js:156
   Fix: Use parameterized queries

Use `/secure-prompts` to validate any suspicious findings.
```

## Best Practices

1. **Run Regularly** - Weekly in development, before each release
2. **Fix Critical First** - Address critical/high issues immediately
3. **Track Progress** - Monitor security posture over time
4. **Automate Checks** - Integrate into CI/CD pipeline
5. **Review Dependencies** - Check for known vulnerabilities

## Configuration

```json
{
  "scan_depth": "comprehensive",
  "include_dependencies": true,
  "check_configurations": true,
  "owasp_version": "2021",
  "custom_rules": [],
  "exclude_paths": ["node_modules", "vendor", "test"]
}
```

---
*Comprehensive security analysis following industry best practices*
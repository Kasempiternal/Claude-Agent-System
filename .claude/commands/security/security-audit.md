# /security-audit

## Purpose
Perform a real security audit of the codebase using Claude's Grep and Glob tools to find actual vulnerabilities.

## Usage
```bash
/security-audit
```

## What This Command Actually Does

When `/security-audit` runs, Claude executes **real file scans** using Grep and Glob tools - not pseudocode.

---

## Phase 1: File Discovery

Use Glob to find security-relevant files:

```
Glob: **/auth*
Glob: **/login*
Glob: **/password*
Glob: **/.env*
Glob: **/secret*
Glob: **/config*
Glob: **/api*
Glob: **/*controller*
Glob: **/*service*
```

---

## Phase 2: Vulnerability Scanning

Use Grep to search for common vulnerability patterns:

### Hardcoded Secrets
```
Grep: (api[_-]?key|apikey)\s*[:=]\s*['"][^'"]+
Grep: (secret|token|password)\s*[:=]\s*['"][^'"]+
Grep: (aws_access_key|aws_secret)
Grep: Bearer\s+[A-Za-z0-9\-_]+
```

### SQL Injection
```
Grep: query\s*\(\s*['"`].*\+
Grep: execute\s*\(\s*['"`].*\+
Grep: raw\s*\(\s*['"`].*\$
Grep: (SELECT|INSERT|UPDATE|DELETE).*\+.*variable
```

### XSS Vulnerabilities
```
Grep: innerHTML\s*=
Grep: document\.write\(
Grep: dangerouslySetInnerHTML
Grep: \$\(.*\)\.html\(
Grep: v-html\s*=
```

### Command Injection
```
Grep: exec\s*\(.*\+
Grep: system\s*\(.*\$
Grep: shell_exec\s*\(
Grep: subprocess\..*shell\s*=\s*True
Grep: child_process\.exec\(
```

### Insecure Authentication
```
Grep: password.*plain
Grep: md5\s*\(.*password
Grep: sha1\s*\(.*password
Grep: NoAuth|no.?auth|skip.?auth
```

### CORS Issues
```
Grep: Access-Control-Allow-Origin.*\*
Grep: cors.*origin.*\*
Grep: AllowAllOrigins
```

---

## Phase 3: File Analysis

For each file flagged by Grep, Claude:

1. **Reads the file** using the Read tool
2. **Identifies the specific vulnerable line(s)**
3. **Assesses the severity** (Critical/High/Medium/Low)
4. **Provides remediation** with code example

---

## Phase 4: Report Generation

Display findings directly in conversation:

```
🔍 SECURITY AUDIT COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━

Files Scanned: [N]
Issues Found: [N]

🔴 Critical: [N]  🟠 High: [N]  🟡 Medium: [N]  🟢 Low: [N]

## Critical Issues

### CRIT-001: Hardcoded API Key
📁 File: src/config/api.js:42
⚠️ Issue: API key stored in source code
🔧 Fix: Move to environment variable

Before:
const API_KEY = "sk-abc123..."

After:
const API_KEY = process.env.API_KEY

---

### CRIT-002: SQL Injection
📁 File: src/db/users.js:87
⚠️ Issue: String concatenation in query
🔧 Fix: Use parameterized queries

Before:
db.query("SELECT * FROM users WHERE id = " + userId)

After:
db.query("SELECT * FROM users WHERE id = ?", [userId])

---

## High Issues
[Similar format...]

## Recommendations

1. **Immediate**: Fix all Critical and High issues
2. **Short-term**: Address Medium issues
3. **Long-term**: Implement security linting in CI
```

---

## Severity Definitions

| Severity | Definition | Examples |
|----------|------------|----------|
| **Critical** | Immediate exploitation risk | Hardcoded secrets, auth bypass, RCE |
| **High** | Serious vulnerability | SQL injection, XSS, broken auth |
| **Medium** | Moderate risk | Missing rate limiting, weak CORS |
| **Low** | Minor issues | Missing headers, verbose errors |

---

## What This Command Does NOT Do

- ❌ Does not use external tools (semgrep, ast-grep, etc.)
- ❌ Does not require any installation
- ❌ Does not run pseudocode or fake scans
- ❌ Does not make up findings

---

## Example Run

```bash
/security-audit

🔍 Starting Security Audit...

Phase 1: Discovering files...
  Found 23 security-relevant files

Phase 2: Scanning for vulnerabilities...
  Checking hardcoded secrets... 2 matches
  Checking SQL injection... 1 match
  Checking XSS... 0 matches
  Checking command injection... 0 matches

Phase 3: Analyzing findings...

🔍 SECURITY AUDIT COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━

Files Scanned: 23
Issues Found: 3

🔴 Critical: 1  🟠 High: 2  🟡 Medium: 0  🟢 Low: 0

[Detailed findings follow...]
```

---

## Integration

Works with:
- `/secure-prompts` - Validate suspicious patterns
- Post-execution review - Security check in review phase
- CI/CD - Can be run as part of pipeline

---

*Real scans. Real findings. Real fixes.*

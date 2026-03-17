# Scanner Result Format

Every scanner MUST wrap its output in this format. The report generator parses this structure.

---

## Scanner: [SAST | SCA | SECRETS | CONFIG]
## Scan Duration: [approximate time taken]
## Files Analyzed: [count]

### Summary

| Severity | Count |
|----------|-------|
| CRITICAL | N |
| HIGH     | N |
| MEDIUM   | N |
| LOW      | N |
| **Total** | **N** |

### Findings

[Individual findings using finding-format.md structure — each finding separated by `---`]

---

[FINDING-ID]: [Title]
...

---

[FINDING-ID]: [Title]
...

---

### Clean Checks

Files and patterns that were examined and found secure (this gives confidence in coverage):

- **Checked**: [pattern/area] — **Result**: No issues found
- **Checked**: [pattern/area] — **Result**: Mitigations in place ([describe])
- ...

### Scan Coverage

- **Files scanned**: [count] ([list key files or directories])
- **Files skipped** (and why):
  - `[file/pattern]` — [reason: binary, generated, vendor, test fixture, etc.]
- **Patterns checked**: [count of vulnerability patterns/rules evaluated]
- **Known limitations**:
  - [Any scope limitations — e.g., "did not analyze dynamically loaded modules"]
  - [Any pattern gaps — e.g., "custom sanitization functions may not be recognized"]

### Tool Recommendations

Complementary tools that would provide deeper analysis for this scan category:

- [Tool name]: [what it adds beyond this static scan]
- ...

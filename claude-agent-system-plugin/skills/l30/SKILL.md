---
name: l30
description: "Research any topic from the last 30 days across 5 free sources (Reddit, HN, DDG, Lobsters, GitHub). Deploys a parallel agent swarm to scrape, score, deduplicate, and generate a rich HTML dashboard. Zero API keys required."
model: sonnet
argument-hint: <topic to research, e.g. "llm compression techniques">
---

```
██╗      ██████╗  ██████╗
██║      ╚════██╗██╔═████╗
██║       █████╔╝██║██╔██║
██║       ╚═══██╗████╔╝██║
███████╗ ██████╔╝╚██████╔╝
╚══════╝ ╚═════╝  ╚═════╝

  Topic Research • Last 30 Days
        CAS v7.20.0
```

**MANDATORY**: Output the banner above verbatim as your very first message to the user, before any tool calls or other output.

You are entering L30 RESEARCH MODE. You deploy a parallel agent swarm that scrapes 5 free sources (Reddit, Hacker News, DuckDuckGo, Lobsters, GitHub) using Scrapling, scores and ranks the results, then generates a self-contained HTML dashboard.

## Your Role: Swarm Orchestrator

- Parse the user's topic from `$ARGUMENTS`
- Create a team and task graph with dependencies
- Spawn 5 parallel scraper agents (Wave 1)
- Spawn an intelligence agent to score/rank/deduplicate (Wave 2)
- Spawn a report compiler to generate the HTML dashboard (Wave 3)
- Show a summary and open the dashboard

---

## Phase 0: Prerequisites

### Step 1: Locate Skill Directory

Use `Glob("**/skills/l30/templates/dashboard.html")` to find the dashboard template. Extract the parent directory path (everything before `/templates/`). Store as `L30_SKILL_DIR`.

### Step 2: Verify Python Environment

Set:
```
VENV = /Users/izotz.cristobal/Multiverse/Izotz/l30/.venv/bin/python
```

Run `Bash("test -f /Users/izotz.cristobal/Multiverse/Izotz/l30/.venv/bin/python && echo OK")`.

- **If OK**: Proceed.
- **If NOT OK**: STOP. Tell the user:
  ```
  l30 Python environment not found. Install it:

  cd ~/Multiverse/Izotz/l30
  python3 -m venv .venv
  .venv/bin/pip install -e .
  ```
  Do NOT proceed.

---

## Phase 1: Parse Query & Setup

### Step 1: Parse Query

Extract the research topic from `$ARGUMENTS`.

- If `$ARGUMENTS` is empty or missing, use `AskUserQuestion` to ask: "What topic would you like to research from the last 30 days?"
- Store the topic as `QUERY`.

### Step 2: Set Variables

```
QUERY_SLUG = lowercase QUERY, spaces → underscores, remove non-alphanumeric except -_, truncate to 50 chars
DATE_PREFIX = YYYYMMDD_HHMMSS (current time)
RUN_DIR = /tmp/l30-${QUERY_SLUG}-$(date +%s)
OUTPUT_DIR = ~/Documents/l30/dashboards
OUTPUT_FILE = ${OUTPUT_DIR}/${DATE_PREFIX}_${QUERY_SLUG}.html
```

### Step 3: Create Directories

Run `Bash("mkdir -p ${RUN_DIR} ${OUTPUT_DIR}")`.

Display: `Researching: "${QUERY}" across 5 sources...`

---

## Phase 2: Create Team & Task Graph

### Step 1: Create Team

Use `TeamCreate` with:
- `team_name`: `"l30-${QUERY_SLUG}"`
- `description`: `"L30 research swarm for: ${QUERY}"`

### Step 2: Create All 8 Tasks

Use `TaskCreate` for each task. Store the returned task IDs.

| # | Subject | activeForm |
|---|---------|------------|
| 1 | Reddit scraping for "${QUERY}" | Scraping Reddit |
| 2 | HN scraping for "${QUERY}" | Scraping Hacker News |
| 3 | DDG scraping for "${QUERY}" | Scraping DuckDuckGo |
| 4 | Lobsters scraping for "${QUERY}" | Scraping Lobsters |
| 5 | GitHub scraping for "${QUERY}" | Scraping GitHub |
| 6 | Intelligence analysis & ranking | Analyzing and ranking results |
| 7 | Dashboard compilation | Building HTML dashboard |

### Step 3: Set Dependencies

Use `TaskUpdate` with `addBlockedBy`:
- Task 6: `addBlockedBy: [task1_id, task2_id, task3_id, task4_id, task5_id]`
- Task 7: `addBlockedBy: [task6_id]`

### Step 4: Pre-assign Wave 1 Tasks

Use `TaskUpdate` with `owner`:
- Task 1 → `owner: "reddit-scraper"`
- Task 2 → `owner: "hn-scraper"`
- Task 3 → `owner: "ddg-scraper"`
- Task 4 → `owner: "lobsters-scraper"`
- Task 5 → `owner: "github-scraper"`

---

## Teammate Prompt Preamble

Prepend this to EVERY teammate's prompt:

> You are `{TEAMMATE_NAME}` on team `l30-{QUERY_SLUG}`.
>
> **Team Protocol — follow these steps exactly:**
> 1. Run `TaskList` to find your assigned task (your name appears in the `owner` field)
> 2. Run `TaskGet` with your task ID to confirm your assignment
> 3. Set your task status to `in_progress` via `TaskUpdate`
> 4. Complete the work described below
> 5. Set your task status to `completed` via `TaskUpdate`
> 6. Send a brief summary to the team lead via `SendMessage` (type: "message", recipient: "lead", content: your summary, summary: "Completed [task subject]")
>
> If you encounter issues, message "lead" before proceeding.
>
> **Your assignment follows below.**

---

## Wave 1: Parallel Scraping (5 teammates)

Spawn all 5 teammates IN PARALLEL via `Agent` with `team_name: "l30-{QUERY_SLUG}"`. Each uses `subagent_type: "general-purpose"` and `model: "sonnet"`.

All scraper agents run the same pattern: a single Bash command that invokes the l30 Python scraper with Scrapling, then writes JSON results to `RUN_DIR`.

### Source Agent Template

Each agent's brief follows this pattern (replace `{SOURCE_MODULE}`, `{SOURCE_CLASS}`, `{SOURCE_NAME}`):

```
Run this exact Bash command (timeout 90s):

{VENV} -c "
import asyncio, json
from l30.sources.{SOURCE_MODULE} import {SOURCE_CLASS}
source = {SOURCE_CLASS}()
results = asyncio.run(source.search(query='{QUERY}', days=30, max_results=25))
data = [r.model_dump(mode='json') for r in results]
with open('{RUN_DIR}/{SOURCE_NAME}.json', 'w') as f:
    json.dump(data, f, default=str)
print(json.dumps({'source': '{SOURCE_NAME}', 'count': len(data)}))
"

After the command completes:
- If successful: Report the result count
- If error: Report the error message, write an empty array to {RUN_DIR}/{SOURCE_NAME}.json
```

### The 5 Agents

1. **`name: "reddit-scraper"`**
   - SOURCE_MODULE: `reddit`, SOURCE_CLASS: `RedditSource`, SOURCE_NAME: `reddit`
   - Brief: Preamble + "Scrape Reddit for '{QUERY}'. Uses Scrapling with Chrome impersonation for the JSON API, fetches top comments. " + Source Agent Template

2. **`name: "hn-scraper"`**
   - SOURCE_MODULE: `hackernews`, SOURCE_CLASS: `HackerNewsSource`, SOURCE_NAME: `hackernews`
   - Brief: Preamble + "Scrape Hacker News for '{QUERY}'. Uses Scrapling with Algolia API, fetches discussion comments. " + Source Agent Template

3. **`name: "ddg-scraper"`**
   - SOURCE_MODULE: `duckduckgo`, SOURCE_CLASS: `DuckDuckGoSource`, SOURCE_NAME: `duckduckgo`
   - Brief: Preamble + "Scrape DuckDuckGo for '{QUERY}'. Uses Scrapling to scrape DDG HTML search, extracts real URLs from redirect wrappers, filters junk domains. " + Source Agent Template

4. **`name: "lobsters-scraper"`**
   - SOURCE_MODULE: `lobsters`, SOURCE_CLASS: `LobstersSource`, SOURCE_NAME: `lobsters`
   - Brief: Preamble + "Scrape Lobsters for '{QUERY}'. Uses Scrapling for HTML parsing with CSS selectors. Lobsters is a small community — 0 results is normal for niche topics. " + Source Agent Template

5. **`name: "github-scraper"`**
   - SOURCE_MODULE: `github`, SOURCE_CLASS: `GitHubSource`, SOURCE_NAME: `github`
   - Brief: Preamble + "Scrape GitHub for '{QUERY}'. Uses Scrapling with GitHub REST API for rich metadata (descriptions, stars, language, topics). Falls back to HTML scraping if rate-limited. " + Source Agent Template

**→ Wait for all 5 teammates to send completion messages.**
**→ After all 5 complete, send `shutdown_request` (via `SendMessage`, type: "shutdown_request") to each Wave 1 teammate.**
**→ If any teammate hangs for 3+ minutes with no message, consider it failed and proceed.**

---

## Wave 2: Intelligence Analysis (1 teammate)

Pre-assign: `TaskUpdate(taskId: task6_id, owner: "intelligence-lead")`

Spawn: **`name: "intelligence-lead"`** | `model: "sonnet"` | `subagent_type: "general-purpose"`

Brief: Preamble + the following:

```
You are the intelligence analyst. Read all source result files and run the scoring/ranking pipeline.

Run this Bash command (timeout 60s):

{VENV} -c "
import json, glob, os, time
from datetime import datetime, timezone
from l30.models import SearchResult, ResearchReport, SourceStatus
from l30.scoring import full_pipeline

all_results = []
statuses = []
run_dir = '{RUN_DIR}'

for source_name in ['reddit', 'hackernews', 'duckduckgo', 'lobsters', 'github']:
    fpath = os.path.join(run_dir, f'{source_name}.json')
    count = 0
    error = ''
    try:
        with open(fpath) as f:
            items = json.load(f)
        results = [SearchResult(**item) for item in items]
        all_results.extend(results)
        count = len(results)
    except FileNotFoundError:
        error = 'Source file not found'
    except Exception as e:
        error = str(e)[:200]

    statuses.append(SourceStatus(
        name=source_name,
        status='done' if count > 0 else ('error' if error else 'done'),
        result_count=count,
        error=error,
    ).model_dump(mode='json'))

total_raw = len(all_results)
ranked = full_pipeline(all_results, '{QUERY}')

report = ResearchReport(
    query='{QUERY}',
    days=30,
    sources_used=[s['name'] for s in statuses if s['status'] == 'done' and s['result_count'] > 0],
    sources_failed=[s['name'] for s in statuses if s['status'] == 'error'],
    results=ranked,
    total_raw=total_raw,
    total_final=len(ranked),
    searched_at=datetime.now(timezone.utc),
).model_dump(mode='json')

output = json.dumps({'report': report, 'statuses': statuses}, default=str)
with open(os.path.join(run_dir, 'ranked.json'), 'w') as f:
    f.write(output)
print(f'Ranked: {len(ranked)} results from {total_raw} raw')
"

After the command completes, report the results count.
```

**→ Wait for completion. Send `shutdown_request`.**

---

## Wave 3: Dashboard Compilation (1 teammate)

Pre-assign: `TaskUpdate(taskId: task7_id, owner: "report-compiler")`

Spawn: **`name: "report-compiler"`** | `model: "sonnet"` | `subagent_type: "general-purpose"`

Brief: Preamble + the following:

```
You are the report compiler. Generate the HTML dashboard from the ranked results.

Steps:
1. Read the ranked data: Read the file at {RUN_DIR}/ranked.json
2. Read the dashboard template: Read the file at {L30_SKILL_DIR}/templates/dashboard.html
3. In the template, find the placeholder: /* REPORT_DATA_PLACEHOLDER */
4. Replace that placeholder with the FULL JSON content from ranked.json
   - The result should be: const REPORT_DATA = {"report": {...}, "statuses": [...]};
5. Write the final HTML to: {OUTPUT_FILE}
6. Open the dashboard: Run Bash("open {OUTPUT_FILE}")
7. Report the file path and result count
```

**→ Wait for completion. Send `shutdown_request`.**

---

## Phase 3: Summary & Cleanup

After Wave 3 completes:

1. Read `{RUN_DIR}/ranked.json` to extract summary stats
2. Display:

```
L30 RESEARCH COMPLETE

  Query: "{QUERY}"
  Period: Last 30 days
  Results: {total_raw} raw -> {total_final} after dedup

  Sources:
    {for each status: ✓ or ✗} {name}: {result_count} results

  Dashboard: {OUTPUT_FILE}
```

3. Delete the team: `TeamDelete` to clean up
4. Temp data retained at `{RUN_DIR}` — user can inspect or delete

---

## Error Handling

- **Wave 1 partial failure**: Continue with available sources. An empty JSON file means 0 results, not a crash.
- **Wave 2 failure**: Orchestrator reads the source JSON files directly, concatenates them, and writes a basic ranked.json without scoring.
- **Wave 3 failure**: Tell the user the data is at `{RUN_DIR}/ranked.json` and show the template path for manual compilation.
- **Timeouts**: If any teammate hangs for 3+ minutes, consider it failed. Send `shutdown_request`, proceed without its output.
- **Always** call `TeamDelete` at the end, even if some waves failed.
- **Always** show what succeeded and what failed.

---

## Critical Rules

1. **All scraping uses Scrapling** — the Python sources use `scrapling.fetchers.Fetcher` with Chrome impersonation
2. **One Bash call per agent** — each scraper runs a single Python command
3. **Shell-escape the query** — wrap in single quotes, escape any internal single quotes
4. **90s timeout** on scraper Bash calls, **60s** on intelligence and compiler
5. **Always generate the dashboard** even if some sources failed — partial results are valuable
6. **Open the file in browser** — the user expects visual output
7. **Self-contained HTML** — the dashboard works offline, no server needed
8. **All teammates use `subagent_type: "general-purpose"`** — required for team coordination tools

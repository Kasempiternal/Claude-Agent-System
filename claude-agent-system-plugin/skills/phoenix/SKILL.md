---
name: phoenix
description: "[BETA — macOS + Ghostty only] Reboot your Mac without losing your Claude Code sessions. Snapshots every running CLI session (working dir + session id), arms a one-shot login agent, and reboots; on next login each session reopens in its own Ghostty window, resumed via claude --resume. Use /phoenix restart for the full auto cycle, or snapshot | restore | arm | disarm | status. Use when you have many claude sessions open and need to restart/reboot the machine but dread reopening and resuming them all."
argument-hint: restart | snapshot | restore | arm | disarm | status
model: opus
---

```
██████╗ ██╗  ██╗ ██████╗ ███████╗███╗   ██╗██╗██╗  ██╗
██╔══██╗██║  ██║██╔═══██╗██╔════╝████╗  ██║██║╚██╗██╔╝
██████╔╝███████║██║   ██║█████╗  ██╔██╗ ██║██║ ╚███╔╝
██╔═══╝ ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║██║ ██╔██╗
██║     ██║  ██║╚██████╔╝███████╗██║ ╚████║██║██╔╝ ██╗
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝

        ◎ Reboot without losing a single session ◎
                       CAS v7.28.0
              ⚠ BETA — macOS + Ghostty only ⚠
```

**MANDATORY**: Output the banner above verbatim as your very first message, before any tool calls.

> ## ⚠ BETA — macOS + Ghostty only
>
> Newly shipped and validated against a real 15-session setup, but not yet battle-tested across
> machines. It **reopens sessions in Ghostty only** (the reopen step uses `ghostty -e`), and the
> auto-reboot needs macOS. If anything misbehaves: your sessions are armed independently of the
> reboot, so the safe path is `/phoenix snapshot` → `/phoenix arm` → reboot manually. Cancel a
> pending restore anytime with `/phoenix disarm`. Feedback: https://github.com/Kasempiternal/Claude-Agent-System/issues

Phoenix makes rebooting cost-free when you have many `claude` sessions open. It captures the
live session set, arms a **one-shot** login agent, and (optionally) reboots. On the next login,
every session reopens in its own **Ghostty** window, `cd`'d to its original directory and resumed
with `claude --resume <id>`.

## How it works (one moving part: a deterministic CLI)

All behavior lives in a single dependency-free Node script. The skill's only job is to run the
right subcommand and **print its stdout to the user verbatim**.

- **Detection** is from the OS, not a registry: `ps` finds the `claude` CLI process trees and
  `lsof` recovers each one's working directory plus the conversation transcript
  (`~/.claude/projects/<enc>/<uuid>.jsonl`) it holds open — the transcript basename is the
  session id. This correctly separates *multiple sessions sharing one directory* (each tree holds
  its own transcript open). The Electron desktop app and daemon "spare" processes are filtered out.
- **Restore** uses `open -na Ghostty --args -e zsh -lc "cd <dir> && exec claude --resume <id>"` —
  one new window per session. This is a launch, not Apple-Events automation, so it avoids the macOS
  Automation permission prompt.
- **State** lives at a stable path `~/.cas/phoenix/` (snapshot.json, ARMED flag, a copy of the
  script, restore.log). The login agent is `~/Library/LaunchAgents/com.cas.phoenix.restore.plist`.

## Subcommand routing

Treat the first word of `$ARGUMENTS` (default to `status` if empty, and confirm intent before any
destructive action):

| User typed | Run |
|---|---|
| `/phoenix restart` | `node "${CLAUDE_PLUGIN_ROOT}/skills/phoenix/scripts/phoenix.js" restart` |
| `/phoenix snapshot` | `node "${CLAUDE_PLUGIN_ROOT}/skills/phoenix/scripts/phoenix.js" snapshot` |
| `/phoenix restore` | `node "${CLAUDE_PLUGIN_ROOT}/skills/phoenix/scripts/phoenix.js" restore` |
| `/phoenix arm` | `node "${CLAUDE_PLUGIN_ROOT}/skills/phoenix/scripts/phoenix.js" arm` |
| `/phoenix disarm` | `node "${CLAUDE_PLUGIN_ROOT}/skills/phoenix/scripts/phoenix.js" disarm` |
| `/phoenix status` | `node "${CLAUDE_PLUGIN_ROOT}/skills/phoenix/scripts/phoenix.js" status` |

Useful flags: `restart --dry-run` (snapshot + arm, print the reboot command instead of rebooting);
`restore --dry-run` (print the exact launch commands without opening windows).

### What each does
- **`restart`** — the full auto path: `snapshot` → `arm` → 5-second abort countdown → reboot via
  `osascript … System Events restart`. After login the one-shot agent reopens everything, then
  removes itself. **This reboots the machine and ends the current session** — confirm with the user
  first, and tell them their sessions (including this one) will reappear after they log back in.
- **`snapshot`** — capture the current sessions to `~/.cas/phoenix/snapshot.json`. Non-destructive.
- **`arm` / `disarm`** — install / remove the one-shot login restore agent. `arm` does not reboot.
- **`restore`** — reopen everything from the snapshot now (also what the login agent runs). Avoid
  running this while the captured sessions are still live — it would open second windows on them.
- **`status`** — armed? snapshot age + captured sessions, agent installed?, recent restore log.

**Recommended manual flow** (if the user prefers to control the reboot): `/phoenix snapshot` →
`/phoenix arm` → reboot manually whenever ready → sessions auto-reopen on next login.

## Honest limitations (tell the user when relevant)

- **Ghostty only.** Restore opens Ghostty windows. If a session was running in a different terminal,
  it still reopens — just in Ghostty. Requires `Ghostty.app`; `snapshot` warns if it's missing.
- **The reboot may need permission.** The first `System Events` restart can prompt for Automation/
  Accessibility consent, and macOS may pause if an app has unsaved work. If the auto-reboot doesn't
  fire, sessions are already **armed** — just reboot manually and they reopen on next login.
- **Multiple sessions in one directory** are separated by which transcript each process holds open.
  A session that is completely idle with no held transcript falls back to "resume most recent in
  that directory" (`claude -c`), which can be ambiguous if several share the dir.
- **One-shot by design.** The agent fires once on the next login and deletes itself. Re-arm (or run
  `/phoenix restart`) for the next reboot. Cancel a pending restore anytime with `/phoenix disarm`.
- **Snapshots are point-in-time.** Sessions started after a `snapshot` won't be restored — re-run
  `snapshot` (or use `restart`, which snapshots automatically) right before rebooting.

## Reference

- Engine: `${CLAUDE_PLUGIN_ROOT}/skills/phoenix/scripts/phoenix.js`
- State: `~/.cas/phoenix/` (snapshot.json, snapshot.md, ARMED, phoenix.js copy, restore.log)
- Login agent: `~/Library/LaunchAgents/com.cas.phoenix.restore.plist`
- Feedback: https://github.com/Kasempiternal/Claude-Agent-System/issues

#!/usr/bin/env node
/**
 * /phoenix — snapshot all running Claude Code sessions, reboot, and reopen them.
 *
 * The problem this solves: dozens of long-lived `claude` sessions across Ghostty
 * windows make rebooting expensive (every window must be reopened, re-`cd`'d, and
 * resumed by hand). Phoenix captures the live session set, arms a one-shot login
 * agent, and on next login reopens each session in its own Ghostty window resumed
 * via `claude --resume <id>`.
 *
 * Subcommands:
 *   snapshot            detect running CLI sessions -> ~/.cas/phoenix/snapshot.json (+ .md)
 *   restart             snapshot + arm + reboot (the full-auto path)  [--dry-run]
 *   arm                 install the one-shot login restore agent (LaunchAgent + ARMED)
 *   restore             reopen every captured session in Ghostty      [--from-login] [--dry-run]
 *   disarm              remove the login restore agent + ARMED flag
 *   status              show armed state, snapshot age/contents, last restore log
 *
 * Design notes (grounded in empirical probing on macOS + Ghostty):
 *   - Sessions are detected from the OS, not a registry: `ps` finds `claude` CLI
 *     processes, `lsof` recovers each one's cwd AND the conversation transcript
 *     (~/.claude/projects/<enc>/<uuid>.jsonl) it holds open. The session id is the
 *     jsonl basename. This disambiguates multiple sessions sharing one directory —
 *     each process tree holds its own transcript open.
 *   - CLAUDE_CODE_SESSION_ID is NOT present in top-level session process envs (only
 *     in child tool/subagent processes), so it is deliberately not relied upon.
 *   - The Electron desktop app (/Applications/Claude.app) + helpers, and daemon
 *     "spare" pre-warm processes (cwd under cc-daemon/.../spare), are filtered out.
 *   - Reopen uses `open -na Ghostty --args -e zsh -lc "<cmd>"` — a LaunchServices
 *     launch (one new window per call), which avoids the Automation/Apple-Events
 *     TCC prompt that `osascript tell application` would trigger from a login agent.
 *
 * State lives at a STABLE absolute path (~/.cas/phoenix/), not project-relative,
 * because the login-time restore runs with no project cwd. `arm` copies this script
 * there so the LaunchAgent survives plugin version bumps. The script therefore must
 * stay dependency-free (only Node built-ins).
 *
 * Exits non-zero only on usage errors. Operational issues print a clear message and
 * exit 0 so the wrapping skill renders them cleanly.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawn, spawnSync } = require('child_process');

const GHOSTTY = 'Ghostty';
const LABEL = 'com.cas.phoenix.restore';

// --- paths (stable, home-based) ------------------------------------------

function baseDir() {
  return path.join(os.homedir(), '.cas', 'phoenix');
}

function paths() {
  const base = baseDir();
  return {
    base,
    snapshotJson: path.join(base, 'snapshot.json'),
    snapshotMd: path.join(base, 'snapshot.md'),
    armedFlag: path.join(base, 'ARMED'),
    scriptCopy: path.join(base, 'phoenix.js'),
    restoreLog: path.join(base, 'restore.log'),
    plist: path.join(os.homedir(), 'Library', 'LaunchAgents', `${LABEL}.plist`),
  };
}

// --- small io helpers -----------------------------------------------------

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err && err.code === 'ENOENT') return null;
    if (err instanceof SyntaxError) softError(`Cannot parse ${file} — not valid JSON.`);
    throw err;
  }
}

function writeJSON(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
}

function nowISO() {
  return new Date().toISOString();
}

function out(msg) {
  process.stdout.write(msg + '\n');
}

function usageError(msg) {
  process.stderr.write(`/phoenix: ${msg}\n`);
  process.stderr.write('Usage: /phoenix snapshot | restart | restore | arm | disarm | status\n');
  process.exit(2);
}

function softError(msg) {
  process.stderr.write(`${msg}\n`);
  process.exit(0);
}

function appendLog(line) {
  try {
    const { restoreLog } = paths();
    fs.mkdirSync(path.dirname(restoreLog), { recursive: true });
    fs.appendFileSync(restoreLog, `${nowISO()} ${line}\n`);
  } catch (_) { /* logging must never throw */ }
}

function sleepSec(sec) {
  // synchronous sleep without a busy loop, via /bin/sleep
  spawnSync('sleep', [String(sec)], { stdio: 'ignore' });
}

// Run an external program with an argument array (no shell -> no injection).
// Returns stdout; on non-zero exit/timeout returns whatever was captured (lsof
// exits non-zero when some fds are unreadable but still prints useful output).
function run(file, args, opts) {
  try {
    return execFileSync(file, args, Object.assign({ encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }, opts)).toString();
  } catch (err) {
    return (err && err.stdout) ? err.stdout.toString() : '';
  }
}

// --- session detection ----------------------------------------------------

// Claude Code stores transcripts at ~/.claude/projects/<enc>/<uuid>.jsonl where
// <enc> is the cwd with every '/' and '.' replaced by '-'.
function encodeCwd(cwd) {
  return cwd.replace(/[/.]/g, '-');
}

// Absolute path to the `claude` binary. Resolved at snapshot time (interactive
// context, PATH is good) and stored, because the login-time restore runs in a
// minimal-PATH launchd context where `claude` is NOT on PATH (it lives in
// ~/.local/bin, added only by ~/.zshrc, which a non-interactive `zsh -lc` does
// not source). Never rely on PATH for the restore launch.
function resolveClaudeBin() {
  const local = path.join(os.homedir(), '.local', 'bin', 'claude');
  if (fs.existsSync(local)) return local;
  const w = run('which', ['claude']).trim().split('\n')[0];
  if (w && fs.existsSync(w)) return w;
  return 'claude';
}

function isClaudeExec(exec) {
  if (/\/Applications\/Claude\.app/.test(exec)) return false;       // Electron desktop app
  if (/Claude Helper|chrome_crashpad|chrome-native-host/.test(exec)) return false;
  const first = exec.trim().split(/\s+/)[0] || '';
  return /\.local\/share\/claude\/versions\//.test(first)
      || /\.local\/bin\/claude$/.test(first)
      || first === 'claude'
      || /\/claude$/.test(first);
}

function isJunkCwd(cwd) {
  // daemon pre-warm spares and other non-conversation working dirs
  return !cwd || /\/cc-daemon[^/]*\//.test(cwd) || /\/spare(\/|$)/.test(cwd);
}

// ps -axww -o pid=,ppid=,command=  ->  [{pid, ppid, exec}]
function listProcs() {
  const text = run('ps', ['-axww', '-o', 'pid=,ppid=,command=']);
  const procs = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*(\d+)\s+(\d+)\s+(.*)$/);
    if (!m) continue;
    procs.push({ pid: m[1], ppid: m[2], exec: m[3] });
  }
  return procs;
}

// Parse `lsof -Fpn` output -> Map(pid -> [names]).
function parseLsofPN(text) {
  const map = new Map();
  let cur = null;
  for (const line of text.split('\n')) {
    if (line[0] === 'p') { cur = line.slice(1); map.set(cur, []); }
    else if (line[0] === 'n' && cur) { map.get(cur).push(line.slice(1)); }
  }
  return map;
}

function fileSizeMtime(file) {
  try { const st = fs.statSync(file); return { size: st.size, mtime: st.mtimeMs }; }
  catch (_) { return null; }
}

// Returns [{cwd, sessionId|null, pid}] — one entry per live session, deduped.
function gatherSessions() {
  const procs = listProcs();
  const claude = procs.filter(p => isClaudeExec(p.exec));
  const claudePids = new Set(claude.map(p => p.pid));

  // children index (across all procs) so we can walk each session's tree
  const childrenOf = new Map();
  for (const p of procs) {
    if (!childrenOf.has(p.ppid)) childrenOf.set(p.ppid, []);
    childrenOf.get(p.ppid).push(p.pid);
  }

  // roots = claude procs whose parent is not itself a claude proc
  const roots = claude.filter(p => !claudePids.has(p.ppid)).map(p => p.pid);

  // tree of claude pids under each root (root + claude descendants)
  function treeOf(rootPid) {
    const tree = [];
    const stack = [rootPid];
    const seen = new Set();
    while (stack.length) {
      const pid = stack.pop();
      if (seen.has(pid)) continue;
      seen.add(pid);
      if (claudePids.has(pid)) tree.push(pid);
      for (const c of (childrenOf.get(pid) || [])) stack.push(c);
    }
    return tree;
  }

  // one lsof call for all root cwds, one for all claude open files
  const cwdText = run('lsof', ['-w', '-a', '-d', 'cwd', '-p', roots.join(','), '-Fpn'], { timeout: 30000 });
  const cwdMap = parseLsofPN(cwdText); // pid -> [cwd]
  const openText = run('lsof', ['-w', '-p', claude.map(p => p.pid).join(','), '-Fpn'], { timeout: 40000 });
  const openMap = parseLsofPN(openText); // pid -> [open file names]

  const claimed = new Set(); // jsonl paths already assigned to a session
  const sessions = [];

  for (const rootPid of roots) {
    const cwd = (cwdMap.get(rootPid) || [])[0];
    if (isJunkCwd(cwd)) continue;
    const enc = encodeCwd(cwd);
    const projMarker = `/.claude/projects/${enc}/`;

    // open transcripts held by this session's tree, matching this cwd's project dir
    const tree = treeOf(rootPid);
    const candidates = [];
    for (const pid of tree) {
      for (const name of (openMap.get(pid) || [])) {
        if (name.includes(projMarker) && /\.jsonl$/.test(name) && !claimed.has(name)) {
          const meta = fileSizeMtime(name);
          if (meta) candidates.push({ name, ...meta });
        }
      }
    }

    let sessionId = null;
    if (candidates.length) {
      // main conversation = largest transcript (subagent transcripts are smaller),
      // newest-mtime as tiebreak
      candidates.sort((a, b) => (b.size - a.size) || (b.mtime - a.mtime));
      const pick = candidates[0];
      claimed.add(pick.name);
      sessionId = path.basename(pick.name, '.jsonl');
    } else {
      // fallback: newest unclaimed transcript in the project dir (no open handle found)
      const projDir = path.join(os.homedir(), '.claude', 'projects', enc);
      try {
        const files = fs.readdirSync(projDir)
          .filter(f => f.endsWith('.jsonl'))
          .map(f => ({ name: path.join(projDir, f), ...fileSizeMtime(path.join(projDir, f)) }))
          .filter(f => f.size != null && !claimed.has(f.name))
          .sort((a, b) => b.mtime - a.mtime);
        if (files.length) { claimed.add(files[0].name); sessionId = path.basename(files[0].name, '.jsonl'); }
      } catch (_) { /* no project dir -> cwd-only entry */ }
    }

    sessions.push({ cwd, sessionId, pid: rootPid });
  }

  // dedupe: same sessionId captured twice (e.g. launcher + reparented worker)
  const bySession = new Map();
  const cwdOnly = [];
  for (const s of sessions) {
    if (s.sessionId) {
      if (!bySession.has(s.sessionId)) bySession.set(s.sessionId, s);
    } else {
      cwdOnly.push(s);
    }
  }
  // for cwd-only entries, keep at most one per cwd that has no resolved session there
  const resolvedCwds = new Set([...bySession.values()].map(s => s.cwd));
  const seenCwd = new Set();
  const extraCwdOnly = [];
  for (const s of cwdOnly) {
    if (resolvedCwds.has(s.cwd) || seenCwd.has(s.cwd)) continue;
    seenCwd.add(s.cwd);
    extraCwdOnly.push(s);
  }

  return [...bySession.values(), ...extraCwdOnly];
}

// --- snapshot -------------------------------------------------------------

function cmdSnapshot() {
  const sessions = gatherSessions();
  const { snapshotJson, snapshotMd } = paths();

  const ghosttyBin = '/Applications/Ghostty.app/Contents/MacOS/ghostty';
  const data = {
    capturedAt: nowISO(),
    nodeBin: process.execPath,
    ghosttyBin: fs.existsSync(ghosttyBin) ? ghosttyBin : null,
    claudeBin: resolveClaudeBin(),
    sessions: sessions.map(s => ({ cwd: s.cwd, sessionId: s.sessionId })),
  };
  writeJSON(snapshotJson, data);

  // human-readable companion
  let md = `# Phoenix snapshot\n\n- Captured: ${data.capturedAt}\n- Sessions: ${sessions.length}\n\n`;
  for (const s of sessions) {
    md += `- \`${s.cwd}\`${s.sessionId ? ` — \`${s.sessionId}\`` : ' — (no id; will resume most recent)'}\n`;
  }
  fs.mkdirSync(path.dirname(snapshotMd), { recursive: true });
  fs.writeFileSync(snapshotMd, md);

  if (!sessions.length) {
    out('No running Claude Code sessions detected. Nothing to snapshot.');
    return;
  }

  out(`Captured ${sessions.length} session(s) -> ${snapshotJson}`);
  out('');
  for (const s of sessions) {
    const id = s.sessionId ? s.sessionId.slice(0, 8) : '(most-recent)';
    out(`  ${id}  ${s.cwd}`);
  }
  if (data.ghosttyBin == null) {
    out('');
    out('WARNING: Ghostty.app not found at the expected path — restore needs Ghostty.');
  }
}

// --- arm / disarm ---------------------------------------------------------

function plistContents(nodeBin, scriptPath) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${nodeBin}</string>
    <string>${scriptPath}</string>
    <string>restore</string>
    <string>--from-login</string>
  </array>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>${path.join(baseDir(), 'launchagent.out.log')}</string>
  <key>StandardErrorPath</key><string>${path.join(baseDir(), 'launchagent.err.log')}</string>
</dict>
</plist>
`;
}

function cmdArm() {
  const { base, plist, scriptCopy, armedFlag, snapshotJson } = paths();
  fs.mkdirSync(base, { recursive: true });

  // copy this script to the stable location so the agent survives plugin updates
  const self = path.resolve(__filename);
  if (path.resolve(scriptCopy) !== self) fs.copyFileSync(self, scriptCopy);

  fs.mkdirSync(path.dirname(plist), { recursive: true });
  fs.writeFileSync(plist, plistContents(process.execPath, scriptCopy));
  fs.writeFileSync(armedFlag, nowISO() + '\n');

  out(`Armed. One-shot restore agent installed at ${plist}`);
  out('It will fire once on next login and then disarm itself.');
  if (!fs.existsSync(snapshotJson)) {
    out('');
    out('NOTE: no snapshot exists yet — run /phoenix snapshot first (restart does this automatically).');
  }
}

function unloadAgent(plist) {
  // best-effort across launchctl variants; ignore failures
  const uid = process.getuid ? process.getuid() : null;
  if (uid != null) spawnSync('launchctl', ['bootout', `gui/${uid}/${LABEL}`], { stdio: 'ignore' });
  spawnSync('launchctl', ['unload', plist], { stdio: 'ignore' });
}

function cmdDisarm() {
  const { plist, armedFlag } = paths();
  unloadAgent(plist);
  let removed = false;
  if (fs.existsSync(plist)) { fs.unlinkSync(plist); removed = true; }
  if (fs.existsSync(armedFlag)) { fs.unlinkSync(armedFlag); removed = true; }
  out(removed ? 'Disarmed — login restore agent removed.' : 'Nothing to disarm.');
}

// --- restore --------------------------------------------------------------

function shq(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}

function buildLaunchCmd(session, claudeBin) {
  const bin = claudeBin || 'claude';
  const binDir = path.dirname(bin);
  const resume = session.sessionId
    ? `${shq(bin)} --resume ${session.sessionId}`
    : `${shq(bin)} -c`;
  // Ghostty runs this via `zsh -lc` — a NON-interactive login shell that does NOT
  // source ~/.zshrc, so at login `claude` may not be on PATH. Use the absolute
  // binary path AND prepend its dir to PATH (so tools claude itself shells out to
  // resolve). Then cd and hand off via exec.
  const pathExport = (binDir && binDir !== '.') ? `export PATH=${shq(binDir)}:"$PATH"; ` : '';
  return `${pathExport}cd ${shq(session.cwd)} && exec ${resume}`;
}

function launchSession(session, dryRun, claudeBin) {
  const script = buildLaunchCmd(session, claudeBin);
  const args = ['-na', GHOSTTY, '--args', '-e', 'zsh', '-lc', script];
  if (dryRun) { out(`open ${args.map(a => (/\s/.test(a) ? `"${a}"` : a)).join(' ')}`); return; }
  const child = spawn('open', args, { detached: true, stdio: 'ignore' });
  child.unref();
  appendLog(`launch ${session.sessionId || '(most-recent)'} ${session.cwd}`);
}

function cmdRestore(flags) {
  const fromLogin = flags.includes('--from-login');
  const dryRun = flags.includes('--dry-run');
  const { snapshotJson, armedFlag, plist } = paths();

  if (fromLogin && !fs.existsSync(armedFlag)) {
    // not armed -> this login already restored (or was never armed). Stay silent.
    process.exit(0);
  }

  // Disarm BEFORE doing anything else so a crash mid-restore (or an empty snapshot)
  // can never cause a respawn storm on the next login. Worst case: auto-restore
  // didn't finish -> the user reruns /phoenix restore manually. This runs on every
  // real fire, including the empty-snapshot case below.
  //
  // We only DELETE the plist + flag here — we deliberately do NOT `launchctl bootout`
  // ourselves: this code is usually running AS that agent, and booting it out could
  // SIGTERM us mid-restore (only some windows would open). Removing the plist file is
  // enough for one-shot — the already-running job finishes, and launchd won't load a
  // missing plist next login. (Explicit `disarm` does the full bootout.)
  if (!dryRun) {
    try { if (fs.existsSync(plist)) fs.unlinkSync(plist); } catch (_) {}
    try { if (fs.existsSync(armedFlag)) fs.unlinkSync(armedFlag); } catch (_) {}
  }

  const data = readJSON(snapshotJson);
  if (!data || !Array.isArray(data.sessions) || !data.sessions.length) {
    if (fromLogin) { appendLog('restore: no snapshot, nothing to do (disarmed)'); process.exit(0); }
    softError('No snapshot found. Run /phoenix snapshot (or /phoenix restart) first.');
  }
  if (!dryRun) appendLog(`restore start: ${data.sessions.length} session(s), fromLogin=${fromLogin}`);

  // at login, let WindowServer / Ghostty come up before spawning windows
  if (fromLogin && !dryRun) sleepSec(10);

  // claudeBin from the snapshot; fall back for older snapshots that predate it
  const localBin = path.join(os.homedir(), '.local', 'bin', 'claude');
  const claudeBin = data.claudeBin || (fs.existsSync(localBin) ? localBin : 'claude');

  let n = 0;
  for (const s of data.sessions) {
    if (!s.cwd) continue;
    launchSession(s, dryRun, claudeBin);
    n++;
    if (!dryRun && n < data.sessions.length) sleepSec(0.7); // stagger
  }

  if (dryRun) out(`\n(${n} session(s) — dry run, nothing launched)`);
  else out(`Reopened ${n} session(s) in Ghostty.`);
}

// --- restart (full auto) --------------------------------------------------

function cmdRestart(flags) {
  const dryRun = flags.includes('--dry-run');
  out('Phoenix restart — snapshotting sessions...');
  cmdSnapshot();
  out('');
  cmdArm();
  out('');

  if (dryRun) {
    out('DRY RUN — would now reboot with:');
    out(`  osascript -e 'tell application "System Events" to restart'`);
    out('Run without --dry-run to actually reboot.');
    return;
  }

  out('Rebooting in 5 seconds — press Ctrl-C to abort.');
  for (let i = 5; i >= 1; i--) { out(`  ${i}...`); sleepSec(1); }
  out('Restarting now. Sessions will reopen automatically after you log back in.');
  try {
    execFileSync('osascript', ['-e', 'tell application "System Events" to restart'], { stdio: 'ignore' });
  } catch (err) {
    out('');
    out('Could not trigger the restart automatically (macOS may need Automation');
    out('permission for System Events). Your sessions ARE armed — just reboot');
    out('manually and they will reopen on next login.');
  }
}

// --- status ---------------------------------------------------------------

function cmdStatus() {
  const { snapshotJson, armedFlag, plist, restoreLog } = paths();
  const armed = fs.existsSync(armedFlag);
  const hasPlist = fs.existsSync(plist);
  out(`Armed: ${armed ? 'YES (restore will fire on next login)' : 'no'}`);
  out(`Login agent installed: ${hasPlist ? plist : 'no'}`);

  const data = readJSON(snapshotJson);
  if (data && Array.isArray(data.sessions)) {
    out('');
    out(`Snapshot: ${data.sessions.length} session(s), captured ${data.capturedAt}`);
    for (const s of data.sessions) {
      out(`  ${s.sessionId ? s.sessionId.slice(0, 8) : '(most-recent)'}  ${s.cwd}`);
    }
  } else {
    out('Snapshot: none. Run /phoenix snapshot.');
  }

  try {
    const log = fs.readFileSync(restoreLog, 'utf8').trim().split('\n').slice(-5);
    if (log.length && log[0]) { out(''); out('Recent restore log:'); log.forEach(l => out(`  ${l}`)); }
  } catch (_) { /* no log yet */ }
}

// --- main -----------------------------------------------------------------

function main() {
  const [, , subcommand, ...rest] = process.argv;
  if (!subcommand) usageError('missing subcommand');
  switch (subcommand) {
    case 'snapshot': return cmdSnapshot();
    case 'arm':      return cmdArm();
    case 'disarm':   return cmdDisarm();
    case 'restore':  return cmdRestore(rest);
    case 'restart':  return cmdRestart(rest);
    case 'status':   return cmdStatus();
    default:         return usageError(`unknown subcommand: ${subcommand}`);
  }
}

main();

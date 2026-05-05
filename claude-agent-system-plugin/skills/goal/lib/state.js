/**
 * /goal — shared state helpers
 *
 * Used by both the skill-side CLI (scripts/goal-state.js) and the
 * Stop hook (hooks/goal-continuation.js). Keeping logic here prevents
 * the two callers from drifting on file paths or schema.
 */

const fs = require('fs');
const path = require('path');

const STATUSES = ['active', 'paused', 'achieved', 'abandoned', 'cleared'];
const TERMINAL_STATUSES = ['achieved', 'abandoned', 'cleared'];

function resolveProjectDir(hookInput) {
  return process.env.CLAUDE_PROJECT_DIR
    || (hookInput && hookInput.cwd)
    || process.env.PWD
    || process.cwd();
}

function paths(projectDir) {
  const dir = path.join(projectDir, '.cas', 'goals');
  return {
    dir,
    activeFile: path.join(dir, 'active.json'),
    runtimeFile: path.join(dir, '.runtime.json'),
    archiveDir: path.join(dir, 'archive'),
  };
}

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err && err.code === 'ENOENT') return null;
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

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'goal';
}

const TRANSCRIPT_TAIL_BYTES = 5 * 1024 * 1024;

function readTranscriptTail(transcriptPath) {
  if (!transcriptPath) return '';
  try {
    const stat = fs.statSync(transcriptPath);
    if (stat.size <= TRANSCRIPT_TAIL_BYTES) {
      return fs.readFileSync(transcriptPath, 'utf8');
    }
    const fd = fs.openSync(transcriptPath, 'r');
    try {
      const buf = Buffer.alloc(TRANSCRIPT_TAIL_BYTES);
      fs.readSync(fd, buf, 0, TRANSCRIPT_TAIL_BYTES, stat.size - TRANSCRIPT_TAIL_BYTES);
      const s = buf.toString('utf8');
      const nl = s.indexOf('\n');
      return nl >= 0 ? s.slice(nl + 1) : s;
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return '';
  }
}

function lastTurnHadNoToolCalls(transcriptPath) {
  const tail = readTranscriptTail(transcriptPath);
  if (!tail) return false;
  const lines = tail.split('\n').filter(l => l.trim().length);
  for (let i = lines.length - 1; i >= 0; i--) {
    let entry;
    try { entry = JSON.parse(lines[i]); } catch { continue; }
    const isAssistant =
      entry.role === 'assistant' ||
      entry.type === 'assistant' ||
      (entry.message && entry.message.role === 'assistant');
    if (!isAssistant) continue;

    const content =
      (entry.message && entry.message.content) ||
      entry.content ||
      [];
    if (!Array.isArray(content)) return false;
    const hasToolUse = content.some(b => b && (b.type === 'tool_use' || b.type === 'server_tool_use'));
    return !hasToolUse;
  }
  return false;
}

function newGoal({ objective, maxIterations, yieldEvery }) {
  return {
    objective: String(objective).trim(),
    status: 'active',
    iterations: 0,
    maxIterations: maxIterations,
    yieldEvery: yieldEvery,
    createdAt: nowISO(),
    updatedAt: nowISO(),
    history: [{ at: nowISO(), event: 'created' }],
  };
}

function appendHistory(state, event, reason) {
  const entry = { at: nowISO(), event };
  if (reason) entry.reason = reason;
  state.history = state.history || [];
  state.history.push(entry);
  state.updatedAt = entry.at;
}

function archive(projectDir, state) {
  const { activeFile, runtimeFile, archiveDir } = paths(projectDir);
  fs.mkdirSync(archiveDir, { recursive: true });
  if (state) {
    const ts = nowISO().replace(/[:.]/g, '-');
    const dest = path.join(archiveDir, `${ts}-${slug(state.objective)}.json`);
    fs.writeFileSync(dest, JSON.stringify(state, null, 2) + '\n');
  }
  for (const f of [activeFile, runtimeFile]) {
    try { fs.unlinkSync(f); } catch {}
  }
}

function statusLine(status) {
  switch (status) {
    case 'active':    return 'Pursuing goal';
    case 'paused':    return 'Goal paused (/goal resume)';
    case 'achieved':  return 'Goal achieved';
    case 'abandoned': return 'Goal abandoned';
    case 'cleared':   return 'Goal cleared';
    default:          return `Goal status: ${status}`;
  }
}

function commandRow(status) {
  if (status === 'active')          return 'Commands:     /goal pause, /goal clear';
  if (status === 'paused')          return 'Commands:     /goal resume, /goal clear';
  return                                   'Commands:     /goal clear';
}

function fmtDuration(state) {
  const start = Date.parse(state.createdAt);
  const end = Date.parse(state.updatedAt);
  if (!start || !end) return '-';
  const sec = Math.max(0, Math.round((end - start) / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatBanner(state) {
  if (!state) return 'No goal is currently set.';
  const lines = [
    statusLine(state.status),
    `Objective:    ${state.objective}`,
    `Status:       ${state.status}`,
    `Iteration:    ${state.iterations}/${state.maxIterations}`,
    `Time used:    ${fmtDuration(state)}`,
    commandRow(state.status),
  ];
  return lines.join('\n');
}

module.exports = {
  STATUSES,
  TERMINAL_STATUSES,
  resolveProjectDir,
  paths,
  readJSON,
  writeJSON,
  nowISO,
  slug,
  lastTurnHadNoToolCalls,
  newGoal,
  appendHistory,
  archive,
  formatBanner,
};

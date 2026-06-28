#!/usr/bin/env node
/**
 * /orchestrate — deterministic state CLI
 *
 * Subcommands:
 *   on                 set outputStyle -> "Orchestrator" in .claude/settings.local.json
 *                      (backs up the prior value so `off` can restore it)
 *   off                restore the prior outputStyle (or remove the key)
 *   seed <objective>   create .cas/plans/orchestrate-<slug>/ with objective.md + archive/
 *   status             show whether orchestrator mode is set + list workspaces/handoffs
 *
 * Honest about the platform limits:
 *   - Output styles are read once at session start; activation needs /clear or restart.
 *   - The exact outputStyle value for a PLUGIN-shipped style is undocumented; "Orchestrator"
 *     is the grounded inference (the `name:` frontmatter, not namespaced). If it doesn't
 *     engage, the user should pick it via /config, which writes the authoritative value.
 *
 * Exits non-zero only on usage errors. Operational issues print a clear message and exit 0
 * so the wrapping skill can show them cleanly.
 *
 * State:
 *   .claude/settings.local.json        the real Claude Code setting (preserved, key-merged)
 *   .cas/orchestrate/state.json        our bookkeeping { previousOutputStyle, activatedAt }
 *   .cas/plans/orchestrate-<slug>/     per-objective workspaces
 */

const fs = require('fs');
const path = require('path');

const STYLE_VALUE = 'Orchestrator';

function projectDir() {
  return process.env.CLAUDE_PROJECT_DIR
    || process.env.PWD
    || process.cwd();
}

function paths(dir) {
  return {
    settingsFile: path.join(dir, '.claude', 'settings.local.json'),
    stateFile: path.join(dir, '.cas', 'orchestrate', 'state.json'),
    plansDir: path.join(dir, '.cas', 'plans'),
  };
}

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err && err.code === 'ENOENT') return null;
    if (err instanceof SyntaxError) {
      softError(`Cannot parse ${file} — it is not valid JSON. Fix it by hand before re-running.`);
    }
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
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'session';
}

function usageError(msg) {
  process.stderr.write(`/orchestrate: ${msg}\n`);
  process.stderr.write('Usage: /orchestrate <objective> | on | off | status\n');
  process.exit(2);
}

function softError(msg) {
  process.stderr.write(`${msg}\n`);
  process.exit(0);
}

function out(msg) {
  process.stdout.write(msg + '\n');
}

// --- on -------------------------------------------------------------------

function cmdOn() {
  const dir = projectDir();
  const { settingsFile, stateFile } = paths(dir);

  const settings = readJSON(settingsFile) || {};
  const current = settings.outputStyle;

  if (current === STYLE_VALUE) {
    out('Orchestrator mode is already set as the active output style.');
    out('If it is not in effect this session, run /clear or start a new session.');
    return;
  }

  // Record the prior value so `off` can restore it. Don't clobber an existing backup.
  const state = readJSON(stateFile) || {};
  if (state.previousOutputStyle === undefined) {
    state.previousOutputStyle = current === undefined ? null : current;
  }
  state.activatedAt = nowISO();
  writeJSON(stateFile, state);

  settings.outputStyle = STYLE_VALUE;
  writeJSON(settingsFile, settings);

  out(`Set outputStyle = "${STYLE_VALUE}" in .claude/settings.local.json.`);
  out('');
  out('IMPORTANT — this takes effect only on a fresh session:');
  out('  → Run /clear (or restart Claude Code) to enter Orchestrator mode now.');
  out('');
  out('If Orchestrator mode does not engage after /clear, the plugin-style value may differ.');
  out('Pick it the authoritative way: /config → Output style → Orchestrator, then /clear.');
}

// --- off ------------------------------------------------------------------

function cmdOff() {
  const dir = projectDir();
  const { settingsFile, stateFile } = paths(dir);

  const settings = readJSON(settingsFile);
  const state = readJSON(stateFile) || {};

  if (!settings || settings.outputStyle !== STYLE_VALUE) {
    out('Orchestrator is not the active output style — nothing to turn off.');
    return;
  }

  const prev = state.previousOutputStyle;
  if (prev === null || prev === undefined) {
    delete settings.outputStyle;
  } else {
    settings.outputStyle = prev;
  }
  writeJSON(settingsFile, settings);

  // Clear our backup so a future `on` records a fresh baseline.
  delete state.previousOutputStyle;
  delete state.activatedAt;
  writeJSON(stateFile, state);

  out(prev ? `Restored outputStyle = "${prev}".` : 'Removed the orchestrator outputStyle.');
  out('Run /clear or start a new session for it to take effect.');
}

// --- seed -----------------------------------------------------------------

function cmdSeed(args) {
  const objective = args.join(' ').trim();
  if (!objective) usageError('an objective is required: /orchestrate <objective>');
  if (objective.length > 4000) usageError('objective must be at most 4000 characters');

  const dir = projectDir();
  const { plansDir } = paths(dir);
  const wsName = `orchestrate-${slug(objective)}`;
  const wsDir = path.join(plansDir, wsName);
  fs.mkdirSync(path.join(wsDir, 'archive'), { recursive: true });

  const objectiveFile = path.join(wsDir, 'objective.md');
  if (!fs.existsSync(objectiveFile)) {
    fs.writeFileSync(objectiveFile,
      `# Objective\n\n${objective}\n\n- **Created:** ${nowISO()}\n\n## Decisions\n\n## Open threads\n`);
  }

  out(`Workspace: .cas/plans/${wsName}/`);
  out(`Objective recorded in .cas/plans/${wsName}/objective.md`);
  out('Living handoffs go here as handoff-<agent>.md; archived to archive/ on termination.');
}

// --- status ---------------------------------------------------------------

function listHandoffs(wsDir) {
  let living = [];
  let archived = [];
  try {
    living = fs.readdirSync(wsDir).filter(f => /^handoff-.*\.md$/.test(f));
  } catch (_) { /* none */ }
  try {
    archived = fs.readdirSync(path.join(wsDir, 'archive')).filter(f => /^handoff-.*\.md$/.test(f));
  } catch (_) { /* none */ }
  return { living, archived };
}

function cmdStatus() {
  const dir = projectDir();
  const { settingsFile, plansDir } = paths(dir);

  const settings = readJSON(settingsFile) || {};
  const active = settings.outputStyle === STYLE_VALUE;
  out(`Output style setting: ${settings.outputStyle ? `"${settings.outputStyle}"` : '(default)'}`);
  out(`Orchestrator mode set: ${active ? 'YES (effective after /clear if not already)' : 'no'}`);
  out('');

  let workspaces = [];
  try {
    workspaces = fs.readdirSync(plansDir).filter(f => f.startsWith('orchestrate-'));
  } catch (_) { /* no plans dir */ }

  if (!workspaces.length) {
    out('No orchestrate workspaces yet. Start one with /orchestrate <objective>.');
    return;
  }

  out('Workspaces:');
  for (const ws of workspaces) {
    const { living, archived } = listHandoffs(path.join(plansDir, ws));
    out(`  .cas/plans/${ws}/`);
    out(`    living handoffs (active threads): ${living.length ? living.join(', ') : 'none'}`);
    out(`    archived handoffs (closed):       ${archived.length ? archived.join(', ') : 'none'}`);
  }
}

// --- main -----------------------------------------------------------------

function main() {
  const [, , subcommand, ...rest] = process.argv;
  if (!subcommand) usageError('missing subcommand or objective');

  switch (subcommand) {
    case 'on':     return cmdOn();
    case 'off':    return cmdOff();
    case 'status': return cmdStatus();
    case 'seed':   return cmdSeed(rest);
    default:
      // Anything else is treated as the objective for `seed`.
      return cmdSeed([subcommand, ...rest]);
  }
}

main();

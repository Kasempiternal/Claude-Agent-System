# Recovery Procedures

When things go wrong in a multi-agent swarm, follow these procedures instead of abandoning work.

## RP-1: Stuck Agent Replacement

**Detection signals**:
- Agent's task is still `in_progress` but no completion message received
- Agent has been idle for an extended period with no output
- Agent reported an error but didn't mark task as completed

**Procedure**:
1. Check the agent's task status via TaskList
2. If stuck: spawn a replacement agent with name `{original-name}-r` (e.g., `impl-task1-stream-a-r`)
3. Provide the replacement with:
   - The original agent's mission and file list
   - Note: "You are replacing a stuck agent. Check the current file state before making changes."
4. Mark the original agent's task as `in_progress` (the replacement inherits it)
5. Send shutdown_request to the stuck agent

**Key rule**: Don't wait indefinitely. If an agent hasn't responded after a reasonable period, replace it.

## RP-2: Partial Rollback (Verification Failure)

**Detection signals**:
- Verifier reports FAIL with specific failing tasks
- Some tasks in the wave passed, others failed

**Procedure**:
1. Identify which tasks failed from the verifier report
2. Do NOT revert passing tasks — their changes are valid
3. Spawn targeted fix agents with:
   - The specific failure context (error messages, failing tests)
   - The files owned by the failed task
   - Name: `fix-iter{I}-w{W}-{letter}` or `fix-task{T}-{letter}`
4. After fixes, re-run verification for the failed tasks only
5. If fixes fail twice: escalate to the next iteration (Legion) or flag for user (Hydra)

**Key rule**: Surgical fixes, not full rollbacks. Preserve passing work.

## RP-3: Budget Overrun

**Detection signals**:
- Agent count approaching limits (20+ in a single wave)
- Multiple waves spawning more agents than planned
- Orchestrator context growing rapidly

**Procedure**:
1. Pause before launching the next wave
2. Assess: does adding more agents actually reduce the critical path?
3. Options (in priority order):
   a. Merge agents that operate on related files
   b. Descope P2/P3 tasks to future iterations
   c. Reduce wave parallelism (more sequential, fewer agents)
4. Update the plan to reflect reduced scope

**Key rule**: More agents != faster completion. Each agent adds coordination overhead.

## RP-4: Context Pressure

**Detection signals**:
- Iteration count > 3 (Legion)
- Total agents spawned > 20 across all iterations
- Iteration log > 50K tokens cumulative
- Orchestrator starting to lose track of prior decisions

**Procedure**:
1. Enter CONSERVATION MODE — announce: `CONTEXT PRESSURE: entering conservation mode`
2. Compress iteration logs to bare minimum (~100 tokens per iteration)
3. Delegate ALL reading to sub-agents — orchestrator should not read files directly
4. Agent self-reporting: each agent includes a 1-line summary with their completion message
5. Prefer fewer, larger agents over many small ones
6. Consider stopping early if P1 tasks are complete (Legion: trigger completion assessment)

**Key rule**: Context is a finite resource. When pressure is high, trade parallelism for simplicity.

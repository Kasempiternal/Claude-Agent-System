# Multi-Agent Anti-Patterns

These are the most common failure modes in multi-agent swarms. Analysts MUST check for these during plan validation. Violation of any anti-pattern should be fixed before launching implementation agents.

## AP-1: Coordinator Implements Code

**Symptom**: The orchestrator (Hydra/Legion CEO) writes code directly instead of delegating.
**Fix**: All code changes MUST go through impl agents. The orchestrator delegates via Task tool only.

## AP-2: Multi-Agent for Sequential Work

**Symptom**: Two agents in the same wave where Agent B depends on Agent A's output.
**Fix**: Merge into one agent, or move Agent B to the next wave.

## AP-3: Agents Without Critical-Path Reduction

**Symptom**: Adding an agent that doesn't reduce total execution time (its work is a subset of another agent's scope).
**Fix**: Merge the redundant agent into its parent, or remove it entirely.

## AP-4: Scope Drift

**Symptom**: An agent discovers unplanned work and implements it on the spot.
**Fix**: Unplanned work becomes a NEW task for a future wave/iteration. Report it, don't implement it.

## AP-5: Execution Without Risk Classification

**Symptom**: Tasks enter implementation without a risk tier assigned.
**Fix**: Every task MUST have a tier (T0-T3) before wave launch. Analyst assigns during synthesis.

## AP-6: Multiple Agents Editing Same File

**Symptom**: Two agents in the same wave both modify the same file.
**Fix**: Reassign to one agent, or split to sequential waves. File ownership is exclusive per wave.
**Exception**: RP-2 fix agents are exempt within the recovery wave since they operate sequentially by definition (only one fix agent per file).

## Validation Checklist

Before launching any wave, the analyst should verify:
- [ ] No wave-internal sequential dependencies (AP-2)
- [ ] Every agent reduces the critical path (AP-3)
- [ ] No file overlap within a wave (AP-6)
- [ ] All tasks have risk tiers assigned (AP-5)

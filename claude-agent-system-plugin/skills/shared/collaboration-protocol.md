# Collaboration Protocol

## The 3 Rules

These rules apply to all skills using the collaboration mailbox system (Siege, Hydra).

### Rule 1: Self-Contained Spawn Prompts

Every teammate gets everything inline:
- Role and scope
- Shared file paths
- Inbox addresses of ALL other teammates
- All context needed to start immediately

Never say "read context file for details" — put it in the prompt.

### Rule 2: Defined Communication Vocabulary

ALL teammates use this shared message schema when writing to inboxes:

```json
{ "type": "interface_proposal|broadcast|challenge|ack|blocker|sync",
  "from": "agent-name",
  "priority": "HIGH|NORMAL",
  "affects": ["teammate-1", "teammate-2"],
  "content": "..." }
```

Append messages as one JSON object per line to the target's `.jsonl` inbox file.

### Rule 3: Coordination as Success Metric

A worker that completes tasks without sending any inter-agent messages has FAILED the collaboration requirement, regardless of code quality. You MUST communicate.

---

## Protocol 1: Mandatory Pre-Coding Contract Exchange

Before ANY implementation, force interface negotiation:

```
Step 1: Read task assignment
Step 2: Identify every interface you produce or consume
Step 3: Broadcast interface_proposal to ALL teammate inboxes
Step 4: Read your inbox. Negotiate conflicts via messages BEFORE coding.
Step 5: Only begin implementation after interfaces are agreed (or no conflicts after 1 read cycle).

RULE: You MUST NOT write code that crosses a boundary with another
teammate until that boundary is explicitly agreed in messages.
```

## Protocol 2: Broadcast-on-Discovery

When a teammate discovers ANYTHING that affects others, they MUST message ALL teammates BEFORE continuing:
- Constraints that change shared interfaces
- Bugs in files another agent owns
- Missing dependencies or packages
- Assumptions that others might have made differently
- File conflicts

Message type: `broadcast` with priority `HIGH` if it blocks others.

## Protocol 3: Sync Checkpoints (Mandatory Inbox Reads)

Teammates MUST read their inbox and process messages at these points:
- After completing each task from the task list
- Before modifying any shared file
- Before marking a task as DONE
- When blocked or when finding a blocker

At each checkpoint: read inbox -> process messages -> reply if needed -> update task list -> proceed.

HIGH priority messages STOP current work immediately.

## Protocol 4: Scoped Context Loading

Each teammate gets explicit file ownership and scope:

```
Your scope: {scope_dirs}
Files you MAY modify: ONLY files under {owned_dirs}
Files you MAY READ: anything
Files you MUST NOT TOUCH: {forbidden_dirs}

Your inbox: .claude/plans/{slug}/mailboxes/{your-name}.jsonl
Other inboxes: {list of all other teammate inbox paths}
```

## Protocol 5: Adversarial Verification (Two-Skeptic Debate)

Instead of one verifier, TWO skeptics debate:

```
SKEPTIC-A: Find everything that fails. Write findings to verify-A.md.
           Then read SKEPTIC-B's inbox. If B found something you missed,
           acknowledge. If B claims something passes that you think fails,
           CHALLENGE with evidence (run the test yourself).

SKEPTIC-B: Same, independently. Then read SKEPTIC-A's findings and debate.

Final verdict requires BOTH to agree.
If they disagree -> escalate to orchestrator with both positions.
Do NOT force consensus.
```

# Message Schema

## Shared Message Vocabulary

All inter-agent communication in the collaboration mailbox system uses JSONL (one JSON object per line) written to inbox files at `.claude/plans/{slug}/mailboxes/{agent-name}.jsonl`.

## Message Format

```json
{
  "type": "<message_type>",
  "from": "<sender-agent-name>",
  "priority": "HIGH|NORMAL",
  "affects": ["<teammate-1>", "<teammate-2>"],
  "content": "<message body>"
}
```

## Message Types

### `interface_proposal`
Sent before coding begins. Proposes an interface contract (function signatures, data shapes, API endpoints) that crosses module boundaries.

```json
{"type":"interface_proposal","from":"impl-a","priority":"NORMAL","affects":["impl-b","tests"],"content":"UserService.getById(id: string): Promise<User | null> — I will export this from src/services/user.ts"}
```

### `broadcast`
Sent when discovering something that affects other teammates. Must be sent BEFORE continuing work.

```json
{"type":"broadcast","from":"impl-a","priority":"HIGH","affects":["impl-b","impl-c","tests"],"content":"Found that the database schema uses UUID not integer IDs — all foreign key references must use string type"}
```

### `challenge`
Sent when disagreeing with another teammate's proposal or finding. Must include evidence.

```json
{"type":"challenge","from":"impl-b","priority":"HIGH","affects":["impl-a"],"content":"Your UserService.getById should return User (not null) — the caller already validates existence. Throwing NotFoundError is better for our error handling pattern."}
```

### `ack`
Acknowledges receipt and agreement with a proposal or broadcast.

```json
{"type":"ack","from":"tests","priority":"NORMAL","affects":["impl-a"],"content":"ACK interface_proposal for UserService.getById — will write tests against Promise<User | null> signature"}
```

### `blocker`
Signals that work cannot proceed. Requires immediate attention from the affected teammates.

```json
{"type":"blocker","from":"impl-b","priority":"HIGH","affects":["architect","impl-a"],"content":"Cannot implement PaymentService — requires AuthService token refresh which impl-a hasn't exposed yet"}
```

### `sync`
General status update at a sync checkpoint. Sent after completing a task or reaching a milestone.

```json
{"type":"sync","from":"impl-a","priority":"NORMAL","affects":["tests","impl-b"],"content":"Completed UserService with all CRUD methods. Exported types at src/types/user.ts. Tests teammate: mock data shape is { id: string, name: string, email: string }"}
```

## Reading Inbox

To read your inbox:
1. Read your `.jsonl` file (each line is one JSON message)
2. Process HIGH priority messages first
3. Reply to proposals/challenges that affect your work
4. Clear or mark processed (append a `sync` message acknowledging processed messages)

## Writing to Inboxes

To send a message to teammate `impl-b`:
1. Construct the JSON message object
2. Append it as a single line to `.claude/plans/{slug}/mailboxes/impl-b.jsonl`
3. If the file doesn't exist, create it

## Message Count Tracking

At the end of your work, report your message counts:
```
MESSAGES SENT: {count}
MESSAGES RECEIVED: {count}
INTERFACE PROPOSALS: {count}
```



# Nool ticket handoff demo

A small, dependency-free client demo showing one task continued across two coding-agent sessions. Agent A implements backend priority filtering and records the client's decisions in Nool. Agent B starts fresh, retrieves that state, and completes the interface and URL behavior.

## Run the completed app

```sh
npm test
npm run verify:handoff
npm start
```

Open `http://127.0.0.1:4173`. Try a search, select a priority, refresh the page, and copy the URL into another tab.

## Demo checkpoints

- `demo-baseline` — the original board has search but no priority feature.
- `demo-agent-a` — backend filtering and tests are complete; the dropdown and URL state are still missing. Nool contains the clarification and remaining work.
- `demo-complete` — the finished feature and verified handoff.

The checkpoints are tags inside this repository. Nool also maintains local ledger state, so a Git worktree at a tag is insufficient for the live handoff. Create a fresh, self-contained agent-A workspace with the tested preparation command:

```sh
npm run demo:prepare -- /tmp/nool-agent-a
npm run demo:verify-prepared -- /tmp/nool-agent-a
```

The preparation command refuses to overwrite an existing destination. It exports the agent-A code, initializes a new Nool ledger, creates and starts the task, and records the client decisions. Do not give the fresh agent the old conversation. Give it the prompt in `demo/agent-b-prompt.md` from the completed repository.

See [demo/runbook.md](demo/runbook.md) for the ten-minute presentation flow and reset instructions.

## What the demo proves

It proves that this repository's goal, acceptance criteria, decisions, partial implementation, and remaining work can be recovered in a fresh session using the checked-in Nool state. It does not claim that a model's hidden internal state or whole chat transcript is transferred.

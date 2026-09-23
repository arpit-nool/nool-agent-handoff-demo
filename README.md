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

The checkpoints are tags inside this repository. The safest rehearsal setup is a separate worktree:

```sh
git worktree add /tmp/nool-agent-a demo-agent-a
cd /tmp/nool-agent-a
nool context "continue ticket priority filter" --scope priority-filter --budget 1200 --compact
nool task show --id 3169a2b2 --compact
```

Do not give the fresh agent the old conversation. Give it the prompt in `demo/agent-b-prompt.md` from the completed repository, replacing nothing: the task identifier is real and already recorded.

See [demo/runbook.md](demo/runbook.md) for the ten-minute presentation flow and reset instructions.

## What the demo proves

It proves that this repository's goal, acceptance criteria, decisions, partial implementation, and remaining work can be recovered in a fresh session using the checked-in Nool state. It does not claim that a model's hidden internal state or whole chat transcript is transferred.

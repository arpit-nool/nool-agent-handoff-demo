# How to demonstrate Nool with this project

This is a ten-minute client demo of state preservation across agent sessions. The browser app is the visible product; Nool is the durable task, decision, and evidence layer behind the handoff.

## Prepare the starting point

Run these commands from `ticket-handoff-demo`:

```sh
npm run demo:prepare -- /tmp/nool-ticket-handoff-live
npm run demo:verify-prepared -- /tmp/nool-ticket-handoff-live
```

The preparation command refuses to overwrite an existing directory. Choose a new empty path if it fails. It creates the agent-A state, initializes Nool, creates and starts the handoff task, records the client clarification, and starts the task. Verification confirms the app has six passing tests and the task is still `InProgress`.

## Demonstrate agent A's state

Open the prepared directory in the first coding-agent session. Run:

```sh
npm test
nool task list --tag handoff --compact
nool findings --all --scope priority-filter --json
nool context "continue ticket priority filter" --scope priority-filter --budget 1200 --compact
```

Point out the facts Nool retrieves:

- The task is to add priority filtering to the ticket board.
- Search and priority must combine with AND.
- All priorities is the default.
- A copied or refreshed URL must preserve both selections.
- Agent A finished backend filtering and its tests.
- The selector, URL synchronization, and final acceptance checks remain.

Do not paste those decisions into the next agent's prompt. They should come from Nool.

## Demonstrate the fresh agent

End the first agent session. Start a second session in the same prepared directory and open `demo/agent-b-prompt.md`. The prompt deliberately names the thread, not the task ID or client clarification. The second agent should retrieve context first, explain what it found, and only then edit.

The second agent implements three visible behaviors:

1. A priority selector with High, Medium, Low, and All priorities.
2. Search and priority combined in one API request.
3. Both choices encoded in the URL so refresh and copy/paste preserve state.

The client can watch the second agent retrieve context before it writes code. That is the product moment. The app is the small, understandable task used to make that moment visible.

## Verify the result with the client

Run:

```sh
npm test
npm start
```

Open `http://127.0.0.1:4173` and demonstrate this sequence:

1. Search for `email` and choose `High priority`; one ticket remains.
2. Refresh the page; both controls remain selected.
3. Copy the URL into a new tab; the same result remains.
4. Choose `All priorities`; the search remains and the priority restriction disappears.

The app uses synthetic ticket data. It does not pretend to prove a production-scale improvement. This run establishes that a fresh session can recover durable task context and complete the agreed feature.

## Optional prepared fallback

If live generation is too slow during a client call, say so clearly and run:

```sh
npm run demo:rehearse-completion -- /tmp/nool-ticket-handoff-live
```

This applies the checked-in reference implementation, runs all tests, proposes and solidifies the change through Nool, reviews the criteria, and records the task as `VerifiedDone`. It is a recovery path, not a substitute for showing fresh-agent retrieval.

## What to ask the client

Close with three questions:

- Which requirements do your agents repeatedly lose during handoffs?
- What evidence would make continuity valuable to your team?
- Would you evaluate this against your current notes and handoff process on a small task cohort?

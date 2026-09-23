# Presenter runbook

## Before the client call

From the completed repository, verify both the application and the stored handoff:

```sh
npm test
npm run verify:handoff
```

Prepare two worktrees outside the repository so the three checkpoints remain untouched:

```sh
git worktree add /tmp/nool-demo-baseline demo-baseline
git worktree add /tmp/nool-demo-agent-a demo-agent-a
```

If either destination already exists, choose a new empty directory. Do not delete an existing worktree during a client call.

## Ten-minute flow

1. **Baseline (1 minute):** In `/tmp/nool-demo-baseline`, run the app. Search works; there is no priority selector.
2. **Interruption point (2 minutes):** Open `/tmp/nool-demo-agent-a`. Show that backend priority tests pass and the UI is unfinished.
3. **Fresh retrieval (2 minutes):** Start a fresh coding-agent session in the agent-A worktree and paste only `demo/agent-b-prompt.md` from the completed repository.
4. **Inspect the evidence (1 minute):** The new agent should retrieve task `3169a2b2`, the scoped finding, and the reasoning note. It should state that search and priority combine with AND, All is the default, URL state must persist, backend work is complete, and frontend work remains.
5. **Complete the feature (2 minutes):** Let the agent implement the selector and URL synchronization. Use the completed repository as the recovery checkpoint if generation runs long; say explicitly when you switch to it.
6. **Acceptance (2 minutes):** Run the tests. Select High, combine it with a search, refresh, and open the copied URL in another tab.

## Direct retrieval commands

```sh
nool context "continue ticket priority filter" --scope priority-filter --budget 1200 --compact
nool findings --all --scope priority-filter --json
nool task show --id 3169a2b2 --compact
```

Expected recoverable facts:

- Goal: add priority filtering to the existing ticket board.
- Product behavior: search and priority combine with AND.
- Default: All priorities.
- URL behavior: search and priority survive refresh/copy.
- Completed by agent A: backend filtering and tests.
- Remaining for agent B: selector, URL synchronization, and final acceptance checks.

## Client-facing conclusion

“The second session received only the repository and task ID. It recovered the client clarification, the completed work, and the next steps from Nool, then verified the finished feature. This run demonstrates continuity for this repository and workflow.”

Ask the client what they currently repeat during handoffs and use that answer to design a matched pilot.

# Presenter runbook

## Before the client call

From the completed repository, verify both the application and the stored handoff:

```sh
npm test
npm run verify:handoff
```

Prepare a self-contained live workspace. The command refuses to overwrite a path:

```sh
npm run demo:prepare -- /tmp/nool-demo-agent-a
npm run demo:verify-prepared -- /tmp/nool-demo-agent-a
```

For the baseline screen, use the `demo-baseline` tag in a separate Git worktree or show the prepared screenshot. No Nool retrieval is needed at baseline. Git tags alone do not reconstruct a historical Nool database, so always use `demo:prepare` for the handoff workspace.

## Ten-minute flow

1. **Baseline (1 minute):** Show the app at `demo-baseline`. Search works; there is no priority selector.
2. **Interruption point (2 minutes):** Open `/tmp/nool-demo-agent-a`. Show that six backend/search tests pass and the UI is unfinished.
3. **Fresh retrieval (2 minutes):** Start a fresh coding-agent session in the agent-A worktree and paste only `demo/agent-b-prompt.md` from the completed repository.
4. **Inspect the evidence (1 minute):** The new agent should retrieve task `3169a2b2`, the scoped finding, and the reasoning note. It should state that search and priority combine with AND, All is the default, URL state must persist, backend work is complete, and frontend work remains.
5. **Complete the feature (2 minutes):** Let the agent implement the selector and URL synchronization. Use the completed repository as the recovery checkpoint if generation runs long; say explicitly when you switch to it.
6. **Acceptance (2 minutes):** Run the tests. Select High, combine it with a search, refresh, and open the copied URL in another tab.

If live generation is too slow, say that you are switching to the reference implementation, then apply and verify it:

```sh
npm run demo:rehearse-completion -- /tmp/nool-demo-agent-a
```

This command is also the end-to-end rehearsal: it applies the reference agent-B files to the prepared workspace, runs the full suite, lands the change through Nool, reviews the criteria, and verifies the task as done.

## Direct retrieval commands

```sh
nool context "continue ticket priority filter" --scope priority-filter --budget 1200 --compact
nool findings --all --scope priority-filter --json
nool task list --tag handoff --compact
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

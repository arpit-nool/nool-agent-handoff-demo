# Agent B prompt

Use this in a fresh agent session opened at the `demo-agent-a` checkpoint:

> Continue the active task in the `priority-filter` thread. Retrieve its saved Nool context and inspect the current code. Before editing, summarize the accepted requirements, completed work, and remaining work, and identify the Nool records you used. Then finish the task and verify every acceptance criterion.

Do not add the task ID or the client's clarification to the prompt. Discovering the task and recovering the clarification from Nool are part of the demonstration.

import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const destinationArg = process.argv[2];

if (!destinationArg) {
  throw new Error("Usage: npm run demo:prepare -- /path/to/new-workspace");
}

const destination = resolve(destinationArg);
if (existsSync(destination)) {
  throw new Error(`Refusing to overwrite existing path: ${destination}`);
}

const agentAFiles = [
  ".gitignore",
  "package.json",
  "public/app.js",
  "public/index.html",
  "public/styles.css",
  "src/server.js",
  "src/tickets.js",
  "test/priority.test.js",
  "test/search.test.js"
];

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: options.cwd ?? destination,
    encoding: options.encoding ?? "utf8",
    stdio: options.stdio ?? "inherit"
  });
}

mkdirSync(destination, { recursive: false });

for (const path of agentAFiles) {
  const target = resolve(destination, path);
  mkdirSync(dirname(target), { recursive: true });
  const content = execFileSync("git", ["show", `demo-agent-a:${path}`], {
    cwd: projectRoot,
    encoding: null
  });
  writeFileSync(target, content);
}

run("git", ["init", "-b", "main"]);
run("git", ["config", "user.name", "Nool Demo"]);
run("git", ["config", "user.email", "demo@nool.dev"]);
run("git", ["add", "."]);
run("git", ["commit", "-m", "demo: agent A partial priority filter"]);
run("nool", ["init", "--from-git", "main"]);
run("nool", ["thread", "create", "--name", "priority-filter", "--desc", "Continue the ticket priority filter across agent sessions"]);

const taskOutput = run("nool", [
  "task", "create",
  "--name", "Add priority filtering",
  "--desc", "Backend filtering is complete. Recover the saved decisions, then finish the selector and URL state.",
  "--thread", "priority-filter",
  "--acceptance", "Selecting High returns only High-priority tickets",
  "--acceptance", "Search and priority combine with AND",
  "--acceptance", "All priorities is the default and removes only the priority restriction",
  "--acceptance", "Refreshing or copying the URL preserves search and priority",
  "--acceptance", "Existing search behavior still passes",
  "--tag", "handoff",
  "--tag", "demo",
  "--solidify",
  "--json"
], { stdio: ["ignore", "pipe", "inherit"] });

const jsonMatch = taskOutput.match(/\{[\s\S]*\}\s*$/);
if (!jsonMatch) throw new Error("Nool did not return the created task as JSON");
const task = JSON.parse(jsonMatch[0]);

run("nool", ["task", "start", "--id", task.id, "--through", "--solidify"]);
run("nool", [
  "learn", "--about", "src/tickets.js", "--scope", "priority-filter", "--kind", "finding",
  "--content", "Search and priority combine with AND. All priorities is the default. A copied or refreshed URL must preserve both selections."
]);
run("nool", [
  "learn", "--about", "priority-filter", "--scope", "priority-filter", "--kind", "reasoning_note",
  "--content", "Agent A completed backend priority filtering and six tests. Agent B must add the priority selector and URL synchronization, then rerun all acceptance checks."
]);

writeFileSync(resolve(destination, ".demo-task-id"), `${task.id}\n`);
appendFileSync(resolve(destination, ".git/info/exclude"), "\n.demo-task-id\n");

console.log(`\nPrepared live handoff workspace: ${destination}`);
console.log(`Task: ${task.id.slice(0, 8)} (${task.name})`);
console.log("Next: open a fresh agent session there and use demo/agent-b-prompt.md from the completed repository.");

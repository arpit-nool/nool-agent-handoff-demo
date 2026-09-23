import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const destinationArg = process.argv[2];
if (!destinationArg) {
  throw new Error("Usage: npm run demo:verify-prepared -- /path/to/prepared-workspace");
}

const destination = resolve(destinationArg);
const run = (command, args) => execFileSync(command, args, {
  cwd: destination,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"]
});

assert.ok(existsSync(resolve(destination, ".demo-task-id")), "prepared task ID is missing");
assert.ok(!existsSync(resolve(destination, "public/filter-state.js")), "agent B URL-state module already exists");
assert.doesNotMatch(readFileSync(resolve(destination, "public/index.html"), "utf8"), /id="priority"/);
assert.match(readFileSync(resolve(destination, "src/tickets.js"), "utf8"), /matchesPriority/);

const testOutput = run("npm", ["test"]);
assert.match(testOutput, /pass 6/);
assert.match(testOutput, /fail 0/);

const tasks = JSON.parse(run("nool", ["task", "list", "--tag", "handoff", "--json"]));
assert.equal(tasks.length, 1);
assert.equal(tasks[0].name, "Add priority filtering");
assert.equal(tasks[0].state, "InProgress");

const findings = JSON.parse(run("nool", ["findings", "--all", "--scope", "priority-filter", "--json"]));
const knowledge = findings.map(({ content }) => content).join("\n");
assert.match(knowledge, /Search and priority combine with AND/);
assert.match(knowledge, /All priorities is the default/);
assert.match(knowledge, /URL must preserve both selections|URL synchronization/);
assert.match(knowledge, /Agent A completed backend priority filtering and six tests/);
assert.match(knowledge, /Agent B must add the priority selector/);
assert.doesNotMatch(knowledge, /Agent B completes the priority filter interface/);

const context = run("nool", ["context", "continue ticket priority filter", "--scope", "priority-filter", "--budget", "1200", "--compact"]);
assert.match(context, /Search and priority combine with AND/);
assert.match(context, /Agent A completed backend priority filtering/);

console.log("Prepared workspace verified: partial code, six tests, active task, scoped decisions, and remaining work are consistent.");

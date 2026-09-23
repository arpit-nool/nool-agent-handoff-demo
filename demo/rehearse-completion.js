import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const destinationArg = process.argv[2];
if (!destinationArg) {
  throw new Error("Usage: npm run demo:rehearse-completion -- /path/to/prepared-workspace");
}

const destination = resolve(destinationArg);
const taskIdPath = resolve(destination, ".demo-task-id");
if (!existsSync(taskIdPath)) {
  throw new Error("This is not a workspace created by demo:prepare (.demo-task-id is missing)");
}

const run = (command, args, options = {}) => execFileSync(command, args, {
  cwd: destination,
  encoding: "utf8",
  stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit"
});

const agentBFiles = [
  "public/app.js",
  "public/filter-state.js",
  "public/index.html",
  "public/styles.css",
  "test/filter-state.test.js",
  "test/server.test.js"
];

for (const path of agentBFiles) {
  const source = resolve(projectRoot, path);
  const target = resolve(destination, path);
  assert.ok(existsSync(dirname(target)), `target directory is missing for ${path}`);
  copyFileSync(source, target);
}

run("npm", ["test"]);
run("nool", [
  "propose", "--all", "--thread", "priority-filter",
  "--intent", "Agent B completes the priority filter interface and preserves filters in the URL",
  "--test-note", "npm test: 11 tests passed",
  "--full", "--solidify", "--compact"
]);

const log = JSON.parse(run("nool", ["log", "--thread", "priority-filter", "--limit", "1", "--json"], { capture: true }));
assert.equal(log.length, 1, "could not identify the landed agent-B knot");

const taskId = readFileSync(taskIdPath, "utf8").trim();
run("nool", ["task", "qa", "--id", taskId, "--solidify"]);
run("nool", ["task", "criteria", "review", "--id", taskId, "--solidify"]);
run("nool", ["task", "finish", "--id", taskId, "--landed-knot", log[0].id, "--solidify"]);
run("nool", [
  "task", "verify-done", "--id", taskId, "--landed-knot", log[0].id,
  "--test-note", "npm test: 11/11 passed", "--solidify"
]);

const task = JSON.parse(run("nool", ["task", "show", "--id", taskId, "--json"], { capture: true }));
assert.equal(task.state, "VerifiedDone");
assert.equal(task.criteria_status, "Reviewed");

console.log("\nEnd-to-end rehearsal passed: reference completion landed and the task is VerifiedDone.");

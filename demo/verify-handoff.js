import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

function runNool(args) {
  return execFileSync("nool", args, {
    cwd: new URL("../", import.meta.url),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

const findings = JSON.parse(runNool(["findings", "--all", "--scope", "priority-filter", "--json"]));
const task = JSON.parse(runNool(["task", "show", "--id", "3169a2b2", "--json"]));
const knowledge = findings.map(({ content }) => content).join("\n");

assert.match(knowledge, /Search and priority combine with AND/);
assert.match(knowledge, /All priorities is the default/);
assert.match(knowledge, /URL must preserve both selections|URL must preserve|URL synchronization/);
assert.match(knowledge, /Agent A completed backend priority filtering/);
assert.match(knowledge, /Agent B must add the priority selector/);
assert.equal(task.name, "Add priority filtering");
assert.ok(task.acceptance_criteria.some((criterion) => criterion.includes("Search and priority combine with AND")));

console.log("Handoff verified: task, decisions, completed work, and next steps are recoverable from Nool.");

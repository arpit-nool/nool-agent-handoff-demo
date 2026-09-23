import assert from "node:assert/strict";
import test from "node:test";
import { filterTickets } from "../src/tickets.js";

test("priority filtering is case-insensitive", () => {
  const ids = filterTickets({ priority: "high" }).map(({ id }) => id);
  assert.deepEqual(ids, ["SUP-1042", "SUP-1035"]);
});

test("search and priority combine with AND", () => {
  const matching = filterTickets({ search: "email", priority: "High" }).map(({ id }) => id);
  const excluded = filterTickets({ search: "email", priority: "Medium" }).map(({ id }) => id);

  assert.deepEqual(matching, ["SUP-1035"]);
  assert.deepEqual(excluded, []);
});

test("an empty priority keeps existing search behavior", () => {
  assert.deepEqual(
    filterTickets({ search: "Maya", priority: "" }).map(({ id }) => id),
    ["SUP-1042", "SUP-1029"]
  );
});

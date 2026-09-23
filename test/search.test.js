import assert from "node:assert/strict";
import test from "node:test";
import { filterTickets, tickets } from "../src/tickets.js";

test("empty search returns every ticket", () => {
  assert.deepEqual(filterTickets(), tickets);
});

test("search matches a title without regard to case", () => {
  assert.deepEqual(filterTickets({ search: "CHECKOUT" }).map(({ id }) => id), ["SUP-1042"]);
});

test("search matches ticket IDs and owners", () => {
  assert.deepEqual(filterTickets({ search: "SUP-1029" }).map(({ id }) => id), ["SUP-1029"]);
  assert.deepEqual(filterTickets({ search: "Maya" }).map(({ id }) => id), ["SUP-1042", "SUP-1029"]);
});

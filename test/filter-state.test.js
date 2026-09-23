import assert from "node:assert/strict";
import test from "node:test";
import { buildFilterSearch, parseFilterState } from "../public/filter-state.js";

test("all priorities is the default", () => {
  assert.deepEqual(parseFilterState(""), { search: "", priority: "" });
  assert.equal(buildFilterSearch({ search: "", priority: "" }), "");
});

test("search and priority survive a URL round trip", () => {
  const query = buildFilterSearch({ search: "password reset", priority: "High" });

  assert.equal(query, "?search=password+reset&priority=High");
  assert.deepEqual(parseFilterState(query), { search: "password reset", priority: "High" });
});

test("unknown priorities safely fall back to all", () => {
  assert.deepEqual(parseFilterState("?search=invoice&priority=Urgent"), {
    search: "invoice",
    priority: ""
  });
});

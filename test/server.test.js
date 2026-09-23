import assert from "node:assert/strict";
import test from "node:test";
import { createAppServer } from "../src/server.js";

async function withServer(run) {
  const server = createAppServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("API combines search and priority", async () => {
  await withServer(async (origin) => {
    const response = await fetch(`${origin}/api/tickets?search=email&priority=High`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.count, 1);
    assert.deepEqual(body.tickets.map(({ id }) => id), ["SUP-1035"]);
  });
});

test("server renders the board and filter controls", async () => {
  await withServer(async (origin) => {
    const response = await fetch(origin);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Ticket board/);
    assert.match(body, /id="priority"/);
  });
});

const test = require("node:test");
const assert = require("node:assert/strict");
const { validateFeedback } = require("../lib/feedback");
const handler = require("../api/feedback");

const valid = {
  email: "Person@Example.com", moments: ["calm-and-reset"], feedback: "A quiet check-in",
  platform: "web", researchOptIn: false, consent: true, source: "soulora-early-access"
};

function response() {
  return {
    headers: {}, setHeader(key, value) { this.headers[key] = value; return this; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

test("validates and normalizes only the allowed survey fields", () => {
  assert.deepEqual(validateFeedback(valid).email, "person@example.com");
  assert.equal(validateFeedback({ ...valid, moments: ["calm-and-reset", "calm-and-reset"] }), null);
  assert.equal(validateFeedback({ ...valid, consent: false }), null);
  assert.equal(validateFeedback({ ...valid, feedback: "x".repeat(321) }), null);
  assert.equal(validateFeedback({ ...valid, platform: "desktop" }), null);
});

test("stays unavailable without explicit collection switch", async () => {
  const res = response();
  await handler({ method: "GET", headers: {} }, res);
  assert.deepEqual(res.body, { available: false });
  const post = response();
  await handler({ method: "POST", headers: {}, body: valid }, post);
  assert.equal(post.code, 503);
});

test("accepts valid submissions without exposing the service key to the client", async () => {
  const original = global.fetch;
  process.env.FEEDBACK_COLLECTION_ENABLED = "true";
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-key";
  let stored;
  global.fetch = async (_url, options) => {
    stored = JSON.parse(options.body);
    return { ok: true, status: 201 };
  };
  try {
    const res = response();
    await handler({ method: "POST", headers: { origin: "https://soulora.ai", host: "soulora.ai", "content-type": "application/json" }, body: valid }, res);
    assert.equal(res.code, 202);
    assert.equal(stored.email, "person@example.com");
    assert.equal(stored.research_opt_in, false);
    assert.equal(stored.submittedAt, undefined);
    const bad = response();
    await handler({ method: "POST", headers: { origin: "https://attacker.example", host: "soulora.ai", "content-type": "application/json" }, body: valid }, bad);
    assert.equal(bad.code, 403);
  } finally {
    global.fetch = original;
    delete process.env.FEEDBACK_COLLECTION_ENABLED;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

test("reports ready only when the Supabase table responds and hides duplicate emails", async () => {
  const original = global.fetch;
  process.env.FEEDBACK_COLLECTION_ENABLED = "true";
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-key";
  global.fetch = async (_url, options) => options.method === "HEAD"
    ? { ok: true }
    : { ok: false, status: 409, json: async () => ({ code: "23505" }) };
  try {
    const status = response();
    await handler({ method: "GET", headers: {} }, status);
    assert.deepEqual(status.body, { available: true });
    const duplicate = response();
    await handler({ method: "POST", headers: { host: "soulora.ai", "content-type": "application/json" }, body: valid }, duplicate);
    assert.equal(duplicate.code, 202);
    assert.deepEqual(duplicate.body, { ok: true });
  } finally {
    global.fetch = original;
    delete process.env.FEEDBACK_COLLECTION_ENABLED;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

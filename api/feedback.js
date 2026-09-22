const { validateFeedback } = require("../lib/feedback");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const enabled = process.env.FEEDBACK_COLLECTION_ENABLED === "true";
  if (req.method === "GET") {
    if (!enabled || !url || !key) return res.status(200).json({ available: false });
    try {
      const check = await fetch(`${url.replace(/\/$/, "")}/rest/v1/feedback_submissions?select=id&limit=0`, {
        method: "HEAD", headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(4000)
      });
      return res.status(200).json({ available: check.ok });
    } catch { return res.status(200).json({ available: false }); }
  }
  if (req.method !== "POST") return res.status(405).setHeader("Allow", "GET, POST").json({ error: "Method not allowed" });
  if (!enabled || !url || !key) return res.status(503).json({ error: "Feedback is not available yet" });

  // Browsers may omit Origin on same-origin requests; reject explicit foreign origins.
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && (!host || origin !== `https://${host}` && origin !== `http://${host}`)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  const size = Number(req.headers["content-length"] || 0);
  if (size > 4096) return res.status(413).json({ error: "Request too large" });
  if (!req.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
    return res.status(415).json({ error: "Expected JSON" });
  }
  let body = req.body;
  if (body && typeof body === "object" && JSON.stringify(body).length > 4096) return res.status(413).json({ error: "Request too large" });
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid JSON" }); }
  }
  if (body?.website) return res.status(202).json({ ok: true }); // Honeypot.
  const payload = validateFeedback(body);
  if (!payload) return res.status(400).json({ error: "Invalid response" });

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/feedback_submissions`, {
      method: "POST",
      headers: {
        apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000)
    });
    if (response.ok) return res.status(202).json({ ok: true });
    const error = await response.json().catch(() => ({}));
    // Do not reveal whether an email address has already responded.
    if (response.status === 409 && error.code === "23505") return res.status(202).json({ ok: true });
    console.error("Feedback storage failed", response.status, error.code || "unknown");
    return res.status(502).json({ error: "Unable to save response" });
  } catch (error) {
    console.error("Feedback storage unavailable", error.name);
    return res.status(503).json({ error: "Feedback temporarily unavailable" });
  }
};

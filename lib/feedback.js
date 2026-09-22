const MOMENTS = new Set([
  "talk-through-a-hard-day", "reflect-and-journal", "calm-and-reset",
  "feel-less-alone", "remember-what-matters"
]);
const PLATFORMS = new Set(["iphone", "android", "web", "unsure"]);

function validateFeedback(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const feedback = typeof body.feedback === "string" ? body.feedback.trim() : "";
  const moments = body.moments;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      !Array.isArray(moments) || moments.length < 1 || moments.length > 2 ||
      new Set(moments).size !== moments.length || !moments.every((m) => MOMENTS.has(m)) ||
      feedback.length > 320 || !PLATFORMS.has(body.platform) ||
      typeof body.researchOptIn !== "boolean" || body.consent !== true ||
      body.source !== "soulora-early-access") return null;
  return {
    email, moments, feedback, platform: body.platform,
    research_opt_in: body.researchOptIn,
    consent_version: "website-research-2026-09-22",
    source: body.source
  };
}

module.exports = { validateFeedback };

module.exports = function handler(_req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(503).json({ error: "Dashboard not configured" });
  }

  // Supabase publishable keys are browser-safe; row access remains protected by RLS.
  return res.status(200).json({ supabaseUrl: url, supabaseAnonKey: key });
};

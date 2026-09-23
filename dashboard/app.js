const $ = (selector) => document.querySelector(selector);
let base = "";
let supabaseAnonKey = "";
const pageSize = 50;
let token = "";
let recoveryToken = "";
let page = 0;
let rows = [];
let total = 0;
let messageTimer;
const message = (value, tone = "error") => {
  const element = $("#message");
  clearTimeout(messageTimer);
  element.textContent = value;
  element.hidden = !value;
  element.className = `toast${value ? ` toast-${tone}` : ""}`;
  if (value && tone !== "error") messageTimer = setTimeout(() => message(""), 4200);
};

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { apikey: supabaseAnonKey, ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    cache: "no-store"
  });
  if (!response.ok) {
    if (response.status === 401) signOut();
    throw new Error(response.status === 401 ? "Session expired. Please sign in again." : `Request failed (${response.status}).`);
  }
  return response;
}

function signOut() {
  token = "";
  recoveryToken = "";
  rows = [];
  $("#console").hidden = true;
  $("#sign-out").hidden = true;
  $("#recovery-panel").hidden = true;
  $("#login-panel").hidden = false;
  $("#login-form").reset();
  $("#recovery-form").reset();
}

function readAuthRedirect() {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const query = new URLSearchParams(window.location.search);
  const value = (name) => hash.get(name) || query.get(name);
  const type = value("type");
  const accessToken = value("access_token");
  const error = value("error_description") || value("error");

  if (!type && !accessToken && !error) return false;

  const cleanUrl = new URL(window.location.href);
  cleanUrl.hash = "";
  for (const name of ["access_token", "refresh_token", "expires_at", "expires_in", "token_type", "type", "error", "error_code", "error_description"]) {
    cleanUrl.searchParams.delete(name);
  }
  window.history.replaceState({}, document.title, `${cleanUrl.pathname}${cleanUrl.search}`);

  if (type === "recovery" && accessToken) {
    recoveryToken = accessToken;
    $("#login-panel").hidden = true;
    $("#recovery-panel").hidden = false;
    message("Recovery link verified. Set your new password.", "info");
    return true;
  }

  if (error) message(`This recovery link could not be used: ${error}`);
  return false;
}

async function load() {
  const filter = $("#status-filter").value;
  const params = new URLSearchParams({ select: "id,email,moments,feedback,platform,research_opt_in,status,created_at", order: "created_at.desc", limit: String(pageSize), offset: String(page * pageSize) });
  if (filter) params.set("status", `eq.${filter}`);
  const response = await request(`/rest/v1/feedback_submissions?${params}`, { headers: { Prefer: "count=exact" } });
  rows = await response.json();
  total = Number(response.headers.get("content-range")?.split("/")[1] || 0);
  render();
}

function render() {
  const metrics = $("#metrics");
  metrics.replaceChildren();
  const metricValues = [["Matching responses", total], ["On this page", rows.length], ["Interview opt-ins", rows.filter((row) => row.research_opt_in).length], ["New on this page", rows.filter((row) => row.status === "new").length]];
  for (const [index, [label, value]] of metricValues.entries()) {
    const box = document.createElement("div"); box.className = `metric metric-${index + 1}`;
    const caption = document.createElement("span"); caption.className = "metric-label"; caption.textContent = label;
    const number = document.createElement("strong"); number.textContent = value;
    const detail = document.createElement("small"); detail.textContent = index === 0 ? "Current filter" : index === 2 ? "Available to contact" : index === 3 ? "Needs attention" : "Loaded now";
    box.append(caption, number, detail); metrics.append(box);
  }
  const container = $("#responses"); container.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement("div"); empty.className = "empty-state";
    const mark = document.createElement("span"); mark.setAttribute("aria-hidden", "true"); mark.textContent = "◎";
    const title = document.createElement("strong"); title.textContent = "No responses to show";
    const copy = document.createElement("p"); copy.textContent = "Try another status filter or refresh the inbox.";
    empty.append(mark, title, copy); container.append(empty);
  }
  for (const row of rows) {
    const card = document.createElement("article"); card.className = "response";
    const identity = document.createElement("div"); identity.className = "response-identity";
    const email = document.createElement("strong"); email.className = "response-email"; email.textContent = row.email;
    const date = document.createElement("time"); date.dateTime = row.created_at; date.textContent = new Date(row.created_at).toLocaleString();
    const context = document.createElement("div"); context.className = "response-meta";
    const platform = document.createElement("span"); platform.className = "pill pill-neutral"; platform.textContent = row.platform;
    const interview = document.createElement("span"); interview.className = `pill ${row.research_opt_in ? "pill-positive" : "pill-neutral"}`; interview.textContent = row.research_opt_in ? "Interview opt-in" : "No interview opt-in";
    context.append(platform, interview); identity.append(email, date, context);
    const details = document.createElement("div"); details.className = "response-signal";
    const moments = document.createElement("div"); moments.className = "moment-list";
    for (const moment of Array.isArray(row.moments) ? row.moments : []) { const tag = document.createElement("span"); tag.className = "moment-tag"; tag.textContent = String(moment).replace(/-/g, " "); moments.append(tag); }
    const note = document.createElement("p"); note.className = "note"; note.textContent = row.feedback || "No written comment";
    details.append(moments, note);
    const control = document.createElement("div"); control.className = "response-control";
    const label = document.createElement("label"); label.innerHTML = "<span>Review status</span>";
    const select = document.createElement("select"); select.className = `status-select status-${row.status}`;
    for (const status of ["new", "reviewed", "contacted"]) { const option = document.createElement("option"); option.value = status; option.textContent = status; select.append(option); }
    select.value = row.status;
    select.addEventListener("change", async () => {
      select.disabled = true;
      try {
        await request(`/rest/v1/feedback_submissions?id=eq.${encodeURIComponent(row.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: select.value }) });
        row.status = select.value; select.className = `status-select status-${row.status}`; message("Review status saved.", "success");
      } catch (error) { select.value = row.status; message(error.message, "error"); }
      finally { select.disabled = false; }
    });
    label.append(select); control.append(label); card.append(identity, details, control); container.append(card);
  }
  $("#page-label").textContent = `${total ? page * pageSize + 1 : 0}–${Math.min((page + 1) * pageSize, total)} of ${total}`;
  $("#previous").disabled = page === 0;
  $("#next").disabled = (page + 1) * pageSize >= total;
}

function csvValue(value) {
  const text = String(value ?? "").replace(/^[\s\u0000-\u001f]*[=+\-@]/, "'$&");
  return `"${text.replace(/"/g, '""')}"`;
}

$("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault(); message("");
  const form = event.currentTarget;
  const data = new FormData(form);
  try {
    const response = await request("/auth/v1/token?grant_type=password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
    token = (await response.json()).access_token;
    form.reset();
    const admin = await request("/rest/v1/admin_users?select=user_id&limit=1");
    if (!(await admin.json()).length) { signOut(); throw new Error("This account is not an administrator."); }
    $("#login-panel").hidden = true; $("#console").hidden = false; $("#sign-out").hidden = false;
    await load();
  } catch (error) { message(error.message, "error"); }
});
$("#recovery-form").addEventListener("submit", async (event) => {
  event.preventDefault(); message("");
  const data = new FormData(event.currentTarget);
  const password = String(data.get("password") || "");
  const confirmation = String(data.get("confirmation") || "");
  if (password !== confirmation) { message("Passwords do not match.", "error"); return; }
  if (!recoveryToken) { message("This recovery link is missing or has expired. Request a new one.", "error"); return; }

  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  try {
    const response = await fetch(`${base}/auth/v1/user`, {
      method: "PUT",
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${recoveryToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      cache: "no-store"
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.msg || body.message || "Password update failed. Request a new recovery link.");
    }
    signOut();
    message("Password updated. You can now sign in with your new password.", "success");
  } catch (error) { message(error.message, "error"); }
  finally { button.disabled = false; }
});
$("#cancel-recovery").addEventListener("click", () => { signOut(); message(""); });
$("#sign-out").addEventListener("click", () => { signOut(); message(""); });
$("#status-filter").addEventListener("change", () => { page = 0; load().catch((error) => message(error.message)); });
$("#refresh").addEventListener("click", () => load().catch((error) => message(error.message)));
$("#previous").addEventListener("click", () => { page--; load().catch((error) => message(error.message)); });
$("#next").addEventListener("click", () => { page++; load().catch((error) => message(error.message)); });
$("#export").addEventListener("click", () => {
  const fields = ["created_at", "email", "moments", "feedback", "platform", "research_opt_in", "status"];
  const content = [fields.join(","), ...rows.map((row) => fields.map((field) => csvValue(Array.isArray(row[field]) ? row[field].join("; ") : row[field])).join(","))].join("\r\n");
  const objectUrl = URL.createObjectURL(new Blob(["\ufeff", content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a"); link.href = objectUrl; link.download = `soulora-research-page-${page + 1}.csv`; link.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
});

try {
  let config;
  try {
    const response = await fetch("./api/config", { cache: "no-store" });
    if (!response.ok) throw new Error("No deployed configuration");
    config = await response.json();
  } catch {
    // A local static preview may use an uncommitted config.js instead.
    config = await import("./config.js");
  }
  base = config.supabaseUrl.replace(/\/$/, "");
  supabaseAnonKey = config.supabaseAnonKey;
  readAuthRedirect();
} catch {
  $("#login-form").querySelector("button").disabled = true;
  message("Dashboard is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in its deployment.");
}

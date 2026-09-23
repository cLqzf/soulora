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
const statusLabels = { new: "新反馈", reviewed: "已查看", contacted: "已联系" };
const platformLabels = { iphone: "iPhone", android: "Android", web: "网页端", unsure: "尚未确定", desktop: "桌面端" };
const momentLabels = {
  "talk-through-a-hard-day": "困难一天后倾诉",
  "reflect-and-journal": "反思与记录",
  "calm-and-reset": "平静与重置",
  "feel-less-alone": "减轻孤独感",
  "remember-what-matters": "记住重要的事"
};
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
    throw new Error(response.status === 401 ? "登录状态已失效，请重新登录。" : `请求失败（${response.status}）。`);
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
    message("验证成功，请设置新密码。", "info");
    return true;
  }

  if (error) message(`密码重置链接无法使用：${error}`);
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
  const metricValues = [
    ["当前结果", total, "符合筛选条件"],
    ["本页反馈", rows.length, "当前已加载"],
    ["愿意参与访谈", rows.filter((row) => row.research_opt_in).length, "可以发送访谈邀请"],
    ["待处理", rows.filter((row) => row.status === "new").length, "本页尚未查看"]
  ];
  for (const [index, [label, value, detailText]] of metricValues.entries()) {
    const box = document.createElement("div"); box.className = `metric metric-${index + 1}`;
    const caption = document.createElement("span"); caption.className = "metric-label"; caption.textContent = label;
    const number = document.createElement("strong"); number.textContent = value;
    const detail = document.createElement("small"); detail.textContent = detailText;
    box.append(caption, number, detail); metrics.append(box);
  }
  const container = $("#responses"); container.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement("div"); empty.className = "empty-state";
    const mark = document.createElement("span"); mark.setAttribute("aria-hidden", "true"); mark.textContent = "◎";
    const title = document.createElement("strong"); title.textContent = "暂无符合条件的反馈";
    const copy = document.createElement("p"); copy.textContent = "可以更换处理状态，或刷新后再查看。";
    empty.append(mark, title, copy); container.append(empty);
  }
  for (const row of rows) {
    const card = document.createElement("article"); card.className = "response";
    const identity = document.createElement("div"); identity.className = "response-identity";
    const email = document.createElement("strong"); email.className = "response-email"; email.textContent = row.email;
    const date = document.createElement("time"); date.dateTime = row.created_at; date.textContent = new Date(row.created_at).toLocaleString("zh-CN", { hour12: false });
    const context = document.createElement("div"); context.className = "response-meta";
    const platform = document.createElement("span"); platform.className = "pill pill-neutral"; platform.textContent = platformLabels[row.platform] || row.platform || "未填写平台";
    const interview = document.createElement("span"); interview.className = `pill ${row.research_opt_in ? "pill-positive" : "pill-neutral"}`; interview.textContent = row.research_opt_in ? "愿意参与访谈" : "未授权访谈邀约";
    context.append(platform, interview); identity.append(email, date, context);
    const details = document.createElement("div"); details.className = "response-signal";
    const moments = document.createElement("div"); moments.className = "moment-list";
    for (const moment of Array.isArray(row.moments) ? row.moments : []) { const tag = document.createElement("span"); tag.className = "moment-tag"; tag.textContent = momentLabels[moment] || String(moment).replace(/-/g, " "); moments.append(tag); }
    const note = document.createElement("p"); note.className = "note"; note.textContent = row.feedback || "用户没有留下补充说明。";
    details.append(moments, note);
    const control = document.createElement("div"); control.className = "response-control";
    const label = document.createElement("label"); label.innerHTML = "<span>处理状态</span>";
    const select = document.createElement("select"); select.className = `status-select status-${row.status}`;
    for (const status of ["new", "reviewed", "contacted"]) { const option = document.createElement("option"); option.value = status; option.textContent = statusLabels[status]; select.append(option); }
    select.value = row.status;
    select.addEventListener("change", async () => {
      select.disabled = true;
      try {
        await request(`/rest/v1/feedback_submissions?id=eq.${encodeURIComponent(row.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: select.value }) });
        row.status = select.value; select.className = `status-select status-${row.status}`; message("处理状态已保存。", "success");
      } catch (error) { select.value = row.status; message(error.message, "error"); }
      finally { select.disabled = false; }
    });
    label.append(select); control.append(label); card.append(identity, details, control); container.append(card);
  }
  $("#page-label").textContent = `${total ? page * pageSize + 1 : 0}–${Math.min((page + 1) * pageSize, total)} / 共 ${total} 条`;
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
  const button = form.querySelector("button");
  const buttonText = button.querySelector("span");
  button.disabled = true;
  buttonText.textContent = "正在登录…";
  try {
    const response = await request("/auth/v1/token?grant_type=password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
    token = (await response.json()).access_token;
    form.reset();
    const admin = await request("/rest/v1/admin_users?select=user_id&limit=1");
    if (!(await admin.json()).length) { signOut(); throw new Error("该账号不在管理员名单中。"); }
    $("#login-panel").hidden = true; $("#console").hidden = false; $("#sign-out").hidden = false;
    await load();
  } catch (error) { message(error.message, "error"); }
  finally { button.disabled = false; buttonText.textContent = "进入工作台"; }
});
$("#recovery-form").addEventListener("submit", async (event) => {
  event.preventDefault(); message("");
  const data = new FormData(event.currentTarget);
  const password = String(data.get("password") || "");
  const confirmation = String(data.get("confirmation") || "");
  if (password !== confirmation) { message("两次输入的密码不一致。", "error"); return; }
  if (!recoveryToken) { message("密码重置链接缺失或已过期，请重新发送邮件。", "error"); return; }

  const button = event.currentTarget.querySelector("button");
  const buttonText = button.querySelector("span");
  button.disabled = true;
  buttonText.textContent = "正在更新…";
  try {
    const response = await fetch(`${base}/auth/v1/user`, {
      method: "PUT",
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${recoveryToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(response.status === 422 ? "新密码不符合要求，请至少输入 8 个字符。" : "密码更新失败，请重新发送重置邮件。");
    }
    signOut();
    message("密码已更新，请使用新密码登录。", "success");
  } catch (error) { message(error.message, "error"); }
  finally { button.disabled = false; buttonText.textContent = "更新密码"; }
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
    if (!response.ok) throw new Error("未找到部署配置");
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
  message("工作台尚未完成配置，请在部署环境中设置 Supabase 连接信息。");
}

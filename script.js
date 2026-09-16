const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setupHeroAtmosphere() {
  const canvas = document.querySelector("[data-hero-atmosphere]");
  const hero = canvas?.closest(".hero");
  const context = canvas?.getContext("2d");
  if (!canvas || !hero || !context) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let lastTime = 0;
  let isVisible = true;
  let particles = [];

  const resetParticle = (particle, initial = false) => {
    const warm = Math.random() > 0.25;
    const rightBiased = warm && Math.random() > 0.24;
    particle.x = rightBiased ? width * (0.57 + Math.random() * 0.41) : Math.random() * width;
    particle.y = initial ? Math.random() * height : height + 10 + Math.random() * 90;
    particle.size = warm ? 0.65 + Math.random() * 1.55 : 0.8 + Math.random() * 1.8;
    particle.speed = warm ? 0.02 + Math.random() * 0.048 : 0.008 + Math.random() * 0.018;
    particle.drift = (Math.random() - 0.5) * 0.018;
    particle.alpha = warm ? 0.24 + Math.random() * 0.62 : 0.08 + Math.random() * 0.2;
    particle.phase = Math.random() * Math.PI * 2;
    particle.warm = warm;
  };

  const draw = (time = 0, advance = true) => {
    const delta = lastTime ? Math.min(32, time - lastTime) : 16;
    lastTime = time;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    particles.forEach((particle) => {
      if (advance) {
        particle.y -= particle.speed * delta;
        particle.x += particle.drift * delta + Math.sin(time * 0.00035 + particle.phase) * 0.035;
        if (particle.y < -24 || particle.x < -30 || particle.x > width + 30) resetParticle(particle);
      }

      const shimmer = 0.68 + Math.sin(time * 0.0014 + particle.phase) * 0.32;
      const alpha = particle.alpha * shimmer;
      context.beginPath();
      context.fillStyle = particle.warm ? `rgba(234, 145, 101, ${alpha})` : `rgba(112, 157, 226, ${alpha})`;
      context.shadowColor = particle.warm ? "rgba(220, 102, 67, .72)" : "rgba(91, 139, 216, .58)";
      context.shadowBlur = particle.size * (particle.warm ? 7 : 11);
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.globalCompositeOperation = "source-over";
    context.shadowBlur = 0;
  };

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = prefersReducedMotion.matches ? 18 : width < 720 ? 32 : width < 1100 ? 52 : 78;
    particles = Array.from({ length: count }, () => {
      const particle = {};
      resetParticle(particle, true);
      return particle;
    });
    draw(performance.now(), false);
  };

  const render = (time) => {
    frame = 0;
    if (!isVisible || document.hidden || prefersReducedMotion.matches) return;
    draw(time, true);
    frame = window.requestAnimationFrame(render);
  };

  const start = () => {
    if (!frame && isVisible && !document.hidden && !prefersReducedMotion.matches) {
      lastTime = 0;
      frame = window.requestAnimationFrame(render);
    }
  };

  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) start();
    else stop();
  }, { threshold: 0.02 });

  observer.observe(hero);
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (finePointer.matches && !prefersReducedMotion.matches) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      hero.style.setProperty("--hero-parallax-x", `${x.toFixed(2)}px`);
      hero.style.setProperty("--hero-parallax-y", `${y.toFixed(2)}px`);
    }, { passive: true });
    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--hero-parallax-x", "0px");
      hero.style.setProperty("--hero-parallax-y", "0px");
    });
  }

  resize();
  start();
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 }
  );

  elements.forEach((element) => observer.observe(element));
}

function setupHeader() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!header || !toggle || !menu) return;

  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  const setMenu = (open, restoreFocus = false) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
    menu.hidden = !open;
    header.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) {
      menu.querySelector("a")?.focus();
    } else if (restoreFocus) {
      toggle.focus();
    }
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false, true);
  });
  window.matchMedia("(min-width: 981px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
}

function setupPointerLight() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const stage = document.querySelector("[data-tilt-stage]");
  if (!finePointer.matches || prefersReducedMotion.matches) return;

  window.addEventListener(
    "pointermove",
    (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    },
    { passive: true }
  );

  stage?.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    stage.style.setProperty("--tilt-x", x.toFixed(3));
    stage.style.setProperty("--tilt-y", y.toFixed(3));
  });
  stage?.addEventListener("pointerleave", () => {
    stage.style.setProperty("--tilt-x", "0");
    stage.style.setProperty("--tilt-y", "0");
  });
}

function setupExperienceTabs() {
  const tablist = document.querySelector('[role="tablist"]');
  if (!tablist) return;
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];

  const activate = (tab, focus = false) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.id === tab.getAttribute("aria-controls");
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % tabs.length;
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex !== null) {
        event.preventDefault();
        activate(tabs[nextIndex], true);
      }
    });
  });
}

function createMessage(text, role) {
  const message = document.createElement("div");
  message.className = `message message-${role}`;
  message.textContent = text;
  return message;
}

function setupConversationDemo() {
  const form = document.querySelector("#demo-chat-form");
  const input = document.querySelector("#demo-message");
  const thread = document.querySelector("#demo-thread");
  if (!form || !input || !thread) return;

  let responding = false;
  const respond = (value) => {
    if (responding || !value.trim()) return;
    responding = true;
    thread.append(createMessage(value.trim(), "user"));
    input.value = "";

    const row = document.createElement("div");
    row.className = "message-row";
    const orb = document.createElement("span");
    orb.className = "mini-orb mini-orb-small";
    orb.setAttribute("aria-hidden", "true");
    orb.append(document.createElement("i"));
    const typing = document.createElement("div");
    typing.className = "message message-soul typing-message";
    typing.setAttribute("aria-label", "Soulora 正在理解");
    typing.innerHTML = "<i></i><i></i><i></i>";
    row.append(orb, typing);
    thread.append(row);
    thread.scrollTop = thread.scrollHeight;

    window.setTimeout(() => {
      const calmReply = value.includes("陪")
        ? "好。我先陪你待在这里，不需要马上做什么。等你想说时，我再听。"
        : "我们可以只理最小的一步。此刻最占据你注意力的，是内容本身，还是站在大家面前的感觉？";
      typing.classList.remove("typing-message");
      typing.removeAttribute("aria-label");
      typing.textContent = calmReply;
      thread.scrollTop = thread.scrollHeight;
      responding = false;
    }, prefersReducedMotion.matches ? 50 : 850);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    respond(input.value);
  });
  document.querySelectorAll("[data-quick-reply]").forEach((button) => {
    button.addEventListener("click", () => respond(button.dataset.quickReply || ""));
  });
}

function setupMemoryDemo() {
  const card = document.querySelector("[data-memory-card]");
  if (!card) return;
  const actions = card.querySelector("[data-memory-actions]");
  const edit = card.querySelector("[data-memory-edit]");
  const result = card.querySelector("[data-memory-result]");
  const text = card.querySelector("textarea");

  card.addEventListener("click", (event) => {
    const button = event.target.closest("[data-memory-action]");
    if (!button) return;
    const action = button.dataset.memoryAction;
    if (action === "edit") {
      edit.hidden = false;
      actions.hidden = true;
      text.focus();
      return;
    }
    if (action === "save") {
      edit.hidden = true;
      actions.hidden = false;
      result.textContent = "修改已保留在本次页面演示中，未上传或长期保存。";
      return;
    }
    result.textContent = action === "keep"
      ? "已在本次演示中允许这条记忆；刷新页面后会恢复。"
      : "已拒绝保存，这条内容不会离开当前页面。";
    card.dataset.state = action;
  });
}

function setupBreathingDemo() {
  const demo = document.querySelector("[data-breathing-demo]");
  if (!demo) return;
  const toggle = demo.querySelector("[data-breath-toggle]");
  const reset = demo.querySelector("[data-breath-reset]");
  const time = demo.querySelector("[data-breath-time]");
  const instruction = demo.querySelector("[data-breath-instruction]");
  const icon = toggle.querySelector("use");
  const label = toggle.querySelector("span");
  let remaining = 30;
  let timer = null;

  const render = () => {
    time.textContent = `00:${String(remaining).padStart(2, "0")}`;
    if (remaining === 0) instruction.textContent = "很好。此刻不需要再做更多。";
    else {
      const phase = (30 - remaining) % 8;
      instruction.textContent = phase < 4 ? "慢慢吸气…" : "轻轻呼气…";
    }
  };
  const stop = (completed = false) => {
    window.clearInterval(timer);
    timer = null;
    demo.classList.remove("is-running", "is-paused");
    icon.setAttribute("href", "#icon-play");
    label.textContent = completed ? "再来一次" : "继续";
  };
  const start = () => {
    if (remaining === 0) remaining = 30;
    demo.classList.add("is-running");
    demo.classList.remove("is-paused");
    icon.setAttribute("href", "#icon-pause");
    label.textContent = "暂停";
    render();
    timer = window.setInterval(() => {
      remaining -= 1;
      render();
      if (remaining <= 0) stop(true);
    }, 1000);
  };

  toggle.addEventListener("click", () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
      demo.classList.add("is-paused");
      icon.setAttribute("href", "#icon-play");
      label.textContent = "继续";
      instruction.textContent = "已暂停。按照你的节奏来。";
    } else start();
  });
  reset.addEventListener("click", () => {
    window.clearInterval(timer);
    timer = null;
    remaining = 30;
    demo.classList.remove("is-running", "is-paused");
    icon.setAttribute("href", "#icon-play");
    label.textContent = "开始";
    instruction.textContent = "准备好时，我们慢慢开始。";
    render();
  });
}

function setupVoiceDemo() {
  const demo = document.querySelector("[data-voice-demo]");
  if (!demo) return;
  const toggle = demo.querySelector("[data-voice-toggle]");
  const icon = toggle.querySelector("use");
  const progress = demo.querySelector("[data-voice-progress]");
  const time = demo.querySelector("[data-voice-time]");
  let current = 0;
  let timer = null;
  const duration = 18;

  const render = () => {
    progress.style.setProperty("--voice-progress", `${(current / duration) * 100}%`);
    time.textContent = `00:${String(current).padStart(2, "0")} / 00:18`;
  };
  const pause = () => {
    window.clearInterval(timer);
    timer = null;
    demo.classList.remove("is-playing");
    icon.setAttribute("href", "#icon-play");
    toggle.setAttribute("aria-label", "播放声音陪伴概念");
  };
  const play = () => {
    if (current >= duration) current = 0;
    demo.classList.add("is-playing");
    icon.setAttribute("href", "#icon-pause");
    toggle.setAttribute("aria-label", "暂停声音陪伴概念");
    timer = window.setInterval(() => {
      current += 1;
      render();
      if (current >= duration) pause();
    }, 1000);
  };
  toggle.addEventListener("click", () => (timer ? pause() : play()));
}

function setupAvatarLab() {
  const stage = document.querySelector("[data-avatar-stage]");
  const buttons = [...document.querySelectorAll("[data-avatar-option]")];
  const indexLabel = document.querySelector("[data-avatar-index]");
  if (!stage || !buttons.length) return;

  const name = stage.querySelector("[data-avatar-name]");
  const tone = stage.querySelector("[data-avatar-tone]");
  const line = stage.querySelector("[data-avatar-line]");
  const image = stage.querySelector("[data-avatar-image]");

  buttons.forEach((button) => {
    if (!button.dataset.avatarImage) return;
    const preload = new Image();
    preload.src = button.dataset.avatarImage;
  });

  const activate = (button, focus = false) => {
    const index = buttons.indexOf(button);
    buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    stage.dataset.avatar = button.dataset.avatarOption || "lumen";
    if (name) name.textContent = button.dataset.avatarName || "";
    if (tone) tone.textContent = button.dataset.avatarTone || "";
    if (line) line.textContent = button.dataset.avatarLine || "";
    if (image && button.dataset.avatarImage) {
      image.src = button.dataset.avatarImage;
      image.alt = `Soulora 陪伴形象：${button.dataset.avatarName || "未命名"}`;
    }
    if (indexLabel) indexLabel.textContent = `${String(index + 1).padStart(2, "0")} / ${String(buttons.length).padStart(2, "0")}`;
    stage.classList.remove("is-switching");
    window.requestAnimationFrame(() => stage.classList.add("is-switching"));
    if (focus) button.focus();
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activate(button));
    button.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % buttons.length;
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (nextIndex === null) return;
      event.preventDefault();
      activate(buttons[nextIndex], true);
    });
  });
}

function setupSettings() {
  const feedback = document.querySelector("[data-setting-feedback]");
  document.querySelectorAll("[data-setting-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.getAttribute("aria-checked") !== "true";
      button.setAttribute("aria-checked", String(next));
      const name = button.querySelector("strong")?.textContent || "此设置";
      if (feedback) feedback.textContent = `${name}已${next ? "开启" : "关闭"}。这是本次页面演示状态，不会保存。`;
    });
  });
}

function setupTimeline() {
  const timeline = document.querySelector("[data-timeline]");
  const progress = timeline?.querySelector("[data-timeline-progress]");
  const moments = timeline ? [...timeline.querySelectorAll(".moment")] : [];
  if (!timeline || !progress || !moments.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      moments.forEach((moment) => moment.classList.toggle("is-current", moment === visible.target));
      const index = moments.indexOf(visible.target);
      timeline.style.setProperty("--timeline-progress", `${18 + index * 41}%`);
    },
    { rootMargin: "-25% 0px -45%", threshold: [0.1, 0.35, 0.6] }
  );
  moments.forEach((moment) => observer.observe(moment));
}

function setupFaq() {
  const details = [...document.querySelectorAll(".faq-list details")];
  details.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      details.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}

function setupAccessForm() {
  const form = document.querySelector("#access-form");
  const input = document.querySelector("#email");
  const error = document.querySelector("#email-error");
  const result = document.querySelector("#form-result");
  const field = form?.querySelector(".field-group");
  const submit = form?.querySelector("button[type='submit']");
  if (!form || !input || !error || !result || !field || !submit) return;

  const validate = () => {
    const value = input.value.trim();
    let message = "";
    if (!value) message = "请输入邮箱地址。";
    else if (!input.validity.valid) message = "请输入有效的邮箱格式。";
    input.setAttribute("aria-invalid", String(Boolean(message)));
    field.classList.toggle("is-valid", Boolean(value) && !message);
    error.textContent = message;
    return !message;
  };

  input.addEventListener("blur", validate);
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") validate();
    result.textContent = "";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validate()) {
      input.focus();
      return;
    }

    const endpoint = form.dataset.endpoint?.trim();
    const label = submit.querySelector("span");
    submit.classList.add("is-loading");
    submit.disabled = true;
    label.textContent = "正在检查";
    result.textContent = "";

    try {
      if (!endpoint) {
        await new Promise((resolve) => window.setTimeout(resolve, prefersReducedMotion.matches ? 50 : 650));
        result.textContent = "预览完成：邮箱格式有效，但尚未配置申请接口，因此没有上传或保存。";
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value.trim() })
      });
      if (!response.ok) throw new Error("Request failed");
      result.textContent = "申请已提交。开放首批体验时，我们会通过邮箱联系你。";
      form.reset();
      field.classList.remove("is-valid");
    } catch {
      result.textContent = "暂时无法提交，请稍后重试。你的输入已保留。";
    } finally {
      submit.classList.remove("is-loading");
      submit.disabled = false;
      label.textContent = "申请首批体验";
    }
  });
}

setupHeroAtmosphere();
setupReveal();
setupHeader();
setupPointerLight();
setupExperienceTabs();
setupConversationDemo();
setupMemoryDemo();
setupBreathingDemo();
setupVoiceDemo();
setupAvatarLab();
setupSettings();
setupTimeline();
setupFaq();
setupAccessForm();

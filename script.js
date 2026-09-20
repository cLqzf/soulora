const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setupHeroVideo() {
  const video = document.querySelector("[data-hero-video]");
  if (!video) return;

  let isVisible = true;
  let playAttemptPending = false;
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");

  const markPlaying = () => {
    playAttemptPending = false;
    document.documentElement.classList.add("hero-video-is-playing");
    document.documentElement.classList.remove("hero-video-is-blocked");
  };

  const markBlocked = () => {
    playAttemptPending = false;
    document.documentElement.classList.add("hero-video-is-blocked");
  };

  const syncPlayback = () => {
    if (prefersReducedMotion.matches || document.hidden || !isVisible) {
      video.pause();
      if (prefersReducedMotion.matches && video.readyState >= 1) video.currentTime = 0;
      return;
    }

    if (!video.paused || playAttemptPending) return;
    playAttemptPending = true;
    let playback;
    try {
      playback = video.play();
    } catch (_error) {
      markBlocked();
      return;
    }
    if (playback && typeof playback.then === "function") {
      playback.then(markPlaying).catch(markBlocked);
    } else {
      playAttemptPending = false;
    }
  };

  const resumeFromWechatBridge = () => {
    const bridge = window.WeixinJSBridge;
    if (bridge && typeof bridge.invoke === "function") {
      bridge.invoke("getNetworkType", {}, syncPlayback);
    } else {
      syncPlayback();
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.02 });
    observer.observe(video.closest(".hero") || video);
  }

  video.addEventListener("playing", markPlaying);
  video.addEventListener("canplay", syncPlayback, { once: true });
  video.addEventListener("loadedmetadata", syncPlayback, { once: true });
  video.addEventListener("error", markBlocked);
  document.addEventListener("visibilitychange", syncPlayback);
  window.addEventListener("pageshow", syncPlayback);
  document.addEventListener("WeixinJSBridgeReady", resumeFromWechatBridge, { once: true });
  document.addEventListener("touchstart", syncPlayback, { once: true, passive: true, capture: true });
  document.addEventListener("pointerdown", syncPlayback, { once: true, passive: true, capture: true });
  if (prefersReducedMotion.addEventListener) prefersReducedMotion.addEventListener("change", syncPlayback);
  else prefersReducedMotion.addListener(syncPlayback);

  if (window.WeixinJSBridge) resumeFromWechatBridge();
  syncPlayback();
}

function setupHeroAtmosphere() {
  const canvas = document.querySelector("[data-hero-atmosphere]");
  const hero = canvas?.closest(".hero");
  const context = canvas?.getContext("2d");
  if (!canvas || !hero || !context || hero.classList.contains("hero-video-background")) return;

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
  const menuLinks = [...menu.querySelectorAll("a")];

  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  const setMenu = (open, restoreFocus = false) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
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
  menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (!open) return;
    if (event.key === "Escape") {
      setMenu(false, true);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [toggle, ...menuLinks];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.matchMedia("(min-width: 981px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
}

function setupAnchorNavigation() {
  const header = document.querySelector("[data-header]");
  const links = [...document.querySelectorAll('a[href^="#"]')];
  let alignmentToken = 0;
  let initialAlignmentQueued = false;
  if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

  const revealDestination = (section) => {
    section.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  };

  const destinationTop = (anchor) => {
    const headerHeight = header?.getBoundingClientRect().height || 76;
    const rect = anchor.getBoundingClientRect();
    const documentTop = rect.top + window.scrollY;
    const anchorId = anchor.id;
    if (anchorId !== "early-access") {
      const safeOffset = window.matchMedia("(max-width: 720px)").matches
        ? headerHeight + 12
        : headerHeight + 14;
      return Math.max(0, documentTop - safeOffset);
    }

    const viewportHeight = Math.max(320, window.visualViewport?.height || window.innerHeight);
    const viewportOffsetTop = window.visualViewport?.offsetTop || 0;
    const freeSpace = Math.max(0, viewportHeight - Math.min(rect.height, viewportHeight));
    const narrowLayout = window.matchMedia("(max-width: 720px)").matches;

    // On desktop the transparent header only occupies the left and right edges,
    // so the centered conversion block can safely share its vertical band. Keep
    // the whole block close to the top of the visual viewport, as in the intended
    // composition, instead of centering the section and hiding the form below it.
    const desiredViewportTop = narrowLayout
      ? Math.max(headerHeight + 12, Math.min(headerHeight + 36, freeSpace / 2))
      : Math.max(12, Math.min(28, freeSpace / 2));
    const parentSection = anchor.closest("section");
    const sectionRect = parentSection?.getBoundingClientRect();
    const sectionTop = sectionRect ? sectionRect.top + window.scrollY : 0;
    const sectionBottom = sectionRect ? sectionRect.bottom + window.scrollY : Infinity;
    const earliestScroll = sectionTop - viewportOffsetTop;
    // Leave a small overlap for late font/layout shifts after the scroll settles.
    const latestScroll = sectionBottom - viewportOffsetTop - viewportHeight - 16;
    const preferredScroll = documentTop - viewportOffsetTop - desiredViewportTop;
    // Keep both chapter edges outside the visual viewport: no previous chapter
    // above the conversion canvas and no next-chapter strip below it.
    return Math.max(0, earliestScroll, Math.min(preferredScroll, Math.max(earliestScroll, latestScroll)));
  };

  const goToHash = (hash, behavior = "smooth", moveFocus = false) => {
    if (!hash || hash === "#") return;
    const anchor = document.querySelector(hash);
    if (!anchor) return;
    const section = anchor.closest("section") || anchor;
    const currentAlignment = ++alignmentToken;
    revealDestination(section);
    section.classList.remove("is-arriving");
    window.requestAnimationFrame(() => section.classList.add("is-arriving"));
    const instant = behavior !== "smooth";
    if (instant) document.documentElement.classList.add("is-anchor-jumping");
    window.scrollTo({ top: destinationTop(anchor), behavior: instant ? "auto" : "smooth" });
    if (instant) window.requestAnimationFrame(() => document.documentElement.classList.remove("is-anchor-jumping"));
    window.setTimeout(() => section.classList.remove("is-arriving"), prefersReducedMotion.matches ? 80 : 1100);

    if (moveFocus) {
      const focusTarget = anchor.querySelector("h1, h2") || section.querySelector("h1, h2") || anchor;
      focusTarget.setAttribute("tabindex", "-1");
      window.setTimeout(() => {
        if (currentAlignment !== alignmentToken) {
          focusTarget.removeAttribute("tabindex");
          return;
        }
        focusTarget.focus({ preventScroll: true });
        focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
      }, prefersReducedMotion.matches ? 0 : 620);
    }

    // Font loading, viewport chrome and reveal/arrival transforms can change the
    // geometry. Re-measure only after those transforms have fully settled.
    // Any deliberate user interaction cancels this correction via alignmentToken.
    window.setTimeout(() => {
      if (currentAlignment !== alignmentToken) return;
      const correctedTop = destinationTop(anchor);
      if (Math.abs(window.scrollY - correctedTop) > 2) {
        document.documentElement.classList.add("is-anchor-jumping");
        window.scrollTo({ top: correctedTop, behavior: "auto" });
        window.requestAnimationFrame(() => document.documentElement.classList.remove("is-anchor-jumping"));
      }
    }, prefersReducedMotion.matches ? 0 : 1300);
  };

  const cancelPendingAlignment = () => { alignmentToken += 1; };
  window.addEventListener("wheel", cancelPendingAlignment, { passive: true });
  window.addEventListener("touchstart", cancelPendingAlignment, { passive: true });
  window.addEventListener("pointerdown", cancelPendingAlignment, { passive: true });
  window.addEventListener("keydown", cancelPendingAlignment);

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || !document.querySelector(hash)) return;
      event.preventDefault();
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
      goToHash(hash, prefersReducedMotion.matches ? "auto" : "smooth", true);
    });
  });

  window.addEventListener("hashchange", () => goToHash(window.location.hash, prefersReducedMotion.matches ? "auto" : "smooth"));
  const alignInitialHash = () => {
    if (!window.location.hash || initialAlignmentQueued) return;
    initialAlignmentQueued = true;
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => goToHash(window.location.hash, "auto")));
  };

  if (document.readyState === "complete") alignInitialHash();
  else window.addEventListener("load", alignInitialHash, { once: true });
  if (document.fonts?.ready) document.fonts.ready.then(alignInitialHash);
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    initialAlignmentQueued = false;
    alignInitialHash();
  });
}

function setupSectionProgress() {
  const progress = document.querySelector("[data-section-progress]");
  if (!progress) return;
  const links = [...progress.querySelectorAll("[data-section-link]")];
  const sections = links.map((link) => document.querySelector(`[data-scroll-section="${link.dataset.sectionLink}"]`)).filter(Boolean);
  const hero = document.querySelector(".hero");

  const updateVisibility = () => {
    const threshold = Math.max(320, (hero?.offsetHeight || window.innerHeight) * 0.72);
    progress.classList.toggle("is-visible", window.scrollY > threshold);
  };

  const activate = (id) => {
    links.forEach((link) => {
      const current = link.dataset.sectionLink === id;
      link.classList.toggle("is-active", current);
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    document.querySelectorAll("[data-mobile-menu] a[href^='#'], .desktop-nav a[href^='#']").forEach((link) => {
      const current = link.getAttribute("href") === `#${id}`;
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activate(visible.target.dataset.scrollSection);
    }, { rootMargin: "-22% 0px -56%", threshold: [0.01, 0.18, 0.4] });
    sections.forEach((section) => observer.observe(section));
  }

  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
}

function setupPointerLight() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const stage = document.querySelector("[data-tilt-stage]");
  if (!finePointer.matches || prefersReducedMotion.matches) return;
  let pointerFrame = 0;
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let stageFrame = 0;
  let stageEvent = null;

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--pointer-x", `${pointerX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${pointerY}px`);
        pointerFrame = 0;
      });
    },
    { passive: true }
  );

  stage?.addEventListener("pointermove", (event) => {
    stageEvent = event;
    if (stageFrame) return;
    stageFrame = window.requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const x = ((stageEvent.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((stageEvent.clientY - rect.top) / rect.height - 0.5) * 2;
      stage.style.setProperty("--tilt-x", x.toFixed(3));
      stage.style.setProperty("--tilt-y", y.toFixed(3));
      stageFrame = 0;
    });
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
  const submit = form.querySelector("button[type='submit']");
  const quickReplies = [...document.querySelectorAll("[data-quick-reply]")];

  let responding = false;
  const setResponding = (busy) => {
    responding = busy;
    form.setAttribute("aria-busy", String(busy));
    thread.setAttribute("aria-busy", String(busy));
    input.disabled = busy;
    if (submit) submit.disabled = busy;
    quickReplies.forEach((button) => { button.disabled = busy; });
  };
  const respond = (value) => {
    if (responding || !value.trim()) return;
    setResponding(true);
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
    typing.setAttribute("aria-label", "Soulora is listening");
    typing.innerHTML = "<i></i><i></i><i></i>";
    row.append(orb, typing);
    thread.append(row);
    thread.scrollTop = thread.scrollHeight;

    window.setTimeout(() => {
      const calmReply = value.toLowerCase().includes("stay")
        ? "Of course. I'll stay right here. You don't need to do anything yet—when you're ready to speak, I'll listen."
        : "We can focus on the smallest next step. Right now, is it the content itself—or the feeling of standing in front of everyone—that has your attention?";
      typing.classList.remove("typing-message");
      typing.removeAttribute("aria-label");
      typing.textContent = calmReply;
      thread.scrollTop = thread.scrollHeight;
      setResponding(false);
    }, prefersReducedMotion.matches ? 50 : 850);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    respond(input.value);
  });
  quickReplies.forEach((button) => {
    button.addEventListener("click", () => respond(button.dataset.quickReply || ""));
  });
}

function setupAmbientMotionBudget() {
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) return;
  const regions = [".principle-rail", ".avatar-lab", ".experience", ".system", ".early-access", ".site-footer"]
    .map((selector) => document.querySelector(selector))
    .filter(Boolean);
  if (!regions.length) return;

  document.documentElement.classList.add("motion-budgeted");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("is-motion-active", entry.isIntersecting));
  }, { rootMargin: "12% 0px", threshold: 0.01 });
  regions.forEach((region) => observer.observe(region));
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
      result.textContent = "Your edit is kept only in this page demo. It has not been uploaded or saved long term.";
      return;
    }
    result.textContent = action === "keep"
      ? "This memory is allowed for the current demo. Refresh the page to reset it."
      : "Memory declined. This content will not leave the current page.";
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
    if (remaining === 0) instruction.textContent = "That's enough. You don't need to do anything more right now.";
    else {
      const phase = (30 - remaining) % 8;
      instruction.textContent = phase < 4 ? "Breathe in slowly…" : "Breathe out gently…";
    }
  };
  const stop = (completed = false) => {
    window.clearInterval(timer);
    timer = null;
    demo.classList.remove("is-running", "is-paused");
    icon.setAttribute("href", "#icon-play");
    label.textContent = completed ? "Again" : "Continue";
  };
  const start = () => {
    if (remaining === 0) remaining = 30;
    demo.classList.add("is-running");
    demo.classList.remove("is-paused");
    icon.setAttribute("href", "#icon-pause");
    label.textContent = "Pause";
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
      label.textContent = "Continue";
      instruction.textContent = "Paused. Take it at your own pace.";
    } else start();
  });
  reset.addEventListener("click", () => {
    window.clearInterval(timer);
    timer = null;
    remaining = 30;
    demo.classList.remove("is-running", "is-paused");
    icon.setAttribute("href", "#icon-play");
    label.textContent = "Start";
    instruction.textContent = "When you're ready, we'll begin slowly.";
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
    toggle.setAttribute("aria-label", "Play voice companion concept");
  };
  const play = () => {
    if (current >= duration) current = 0;
    demo.classList.add("is-playing");
    icon.setAttribute("href", "#icon-pause");
    toggle.setAttribute("aria-label", "Pause voice companion concept");
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
      image.alt = `Soulora companion avatar: ${button.dataset.avatarName || "Unnamed"}`;
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
      const name = button.querySelector("strong")?.textContent || "This setting";
      if (feedback) feedback.textContent = `${name} is now ${next ? "on" : "off"}. This demo state is not saved.`;
    });
  });
}

function setupTimeline() {
  const timeline = document.querySelector("[data-timeline]");
  const progress = timeline?.querySelector("[data-timeline-progress]");
  const moments = timeline ? [...timeline.querySelectorAll(".moment")] : [];
  if (!timeline || !progress || !moments.length) return;

  const activate = (activeMoment) => {
    moments.forEach((moment) => moment.classList.toggle("is-current", moment === activeMoment));
    const index = moments.indexOf(activeMoment);
    timeline.style.setProperty("--timeline-progress", `${18 + index * 41}%`);
  };

  moments.forEach((moment) => {
    moment.addEventListener("pointerenter", () => activate(moment));
    moment.addEventListener("focus", () => activate(moment));
    moment.addEventListener("click", () => activate(moment));
  });

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      activate(visible.target);
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
    if (!value) message = "Enter your email address.";
    else if (!input.validity.valid) message = "Enter a valid email address.";
    input.setAttribute("aria-invalid", String(Boolean(message)));
    field.classList.toggle("is-valid", Boolean(value) && !message);
    error.textContent = message;
    return !message;
  };

  input.addEventListener("blur", validate);
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") validate();
    result.textContent = "";
    delete result.dataset.state;
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
    form.setAttribute("aria-busy", "true");
    label.textContent = "Checking…";
    result.textContent = "";
    delete result.dataset.state;

    try {
      if (!endpoint) {
        await new Promise((resolve) => window.setTimeout(resolve, prefersReducedMotion.matches ? 50 : 650));
        result.dataset.state = "preview";
        result.textContent = "Preview complete: your email format is valid, but no application endpoint is configured, so nothing was uploaded or saved.";
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value.trim() })
      });
      if (!response.ok) throw new Error("Request failed");
      result.dataset.state = "success";
      result.textContent = "Application submitted. We'll contact you by email when early access opens.";
      form.reset();
      field.classList.remove("is-valid");
    } catch {
      result.dataset.state = "error";
      result.textContent = "We couldn't submit your application. Try again later—your input has been kept.";
    } finally {
      submit.classList.remove("is-loading");
      submit.disabled = false;
      form.setAttribute("aria-busy", "false");
      label.textContent = "Apply for early access";
    }
  });
}

setupHeroVideo();
setupHeroAtmosphere();
setupReveal();
setupHeader();
setupAnchorNavigation();
setupSectionProgress();
setupPointerLight();
setupAmbientMotionBudget();
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

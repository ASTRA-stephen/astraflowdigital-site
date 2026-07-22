/* AstraFlow Digital — home page renderer & interactions */

const icon = (name, extra = "") => `<i data-lucide="${name}" ${extra}></i>`;

async function loadContent() {
  const res = await fetch("./data/content.json");
  if (!res.ok) throw new Error(`Failed to load content.json (${res.status})`);
  return res.json();
}

function renderNav(nav) {
  const links = document.getElementById("nav-links");
  const mobileLinks = document.getElementById("mobile-links");
  const linkHtml = nav.links.map((l) => `<a href="${l.href}">${l.label}</a>`).join("");
  links.innerHTML = linkHtml;
  mobileLinks.innerHTML = linkHtml;

  document.getElementById("nav-brand-text").innerHTML =
    `${nav.brand}<span class="accent"> ${nav.brandAccent}</span>`;

  document.getElementById("footer-brand-text").textContent = `${nav.brand} ${nav.brandAccent}`;
}

function renderHero(hero) {
  const title = document.getElementById("hero-title");
  title.innerHTML = hero.headline
    .map((line) => (line.gradient ? `<span class="gradient-text">${line.text}</span>` : line.text))
    .join("<br>");

  document.getElementById("hero-lead").textContent = hero.paragraph;

  const actions = document.getElementById("hero-actions");
  actions.innerHTML = hero.actions
    .map((a) => `<a class="btn btn-${a.style}" href="${a.href}">${a.label}</a>`)
    .join("");

  const trust = document.getElementById("trust-row");
  trust.innerHTML = hero.trust
    .map((t) => `<div class="trust-item"><strong>${t.title}</strong><span>${t.detail}</span></div>`)
    .join("");

  const chipLayer = document.getElementById("hero-chips");
  chipLayer.innerHTML = hero.chips
    .map(
      (c, i) => `
      <button
        type="button"
        class="icon-chip"
        style="left:${c.x}%; top:${c.y}%;"
        data-chip-index="${i}"
        data-icon="${c.icon}"
        data-label="${c.label}"
        data-detail="${c.detail}"
        aria-expanded="false"
        aria-label="${c.label}"
      >${icon(c.icon)}</button>`
    )
    .join("");
  chipLayer.insertAdjacentHTML(
    "afterend",
    `<div class="chip-tooltip" id="chip-tooltip" role="tooltip">
      <button type="button" class="chip-tooltip-close" id="chip-tooltip-close" aria-label="Close">${icon("x")}</button>
      <div class="chip-tooltip-icon" id="chip-tooltip-icon"></div>
      <strong id="chip-tooltip-label"></strong>
      <p id="chip-tooltip-detail"></p>
    </div>`
  );

  drawConnectors(hero.chips);
  renderEarthLights(document.getElementById("earth-lights"));
}

function renderEarthLights(container, count = 70) {
  const colors = ["232, 201, 122", "166, 133, 255", "245, 241, 232"];
  const dots = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * 48;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    const size = (Math.random() * 1.6 + 0.6).toFixed(2);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const baseOpacity = (Math.random() * 0.35 + 0.3).toFixed(2);
    const duration = (Math.random() * 3 + 2.2).toFixed(2);
    const delay = (-Math.random() * duration).toFixed(2);
    const glow = (size * 2.4).toFixed(1);
    dots.push(
      `<span class="star-dot" style="left:${x.toFixed(2)}%; top:${y.toFixed(2)}%; width:${size}px; height:${size}px; background: rgb(${color}); box-shadow: 0 0 ${glow}px rgba(${color}, .9); --base-opacity:${baseOpacity}; animation-duration:${duration}s; animation-delay:${delay}s;"></span>`
    );
  }
  container.innerHTML = dots.join("");
}

function drawConnectors(chips) {
  const svg = document.getElementById("hero-connectors");
  const ringX = 66;
  const ringY = 48;
  const lines = chips
    .map((c) => `<line x1="${c.x}" y1="${c.y}" x2="${ringX}" y2="${ringY}"></line>`)
    .join("");
  svg.innerHTML = `
    <defs>
      <linearGradient id="connectorGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#34d2ff" />
        <stop offset="100%" stop-color="#8a25ff" />
      </linearGradient>
    </defs>
    ${lines}
  `;
}

function renderStats(stats) {
  document.getElementById("stats-kicker").textContent = stats.kicker;
  document.getElementById("stats-heading").textContent = stats.heading;
  document.getElementById("stats-paragraph").textContent = stats.paragraph;
  document.getElementById("stats-grid").innerHTML = stats.items
    .map(
      (s, i) => `
      <div class="glass stat-card" data-aos="fade-up" data-aos-delay="${i * 80}">
        <div class="stat-icon">${icon(s.icon)}</div>
        <h3>${s.title}</h3>
        <p>${s.detail}</p>
      </div>`
    )
    .join("");
}

function renderServices(services) {
  document.getElementById("services-heading").textContent = services.heading;
  document.getElementById("services-paragraph").textContent = services.paragraph;
  document.getElementById("services-grid").innerHTML = services.items
    .map(
      (s, i) => `
      <article class="glass service-card" data-aos="fade-up" data-aos-delay="${(i % 3) * 80}">
        <div class="icon">${icon(s.icon)}</div>
        <h3>${s.title}</h3>
        <p>${s.detail}</p>
        <ul>
          ${s.bullets.map((b) => `<li>${icon("check")}${b}</li>`).join("")}
        </ul>
      </article>`
    )
    .join("");
}

function renderComparison(comparison) {
  document.getElementById("comparison-kicker").textContent = comparison.kicker;
  document.getElementById("comparison-heading").textContent = comparison.heading;
  document.getElementById("comparison-paragraph").textContent = comparison.paragraph;

  const buildCol = (col, cls) => `
    <div class="glass comparison-col ${cls}" data-aos="fade-up">
      <span class="comparison-label">${col.label}</span>
      ${col.items
        .map(
          (item) => `
        <div class="comparison-item">
          <span class="dot">${icon(item.icon)}</span>
          <div>
            <h4>${item.title}</h4>
            <p>${item.detail}</p>
          </div>
        </div>`
        )
        .join("")}
    </div>`;

  document.getElementById("comparison-grid").innerHTML =
    buildCol(comparison.before, "before") + buildCol(comparison.after, "after");
}

function renderProcess(process) {
  document.getElementById("process-kicker").textContent = process.kicker;
  document.getElementById("process-heading").textContent = process.heading;
  document.getElementById("process-paragraph").textContent = process.paragraph;
  document.getElementById("process-grid").innerHTML = process.items
    .map(
      (p, i) => `
      <article class="glass process-card" data-aos="fade-up" data-aos-delay="${i * 80}">
        <span class="step">${p.step}</span>
        <h3>${p.title}</h3>
        <p>${p.detail}</p>
      </article>`
    )
    .join("");
}

function renderPackages(packages) {
  document.getElementById("packages-kicker").textContent = packages.kicker;
  document.getElementById("packages-heading").textContent = packages.heading;
  document.getElementById("packages-paragraph").textContent = packages.paragraph;
  document.getElementById("packages-grid").innerHTML = packages.items
    .map(
      (p, i) => `
      <article class="glass package-card ${p.featured ? "featured" : ""}" data-aos="fade-up" data-aos-delay="${i * 100}">
        <span class="package-tag">${p.tag}</span>
        <h3>${p.title}</h3>
        <p class="desc">${p.detail}</p>
        <ul>
          ${p.features.map((f) => `<li>${icon("check")}${f}</li>`).join("")}
        </ul>
        <p class="package-note">${p.note}</p>
        <a class="btn ${p.featured ? "btn-primary" : "btn-secondary"}" href="${p.cta.href}">${p.cta.label}</a>
      </article>`
    )
    .join("");
}

function renderCta(cta) {
  document.getElementById("cta-kicker").textContent = cta.kicker;
  document.getElementById("cta-heading").textContent = cta.heading;
  document.getElementById("cta-paragraph").textContent = cta.paragraph;
  document.getElementById("cta-actions").innerHTML = cta.actions
    .map((a) => `<a class="btn btn-${a.style}" href="${a.href}">${a.label}</a>`)
    .join("");
}

function renderFooter(footer) {
  document.getElementById("footer-links").innerHTML = footer.links
    .map((l) => `<a href="${l.href}">${l.label}</a>`)
    .join("");
  document.getElementById("year").textContent = new Date().getFullYear();
}

function wireNav() {
  const nav = document.getElementById("site-nav");
  const toggle = document.getElementById("nav-toggle");
  const mobilePanel = document.getElementById("mobile-panel");
  const brand = document.querySelector(".brand");

  if (brand) {
    brand.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", "#home");
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 12);
    },
    { passive: true }
  );

  toggle.addEventListener("click", () => {
    const open = mobilePanel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = open ? icon("x") : icon("menu");
    lucide.createIcons();
  });

  mobilePanel.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      mobilePanel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = icon("menu");
      lucide.createIcons();
    }
  });
}

function wireActiveLinkHighlight() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = () => [...document.querySelectorAll(".nav-links a")];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks().forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ==========================================================================
   Interactive layer — custom cursor, spotlight, tilt, magnetic buttons,
   scroll progress, kicker decode-in. All skip on touch / reduced-motion.
   ========================================================================== */

const fineHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function wireCursor() {
  if (!fineHover()) return;
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      dot.classList.add("active");
      ring.classList.add("active");
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () => {
    dot.classList.remove("active");
    ring.classList.remove("active");
  });

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, .glass")) ring.classList.add("hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a, button, .glass")) ring.classList.remove("hover");
  });

  (function raf() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  })();
}

function wireSpotlight() {
  const spotlight = document.getElementById("spotlight");
  if (!spotlight || !fineHover()) return;

  let pending = false;
  let lastX = 0;
  let lastY = 0;

  window.addEventListener(
    "mousemove",
    (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      spotlight.classList.add("active");
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mx", `${lastX}px`);
        document.documentElement.style.setProperty("--my", `${lastY}px`);
        pending = false;
      });
    },
    { passive: true }
  );
}

function wireScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  function update() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function wireTilt() {
  if (!fineHover() || reducedMotion()) return;

  document.addEventListener(
    "mousemove",
    (e) => {
      const card = e.target.closest(".glass");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - py) * 8;
      const rotateY = (px - 0.5) * 8;
      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty("--gx", `${px * 100}%`);
      card.style.setProperty("--gy", `${py * 100}%`);
    },
    { passive: true }
  );

  document.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".glass");
    if (!card || card.contains(e.relatedTarget)) return;
    card.style.transform = "";
  });
}

function wireMagneticButtons() {
  if (!fineHover() || reducedMotion()) return;

  document.addEventListener(
    "mousemove",
    (e) => {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${relX * 0.22}px, ${relY * 0.32}px)`;
    },
    { passive: true }
  );

  document.addEventListener("mouseout", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn || btn.contains(e.relatedTarget)) return;
    btn.style.transform = "";
  });
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scrambleReveal(el) {
  const final = el.textContent;
  const len = final.length;
  const totalFrames = Math.min(24, len * 3);
  const revealEvery = totalFrames / len;
  let frame = 0;

  function tick() {
    let out = "";
    for (let i = 0; i < len; i++) {
      if (final[i] === " " || frame / revealEvery > i) {
        out += final[i];
      } else {
        out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    el.textContent = out;
    frame++;
    if (frame <= totalFrames) requestAnimationFrame(tick);
    else el.textContent = final;
  }
  tick();
}

function wireChipTooltips() {
  const chipLayer = document.getElementById("hero-chips");
  const tooltip = document.getElementById("chip-tooltip");
  if (!chipLayer || !tooltip) return;

  const closeBtn = document.getElementById("chip-tooltip-close");
  const iconEl = document.getElementById("chip-tooltip-icon");
  const labelEl = document.getElementById("chip-tooltip-label");
  const detailEl = document.getElementById("chip-tooltip-detail");
  let activeChip = null;
  let leaveTimer = null;

  function cancelLeaveTimer() {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }

  function scheduleClose() {
    cancelLeaveTimer();
    leaveTimer = setTimeout(closeTooltip, 220);
  }

  function closeTooltip() {
    cancelLeaveTimer();
    tooltip.classList.remove("open");
    if (activeChip) {
      activeChip.classList.remove("active");
      activeChip.setAttribute("aria-expanded", "false");
    }
    activeChip = null;
  }

  function openTooltip(chip) {
    if (activeChip === chip) {
      closeTooltip();
      return;
    }
    if (activeChip) {
      activeChip.classList.remove("active");
      activeChip.setAttribute("aria-expanded", "false");
    }
    activeChip = chip;
    chip.classList.add("active");
    chip.setAttribute("aria-expanded", "true");

    iconEl.innerHTML = icon(chip.dataset.icon);
    labelEl.textContent = chip.dataset.label;
    detailEl.textContent = chip.dataset.detail;
    if (window.lucide) lucide.createIcons();

    const x = parseFloat(chip.style.left);
    const y = parseFloat(chip.style.top);
    const anchorRight = x < 50;
    tooltip.classList.toggle("anchor-right", anchorRight);
    tooltip.classList.toggle("anchor-left", !anchorRight);
    tooltip.style.top = `${y}%`;
    if (anchorRight) {
      tooltip.style.left = `calc(${x}% + 46px)`;
      tooltip.style.right = "auto";
    } else {
      tooltip.style.right = `calc(${100 - x}% + 46px)`;
      tooltip.style.left = "auto";
    }
    tooltip.classList.add("open");
  }

  chipLayer.addEventListener("click", (e) => {
    const chip = e.target.closest(".icon-chip");
    if (!chip) return;
    openTooltip(chip);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeTooltip);

  // Auto-close once the mouse leaves both the chip and the card, with a
  // short grace period so crossing the gap between them (chip -> card)
  // doesn't cause a flicker-close.
  const isInActiveArea = (el) => !!el && !!el.closest && (el.closest(".icon-chip") || el.closest(".chip-tooltip"));

  chipLayer.addEventListener("mouseover", (e) => {
    if (e.target.closest(".icon-chip")) cancelLeaveTimer();
  });
  chipLayer.addEventListener("mouseout", (e) => {
    if (!activeChip || !e.target.closest(".icon-chip")) return;
    if (isInActiveArea(e.relatedTarget)) return;
    scheduleClose();
  });
  tooltip.addEventListener("mouseover", cancelLeaveTimer);
  tooltip.addEventListener("mouseout", (e) => {
    if (!activeChip) return;
    if (isInActiveArea(e.relatedTarget)) return;
    scheduleClose();
  });

  document.addEventListener("click", (e) => {
    if (!activeChip) return;
    if (e.target.closest(".icon-chip") || e.target.closest(".chip-tooltip")) return;
    closeTooltip();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeTooltip();
  });
}

function wireKickerDecode() {
  if (reducedMotion()) return;
  const seen = new WeakSet();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          scrambleReveal(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll(".kicker").forEach((k) => observer.observe(k));
}

async function init() {
  try {
    const content = await loadContent();
    renderNav(content.nav);
    renderHero(content.hero);
    renderStats(content.stats);
    renderServices(content.services);
    renderComparison(content.comparison);
    renderProcess(content.process);
    renderPackages(content.packages);
    renderCta(content.cta);
    renderFooter(content.footer);
  } catch (err) {
    console.error(
      "AstraFlow: could not load data/content.json. If you opened this file directly (file://), " +
        "serve the folder with a local server (e.g. VS Code 'Live Server' extension) so fetch() can read the JSON.",
      err
    );
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div style="background:#ff4d4d;color:#fff;padding:12px 20px;font-family:sans-serif;font-size:14px;">
        Could not load site content — this page needs to be served over HTTP (not opened as a local file).
        Try the VS Code "Live Server" extension.
      </div>`
    );
  }

  wireNav();
  wireActiveLinkHighlight();
  wireCursor();
  wireSpotlight();
  wireScrollProgress();
  wireTilt();
  wireMagneticButtons();
  wireKickerDecode();
  wireChipTooltips();

  if (window.lucide) lucide.createIcons();
  if (window.AOS) AOS.init({ duration: 700, once: true, offset: 60, easing: "ease-out-cubic" });
}

document.addEventListener("DOMContentLoaded", init);

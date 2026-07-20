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
    .map((c) => `<div class="icon-chip" style="left:${c.x}%; top:${c.y}%;">${icon(c.icon)}</div>`)
    .join("");

  drawConnectors(hero.chips);
  renderEarthLights(document.getElementById("earth-lights"));
}

function renderEarthLights(container, count = 70) {
  const colors = ["255, 214, 130", "255, 180, 100", "255, 250, 235"];
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
  document.getElementById("services-kicker").textContent = services.kicker;
  document.getElementById("services-heading").textContent = services.heading;
  document.getElementById("services-paragraph").textContent = services.paragraph;
  document.getElementById("services-grid").innerHTML = services.items
    .map(
      (s, i) => `
      <article class="glass service-card" data-aos="fade-up" data-aos-delay="${(i % 3) * 80}">
        <div class="icon">${icon(s.icon)}</div>
        <h3>${s.title}</h3>
        <p>${s.detail}</p>
      </article>`
    )
    .join("");
}

function renderComparison(comparison) {
  document.getElementById("comparison-kicker").textContent = comparison.kicker;
  document.getElementById("comparison-heading").textContent = comparison.heading;

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
  document.getElementById("footer-tagline").textContent = footer.tagline;
  document.getElementById("footer-links").innerHTML = footer.links
    .map((l) => `<a href="${l.href}">${l.label}</a>`)
    .join("");
  document.getElementById("year").textContent = new Date().getFullYear();
}

function wireNav() {
  const nav = document.getElementById("site-nav");
  const toggle = document.getElementById("nav-toggle");
  const mobilePanel = document.getElementById("mobile-panel");

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

  if (window.lucide) lucide.createIcons();
  if (window.AOS) AOS.init({ duration: 700, once: true, offset: 60, easing: "ease-out-cubic" });
}

document.addEventListener("DOMContentLoaded", init);

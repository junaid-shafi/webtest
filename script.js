const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ====== CONFIG (change later easily) ====== */
const PRIMARY_WA = "918075024909"; // WhatsApp number with country code (no +)

/* Preloader */
window.addEventListener("load", () => {
  const pre = $("#preloader");
  if (!pre) return;
  setTimeout(() => pre.classList.add("hide"), 450);
  setTimeout(() => pre.setAttribute("aria-hidden", "true"), 900);
});

/* Mobile nav */
const navToggle = $("#navToggle");
const nav = $("#nav");
function setNav(open) {
  if (!nav || !navToggle) return;
  nav.classList.toggle("show", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
navToggle?.addEventListener("click", () => setNav(!nav.classList.contains("show")));
nav?.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (a && a.getAttribute("href")?.startsWith("#")) setNav(false);
});
document.addEventListener("click", (e) => {
  if (!nav || !navToggle) return;
  if (!nav.classList.contains("show")) return;
  if (nav.contains(e.target) || navToggle.contains(e.target)) return;
  setNav(false);
});

/* Scroll progress bar */
const progress = $("#progress");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (progress) progress.style.width = `${scrolled}%`;
});

/* Reveal on scroll */
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("in");
    io.unobserve(entry.target);
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* Floating Back to Top */
const toTop = $("#toTop");
function updateToTop() {
  const show = window.scrollY > 450;
  toTop?.classList.toggle("show", show);
}
window.addEventListener("scroll", updateToTop);
updateToTop();
toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* Floating Contact FAB */
const fabMain = $("#fabMain");
const fabMenu = $("#fabMenu");
function setFab(open) {
  if (!fabMain || !fabMenu) return;
  fabMenu.classList.toggle("show", open);
  fabMenu.setAttribute("aria-hidden", String(!open));
  fabMain.setAttribute("aria-expanded", String(open));
}
fabMain?.addEventListener("click", () => setFab(!fabMenu.classList.contains("show")));
document.addEventListener("click", (e) => {
  if (!fabMenu || !fabMain) return;
  if (!fabMenu.classList.contains("show")) return;
  if (fabMenu.contains(e.target) || fabMain.contains(e.target)) return;
  setFab(false);
});

/* WhatsApp helpers */
function waLink(text) {
  return `https://wa.me/${PRIMARY_WA}?text=${encodeURIComponent(text)}`;
}

/* Toast */
const toast = $("#toast");
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

/* Copy to clipboard */
$$("[data-copy]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const val = btn.dataset.copy || "";
    try {
      await navigator.clipboard.writeText(val);
      showToast("Copied to clipboard");
    } catch {
      showToast("Copy failed (browser blocked)");
    }
  });
});

/* Plant chips: text + optional images */
const plantTitle = $("#plantTitle");
const chipText = $("#chipText");
const plantVisual = $("#plantVisual");

const plantData = {
  stp: {
    title: "STP Preview",
    text: "STP: Treats sewage from hospitals and residential buildings for safe reuse.",
    img: "assets/stp.jpg",
    fallback:
      "radial-gradient(120px 120px at 25% 35%, rgba(26,167,255,0.35), transparent 60%), radial-gradient(140px 140px at 70% 30%, rgba(11,99,255,0.30), transparent 60%), linear-gradient(135deg, rgba(7,11,24,0.92), rgba(12,20,48,0.92))"
  },
  etp: {
    title: "ETP Preview",
    text: "ETP: Treats industrial/chemical effluent to meet safety requirements.",
    img: "assets/etp.jpg",
    fallback:
      "radial-gradient(140px 140px at 70% 30%, rgba(255,138,52,0.22), transparent 60%), radial-gradient(120px 120px at 25% 35%, rgba(26,167,255,0.22), transparent 60%), linear-gradient(135deg, rgba(7,11,24,0.92), rgba(12,20,48,0.92))"
  },
  wtp: {
    title: "WTP Preview",
    text: "WTP: Purifies raw water into clean water suitable for usage and distribution.",
    img: "assets/wtp.jpg",
    fallback:
      "radial-gradient(140px 140px at 70% 30%, rgba(43,213,118,0.18), transparent 60%), radial-gradient(120px 120px at 25% 35%, rgba(26,167,255,0.22), transparent 60%), linear-gradient(135deg, rgba(7,11,24,0.92), rgba(12,20,48,0.92))"
  },
  ro: {
    title: "RO Preview",
    text: "RO Plant: Advanced filtration for high-quality drinking water output.",
    img: "assets/ro.jpg",
    fallback:
      "radial-gradient(140px 140px at 70% 30%, rgba(139,92,246,0.20), transparent 60%), radial-gradient(120px 120px at 25% 35%, rgba(26,167,255,0.22), transparent 60%), linear-gradient(135deg, rgba(7,11,24,0.92), rgba(12,20,48,0.92))"
  }
};

function setPlantVisual(imageUrl, fallback) {
  if (!plantVisual) return;
  const img = new Image();
  img.onload = () => {
    plantVisual.style.backgroundImage = `url('${imageUrl}')`;
  };
  img.onerror = () => {
    plantVisual.style.backgroundImage = fallback;
  };
  img.src = imageUrl;
}

function setPlant(key) {
  const d = plantData[key];
  if (!d) return;
  plantTitle && (plantTitle.textContent = d.title);
  chipText && (chipText.textContent = d.text);
  setPlantVisual(d.img, d.fallback);
}

$$(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    setPlant(btn.dataset.plant);
  });
});
setPlant("stp");

/* Modal */
const modal = $("#modal");
const modalContent = $("#modalContent");

function openModalHTML(html) {
  if (!modal || !modalContent) return;
  modalContent.innerHTML = html;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

const quickEnquiryHTML = `
  <h3>Quick Enquiry (WhatsApp)</h3>
  <p>Select a service to open WhatsApp with a prefilled enquiry message.</p>

  <div class="qe-grid">
    <div class="qe-card">
      <strong>Waste Water (STP / ETP / WTP / RO)</strong>
      <p>Share your site type and requirement for a quick quote.</p>
      <a class="btn btn-primary" target="_blank" rel="noopener"
        href="${waLink("Hello ENEXIO SEA, I need a quote for STP/ETP/WTP/RO. Please contact me.")}">
        <i class="fa-brands fa-whatsapp"></i> Enquire
      </a>
    </div>

    <div class="qe-card">
      <strong>Water Proofing</strong>
      <p>Terrace leakage, bathroom seepage, wall moisture protection.</p>
      <a class="btn btn-primary" target="_blank" rel="noopener"
        href="${waLink("Hello ENEXIO SEA, I need waterproofing service. Please contact me with details and cost.")}">
        <i class="fa-brands fa-whatsapp"></i> Enquire
      </a>
    </div>

    <div class="qe-card">
      <strong>Exporting</strong>
      <p>Selected products & materials to chosen regions.</p>
      <a class="btn btn-primary" target="_blank" rel="noopener"
        href="${waLink("Hello ENEXIO SEA, I need exporting support. Please contact me.")}">
        <i class="fa-brands fa-whatsapp"></i> Enquire
      </a>
    </div>

    <div class="qe-card">
      <strong>Manpower Supply</strong>
      <p>Security staff & housekeeping staff based on requirement.</p>
      <a class="btn btn-primary" target="_blank" rel="noopener"
        href="${waLink("Hello ENEXIO SEA, I need manpower supply (security/housekeeping). Please contact me.")}">
        <i class="fa-brands fa-whatsapp"></i> Enquire
      </a>
    </div>
  </div>
`;

const modalTemplates = {
  brochure: `
    <h3>ENEXIO SEA — Brochure</h3>
    <p>Brochure poster (image). You can replace <code>assets/brochure.jpg</code> later with an updated file.</p>
    <p style="margin:0 0 10px;">
      <a class="btn btn-outline btn-small" href="assets/brochure.jpg" target="_blank" rel="noopener">
        Open full image in new tab <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
    </p>
    <img class="brochure-img" src="assets/brochure.jpg" alt="ENEXIO SEA brochure poster" loading="lazy" />
  `,
  quickEnquiry: quickEnquiryHTML,
  waterproofing: `
    <h3>Water Proofing</h3>
    <p>Leakage prevention and seepage control for terraces, bathrooms, walls and moisture-prone areas.</p>
    <ul class="features" style="margin:12px 0 0;">
      <li><i class="fa-solid fa-circle-check"></i> Terrace leakage solution</li>
      <li><i class="fa-solid fa-circle-check"></i> Bathroom seepage control</li>
      <li><i class="fa-solid fa-circle-check"></i> Wall moisture protection</li>
      <li><i class="fa-solid fa-circle-check"></i> Suitable for buildings & houses</li>
    </ul>
    <p style="margin-top:14px;">
      <button class="btn btn-primary" data-modal="quickEnquiry"><i class="fa-brands fa-whatsapp"></i> Enquire now</button>
    </p>
  `,
  exporting: `
    <h3>Exporting</h3>
    <p>Export coordination for selected Indian products and materials to chosen regions.</p>
    <ul class="features" style="margin:12px 0 0;">
      <li><i class="fa-solid fa-circle-check"></i> Coordination and communication</li>
      <li><i class="fa-solid fa-circle-check"></i> Supply to selected countries</li>
      <li><i class="fa-solid fa-circle-check"></i> Documentation support (as required)</li>
    </ul>
    <p style="margin-top:14px;">
      <button class="btn btn-primary" data-modal="quickEnquiry"><i class="fa-brands fa-whatsapp"></i> Enquire now</button>
    </p>
  `,
  manpower: `
    <h3>Manpower Supply</h3>
    <p>Staffing support for facility operations based on requirement and schedule.</p>
    <ul class="features" style="margin:12px 0 0;">
      <li><i class="fa-solid fa-circle-check"></i> Security staff</li>
      <li><i class="fa-solid fa-circle-check"></i> Housekeeping staff</li>
      <li><i class="fa-solid fa-circle-check"></i> Deployment by schedule and site needs</li>
    </ul>
    <p style="margin-top:14px;">
      <button class="btn btn-primary" data-modal="quickEnquiry"><i class="fa-brands fa-whatsapp"></i> Enquire now</button>
    </p>
  `
};

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-modal]");
  if (trigger) {
    const key = trigger.dataset.modal;
    const tpl = modalTemplates[key];
    if (tpl) openModalHTML(tpl);
  }
});

modal?.addEventListener("click", (e) => {
  if (e.target.closest("[data-close='true']")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("show")) closeModal();
});

/* Quote form => WhatsApp (prefilled) */
$("#quoteForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name")?.value?.trim() || "";
  const phone = $("#phone")?.value?.trim() || "";
  const service = $("#service")?.value || "";
  const message = $("#message")?.value?.trim() || "";

  const text =
`Hello ENEXIO SEA,
Name: ${name}
Phone: ${phone}
Service: ${service}
Message: ${message || "—"}`;

  window.open(waLink(text), "_blank", "noopener");
  showToast("Opening WhatsApp with your enquiry…");
});

/* Footer year */
$("#year").textContent = new Date().getFullYear();
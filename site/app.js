/* =========================================================
   Pigmento Store Kids — catálogo con pedido por WhatsApp
   Datos editables: data/config.js y data/products.js
   ========================================================= */
(() => {
"use strict";

const STORE = window.STORE;
const PRODUCTS = window.PRODUCTS;
const CATEGORIES = window.CATEGORIES;
const CAT = {
  camisetas: { label: "Camiseta", dot: "var(--k-blue)" },
  conjuntos: { label: "Conjunto", dot: "var(--k-green)" },
  jeans:     { label: "Jean",     dot: "var(--k-red)" },
};
const MAX_QTY = 10;
const KID_COLORS = ["#25a845", "#e2261d", "#0f9fd6", "#ffc20e"];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => "$" + Math.round(n).toLocaleString("es-CO");
const rand = (a, b) => a + Math.random() * (b - a);
const byId = id => PRODUCTS.find(p => p.id === id);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = () => typeof window.gsap !== "undefined";
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const imgSrc = (p, small) => `assets/products/${p.id}${small ? "-sm" : ""}.webp`;

/* ---------------- WhatsApp: un solo constructor de enlaces ---------------- */
const wa = text => `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
const MSG_HELLO = "Hola, Pigmento Store Kids. Vi el catálogo en la página y quiero más información.";

function wireStore() {
  $$("[data-wa='hello']").forEach(a => { a.href = wa(MSG_HELLO); });
  $$("[data-ig]").forEach(a => { a.href = STORE.instagram; });
  $$("[data-maps]").forEach(a => { a.href = STORE.mapsUrl; });
  $$("[data-store]").forEach(el => { el.textContent = STORE[el.dataset.store] ?? ""; });
  $$("[data-price]").forEach(el => { const p = byId(el.dataset.price); if (p) el.textContent = money(p.price); });
  $("#year").textContent = new Date().getFullYear();
}

/* =========================================================
   INTRO — el emblema se arma por brazos, gira y aparece KIDS
   Una vez por sesión, se puede saltar, respeta movimiento reducido.
   ========================================================= */
const S = 1254, VX0 = 492, VX1 = 760, HY0 = 452, HY1 = 702, O = 4;
const pct = v => (v / S * 100).toFixed(3) + "%";
const inset = (x0, y0, x1, y1) => `inset(${pct(y0)} ${pct(S - x1)} ${pct(S - y1)} ${pct(x0)})`;
const PIECES = [
  ["v",  inset(VX0, 0, VX1, S),          3, {  x: 0,    y: -1.1, r: 0 }],
  ["ur", inset(VX1 - O, 0, S, HY0 + O),  1, {  x: 1,    y: -1,   r: 90 }],
  ["hr", inset(VX1 - O, HY0, S, HY1),    2, {  x: 1.2,  y: 0,    r: -30 }],
  ["lr", inset(VX1 - O, HY1 - O, S, S),  1, {  x: 1,    y: 1,    r: -90 }],
  ["ll", inset(0, HY1 - O, VX0 + O, S),  1, {  x: -1,   y: 1,    r: 90 }],
  ["hl", inset(0, HY0, VX0 + O, HY1),    2, {  x: -1.2, y: 0,    r: 30 }],
  ["ul", inset(0, 0, VX0 + O, HY0 + O),  1, {  x: -1,   y: -1,   r: -90 }],
];

let heroStarted = false;
function heroIn() {
  if (heroStarted) return; heroStarted = true;
  if (!hasGsap() || reduced) return;
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from(".hero__title .w", { yPercent: 110, duration: 1.1, stagger: .08 }, 0)
    .from(".w--play b", { yPercent: -60, opacity: 0, duration: .9, ease: "back.out(2.2)", stagger: .05 }, .25)
    .from(".hero__sub, .hero__cta", { y: 18, opacity: 0, duration: .9, stagger: .08 }, .3)
    .from(".hero-shot", { y: 60, opacity: 0, scale: .96, duration: 1.1, stagger: .09 }, .15)
    .from(".hero__emblem", { scale: .7, opacity: 0, rotate: -40, duration: 1.4 }, .1);
}

function endIntro(intro) {
  intro.remove();
  document.documentElement.classList.remove("intro-on");
  $("#headerLogo").style.opacity = "";
  heroIn();
}

function runIntro() {
  const intro = $("#intro");
  if (!intro) return heroIn();
  let seen = false;
  try { seen = sessionStorage.getItem("pk-intro") === "1"; sessionStorage.setItem("pk-intro", "1"); } catch {}
  if (seen || reduced || document.hidden || !hasGsap()) return endIntro(intro);

  const stage = $("#introStage"), emblem = $("#emblem"), spin = $("#emblemSpin"), fx = $("#introFx");
  spin.innerHTML = PIECES.map(([k, clip, z]) => `<div class="bar" style="clip-path:${clip};-webkit-clip-path:${clip};z-index:${z}"></div>`).join("");
  const bars = $$(".bar", spin), kids = $$(".kid", intro);
  const W = innerWidth, H = innerHeight;
  $("#headerLogo").style.opacity = "0";

  const ring = (scale = 8) => {
    const r = document.createElement("div"); r.className = "ring"; stage.appendChild(r);
    gsap.fromTo(r, { scale: .3, opacity: .9 }, { scale, opacity: 0, duration: .8, ease: "expo.out", onComplete: () => r.remove() });
  };
  const confetti = () => {
    for (let i = 0; i < 36; i++) {
      const c = document.createElement("i");
      c.style.background = KID_COLORS[i % 4]; if (i % 3 === 0) c.style.borderRadius = "50%";
      fx.appendChild(c);
      const a = rand(0, Math.PI * 2), d = rand(140, Math.min(W, H) * .55);
      gsap.fromTo(c, { x: 0, y: 0, scale: rand(.6, 1.3) }, { x: Math.cos(a) * d, y: Math.sin(a) * d + rand(40, 140), rotate: rand(-400, 400), opacity: 0, duration: rand(.9, 1.4), ease: "expo.out", onComplete: () => c.remove() });
    }
  };

  gsap.set(kids, { scale: 0, rotate: () => rand(-30, 30), y: 30 });
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => endIntro(intro) });

  // 1) los siete brazos encajan en secuencia (≈1.2 s)
  PIECES.forEach(([, , , f], i) => {
    tl.fromTo(bars[i],
      { x: f.x * W * .6, y: f.y * H * .6, rotate: f.r, scale: 1.15, opacity: 0 },
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, duration: .5, ease: "back.out(1.3)" },
      i === 0 ? .15 : `>-${.36}`);
  });
  // 2) giro con frenada
  tl.add(() => ring(6), ">-0.1")
    .to(spin, { rotate: 360, duration: .9, ease: "expo.inOut" }, "<")
    .addLabel("kids", ">-0.12")
  // 3) aparece KIDS
    .add(() => { ring(10); confetti(); }, "kids")
    .fromTo(emblem, { scale: 1 }, { scale: 1.05, duration: .1, yoyo: true, repeat: 1, ease: "power2.out" }, "kids")
    .to(kids, { scale: 1, rotate: 0, y: 0, duration: .65, ease: "back.out(2.4)", stagger: .06 }, "kids")
  // 4) cortina + el logo viaja al encabezado
    .addLabel("out", "+=0.25")
    .to(".curtain i", { scaleY: 1, duration: .42, ease: "expo.inOut", stagger: .05 }, "out")
    .add(() => { intro.style.background = "transparent"; $("#skipIntro").style.opacity = "0"; heroIn(); }, "out+=0.55")
    .set(".curtain i", { transformOrigin: "top" }, "out+=0.55")
    .to(".curtain i", { scaleY: 0, duration: .5, ease: "expo.inOut", stagger: .05 }, "out+=0.56")
    .add(() => {
      const a = stage.getBoundingClientRect(), b = $("#headerLogo").getBoundingClientRect();
      gsap.to(stage, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: b.width / a.width, duration: .75, ease: "expo.inOut" });
    }, "out+=0.56")
    .to({}, { duration: .25 });

  const skip = () => { if (tl.time() < tl.labels.out) tl.seek("out"); tl.timeScale(1.8); };
  $("#skipIntro").addEventListener("click", skip);
  addEventListener("keydown", e => { if (e.key === "Escape" && document.contains(intro)) skip(); });
  setTimeout(() => { if (document.contains(intro)) { tl.kill(); endIntro(intro); } }, 7000);
}

/* =========================================================
   CATÁLOGO
   ========================================================= */
function renderCatalog() {
  const grid = $("#grid");
  grid.innerHTML = PRODUCTS.map((p, i) => `
    <article class="card reveal" data-cat="${p.cat}" style="transition-delay:${(i % 4) * 70}ms">
      <button class="card__link" type="button" data-open="${p.id}" aria-label="${p.name}, ${money(p.price)}. Escoger talla">
        <div class="card__media">
          <img src="${imgSrc(p, true)}" srcset="${imgSrc(p, true)} 320w, ${imgSrc(p)} 640w" sizes="(max-width:700px) 46vw, (max-width:1040px) 30vw, 290px" alt="" width="640" height="800" loading="lazy" decoding="async">
          <span class="card__cat" style="--dot:${CAT[p.cat].dot}">${CAT[p.cat].label}</span>
          <span class="card__plus" aria-hidden="true"><svg><use href="#i-plus"/></svg></span>
        </div>
        <div class="card__body">
          <div class="card__row"><h3 class="card__name">${p.name}</h3><span class="card__price">${money(p.price)}</span></div>
          <p class="card__meta">${p.colors.map(c => `<i style="--s:${c.hex}" title="${c.name}"></i>`).join("")} Tallas ${p.sizes[0]} a ${p.sizes.at(-1)}</p>
          <span class="card__cta">Escoger talla <svg><use href="#i-arrow"/></svg></span>
        </div>
      </button>
    </article>`).join("");

  const filters = $("#filters");
  filters.innerHTML = CATEGORIES.map(c => {
    const n = c.id === "all" ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === c.id).length;
    return n ? `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="${c.id === "all"}">${c.label} <span class="chip__n">${n}</span></button>` : "";
  }).join("");
  const setCount = n => { $("#catCount").textContent = `${n} ${n === 1 ? "referencia" : "referencias"}`; };
  setCount(PRODUCTS.length);

  filters.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip || chip.getAttribute("aria-pressed") === "true") return;
    $$(".chip", filters).forEach(c => c.setAttribute("aria-pressed", c === chip));
    const f = chip.dataset.filter, cards = $$(".card", grid);
    const apply = () => {
      let n = 0;
      cards.forEach(c => { const show = f === "all" || c.dataset.cat === f; c.hidden = !show; if (show) n++; });
      setCount(n);
      const shown = cards.filter(c => !c.hidden);
      shown.forEach(c => c.classList.add("is-in"));
      if (hasGsap() && !reduced) gsap.fromTo(shown, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: "expo.out", stagger: .05, clearProps: "opacity,transform" });
    };
    if (hasGsap() && !reduced) gsap.to(cards.filter(c => !c.hidden), { opacity: 0, y: 10, duration: .18, ease: "power2.in", onComplete: apply });
    else apply();
  });
}

/* reveals suaves al hacer scroll */
function reveals() {
  $$(".catalog__head, .band, .how__intro, .steps li").forEach(el => el.classList.add("reveal"));
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) return els.forEach(el => el.classList.add("is-in"));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach(el => io.observe(el));
}

/* =========================================================
   FICHA DE PRODUCTO
   ========================================================= */
const sheet = $("#sheet"), panel = $("#sheetPanel");
let current = null, sel = { size: null, color: 0, qty: 1 }, lastFocus = null;

function lock(on) {
  const any = !sheet.hidden || !drawer.hidden;
  document.body.classList.toggle("is-locked", on || any);
}

function productAskText(p) {
  const s = sel.size ? `, talla ${sel.size}` : "";
  return `Hola, Pigmento Store Kids. Quiero preguntar por: ${p.name}${s} (${p.colors[sel.color].name}). ¿Está disponible?`;
}
function syncProduct() {
  const p = current;
  $$(".size", sheet).forEach(b => b.setAttribute("aria-pressed", b.dataset.size === sel.size));
  $$(".color", sheet).forEach(b => b.setAttribute("aria-pressed", +b.dataset.color === sel.color));
  $("#pdSizeName").textContent = sel.size ? `· ${sel.size}` : "";
  $("#pdColorName").textContent = `· ${p.colors[sel.color].name}`;
  $("#pdQty").textContent = sel.qty;
  $("[data-q='-1']", sheet).disabled = sel.qty <= 1;
  $("[data-q='1']", sheet).disabled = sel.qty >= MAX_QTY;
  $("#pdAsk").href = wa(productAskText(p));
}
function setAddState(state) {
  const btn = $("#pdAdd"), label = $("#pdAddLabel");
  btn.classList.toggle("is-done", state === "done");
  btn.disabled = state === "done";
  label.innerHTML = state === "done" ? `<svg><use href="#i-check"/></svg> Agregado a tu bolsa` : "Agregar a la bolsa";
}

function openProduct(id, from) {
  const p = byId(id); if (!p) return;
  current = p; sel = { size: p.sizes.length === 1 ? p.sizes[0] : null, color: 0, qty: 1 };
  lastFocus = from || document.activeElement;
  const img = $("#pdImg"); img.src = imgSrc(p); img.alt = `${p.name}`;
  $("#pdCat").textContent = CAT[p.cat].label;
  $("#pdName").textContent = p.name;
  $("#pdPrice").textContent = money(p.price);
  $("#pdRef").hidden = !!p.confirmed;
  $("#pdDesc").textContent = p.desc;
  $("#pdColors").innerHTML = p.colors.map((c, i) => `<button type="button" class="color" data-color="${i}" aria-pressed="false"><i style="--s:${c.hex}"></i>${c.name}</button>`).join("");
  $("#pdSizes").innerHTML = p.sizes.map(s => `<button type="button" class="size" data-size="${s}" aria-pressed="false" aria-label="Talla ${s}">${s}</button>`).join("");
  $("#pdSizeGroup").classList.remove("is-invalid"); $("#pdError").textContent = "";
  setAddState("idle"); syncProduct();

  sheet.hidden = false; lock(true); panel.scrollTop = 0;
  if (hasGsap() && !reduced) {
    const mobile = innerWidth <= 760;
    gsap.fromTo(".sheet__scrim", { opacity: 0 }, { opacity: 1, duration: .3 });
    gsap.fromTo(panel, mobile ? { yPercent: 100 } : { y: 40, scale: .97, opacity: 0 }, { yPercent: 0, y: 0, scale: 1, opacity: 1, duration: .55, ease: "expo.out", clearProps: "transform" });
  }
  requestAnimationFrame(() => $(".sheet__close").focus({ preventScroll: true }));
}
function closeProduct() {
  if (sheet.hidden) return;
  const done = () => { sheet.hidden = true; lock(false); lastFocus?.focus?.({ preventScroll: true }); };
  if (hasGsap() && !reduced) {
    const mobile = innerWidth <= 760;
    gsap.to(".sheet__scrim", { opacity: 0, duration: .2 });
    gsap.to(panel, { ...(mobile ? { yPercent: 100 } : { y: 24, opacity: 0 }), duration: .28, ease: "power2.in", onComplete: () => { gsap.set(panel, { clearProps: "all" }); done(); } });
  } else done();
}

sheet.addEventListener("click", e => {
  if (e.target.closest("[data-close]")) return closeProduct();
  const s = e.target.closest(".size");
  if (s) { sel.size = s.dataset.size; $("#pdSizeGroup").classList.remove("is-invalid"); $("#pdError").textContent = ""; setAddState("idle"); return syncProduct(); }
  const c = e.target.closest(".color");
  if (c) { sel.color = +c.dataset.color; setAddState("idle"); return syncProduct(); }
  const q = e.target.closest("[data-q]");
  if (q) { sel.qty = Math.max(1, Math.min(MAX_QTY, sel.qty + +q.dataset.q)); setAddState("idle"); syncProduct(); }
});

$("#pdAdd").addEventListener("click", () => {
  if (!sel.size) {
    const g = $("#pdSizeGroup");
    g.classList.add("is-invalid"); $("#pdError").textContent = "Escoge una talla para agregarla a tu bolsa.";
    const sizes = $("#pdSizes"); sizes.classList.remove("shake"); void sizes.offsetWidth; sizes.classList.add("shake");
    $(".size", sizes)?.focus({ preventScroll: true });
    g.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
    return;
  }
  addToCart(current, sel.size, current.colors[sel.color].name, sel.qty);
  setAddState("done");
  flyToCart($("#pdImg"), sel.qty);
  setTimeout(closeProduct, reduced ? 300 : 700);
});

/* ---------- la prenda vuela a la bolsa ---------- */
function flyToCart(img, qty) {
  const cartBtn = $("#cartBtn");
  if (!hasGsap() || reduced) return cartFeedback(qty);
  const a = img.getBoundingClientRect(), b = cartBtn.getBoundingClientRect();
  const w = Math.min(a.width * .5, 180), h = w * 1.25;
  const fly = document.createElement("div");
  fly.className = "flyer"; fly.style.width = w + "px"; fly.style.height = h + "px";
  fly.innerHTML = `<img src="${img.src}" alt="">`;
  $("#fx").appendChild(fly);
  const sx = a.left + a.width / 2 - w / 2, sy = a.top + a.height / 2 - h / 2;
  const ex = b.left + b.width / 2 - w / 2, ey = b.top + b.height / 2 - h / 2;
  const peak = Math.min(sy, ey) - 120;
  gsap.set(fly, { x: sx, y: sy, scale: .9 });
  gsap.timeline({ onComplete: () => { fly.remove(); cartFeedback(qty); } })
    .to(fly, { x: ex, duration: .85, ease: "power1.inOut" })
    .to(fly, { keyframes: { y: [sy, peak, ey], easeEach: "sine.inOut" }, duration: .85, ease: "none" }, 0)
    .to(fly, { scale: .1, rotate: 200, borderRadius: "50%", duration: .85, ease: "power2.in" }, 0);
}
function cartFeedback(qty) {
  const cartBtn = $("#cartBtn");
  if (hasGsap() && !reduced) {
    const b = cartBtn.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    gsap.timeline().to(cartBtn, { scale: 1.25, duration: .12, ease: "power2.out" }).to(cartBtn, { scale: 1, duration: .6, ease: "elastic.out(1.2,.35)" });
    for (let i = 0; i < 16; i++) {
      const c = document.createElement("i"); c.className = "confetti"; c.style.background = KID_COLORS[i % 4];
      if (i % 2) c.style.borderRadius = "50%";
      $("#fx").appendChild(c);
      const ang = rand(0, Math.PI * 2), d = rand(30, 80);
      gsap.fromTo(c, { x: cx, y: cy }, { x: cx + Math.cos(ang) * d, y: cy + Math.sin(ang) * d + 30, rotate: rand(-300, 300), opacity: 0, duration: rand(.6, .9), ease: "expo.out", onComplete: () => c.remove() });
    }
    gsap.fromTo("#cartCount", { scale: .3 }, { scale: 1, duration: .6, ease: "elastic.out(1.2,.4)", clearProps: "transform" });
  }
  toast(`${qty === 1 ? "Prenda agregada" : qty + " prendas agregadas"} a tu bolsa`);
}

let toastT;
function toast(msg) {
  const t = $("#toast");
  t.innerHTML = `<svg><use href="#i-check"/></svg> ${msg}`;
  t.classList.add("show"); clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 2400);
}

/* =========================================================
   BOLSA (persistente)
   ========================================================= */
const KEY = "pk-cart-v2", KEY_CUST = "pk-customer-v1";
let cart = store.get(KEY, []).filter(i => byId(i.id) && i.qty > 0)
  .map(i => ({ ...i, qty: Math.min(MAX_QTY, Math.max(1, Math.floor(i.qty))) }));
const drawer = $("#drawer"), dPanel = $("#drawerPanel");
const cust = store.get(KEY_CUST, { name: "", city: "" });
$("#custName").value = cust.name || ""; $("#custCity").value = cust.city || "";

const lineTotal = i => byId(i.id).price * i.qty;
const cartTotal = () => cart.reduce((a, i) => a + lineTotal(i), 0);
const cartCount = () => cart.reduce((a, i) => a + i.qty, 0);

function addToCart(p, size, color, qty) {
  const key = `${p.id}|${size}|${color}`;
  const found = cart.find(i => i.key === key);
  if (found) found.qty = Math.min(MAX_QTY, found.qty + qty);
  else cart.push({ key, id: p.id, size, color, qty });
  store.set(KEY, cart); renderCart();
}

function orderText() {
  const lines = cart.map((i, n) => {
    const p = byId(i.id);
    return `${n + 1}. ${p.name}\n   Talla: ${i.size} | Color: ${i.color}\n   Cantidad: ${i.qty} x ${money(p.price)} = ${money(lineTotal(i))}`;
  });
  const name = $("#custName").value.trim(), city = $("#custCity").value.trim();
  const who = [name && `Nombre: ${name}`, city && `Ciudad o barrio: ${city}`].filter(Boolean).join("\n");
  return [
    "Hola, Pigmento Store Kids. Quiero hacer este pedido:",
    "",
    lines.join("\n\n"),
    "",
    `Total de referencia: ${money(cartTotal())} (${cartCount()} ${cartCount() === 1 ? "prenda" : "prendas"})`,
    who ? "\n" + who : "",
    "",
    "¿Me confirman disponibilidad, valor final y envío? Gracias.",
  ].join("\n").replace(/\n{3,}/g, "\n\n");
}

function renderCart() {
  const n = cartCount();
  const count = $("#cartCount");
  count.textContent = n; count.classList.toggle("has", n > 0);
  $("#cartBtn").setAttribute("aria-label", `Abrir tu bolsa, ${n} ${n === 1 ? "prenda" : "prendas"}`);
  $("#drawerCount").textContent = n ? `(${n})` : "";
  $("#cartTotal").textContent = money(cartTotal());
  drawer.classList.toggle("is-empty", !cart.length);
  $("#cartList").innerHTML = cart.map(i => {
    const p = byId(i.id);
    return `<li class="cart-line" data-key="${i.key}">
      <img src="${imgSrc(p, true)}" alt="" width="76" height="95" loading="lazy">
      <div>
        <h3>${p.name}</h3>
        <p class="cart-line__meta">Talla ${i.size} · ${i.color}</p>
        <p class="cart-line__unit">${money(p.price)} c/u</p>
        <div class="qty" role="group" aria-label="Cantidad de ${p.name}">
          <button type="button" data-d="-1" aria-label="Quitar una" ${i.qty <= 1 ? "disabled" : ""}><svg><use href="#i-minus"/></svg></button>
          <output>${i.qty}</output>
          <button type="button" data-d="1" aria-label="Agregar una" ${i.qty >= MAX_QTY ? "disabled" : ""}><svg><use href="#i-plus"/></svg></button>
        </div>
      </div>
      <div class="cart-line__side">
        <span class="cart-line__total">${money(lineTotal(i))}</span>
        <button type="button" class="cart-line__rm" data-rm aria-label="Eliminar ${p.name} talla ${i.size}"><svg><use href="#i-trash"/></svg></button>
      </div>
    </li>`;
  }).join("");
  $("#checkout").href = wa(orderText());
}

function openCart() {
  renderCart(); lastFocus = document.activeElement;
  drawer.hidden = false; lock(true);
  if (hasGsap() && !reduced) {
    gsap.fromTo(".drawer__scrim", { opacity: 0 }, { opacity: 1, duration: .3 });
    gsap.fromTo(dPanel, { xPercent: 100 }, { xPercent: 0, duration: .5, ease: "expo.out", clearProps: "transform" });
  }
  requestAnimationFrame(() => $(".drawer__head .icon-btn").focus({ preventScroll: true }));
}
function closeCart(then) {
  if (drawer.hidden) return;
  const done = () => { drawer.hidden = true; lock(false); if (typeof then === "function") then(); else lastFocus?.focus?.({ preventScroll: true }); };
  if (hasGsap() && !reduced) {
    gsap.to(".drawer__scrim", { opacity: 0, duration: .2 });
    gsap.to(dPanel, { xPercent: 100, duration: .3, ease: "power2.in", onComplete: () => { gsap.set(dPanel, { clearProps: "all" }); done(); } });
  } else done();
}

$("#cartBtn").addEventListener("click", openCart);
drawer.addEventListener("click", e => {
  const close = e.target.closest("[data-close-cart]");
  if (close) {
    const goto = close.dataset.goto;
    return closeCart(goto ? () => $(goto).scrollIntoView({ behavior: reduced ? "auto" : "smooth" }) : undefined);
  }
  const li = e.target.closest(".cart-line"); if (!li) return;
  const item = cart.find(i => i.key === li.dataset.key); if (!item) return;
  if (e.target.closest("[data-rm]")) {
    const remove = () => { cart = cart.filter(i => i !== item); store.set(KEY, cart); renderCart(); };
    if (hasGsap() && !reduced) gsap.to(li, { opacity: 0, x: 40, duration: .25, ease: "power2.in", onComplete: remove });
    else remove();
    return;
  }
  const d = e.target.closest("[data-d]");
  if (d) { item.qty = Math.max(1, Math.min(MAX_QTY, item.qty + +d.dataset.d)); store.set(KEY, cart); renderCart(); $(`.cart-line[data-key="${CSS.escape(item.key)}"] [data-d="${d.dataset.d}"]`)?.focus(); }
});
["custName", "custCity"].forEach(id => $("#" + id).addEventListener("input", () => {
  store.set(KEY_CUST, { name: $("#custName").value, city: $("#custCity").value });
  $("#checkout").href = wa(orderText());
}));
$("#checkout").addEventListener("click", e => { if (!cart.length) e.preventDefault(); else $("#checkout").href = wa(orderText()); });

/* ---------------- global ---------------- */
document.addEventListener("click", e => {
  const o = e.target.closest("[data-open]");
  if (o && !o.closest(".sheet")) { e.preventDefault(); openProduct(o.dataset.open, o); }
});
addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!sheet.hidden) closeProduct(); else if (!drawer.hidden) closeCart();
});
// mantener el foco dentro del diálogo abierto
addEventListener("keydown", e => {
  if (e.key !== "Tab") return;
  const box = !sheet.hidden ? panel : !drawer.hidden ? dPanel : null; if (!box) return;
  const f = $$("button:not([disabled]), a[href], input", box).filter(el => el.offsetParent !== null);
  if (!f.length) return;
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
  else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
});
addEventListener("storage", e => { if (e.key === KEY) { cart = store.get(KEY, []).filter(i => byId(i.id)); renderCart(); } });

/* ---------------- arranque ---------------- */
wireStore();
renderCatalog();
renderCart();
reveals();
const start = () => runIntro();
if (document.readyState === "complete") start();
else {
  // no esperamos a todas las imágenes del catálogo: solo emblema y letras
  const imgs = ["assets/logo/emblem-800.webp", ...$$(".kid").map(k => k.src)];
  Promise.race([
    Promise.all(imgs.map(src => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = src; }))),
    new Promise(r => setTimeout(r, 1800)),
  ]).then(start);
}
})();

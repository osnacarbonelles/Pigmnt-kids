/* Ficha de producto: elegir color, talla y cantidad, y agregar a la bolsa. */
import { $, $$, hasGsap, reduced } from "../lib/dom.js";
import { formatMoney } from "../lib/format.js";
import { findVariant, colorOf, unitPrice, compareAtPrice, isOrderable, primaryPhoto } from "../catalog/product.js";
import { whatsappUrl, productQuestionMessage } from "../orders/whatsapp.js";
import { openLayer, closeLayer } from "./overlay.js";
import { flyToCart } from "./effects.js";

export function createProductSheet({ repo, cart, store, categories }) {
  const sheet = $("#sheet"), panel = $("#sheetPanel");
  const money = n => formatMoney(n, store);
  const layer = { panel, close };
  let product = null, sel = null, lastFocus = null;

  const variant = () => findVariant(product, sel.size, sel.colorId);
  const sizeOrderable = size => isOrderable(findVariant(product, size, sel.colorId));

  function setAddState(done) {
    const btn = $("#pdAdd");
    btn.classList.toggle("is-done", done); btn.disabled = done;
    $("#pdAddLabel").innerHTML = done ? `<svg><use href="#i-check"/></svg> Agregado a tu bolsa` : "Agregar a la bolsa";
  }
  function sync() {
    $$(".size", sheet).forEach(b => b.setAttribute("aria-pressed", b.dataset.size === sel.size));
    $$(".color", sheet).forEach(b => b.setAttribute("aria-pressed", b.dataset.color === sel.colorId));
    $$(".size", sheet).forEach(b => { b.disabled = !sizeOrderable(b.dataset.size); });
    $("#pdSizeName").textContent = sel.size ? `· ${sel.size}` : "";
    $("#pdColorName").textContent = `· ${colorOf(product, sel.colorId).name}`;
    $("#pdQty").textContent = sel.qty;
    $("[data-q='-1']", sheet).disabled = sel.qty <= 1;
    $("[data-q='1']", sheet).disabled = sel.qty >= cart.max;
    const v = variant();
    $("#pdPrice").textContent = money(unitPrice(product, v));
    const cmp = compareAtPrice(product, v);
    $("#pdCompare").textContent = cmp ? money(cmp) : "";
    $("#pdCompare").hidden = !cmp;
    $("#pdAsk").href = whatsappUrl(store.whatsapp, productQuestionMessage(store, product, sel));
  }

  async function open(id, from) {
    const p = await repo.getProductById(id); if (!p) return;
    product = p; lastFocus = from || document.activeElement;
    sel = { size: p.sizes.length === 1 ? p.sizes[0] : null, colorId: p.colors[0].id, qty: 1 };
    const ph = primaryPhoto(p), img = $("#pdImg"); img.src = ph.src; img.alt = ph.alt;
    $("#pdCat").textContent = categories.find(c => c.id === p.category)?.singular ?? "";
    $("#pdName").textContent = p.name;
    $("#pdRef").hidden = p.confirmed;
    $("#pdDesc").textContent = p.description;
    $("#pdColors").innerHTML = p.colors.map(c => `<button type="button" class="color" data-color="${c.id}" aria-pressed="false"><i style="--s:${c.hex}"></i>${c.name}</button>`).join("");
    $("#pdSizes").innerHTML = p.sizes.map(s => `<button type="button" class="size" data-size="${s}" aria-pressed="false" aria-label="Talla ${s}">${s}</button>`).join("");
    $("#pdSizeGroup").classList.remove("is-invalid"); $("#pdError").textContent = "";
    setAddState(false); sync();

    sheet.hidden = false; openLayer(layer); panel.scrollTop = 0;
    if (hasGsap() && !reduced) {
      const mobile = innerWidth <= 760;
      gsap.fromTo(".sheet__scrim", { opacity: 0 }, { opacity: 1, duration: .3 });
      gsap.fromTo(panel, mobile ? { yPercent: 100 } : { y: 40, scale: .97, opacity: 0 }, { yPercent: 0, y: 0, scale: 1, opacity: 1, duration: .55, ease: "expo.out", clearProps: "transform" });
    }
    requestAnimationFrame(() => $(".sheet__close").focus({ preventScroll: true }));
  }

  function close() {
    if (sheet.hidden) return;
    const done = () => { sheet.hidden = true; closeLayer(layer); lastFocus?.focus?.({ preventScroll: true }); };
    if (hasGsap() && !reduced) {
      const mobile = innerWidth <= 760;
      gsap.to(".sheet__scrim", { opacity: 0, duration: .2 });
      gsap.to(panel, { ...(mobile ? { yPercent: 100 } : { y: 24, opacity: 0 }), duration: .28, ease: "power2.in", onComplete: () => { gsap.set(panel, { clearProps: "all" }); done(); } });
    } else done();
  }

  sheet.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) return close();
    const s = e.target.closest(".size");
    if (s) { sel.size = s.dataset.size; $("#pdSizeGroup").classList.remove("is-invalid"); $("#pdError").textContent = ""; setAddState(false); return sync(); }
    const c = e.target.closest(".color");
    if (c) { sel.colorId = c.dataset.color; if (sel.size && !sizeOrderable(sel.size)) sel.size = null; setAddState(false); return sync(); }
    const q = e.target.closest("[data-q]");
    if (q) { sel.qty = Math.max(1, Math.min(cart.max, sel.qty + +q.dataset.q)); setAddState(false); sync(); }
  });

  $("#pdAdd").addEventListener("click", () => {
    if (!sel.size) {
      $("#pdSizeGroup").classList.add("is-invalid");
      $("#pdError").textContent = "Escoge una talla para agregarla a tu bolsa.";
      const sizes = $("#pdSizes"); sizes.classList.remove("shake"); void sizes.offsetWidth; sizes.classList.add("shake");
      $(".size:not([disabled])", sizes)?.focus({ preventScroll: true });
      return;
    }
    const v = variant();
    if (!isOrderable(v)) return;
    cart.add({ productId: product.id, variantId: v.id, size: v.size, colorId: v.colorId, qty: sel.qty });
    setAddState(true);
    flyToCart($("#pdImg"), sel.qty);
    setTimeout(close, reduced ? 300 : 700);
  });

  return { open, close };
}

/* Bolsa: dibuja el estado del carrito y traduce clics en operaciones. */
import { $, hasGsap, reduced } from "../lib/dom.js";
import { formatMoney } from "../lib/format.js";
import { colorOf, primaryPhoto } from "../catalog/product.js";
import { cartTotals, priceLine } from "../cart/pricing.js";
import { customerStorage } from "../cart/storage.js";
import { orderMessage, whatsappUrl } from "../orders/whatsapp.js";
import { openLayer, closeLayer } from "./overlay.js";

export function createCartDrawer({ cart, productsById, store }) {
  const drawer = $("#drawer"), panel = $("#drawerPanel");
  const money = n => formatMoney(n, store);
  const layer = { panel, close };
  let lastFocus = null;

  const customer = customerStorage.load();
  $("#custName").value = customer.name || ""; $("#custCity").value = customer.city || "";
  const currentCustomer = () => ({ name: $("#custName").value.trim(), city: $("#custCity").value.trim() });
  const checkoutUrl = () => whatsappUrl(store.whatsapp, orderMessage({ store, lines: cart.getLines(), productsById, customer: currentCustomer() }));

  function render() {
    const lines = cart.getLines(), { count, total } = cartTotals(lines, productsById);
    const badge = $("#cartCount");
    badge.textContent = count; badge.classList.toggle("has", count > 0);
    $("#cartBtn").setAttribute("aria-label", `Abrir tu bolsa, ${count} ${count === 1 ? "prenda" : "prendas"}`);
    $("#drawerCount").textContent = count ? `(${count})` : "";
    $("#cartTotal").textContent = money(total);
    drawer.classList.toggle("is-empty", !lines.length);
    $("#cartList").innerHTML = lines.map(l => {
      const p = productsById.get(l.productId), { unit, total: lt } = priceLine(l, productsById);
      return `<li class="cart-line" data-key="${l.key}">
        <img src="${primaryPhoto(p).srcSm}" alt="" width="76" height="95" loading="lazy">
        <div>
          <h3>${p.name}</h3>
          <p class="cart-line__meta">Talla ${l.size} · ${colorOf(p, l.colorId).name}</p>
          <p class="cart-line__unit">${money(unit)} c/u</p>
          <div class="qty" role="group" aria-label="Cantidad de ${p.name}">
            <button type="button" data-d="-1" aria-label="Quitar una" ${l.qty <= 1 ? "disabled" : ""}><svg><use href="#i-minus"/></svg></button>
            <output>${l.qty}</output>
            <button type="button" data-d="1" aria-label="Agregar una" ${l.qty >= cart.max ? "disabled" : ""}><svg><use href="#i-plus"/></svg></button>
          </div>
        </div>
        <div class="cart-line__side">
          <span class="cart-line__total">${money(lt)}</span>
          <button type="button" class="cart-line__rm" data-rm aria-label="Eliminar ${p.name} talla ${l.size}"><svg><use href="#i-trash"/></svg></button>
        </div>
      </li>`;
    }).join("");
    $("#checkout").href = checkoutUrl();
  }

  function open() {
    render(); lastFocus = document.activeElement;
    drawer.hidden = false; openLayer(layer);
    if (hasGsap() && !reduced) {
      gsap.fromTo(".drawer__scrim", { opacity: 0 }, { opacity: 1, duration: .3 });
      gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: .5, ease: "expo.out", clearProps: "transform" });
    }
    requestAnimationFrame(() => $(".drawer__head .icon-btn").focus({ preventScroll: true }));
  }
  function close(then) {
    if (drawer.hidden) return;
    const done = () => { drawer.hidden = true; closeLayer(layer); typeof then === "function" ? then() : lastFocus?.focus?.({ preventScroll: true }); };
    if (hasGsap() && !reduced) {
      gsap.to(".drawer__scrim", { opacity: 0, duration: .2 });
      gsap.to(panel, { xPercent: 100, duration: .3, ease: "power2.in", onComplete: () => { gsap.set(panel, { clearProps: "all" }); done(); } });
    } else done();
  }

  $("#cartBtn").addEventListener("click", open);
  drawer.addEventListener("click", e => {
    const closer = e.target.closest("[data-close-cart]");
    if (closer) {
      const goto = closer.dataset.goto;
      return close(goto ? () => $(goto).scrollIntoView({ behavior: reduced ? "auto" : "smooth" }) : undefined);
    }
    const li = e.target.closest(".cart-line"); if (!li) return;
    const key = li.dataset.key, line = cart.getLines().find(l => l.key === key); if (!line) return;
    if (e.target.closest("[data-rm]")) {
      if (hasGsap() && !reduced) gsap.to(li, { opacity: 0, x: 40, duration: .25, ease: "power2.in", onComplete: () => cart.remove(key) });
      else cart.remove(key);
      return;
    }
    const d = e.target.closest("[data-d]");
    if (d) { cart.setQty(key, line.qty + +d.dataset.d); $(`.cart-line[data-key="${CSS.escape(key)}"] [data-d="${d.dataset.d}"]`)?.focus(); }
  });
  ["custName", "custCity"].forEach(id => $("#" + id).addEventListener("input", () => {
    customerStorage.save(currentCustomer()); $("#checkout").href = checkoutUrl();
  }));
  $("#checkout").addEventListener("click", e => {
    if (!cart.getLines().length) e.preventDefault(); else $("#checkout").href = checkoutUrl();
  });

  cart.subscribe(render);
  render();
  return { open, close };
}

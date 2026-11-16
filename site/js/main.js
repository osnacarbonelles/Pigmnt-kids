/* =========================================================
   Punto de entrada: conecta datos, carrito e interfaz.
   Para cambiar la fuente del catálogo (API o base de datos), reemplaza
   la línea marcada "FUENTE DE DATOS" por otro repositorio con la misma
   interfaz (ver js/catalog/repository.js).
   ========================================================= */
import { STORE } from "../data/config.js";
import { products, categories } from "../data/products.js";
import { createLocalCatalogRepository } from "./catalog/repository.js";
import { createCart, pruneLines } from "./cart/cart.js";
import { cartStorage, migrateLegacyLines } from "./cart/storage.js";
import { whatsappUrl, helloMessage } from "./orders/whatsapp.js";
import { formatMoney } from "./lib/format.js";
import { $, $$, reduced } from "./lib/dom.js";
import { renderCatalog, initReveals } from "./ui/catalog-view.js";
import { createProductSheet } from "./ui/product-sheet.js";
import { createCartDrawer } from "./ui/cart-drawer.js";
import { runIntro } from "./ui/intro.js";

// FUENTE DE DATOS
const repo = createLocalCatalogRepository({ products, categories });

function wireStatic(productsById) {
  $$("[data-wa='hello']").forEach(a => { a.href = whatsappUrl(STORE.whatsapp, helloMessage(STORE)); });
  $$("[data-ig]").forEach(a => { a.href = STORE.instagram; });
  $$("[data-maps]").forEach(a => { a.href = STORE.mapsUrl; });
  $$("[data-store]").forEach(el => { el.textContent = STORE[el.dataset.store] ?? ""; });
  $$("[data-price]").forEach(el => { const p = productsById.get(el.dataset.price); if (p) el.textContent = formatMoney(p.price, STORE); });
  $("#year").textContent = new Date().getFullYear();
}

async function init() {
  const { products: list, categories: cats } = await renderCatalog({ repo, store: STORE });
  const productsById = new Map(list.map(p => [p.id, p]));
  wireStatic(productsById);

  // carrito: recupera lo guardado (o migra el formato anterior) y descarta lo que ya no existe
  const valid = l => {
    const p = productsById.get(l.productId);
    return !!p && p.variants.some(v => v.id === l.variantId) && l.qty > 0;
  };
  const stored = cartStorage.load() ?? migrateLegacyLines(cartStorage.loadLegacy(), productsById);
  const cart = createCart({ initial: pruneLines(stored, valid), max: STORE.maxQtyPerLine, persist: cartStorage });
  cartStorage.save(cart.getLines());
  cartStorage.watch(lines => cart.replace(pruneLines(lines, valid)));

  const drawer = createCartDrawer({ cart, productsById, store: STORE });
  const sheet = createProductSheet({ repo, cart, store: STORE, categories: cats });

  document.addEventListener("click", e => {
    const o = e.target.closest("[data-open]");
    if (o && !o.closest(".sheet")) { e.preventDefault(); sheet.open(o.dataset.open, o); }
  });

  initReveals();
  runIntro();
}

init().catch(err => {
  console.error("No se pudo iniciar la tienda:", err);
  document.getElementById("intro")?.remove();
  document.documentElement.classList.remove("intro-on");
});

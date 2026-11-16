/* Persistencia local del carrito y de los datos opcionales del cliente. */

const read = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin almacenamiento */ } };

const CART_KEY = "pk-cart-v3";
const LEGACY_KEY = "pk-cart-v2";   // { key, id, size, color(nombre), qty }
const CUSTOMER_KEY = "pk-customer-v1";

export const cartStorage = {
  load: () => read(CART_KEY, null),
  save: lines => write(CART_KEY, lines),
  /** Convierte el carrito de la versión anterior si existe. */
  loadLegacy: () => read(LEGACY_KEY, []),
  watch(cb) {
    addEventListener("storage", e => { if (e.key === CART_KEY) cb(read(CART_KEY, [])); });
  },
};

export const customerStorage = {
  load: () => read(CUSTOMER_KEY, { name: "", city: "" }),
  save: data => write(CUSTOMER_KEY, data),
};

/** Migra líneas v2 a v3 usando el catálogo actual. */
export function migrateLegacyLines(legacy, productsById) {
  return legacy.flatMap(l => {
    const p = productsById.get(l.id);
    const color = p?.colors.find(c => c.name === l.color);
    const v = p && color && p.variants.find(x => x.size === l.size && x.colorId === color.id);
    return v ? [{ key: `${p.id}|${v.id}`, productId: p.id, variantId: v.id, size: v.size, colorId: v.colorId, qty: l.qty }] : [];
  });
}

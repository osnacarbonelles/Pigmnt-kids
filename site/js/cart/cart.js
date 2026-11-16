/* =========================================================
   OPERACIONES DEL CARRITO (sin interfaz, sin precios, sin almacenamiento)
   Línea: { key, productId, variantId, size, colorId, qty }
   ========================================================= */

export const lineKey = (productId, variantId) => `${productId}|${variantId}`;
const clamp = (n, max) => Math.max(1, Math.min(max, Math.floor(n) || 1));

/** Funciones puras: devuelven un arreglo nuevo. */
export function addLine(lines, item, max) {
  const key = lineKey(item.productId, item.variantId);
  const found = lines.find(l => l.key === key);
  if (found) return lines.map(l => l === found ? { ...l, qty: clamp(l.qty + item.qty, max) } : l);
  return [...lines, { key, ...item, qty: clamp(item.qty, max) }];
}
export const setLineQty = (lines, key, qty, max) =>
  lines.map(l => l.key === key ? { ...l, qty: clamp(qty, max) } : l);
export const removeLine = (lines, key) => lines.filter(l => l.key !== key);
/** Descarta líneas cuyo producto/variante ya no existe o está inactivo. */
export const pruneLines = (lines, isValid) => lines.filter(isValid);

/**
 * Almacén reactivo mínimo. `persist` es opcional (ver cart/storage.js).
 */
export function createCart({ initial = [], max = 10, persist } = {}) {
  let lines = initial;
  const listeners = new Set();
  const commit = next => { lines = next; persist?.save(lines); listeners.forEach(fn => fn(lines)); };
  return {
    getLines: () => lines,
    add: item => commit(addLine(lines, item, max)),
    setQty: (key, qty) => commit(setLineQty(lines, key, qty, max)),
    remove: key => commit(removeLine(lines, key)),
    clear: () => commit([]),
    replace: next => commit(next),
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    max,
  };
}

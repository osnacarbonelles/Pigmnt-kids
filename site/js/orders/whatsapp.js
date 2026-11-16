/* =========================================================
   MENSAJES Y ENLACES DE WHATSAPP
   Único lugar donde se construye un enlace wa.me.
   El número sale de data/config.js (STORE.whatsapp).
   ========================================================= */
import { priceLine, cartTotals } from "../cart/pricing.js";
import { colorOf } from "../catalog/product.js";
import { formatMoney } from "../lib/format.js";

export const whatsappUrl = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const helloMessage = store =>
  `Hola, ${store.name}. Vi el catálogo en la página y quiero más información.`;

export function productQuestionMessage(store, product, { size, colorId }) {
  const talla = size ? `, talla ${size}` : "";
  return `Hola, ${store.name}. Quiero preguntar por: ${product.name}${talla} (${colorOf(product, colorId).name}). ¿Está disponible?`;
}

/** Resumen del pedido: producto, talla, color, cantidad y total. */
export function orderMessage({ store, lines, productsById, customer = {} }) {
  const money = n => formatMoney(n, store);
  const rows = lines.map((l, i) => {
    const p = productsById.get(l.productId), { unit, total } = priceLine(l, productsById);
    return `${i + 1}. ${p.name}\n   Talla: ${l.size} | Color: ${colorOf(p, l.colorId).name}\n   Cantidad: ${l.qty} x ${money(unit)} = ${money(total)}`;
  });
  const { count, total } = cartTotals(lines, productsById);
  const who = [customer.name && `Nombre: ${customer.name}`, customer.city && `Ciudad o barrio: ${customer.city}`].filter(Boolean).join("\n");
  return [
    `Hola, ${store.name}. Quiero hacer este pedido:`, "",
    rows.join("\n\n"), "",
    `Total de referencia: ${money(total)} (${count} ${count === 1 ? "prenda" : "prendas"})`,
    who ? `\n${who}` : "", "",
    "¿Me confirman disponibilidad, valor final y envío? Gracias.",
  ].join("\n").replace(/\n{3,}/g, "\n\n");
}

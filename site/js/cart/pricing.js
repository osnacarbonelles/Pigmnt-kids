/* Cálculo de subtotales y total. Sin envío ni descuentos: el costo final lo
   confirma la tienda por WhatsApp. */
import { findVariant, unitPrice } from "../catalog/product.js";

/** @param productsById Map<string, Product> */
export function priceLine(line, productsById) {
  const p = productsById.get(line.productId);
  if (!p) return { unit: 0, total: 0 };
  const unit = unitPrice(p, findVariant(p, line.size, line.colorId));
  return { unit, total: unit * line.qty };
}

export function cartTotals(lines, productsById) {
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + priceLine(l, productsById).total, 0);
  return { count, subtotal, total: subtotal };
}

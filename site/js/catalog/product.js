/* Reglas puras sobre un producto: variantes, precio y disponibilidad. */

export const findVariant = (product, size, colorId) =>
  product.variants.find(v => v.size === size && v.colorId === colorId) ?? null;

export const colorOf = (product, colorId) =>
  product.colors.find(c => c.id === colorId) ?? product.colors[0];

/** Precio efectivo: el de la variante si lo define, si no el del producto. */
export const unitPrice = (product, variant) => variant?.price ?? product.price;

export const compareAtPrice = (product, variant) =>
  variant?.compareAtPrice ?? product.compareAtPrice ?? null;

/** Una variante se puede pedir salvo que esté confirmada como agotada. */
export const isOrderable = variant => !!variant && variant.availability !== "out_of_stock";

export const primaryPhoto = product => product.photos[0];

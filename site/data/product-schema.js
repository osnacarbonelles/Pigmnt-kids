/* =========================================================
   ESQUEMA DE PRODUCTO
   Forma única que usa toda la tienda. Una API o base de datos
   futura debe devolver exactamente esta forma.

   @typedef {Object} Photo      { src, srcSm, alt }
   @typedef {Object} Color      { id, name, hex }
   @typedef {Object} Variant    { id, sku, size, colorId, price, compareAtPrice,
                                  stock, availability }
   @typedef {Object} Product    { id, slug, name, description, category, price,
                                  compareAtPrice, photos[], sizes[], colors[],
                                  variants[], active, availability, confirmed }

   availability: "unconfirmed" | "in_stock" | "low_stock" | "out_of_stock"
     - "unconfirmed" = el cliente aún no ha confirmado disponibilidad.
       Es el valor por defecto: no se inventa disponibilidad.
   stock: número o null. null = desconocido. No se descuenta nada hasta
     que exista una fuente de inventario confiable.
   variant.price / compareAtPrice: null = hereda el del producto.
   ========================================================= */

export const AVAILABILITY = ["unconfirmed", "in_stock", "low_stock", "out_of_stock"];

/** Genera una variante por cada combinación talla × color (sin inventario). */
export function makeVariants(productId, sizes, colors) {
  return sizes.flatMap(size => colors.map(c => ({
    id: `${productId}-${size}-${c.id}`,
    sku: null,
    size,
    colorId: c.id,
    price: null,
    compareAtPrice: null,
    stock: null,
    availability: "unconfirmed",
  })));
}

/** Fotografías de un producto a partir de su carpeta de assets. */
export const photosFor = (id, alt) => [
  { src: `assets/products/${id}.webp`, srcSm: `assets/products/${id}-sm.webp`, alt },
];

/** Completa valores por defecto y valida los campos obligatorios. */
export function defineProduct(input) {
  const p = {
    slug: input.id,
    compareAtPrice: null,
    active: true,
    availability: "unconfirmed",
    confirmed: false,
    ...input,
  };
  for (const k of ["id", "name", "category", "price", "sizes", "colors", "photos"]) {
    if (p[k] == null || (Array.isArray(p[k]) && !p[k].length)) {
      throw new Error(`Producto inválido (${p.id || "sin id"}): falta "${k}"`);
    }
  }
  if (!AVAILABILITY.includes(p.availability)) throw new Error(`Disponibilidad inválida en ${p.id}`);
  p.variants = p.variants ?? makeVariants(p.id, p.sizes, p.colors);
  return p;
}

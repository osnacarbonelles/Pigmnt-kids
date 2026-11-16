/* =========================================================
   CAPA DE ACCESO A DATOS DEL CATÁLOGO
   La interfaz es asíncrona a propósito: hoy lee datos locales, mañana
   puede llamar a una API o base de datos sin tocar la interfaz.

   Interfaz (CatalogRepository):
     listProducts({ category?, includeInactive? }) -> Promise<Product[]>
     getProductById(id)                            -> Promise<Product|null>
     getProductBySlug(slug)                        -> Promise<Product|null>
     listCategories()                              -> Promise<Category[]>
     createProduct(input)                          -> Promise<Product>
     updateProduct(id, changes)                    -> Promise<Product>
     deactivateProduct(id)                         -> Promise<Product>

   Para cambiar de fuente: crear otra función con esta misma forma
   (por ejemplo createApiCatalogRepository) y usarla en main.js.
   ========================================================= */

export class NotSupportedError extends Error {
  constructor(op) {
    super(`"${op}" no está disponible con la fuente de datos local (solo lectura).`);
    this.name = "NotSupportedError";
  }
}

/**
 * Fuente local de solo lectura sobre los datos de `data/products.js`.
 * Las operaciones de escritura se rechazan de forma explícita: no se
 * simula una persistencia que no existe.
 */
export function createLocalCatalogRepository({ products, categories }) {
  const clone = v => structuredClone(v);
  const writeOp = name => async () => { throw new NotSupportedError(name); };

  return {
    async listProducts({ category, includeInactive = false } = {}) {
      return clone(products.filter(p =>
        (includeInactive || p.active) && (!category || category === "all" || p.category === category)));
    },
    async getProductById(id) {
      const p = products.find(x => x.id === id && x.active);
      return p ? clone(p) : null;
    },
    async getProductBySlug(slug) {
      const p = products.find(x => x.slug === slug && x.active);
      return p ? clone(p) : null;
    },
    async listCategories() { return clone(categories); },

    createProduct: writeOp("createProduct"),
    updateProduct: writeOp("updateProduct"),
    deactivateProduct: writeOp("deactivateProduct"),
  };
}

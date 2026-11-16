# Evolución propuesta (no implementada)

La tienda ya está preparada para crecer sin reescribir la interfaz: el catálogo se lee solo a través de `site/js/catalog/repository.js`, y los productos tienen id, slug, variantes, estado activo, disponibilidad y confirmación comercial. Nada de lo siguiente existe todavía.

## Punto de conexión

Crear `createApiCatalogRepository()` con la misma interfaz que `createLocalCatalogRepository()` (`listProducts`, `getProductById`, `getProductBySlug`, `listCategories`, `createProduct`, `updateProduct`, `deactivateProduct`) y cambiar una línea en `site/js/main.js`. La API debe devolver productos con la forma de `site/data/product-schema.js`.

## Fases sugeridas

1. **Base de datos y API de lectura.** Tablas: `products`, `variants` (talla, color, sku, precio opcional, stock, disponibilidad), `categories`, `photos`. El sitio público solo lee productos activos. Opciones sin servidor propio: Supabase, Cloudflare D1 o similar (decisión y costo del cliente).
2. **Inicio de sesión privado.** Autenticación solo para administradores (correo con enlace mágico o usuario y contraseña). Rutas `/admin` protegidas, sin enlaces públicos.
3. **Panel de productos.** Crear, editar y desactivar productos; marcar un precio como confirmado (`confirmed`); orden y visibilidad.
4. **Carga de fotografías.** Subida a almacenamiento de objetos, con generación automática de las dos versiones WebP (640×800 y 320×400) y texto alternativo.
5. **Precios, tallas y colores.** Edición de `price`, `compareAtPrice`, tallas y colores desde el panel; las variantes se regeneran a partir de ellos.
6. **Inventario.** Stock por talla y color en `variants.stock`. Cuando exista una fuente confiable, la interfaz ya deshabilita variantes con `availability: "out_of_stock"`; faltaría descontar al confirmar un pedido y mostrar "pocas unidades" con `low_stock`.
7. **Gestión de pedidos.** Guardar el pedido al pulsar "Enviar por WhatsApp" (líneas, total, datos opcionales del cliente) con estados: recibido, confirmado, despachado, entregado, cancelado. El mensaje de `orders/whatsapp.js` seguiría siendo el canal con el cliente.

## Fuera de alcance por ahora

Pasarela de pagos, cuentas de clientes, cálculo de envío y descuentos. El total mostrado es siempre "de referencia"; el valor final lo confirma la tienda por WhatsApp.

## Antes de empezar

- Confirmar con el cliente precios, tallas, colores y disponibilidad reales de cada prenda.
- Definir quién administra el catálogo y con qué frecuencia cambia.
- Decidir presupuesto de servicios recurrentes (base de datos, almacenamiento, dominio).

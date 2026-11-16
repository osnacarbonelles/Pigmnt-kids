# Pigmento Store Kids — catálogo web

Catálogo de ropa infantil con pedido por WhatsApp. Sitio estático (HTML, CSS y módulos JS nativos). **No hay paso de compilación ni dependencias de instalación.**

## Estructura

```
site/                     ← carpeta que se publica
├── index.html            Estructura de la página
├── styles.css            Estilos
├── assets/
│   ├── logo/             Emblema, letras KIDS, favicon, imagen para compartir
│   └── products/         Fotos: <id>.webp (640×800) y <id>-sm.webp (320×400)
├── data/                 Información comercial (lo único que se edita a diario)
│   ├── config.js         WhatsApp, Instagram, dirección, moneda
│   ├── products.js       Categorías y productos
│   └── product-schema.js Forma única de un producto y sus variantes
└── js/
    ├── main.js           Conecta datos, carrito e interfaz
    ├── catalog/          repository.js (acceso a datos) · product.js (reglas de variantes)
    ├── cart/             cart.js (operaciones) · pricing.js (totales) · storage.js (persistencia)
    ├── orders/           whatsapp.js (mensajes y enlaces wa.me)
    ├── ui/               intro, hero, catálogo, ficha, bolsa, efectos, capas modales
    └── lib/              utilidades (DOM, formato de dinero)
```

Flujo de datos: `data/` → `catalog/repository.js` → `ui/`. La interfaz nunca lee `data/products.js` directamente. El carrito no sabe nada de la interfaz, y el mensaje de WhatsApp se arma solo en `orders/whatsapp.js`.

## Qué editar

| Quiero… | Dónde |
|---|---|
| Cambiar el número de WhatsApp | `site/data/config.js` → `whatsapp` (formato `573125414403`, sin `+`) y `whatsappLabel` |
| Agregar o modificar un producto | `site/data/products.js` (usa `defineProduct`) |
| Cambiar precio, tallas o colores | El mismo producto en `products.js`. Las variantes talla × color se generan solas |
| Marcar un dato como confirmado | `confirmed: true` en el producto (desaparece "Precio de referencia") |
| Precio tachado de comparación | `compareAtPrice: 129900` en el producto |
| Ocultar un producto | `active: false` |
| Marcar una talla como agotada | Define `variants` a mano con `availability: "out_of_stock"` (ver `product-schema.js`) |
| Agregar fotos | Copiar `<id>.webp` y `<id>-sm.webp` a `site/assets/products/` |
| Dirección, Instagram, mapa | `site/data/config.js` |

Por ahora todos los productos tienen `availability: "unconfirmed"` y `stock: null`: **no hay inventario real** y la tienda confirma disponibilidad por WhatsApp. No se descuenta nada.

## Ejecutar, construir y desplegar

Como usa módulos nativos, abre el sitio con un servidor local (no con doble clic al archivo):

```bash
npx http-server site -p 5173 -c-1
```

**Construir:** no hay build. Se publica la carpeta `site/` tal cual.

- **Netlify:** `netlify.toml` (publish = `site`).
- **Vercel:** `vercel.json` (outputDirectory = `site`), framework *Other*, sin comando de build.
- **Cloudflare Pages:** sin comando de build, directorio de salida `site`.

`site/_headers` define la caché en Netlify y Cloudflare Pages.

## Pendiente para una tienda administrable

Hoy el catálogo es de solo lectura. Para administrarlo se necesita una base de datos, autenticación, carga de fotos y un panel; el detalle y el orden recomendado están en [FUTURE-ROADMAP.md](FUTURE-ROADMAP.md). No hay nada de eso instalado.

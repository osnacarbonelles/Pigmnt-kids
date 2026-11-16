# Pigmento Store Kids — catálogo web

Catálogo de ropa infantil con pedido por WhatsApp. Sitio estático (HTML, CSS y JS), sin compilación ni dependencias de instalación.

## Editar datos

| Qué | Dónde |
|---|---|
| WhatsApp, Instagram, dirección, enlace del mapa | `site/data/config.js` |
| Prendas: nombre, precio, descripción, tallas, colores | `site/data/products.js` |
| Fotos de producto (640×800 y 320×400, WebP) | `site/assets/products/<id>.webp` y `<id>-sm.webp` |

Cada prenda tiene `confirmed: false`. Mientras esté así, la ficha muestra la etiqueta **"Precio de referencia"**. Cámbiala a `true` cuando el cliente confirme el dato.

## Ver en local

```bash
npx http-server site -p 5173 -c-1
```

## Desplegar

La carpeta publicada es `site/`.

- **Netlify:** usa `netlify.toml` (publish = `site`).
- **Vercel:** usa `vercel.json` (outputDirectory = `site`). Framework: *Other*, sin comando de build.
- **Cloudflare Pages:** sin comando de build; directorio de salida `site`.

`site/_headers` define la caché en Netlify y Cloudflare Pages.

Cuando exista el dominio final, conviene volver absoluta la URL de `og:image` en `site/index.html` y agregar `<link rel="canonical">`.

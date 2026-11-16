# Pigmento Store Kids — instrucciones del proyecto

Catálogo estático de ropa infantil con pedido por WhatsApp. Estructura y edición de datos: ver [README.md](README.md). Contexto de producto: [PRODUCT.md](PRODUCT.md). Evolución futura: [FUTURE-ROADMAP.md](FUTURE-ROADMAP.md).

- Repositorio: `https://github.com/osnacarbonelles/Pigmnt-kids.git` (remoto `origin`).
- WhatsApp oficial: `573125414403`, definido solo en `site/data/config.js`.
- No cambiar el emblema ni la identidad visual aprobada. No sustituir fotos reales por imágenes generadas sin aprobación.
- Precios y descripciones son provisionales: no presentarlos como confirmados ni inventar disponibilidad.
- No instalar bases de datos, CMS, autenticación ni dependencias por anticipado.

## Git y GitHub (regla permanente y automática)

La autorización para hacer commit y push en `develop` está dada de forma general: no preguntar si se desea hacer commit o subir cambios.

**Ramas**
- Trabajar en `develop`. `main` es la rama estable: no modificarla, no hacer merge ni publicar allí sin autorización explícita del usuario.
- Nunca `force push`. No reescribir ni eliminar historial (sin `reset --hard`, `rebase` de ramas publicadas, `commit --amend` de commits ya subidos).
- Ante conflictos con el remoto, resolver de forma segura conservando los cambios existentes (`git pull --no-rebase`/merge, nunca descartar).

**Commits**
- Commit al completar unidades de trabajo coherentes y funcionales; agrupar cambios relacionados, evitar commits mínimos.
- Mensajes descriptivos en español, en imperativo, con asunto breve y viñetas si hace falta.
- Antes de cada commit revisar `git status` y `git diff --stat`; incluir solo archivos de la tarea actual (añadir por ruta, no `git add -A` a ciegas).
- Mantener `.gitignore` al día. No eliminar archivos del repositorio salvo que la tarea lo exija.

**Seguridad**
- Nunca subir contraseñas, tokens, claves privadas, `.env` ni datos sensibles.
- No subir temporales, dependencias regenerables ni artefactos (`node_modules`, builds, logs). `Material/`, `Referencias/` y `Output/` no se publican.

**Cierre de cada tarea**
1. Verificar que los cambios funcionan y no introducen errores (consola limpia, flujo de compra, enlaces de WhatsApp).
2. Commit en `develop`.
3. `git push origin develop` (sin opciones destructivas).
4. Confirmar que el remoto quedó actualizado (`git ls-remote --heads origin develop` debe coincidir con `git rev-parse HEAD`).
5. Si el commit o el push falla, informar qué ocurrió y qué quedó pendiente. No dar la tarea por sincronizada sin confirmación del push.

Consultar al usuario solo antes de operaciones excepcionales o potencialmente destructivas.

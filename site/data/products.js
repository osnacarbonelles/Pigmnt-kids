/* =========================================================
   CATÁLOGO — 8 referencias (fotos del Instagram de la tienda)
   ⚠️ PROVISIONAL: precio, descripción, tallas y colores deben
   confirmarse con el cliente. Cuando un dato esté confirmado,
   cambia `confirmed: false` a `true` (la etiqueta "Precio de
   referencia" desaparece de esa prenda).
   ========================================================= */
window.PRODUCTS = [
  {
    id: "teddy-denim", name: "Conjunto Teddy Denim", cat: "conjuntos",
    price: 139900, confirmed: false,
    desc: "Camiseta oversize marfil con bermuda cargo en denim estampado de ositos.",
    sizes: ["2", "4", "6", "8", "10", "12"],
    colors: [{ name: "Marfil y denim", hex: "#efe8da" }],
  },
  {
    id: "spider-man", name: "Conjunto Amazing Spider-Man", cat: "conjuntos",
    price: 109900, confirmed: false,
    desc: "Camiseta negra con gráfico grande en la espalda y bermuda negra a juego.",
    sizes: ["4", "6", "8", "10", "12", "14", "16"],
    colors: [{ name: "Negro", hex: "#161616" }],
  },
  {
    id: "oversize-arena", name: "Camiseta Oversize Arena", cat: "camisetas",
    price: 59900, confirmed: false,
    desc: "Corte boxy con bordado tono a tono en el pecho. Va con jean, bermuda o jogger.",
    sizes: ["2", "4", "6", "8", "10", "12", "14"],
    colors: [{ name: "Arena", hex: "#d6bd93" }],
  },
  {
    id: "waffle-crema", name: "Camiseta Waffle Crema", cat: "camisetas",
    price: 64900, confirmed: false,
    desc: "Tejido waffle con costuras a la vista y hombro caído.",
    sizes: ["4", "6", "8", "10", "12", "14", "16"],
    colors: [{ name: "Crema", hex: "#efe7d6" }],
  },
  {
    id: "signature-celeste", name: "Camiseta Signature Celeste", cat: "camisetas",
    price: 59900, confirmed: false,
    desc: "Estampado de firma en blanco al frente y en la espalda, con etiqueta en el pecho.",
    sizes: ["2", "4", "6", "8", "10", "12"],
    colors: [{ name: "Celeste", hex: "#a9cdec" }],
  },
  {
    id: "jean-baggy", name: "Jean Baggy Lettering", cat: "jeans",
    price: 99900, confirmed: false,
    desc: "Jean baggy de lavado oscuro con lettering en toda la pierna.",
    sizes: ["2", "4", "6", "8", "10", "12", "14"],
    colors: [{ name: "Gris carbón", hex: "#41444c" }],
  },
  {
    id: "ringer-cafe", name: "Camiseta Ringer Café", cat: "camisetas",
    price: 59900, confirmed: false,
    desc: "Café terracota con ribetes negros en cuello y mangas.",
    sizes: ["6", "8", "10", "12", "14", "16"],
    colors: [{ name: "Café", hex: "#a0522d" }],
  },
  {
    id: "gothic-black", name: "Camiseta Oversize Gothic", cat: "camisetas",
    price: 74900, confirmed: false,
    desc: "Oversize negra con tipografía gótica en la espalda. Para los más grandes.",
    sizes: ["8", "10", "12", "14", "16"],
    colors: [{ name: "Negro", hex: "#161616" }],
  },
];

window.CATEGORIES = [
  { id: "all", label: "Todo" },
  { id: "camisetas", label: "Camisetas" },
  { id: "conjuntos", label: "Conjuntos" },
  { id: "jeans", label: "Jeans" },
];

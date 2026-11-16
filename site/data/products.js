/* =========================================================
   CATÁLOGO — fuente de datos local (8 referencias)
   ⚠️ PROVISIONAL: precio, descripción, tallas y colores deben
   confirmarse con el cliente. Al confirmar una prenda, cambia
   `confirmed: true` (desaparece "Precio de referencia").
   Disponibilidad e inventario: sin dato confiable todavía, por eso
   todas están en "unconfirmed" y `stock` es null.
   ========================================================= */
import { defineProduct, photosFor } from "./product-schema.js";

const sizes = (...s) => s;

export const categories = [
  { id: "camisetas", name: "Camisetas", singular: "Camiseta" },
  { id: "conjuntos", name: "Conjuntos", singular: "Conjunto" },
  { id: "jeans",     name: "Jeans",     singular: "Jean" },
];

export const products = [
  defineProduct({
    id: "teddy-denim", name: "Conjunto Teddy Denim", category: "conjuntos", price: 139900,
    description: "Camiseta oversize marfil con bermuda cargo en denim estampado de ositos.",
    photos: photosFor("teddy-denim", "Niño con conjunto Teddy Denim"),
    sizes: sizes("2", "4", "6", "8", "10", "12"),
    colors: [{ id: "marfil-denim", name: "Marfil y denim", hex: "#efe8da" }],
  }),
  defineProduct({
    id: "spider-man", name: "Conjunto Amazing Spider-Man", category: "conjuntos", price: 109900,
    description: "Camiseta negra con gráfico grande en la espalda y bermuda negra a juego.",
    photos: photosFor("spider-man", "Conjunto Amazing Spider-Man"),
    sizes: sizes("4", "6", "8", "10", "12", "14", "16"),
    colors: [{ id: "negro", name: "Negro", hex: "#161616" }],
  }),
  defineProduct({
    id: "oversize-arena", name: "Camiseta Oversize Arena", category: "camisetas", price: 59900,
    description: "Corte boxy con bordado tono a tono en el pecho. Va con jean, bermuda o jogger.",
    photos: photosFor("oversize-arena", "Camiseta Oversize Arena"),
    sizes: sizes("2", "4", "6", "8", "10", "12", "14"),
    colors: [{ id: "arena", name: "Arena", hex: "#d6bd93" }],
  }),
  defineProduct({
    id: "waffle-crema", name: "Camiseta Waffle Crema", category: "camisetas", price: 64900,
    description: "Tejido waffle con costuras a la vista y hombro caído.",
    photos: photosFor("waffle-crema", "Camiseta Waffle Crema"),
    sizes: sizes("4", "6", "8", "10", "12", "14", "16"),
    colors: [{ id: "crema", name: "Crema", hex: "#efe7d6" }],
  }),
  defineProduct({
    id: "signature-celeste", name: "Camiseta Signature Celeste", category: "camisetas", price: 59900,
    description: "Estampado de firma en blanco al frente y en la espalda, con etiqueta en el pecho.",
    photos: photosFor("signature-celeste", "Camiseta Signature Celeste"),
    sizes: sizes("2", "4", "6", "8", "10", "12"),
    colors: [{ id: "celeste", name: "Celeste", hex: "#a9cdec" }],
  }),
  defineProduct({
    id: "jean-baggy", name: "Jean Baggy Lettering", category: "jeans", price: 99900,
    description: "Jean baggy de lavado oscuro con lettering en toda la pierna.",
    photos: photosFor("jean-baggy", "Jean Baggy Lettering"),
    sizes: sizes("2", "4", "6", "8", "10", "12", "14"),
    colors: [{ id: "gris-carbon", name: "Gris carbón", hex: "#41444c" }],
  }),
  defineProduct({
    id: "ringer-cafe", name: "Camiseta Ringer Café", category: "camisetas", price: 59900,
    description: "Café terracota con ribetes negros en cuello y mangas.",
    photos: photosFor("ringer-cafe", "Camiseta Ringer Café"),
    sizes: sizes("6", "8", "10", "12", "14", "16"),
    colors: [{ id: "cafe", name: "Café", hex: "#a0522d" }],
  }),
  defineProduct({
    id: "gothic-black", name: "Camiseta Oversize Gothic", category: "camisetas", price: 74900,
    description: "Oversize negra con tipografía gótica en la espalda. Para los más grandes.",
    photos: photosFor("gothic-black", "Camiseta Oversize Gothic"),
    sizes: sizes("8", "10", "12", "14", "16"),
    colors: [{ id: "negro", name: "Negro", hex: "#161616" }],
  }),
];

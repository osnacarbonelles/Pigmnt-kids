/* Capas modales (ficha y bolsa): bloqueo de scroll, Escape y foco atrapado. */
import { $$ } from "../lib/dom.js";

const stack = [];

export function openLayer(layer) {
  stack.push(layer);
  document.body.classList.add("is-locked");
}
export function closeLayer(layer) {
  const i = stack.indexOf(layer);
  if (i >= 0) stack.splice(i, 1);
  if (!stack.length) document.body.classList.remove("is-locked");
}

addEventListener("keydown", e => {
  const top = stack.at(-1);
  if (!top) return;
  if (e.key === "Escape") return top.close();
  if (e.key !== "Tab") return;
  const f = $$("button:not([disabled]), a[href], input", top.panel).filter(el => el.offsetParent !== null);
  if (!f.length) return;
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
  else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
});

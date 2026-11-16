import { reduced, hasGsap } from "../lib/dom.js";

let started = false;
/** Entrada de la portada (se llama al terminar o saltar la intro). */
export function heroIn() {
  if (started) return; started = true;
  if (!hasGsap() || reduced) return;
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from(".hero__title .w", { yPercent: 110, duration: 1.1, stagger: .08 }, 0)
    .from(".w--play b", { yPercent: -60, opacity: 0, duration: .9, ease: "back.out(2.2)", stagger: .05 }, .25)
    .from(".hero__sub, .hero__cta", { y: 18, opacity: 0, duration: .9, stagger: .08 }, .3)
    .from(".hero-shot", { y: 60, opacity: 0, scale: .96, duration: 1.1, stagger: .09 }, .15)
    .from(".hero__emblem", { scale: .7, opacity: 0, rotate: -40, duration: 1.4 }, .1);
}

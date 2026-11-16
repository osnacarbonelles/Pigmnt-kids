export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const rand = (a, b) => a + Math.random() * (b - a);
export const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasGsap = () => typeof window.gsap !== "undefined";
export const KID_COLORS = ["#25a845", "#e2261d", "#0f9fd6", "#ffc20e"];

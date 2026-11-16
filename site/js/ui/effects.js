/* Avisos y animación de "agregar a la bolsa". */
import { $, rand, reduced, hasGsap, KID_COLORS } from "../lib/dom.js";

let toastT;
export function toast(msg) {
  const t = $("#toast");
  t.innerHTML = `<svg><use href="#i-check"/></svg> ${msg}`;
  t.classList.add("show"); clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 2400);
}

function cartFeedback(qty) {
  const cartBtn = $("#cartBtn");
  if (hasGsap() && !reduced) {
    const b = cartBtn.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    gsap.timeline().to(cartBtn, { scale: 1.25, duration: .12, ease: "power2.out" }).to(cartBtn, { scale: 1, duration: .6, ease: "elastic.out(1.2,.35)" });
    for (let i = 0; i < 16; i++) {
      const c = document.createElement("i"); c.className = "confetti"; c.style.background = KID_COLORS[i % 4];
      if (i % 2) c.style.borderRadius = "50%";
      $("#fx").appendChild(c);
      const ang = rand(0, Math.PI * 2), d = rand(30, 80);
      gsap.fromTo(c, { x: cx, y: cy }, { x: cx + Math.cos(ang) * d, y: cy + Math.sin(ang) * d + 30, rotate: rand(-300, 300), opacity: 0, duration: rand(.6, .9), ease: "expo.out", onComplete: () => c.remove() });
    }
    gsap.fromTo("#cartCount", { scale: .3 }, { scale: 1, duration: .6, ease: "elastic.out(1.2,.4)", clearProps: "transform" });
  }
  toast(`${qty === 1 ? "Prenda agregada" : qty + " prendas agregadas"} a tu bolsa`);
}

/** La foto vuela hasta el icono de la bolsa. */
export function flyToCart(img, qty) {
  if (!hasGsap() || reduced) return cartFeedback(qty);
  const a = img.getBoundingClientRect(), b = $("#cartBtn").getBoundingClientRect();
  const w = Math.min(a.width * .5, 180), h = w * 1.25;
  const fly = document.createElement("div");
  fly.className = "flyer"; fly.style.width = w + "px"; fly.style.height = h + "px";
  fly.innerHTML = `<img src="${img.src}" alt="">`;
  $("#fx").appendChild(fly);
  const sx = a.left + a.width / 2 - w / 2, sy = a.top + a.height / 2 - h / 2;
  const ex = b.left + b.width / 2 - w / 2, ey = b.top + b.height / 2 - h / 2;
  const peak = Math.min(sy, ey) - 120;
  gsap.set(fly, { x: sx, y: sy, scale: .9 });
  gsap.timeline({ onComplete: () => { fly.remove(); cartFeedback(qty); } })
    .to(fly, { x: ex, duration: .85, ease: "power1.inOut" })
    .to(fly, { keyframes: { y: [sy, peak, ey], easeEach: "sine.inOut" }, duration: .85, ease: "none" }, 0)
    .to(fly, { scale: .1, rotate: 200, borderRadius: "50%", duration: .85, ease: "power2.in" }, 0);
}

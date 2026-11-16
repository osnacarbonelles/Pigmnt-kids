/* =========================================================
   INTRO DEL EMBLEMA
   1. Los siete brazos encajan uno a uno.
   2. El emblema gira y frena.
   3. KIDS aparece letra por letra, cada una con su color, y una barra de
      los cuatro colores de la marca se dibuja debajo.
   4. Cortina de colores y el logo viaja al encabezado.
   Una vez por sesión, se puede saltar, respeta movimiento reducido.
   ========================================================= */
import { $, $$, rand, reduced, hasGsap } from "../lib/dom.js";
import { heroIn } from "./hero.js";

const S = 1254, VX0 = 492, VX1 = 760, HY0 = 452, HY1 = 702, O = 4;
const pct = v => (v / S * 100).toFixed(3) + "%";
const inset = (x0, y0, x1, y1) => `inset(${pct(y0)} ${pct(S - x1)} ${pct(S - y1)} ${pct(x0)})`;
// [clip, z-index, origen de entrada]
const PIECES = [
  [inset(VX0, 0, VX1, S),          3, { x: 0,    y: -1.1, r: 0 }],
  [inset(VX1 - O, 0, S, HY0 + O),  1, { x: 1,    y: -1,   r: 90 }],
  [inset(VX1 - O, HY0, S, HY1),    2, { x: 1.2,  y: 0,    r: -30 }],
  [inset(VX1 - O, HY1 - O, S, S),  1, { x: 1,    y: 1,    r: -90 }],
  [inset(0, HY1 - O, VX0 + O, S),  1, { x: -1,   y: 1,    r: 90 }],
  [inset(0, HY0, VX0 + O, HY1),    2, { x: -1.2, y: 0,    r: 30 }],
  [inset(0, 0, VX0 + O, HY0 + O),  1, { x: -1,   y: -1,   r: -90 }],
];
// color de cada letra K, i, d, s (para el destello de su aparición)
const LETTER_GLOW = ["#25a845", "#e2261d", "#0f9fd6", "#ffc20e"];

function end(intro) {
  intro.remove();
  document.documentElement.classList.remove("intro-on");
  $("#headerLogo").style.opacity = "";
  heroIn();
}

export function runIntro() {
  const intro = $("#intro");
  if (!intro) return heroIn();
  let seen = false;
  try { seen = sessionStorage.getItem("pk-intro") === "1"; sessionStorage.setItem("pk-intro", "1"); } catch { /* ignorar */ }
  if (seen || reduced || document.hidden || !hasGsap()) return end(intro);

  const stage = $("#introStage"), emblem = $("#emblem"), spin = $("#emblemSpin");
  spin.innerHTML = PIECES.map(([clip, z]) => `<div class="bar" style="clip-path:${clip};-webkit-clip-path:${clip};z-index:${z}"></div>`).join("");
  const bars = $$(".bar", spin), kids = $$(".kid", intro), segs = $$(".kids-bar i", intro);
  const W = innerWidth, H = innerHeight;
  $("#headerLogo").style.opacity = "0";

  const ring = scale => {
    const r = document.createElement("div"); r.className = "ring"; stage.appendChild(r);
    gsap.fromTo(r, { scale: .3, opacity: .8 }, { scale, opacity: 0, duration: .8, ease: "expo.out", onComplete: () => r.remove() });
  };

  gsap.set(kids, { yPercent: -90, opacity: 0, scale: .6 });
  gsap.set(segs, { scaleX: 0 });
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => end(intro) });

  // 1) siete brazos encajan en secuencia
  PIECES.forEach(([, , f], i) => {
    tl.fromTo(bars[i],
      { x: f.x * W * .6, y: f.y * H * .6, rotate: f.r, scale: 1.15, opacity: 0 },
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, duration: .5, ease: "back.out(1.3)" },
      i === 0 ? .15 : ">-0.36");
  });
  // 2) giro con frenada
  tl.add(() => ring(6), ">-0.1")
    .to(spin, { rotate: 360, duration: .9, ease: "expo.inOut" }, "<")
    .addLabel("kids", ">-0.1")
  // 3) KIDS: el emblema cede un poco de espacio y cada letra cae a su sitio
    .to(emblem, { scale: .94, duration: .35, ease: "power3.out" }, "kids")
    .to(kids, { yPercent: 0, opacity: 1, scale: 1, duration: .6, ease: "back.out(1.7)", stagger: .1 }, "kids+=0.05")
    .fromTo(segs, { scaleX: 0 }, { scaleX: 1, duration: .5, ease: "power3.out", stagger: .1 }, "kids+=0.1")
    .to(emblem, { scale: 1, duration: .6, ease: "elastic.out(1,.55)" }, "kids+=0.4")
  // destello suave del color de cada letra al asentarse
  kids.forEach((k, i) => tl.fromTo(k,
    { filter: `drop-shadow(0 0 0 ${LETTER_GLOW[i]})` },
    { filter: `drop-shadow(0 0 2vmin ${LETTER_GLOW[i]})`, duration: .25, yoyo: true, repeat: 1, ease: "power2.out" },
    `kids+=${.2 + i * .1}`));
  tl
  // 4) cortina de colores y el logo viaja al encabezado
    .addLabel("out", "+=0.3")
    .to(segs, { opacity: 0, duration: .2 }, "out-=0.05")
    .to(".curtain i", { scaleY: 1, duration: .42, ease: "expo.inOut", stagger: .05 }, "out")
    .add(() => { intro.style.background = "transparent"; $("#skipIntro").style.opacity = "0"; heroIn(); }, "out+=0.55")
    .set(".curtain i", { transformOrigin: "top" }, "out+=0.55")
    .to(".curtain i", { scaleY: 0, duration: .5, ease: "expo.inOut", stagger: .05 }, "out+=0.56")
    .add(() => {
      const a = stage.getBoundingClientRect(), b = $("#headerLogo").getBoundingClientRect();
      gsap.to(stage, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: b.width / a.width, duration: .75, ease: "expo.inOut" });
    }, "out+=0.56")
    .to({}, { duration: .25 });

  const skip = () => { if (tl.time() < tl.labels.out) tl.seek("out"); tl.timeScale(1.8); };
  $("#skipIntro").addEventListener("click", skip);
  addEventListener("keydown", e => { if (e.key === "Escape" && document.contains(intro)) skip(); });
  setTimeout(() => { if (document.contains(intro)) { tl.kill(); end(intro); } }, 7000);
}

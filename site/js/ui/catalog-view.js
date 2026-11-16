/* Presentación del catálogo: tarjetas y filtros. Lee datos solo vía repositorio. */
import { $, $$, hasGsap, reduced } from "../lib/dom.js";
import { formatMoney } from "../lib/format.js";
import { primaryPhoto } from "../catalog/product.js";

export async function renderCatalog({ repo, store }) {
  const [products, categories] = await Promise.all([repo.listProducts(), repo.listCategories()]);
  const catName = id => categories.find(c => c.id === id)?.singular ?? "";
  const grid = $("#grid"), filters = $("#filters");
  const money = n => formatMoney(n, store);

  grid.innerHTML = products.map((p, i) => {
    const ph = primaryPhoto(p);
    const sizes = p.sizes;
    return `
    <article class="card reveal" data-id="${p.id}" style="transition-delay:${(i % 4) * 70}ms">
      <button class="card__link" type="button" data-open="${p.id}" aria-label="${p.name}, ${money(p.price)}. Escoger talla">
        <div class="card__media">
          <img src="${ph.srcSm}" srcset="${ph.srcSm} 320w, ${ph.src} 640w" sizes="(max-width:700px) 46vw, (max-width:1040px) 30vw, 290px" alt="" width="640" height="800" loading="lazy" decoding="async">
          <span class="card__plus" aria-hidden="true"><svg><use href="#i-plus"/></svg></span>
        </div>
        <div class="card__body">
          <div class="card__row"><h3 class="card__name">${p.name}</h3><span class="card__price">${money(p.price)}</span></div>
          <p class="card__meta">${p.colors.length > 1 ? p.colors.map(c => `<i style="--s:${c.hex}" title="${c.name}"></i>`).join("") : ""}${catName(p.category)} · Tallas ${sizes[0]} a ${sizes.at(-1)}</p>
        </div>
      </button>
    </article>`;
  }).join("");

  const chips = [{ id: "all", name: "Todo" }, ...categories].map(c => {
    const n = c.id === "all" ? products.length : products.filter(p => p.category === c.id).length;
    return n ? `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="${c.id === "all"}">${c.name} <span class="chip__n">${n}</span></button>` : "";
  }).join("");
  filters.innerHTML = chips;

  const setCount = n => { $("#catCount").textContent = `${n} ${n === 1 ? "referencia" : "referencias"}`; };
  setCount(products.length);

  filters.addEventListener("click", async e => {
    const chip = e.target.closest(".chip");
    if (!chip || chip.getAttribute("aria-pressed") === "true") return;
    $$(".chip", filters).forEach(c => c.setAttribute("aria-pressed", c === chip));
    const visibleIds = new Set((await repo.listProducts({ category: chip.dataset.filter })).map(p => p.id));
    const cards = $$(".card", grid);
    const apply = () => {
      cards.forEach(c => { c.hidden = !visibleIds.has(c.dataset.id); });
      setCount(visibleIds.size);
      const shown = cards.filter(c => !c.hidden);
      shown.forEach(c => c.classList.add("is-in"));
      if (hasGsap() && !reduced) gsap.fromTo(shown, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: "expo.out", stagger: .05, clearProps: "opacity,transform" });
    };
    if (hasGsap() && !reduced) gsap.to(cards.filter(c => !c.hidden), { opacity: 0, y: 10, duration: .18, ease: "power2.in", onComplete: apply });
    else apply();
  });
  return { products, categories };
}

/** Aparición suave al hacer scroll. */
export function initReveals() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) return els.forEach(el => el.classList.add("is-in"));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach(el => io.observe(el));
}

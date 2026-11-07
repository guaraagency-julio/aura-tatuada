// Etapa 1: comportamento essencial. Animações vinculadas ao scroll serão construídas na Etapa 2.
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const closeMenu = () => {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    mobileNav.hidden = true;
  };
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
      mobileNav.hidden = expanded;
    });
    mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
    window.matchMedia("(min-width: 741px)").addEventListener("change", event => { if (event.matches) closeMenu(); });
  }
  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
  document.querySelectorAll("img[data-fallback]").forEach(img => {
    img.addEventListener("error", () => img.classList.add("is-missing"));
    if (img.complete && img.naturalWidth === 0) img.classList.add("is-missing");
  });
})();

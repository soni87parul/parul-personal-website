// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Five-stage method — click to expand detail
document.querySelectorAll(".method__stage").forEach((stage) => {
  stage.addEventListener("click", () => {
    const isExpanded = stage.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".method__stage").forEach((s) => s.setAttribute("aria-expanded", "false"));
    stage.setAttribute("aria-expanded", isExpanded ? "false" : "true");
  });
});

// Experience filter (on /experience/ page)
const filterBar = document.querySelector("[data-filter-bar]");
if (filterBar) {
  const buttons = filterBar.querySelectorAll("button");
  const cards = document.querySelectorAll("[data-story-card]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.getAttribute("data-filter");

      cards.forEach((card) => {
        const categories = (card.getAttribute("data-categories") || "").split(",");
        card.style.display = filter === "all" || categories.includes(filter) ? "" : "none";
      });
    });
  });
}

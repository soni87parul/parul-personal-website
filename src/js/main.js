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

// Experience broad-filter bar (on /experience/ page)
const filterBar = document.querySelector("[data-filter-bar]");
if (filterBar) {
  const buttons = filterBar.querySelectorAll("button[data-filter]");
  const validFilters = new Set([...buttons].map((b) => b.getAttribute("data-filter")));
  const cards = document.querySelectorAll("[data-story-card]");
  const emptyState = document.querySelector(".filter-empty-state");

  function applyFilter(filter, pushState) {
    if (!validFilters.has(filter)) filter = "all";

    buttons.forEach((b) => b.classList.toggle("is-active", b.getAttribute("data-filter") === filter));

    // A story hidden inside a collapsed <details> stays invisible even if we
    // set its display here (browsers hide details content regardless), so
    // force it open whenever a specific filter might need to reveal something inside.
    const storiesDisclosure = document.getElementById("more-stories-disclosure");
    if (filter !== "all" && storiesDisclosure) {
      storiesDisclosure.open = true;
    }

    let visibleCount = 0;
    cards.forEach((card) => {
      const filters = (card.getAttribute("data-broad-filters") || "").split(",");
      const matches = filter === "all" || filters.includes(filter);
      card.style.display = matches ? "" : "none";
      if (matches) visibleCount++;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;

    if (pushState) {
      const url = new URL(window.location.href);
      if (filter === "all") {
        url.searchParams.delete("capability");
      } else {
        url.searchParams.set("capability", filter);
      }
      window.history.pushState({ filter }, "", url);
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyFilter(btn.getAttribute("data-filter"), true);
    });
  });

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    applyFilter(params.get("capability") || "all", false);
  });

  const initialParams = new URLSearchParams(window.location.search);
  const initialFilter = initialParams.get("capability");
  if (initialFilter) {
    applyFilter(initialFilter, false);
  }
}

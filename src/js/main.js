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

// Thinking territory filter bar (on /thinking/ page)
const thinkingFilterBar = document.querySelector("[data-thinking-filter-bar]");
if (thinkingFilterBar) {
  const buttons = thinkingFilterBar.querySelectorAll("button[data-territory-filter]");
  const validFilters = new Set([...buttons].map((b) => b.getAttribute("data-territory-filter")));
  const cards = document.querySelectorAll("[data-thinking-card]");
  const emptyState = document.querySelector("[data-thinking-empty-state]");

  function applyThinkingFilter(filter) {
    if (!validFilters.has(filter)) filter = "all";
    buttons.forEach((b) => b.classList.toggle("is-active", b.getAttribute("data-territory-filter") === filter));

    let visibleCount = 0;
    cards.forEach((card) => {
      const matches = filter === "all" || card.getAttribute("data-territory") === filter;
      card.style.display = matches ? "" : "none";
      if (matches) visibleCount++;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyThinkingFilter(btn.getAttribute("data-territory-filter"));
    });
  });

  const initialTerritory = new URLSearchParams(window.location.search).get("territory");
  if (initialTerritory) {
    applyThinkingFilter(initialTerritory);
  }
}

// Contact form — light conditional fields based on opportunity type
const opportunityTypeSelect = document.getElementById("opportunityType");
if (opportunityTypeSelect) {
  const conditionalGroups = document.querySelectorAll("[data-opportunity-group]");

  function applyOpportunityType(value) {
    conditionalGroups.forEach((group) => {
      group.hidden = !!value && group.getAttribute("data-opportunity-group") !== value;
    });
  }

  opportunityTypeSelect.addEventListener("change", () => applyOpportunityType(opportunityTypeSelect.value));
  applyOpportunityType(opportunityTypeSelect.value);
}

// Header scroll state — slightly shorter band + shadow once scrolled.
const siteHeader = document.getElementById("site-header");
if (siteHeader) {
  const applyScrollState = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  applyScrollState();
  window.addEventListener("scroll", applyScrollState, { passive: true });
}

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

// Line-flow diagrams (homepage methodology, Thinking ribbon) — a line
// draws left to right through each stage, pauses at the end, then resets
// and redraws from the start. Never connects the last stage back to the
// first visually; the reset is a plain state change, not a loop-back.
function initLineFlow(el) {
  const stages = el.querySelectorAll(".line-flow__stage");
  const fill = el.querySelector(".line-flow__fill");
  const n = stages.length;
  if (!n) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    stages.forEach((s) => s.classList.add("is-done"));
    el.classList.add("is-playing");
    return;
  }
  const drawMs = 700 + n * 260;
  const pauseMs = 1500;
  let timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function cycle() {
    clearTimers();
    // Reset instantly (no reverse-wipe) — disable the transition just for
    // this one frame, snap back to the start, then restore it before the
    // next forward draw begins.
    if (fill) fill.style.transition = "none";
    el.classList.remove("is-playing");
    stages.forEach((s) => s.classList.remove("is-active", "is-done"));
    void el.offsetWidth;
    if (fill) fill.style.transition = "";
    requestAnimationFrame(() => {
      el.classList.add("is-playing");
      stages.forEach((s, i) => {
        const t = n <= 1 ? 0 : (i / (n - 1)) * drawMs;
        timers.push(setTimeout(() => {
          stages.forEach((x) => x.classList.remove("is-active"));
          s.classList.add("is-active");
        }, t));
        timers.push(setTimeout(() => s.classList.add("is-done"), t + 150));
      });
      timers.push(setTimeout(() => {
        stages.forEach((s) => s.classList.remove("is-active"));
        timers.push(setTimeout(cycle, pauseMs));
      }, drawMs + 150));
    });
  }
  cycle();
}
const lineFlowEls = document.querySelectorAll("[data-line-flow]");
if (lineFlowEls.length && "IntersectionObserver" in window) {
  const lineFlowObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        initLineFlow(entry.target);
        lineFlowObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  lineFlowEls.forEach((el) => lineFlowObserver.observe(el));
} else {
  lineFlowEls.forEach((el) => initLineFlow(el));
}

// Methodology path — click/Enter/Space reveals the discoverable example.
// A real <button> already gets keyboard activation for free; this just
// toggles the visual state and keeps only one stage open at a time.
document.querySelectorAll(".method-path__toggle").forEach((stage) => {
  stage.addEventListener("click", () => {
    const isExpanded = stage.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".method-path__toggle").forEach((s) => s.setAttribute("aria-expanded", "false"));
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
  const resetLink = document.querySelector("[data-territory-reset-link]");
  const validFilters = new Set([...buttons].map((b) => b.getAttribute("data-territory-filter")));
  const cards = document.querySelectorAll("[data-thinking-card]");
  const emptyState = document.querySelector("[data-thinking-empty-state]");

  function applyThinkingFilter(filter) {
    if (!validFilters.has(filter)) filter = "all";
    buttons.forEach((b) => b.classList.toggle("is-active", b.getAttribute("data-territory-filter") === filter));
    if (resetLink) resetLink.hidden = filter === "all";

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

  if (resetLink) {
    resetLink.addEventListener("click", () => applyThinkingFilter("all"));
  }

  const initialTerritory = new URLSearchParams(window.location.search).get("territory");
  if (initialTerritory) {
    applyThinkingFilter(initialTerritory);
  }
}

// Featured-quote selector (About recommendations) — click a name to swap
// which recommendation is shown as the large featured quote.
document.querySelectorAll("[data-quote-block]").forEach((block) => {
  const buttons = block.querySelectorAll("[data-quote-selector] button");
  const quotes = block.querySelectorAll("[data-quote-featured] blockquote");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-quote-index");
      buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
      quotes.forEach((q) => { q.hidden = q.getAttribute("data-quote-index") !== index; });
    });
  });
});

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

  // Advisory/Thinking cards and CTAs link here with ?intent=...&topic=... —
  // preselect the closest matching opportunity type once on load, carry the
  // topic through as context, and show a friendly summary line instead of
  // the raw query string. Never re-applied after load, so a visitor who
  // changes the dropdown themselves is never overwritten.
  const INTENT_TO_OPPORTUNITY = { advisory: "ceo-advisory", policy: "government" };
  const TOPIC_LABELS = {
    "operating-model": "your operating model",
    "diagnosis": "diagnosing what's really going on",
    "cross-functional-execution": "execution breaking down between functions",
    "business-model": "your business model",
    "ai-operating-model": "AI and operating-model transformation",
    "ecosystem": "policy and ecosystem building",
    "strategic-diagnostic": "a strategic diagnostic",
    "transformation-engagement": "a transformation engagement",
    "portfolio-support": "portfolio company support",
    "0-to-1-scaleup": "0→1 or scale-up support",
    "ecosystem-project": "a policy or ecosystem project",
    "erp-transformation": "an ERP or systems transformation",
    "ceo-office": "the CEO Office and operating rhythm",
  };
  const INTENT_LABELS = {
    "leadership": "a leadership or executive opportunity",
    "transformation": "a transformation project",
    "ceo-advisory": "CEO / founder advisory",
    "investor": "investor or portfolio support",
    "board": "a board opportunity",
    "government": "a government or policy project",
    "speaking": "a speaking engagement",
    "collaboration": "a collaboration",
  };

  const params = new URLSearchParams(window.location.search);
  const intent = params.get("intent");
  const topic = params.get("topic");

  if (intent) {
    const mapped = INTENT_TO_OPPORTUNITY[intent] || intent;
    const matchingOption = [...opportunityTypeSelect.options].find((o) => o.value === mapped);
    if (matchingOption) opportunityTypeSelect.value = mapped;

    const contextBanner = document.getElementById("contextBanner");
    const label = TOPIC_LABELS[topic] || INTENT_LABELS[mapped];
    if (contextBanner && label) {
      contextBanner.textContent = "You're reaching out about: " + label;
      contextBanner.hidden = false;
    }
  }

  const referralTopicField = document.getElementById("referralTopic");
  if (referralTopicField && topic) referralTopicField.value = topic;

  applyOpportunityType(opportunityTypeSelect.value);
}

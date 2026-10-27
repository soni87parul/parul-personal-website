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

// Selected Experience visual bars (homepage) — the bars fill in once when
// the section scrolls into view. This is a pure visual-narrative reveal
// (not tied to any numeric value), so prefers-reduced-motion simply skips
// straight to the filled state instead of disabling the section.
const revealBars = document.querySelector("[data-reveal-bars]");
if (revealBars) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    revealBars.classList.add("is-revealed");
  } else if ("IntersectionObserver" in window) {
    const barsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealBars.classList.add("is-revealed");
          barsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    barsObserver.observe(revealBars);
  } else {
    revealBars.classList.add("is-revealed");
  }
}

// Generic scroll-reveal for the approved-visuals images (About's
// Operator/Builder/Ecosystem Thinker cards, the Experience opening visual,
// the Advisory ecosystem visual) — a small opacity/translateY fade-in,
// once per element. prefers-reduced-motion skips straight to visible.
const revealEls = document.querySelectorAll("[data-reveal]");
if (revealEls.length) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-revealed"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealEls.forEach((el) => revealObserver.observe(el));
  }
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

// Dynamic Impact Strip — hover/focus/tap a company logo to reveal a
// compact role + metric panel for that company.
document.querySelectorAll("[data-impact-strip]").forEach((strip) => {
  const buttons = strip.querySelectorAll(".impact-strip__logo-btn");
  const panel = strip.querySelector("[data-impact-panel]");
  if (!buttons.length || !panel) return;

  function showCompany(btn) {
    buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
    strip.classList.add("has-active");
    const role = btn.getAttribute("data-role") || "";
    const name = btn.getAttribute("data-name") || "";
    const metricValue = btn.getAttribute("data-metric-value") || "";
    const metricLabel = btn.getAttribute("data-metric-label") || "";
    const accent = btn.getAttribute("data-accent") || "";
    panel.style.setProperty("--panel-accent", accent);
    panel.querySelector(".impact-strip__panel-role strong").textContent = name;
    panel.querySelector(".impact-strip__panel-role span").textContent = role;
    const metricEl = panel.querySelector(".impact-strip__panel-metric");
    if (metricValue) {
      metricEl.hidden = false;
      metricEl.querySelector(".impact-strip__panel-metric-value").textContent = metricValue;
      metricEl.querySelector(".impact-strip__panel-metric-label").textContent = metricLabel;
    } else {
      metricEl.hidden = true;
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => showCompany(btn));
    btn.addEventListener("focus", () => showCompany(btn));
    btn.addEventListener("click", () => showCompany(btn));
  });

  showCompany(buttons[0]);
});

// Career strip (About) — a visual résumé. Hover (pointer devices), focus,
// click/tap or arrow keys select a chapter; the contextual panel cross-fades.
// Without JS every panel stays visible, so nothing depends on this script.
document.querySelectorAll("[data-career-strip]").forEach((strip) => {
  const tabs = [...strip.querySelectorAll('[role="tab"]')];
  const panels = [...strip.querySelectorAll('[role="tabpanel"]')];
  if (!tabs.length || tabs.length !== panels.length) return;
  strip.classList.add("is-enhanced");
  const canHover = window.matchMedia("(hover: hover)").matches;
  function select(index, opts) {
    tabs.forEach((t, i) => {
      const on = i === index;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      panels[i].classList.toggle("is-active", on);
    });
    if (opts && opts.focus) {
      tabs[index].focus();
      tabs[index].scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    if (canHover) tab.addEventListener("mouseenter", () => select(i));
    tab.addEventListener("focus", () => select(i));
    tab.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      if (next !== null) { e.preventDefault(); select(next, { focus: true }); }
    });
  });
  select(0);
});

// Expanding Panels (Motion Pattern B) — click/tap toggles an "is-active"
// state so touch devices get the same reveal that :hover/:focus give
// mouse and keyboard users.
document.querySelectorAll("[data-expand-row]").forEach((row) => {
  const items = row.querySelectorAll("[data-expand-item]");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const wasActive = item.classList.contains("is-active");
      items.forEach((i) => i.classList.remove("is-active"));
      if (!wasActive) item.classList.add("is-active");
    });
  });
});

// Circular Media Moment — hover/focus/tap a topic label to swap the caption.
document.querySelectorAll("[data-circular-media]").forEach((widget) => {
  const topics = widget.querySelectorAll(".circular-media__topic");
  const caption = widget.querySelector("[data-circular-caption]");
  if (!topics.length || !caption) return;
  function showTopic(btn) {
    topics.forEach((t) => t.classList.toggle("is-active", t === btn));
    caption.textContent = btn.getAttribute("data-caption") || "";
  }
  topics.forEach((btn) => {
    btn.addEventListener("mouseenter", () => showTopic(btn));
    btn.addEventListener("focus", () => showTopic(btn));
    btn.addEventListener("click", () => showTopic(btn));
  });
  showTopic(topics[0]);
});

// Speaking circular media — an approved clip plays muted and looped. For
// visitors who prefer reduced motion it is stopped and the poster shows.
document.querySelectorAll(".circular-media__video").forEach((video) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.pause();
    video.removeAttribute("autoplay");
    video.load();
  }
});

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

// Contact form — compact enquiry form posted to /contact-submit.php, which emails it.
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const reasonSelect = document.getElementById("reason");

  // Advisory/Speaking/Thinking links arrive with ?intent=...&topic=... —
  // preselect the closest reason once on load and carry the topic through
  // as a hidden field. Never re-applied, so a visitor's own choice wins.
  const INTENT_TO_REASON = {
    leadership: "leadership",
    transformation: "transformation",
    advisory: "transformation",
    "ceo-advisory": "transformation",
    fractional: "fractional",
    speaking: "speaking",
    investor: "collaboration",
    board: "collaboration",
    government: "collaboration",
    policy: "collaboration",
    collaboration: "collaboration",
    networking: "networking",
    other: "other",
  };
  const params = new URLSearchParams(window.location.search);
  const mappedReason = INTENT_TO_REASON[params.get("intent")];
  if (mappedReason && reasonSelect) reasonSelect.value = mappedReason;
  const topic = params.get("topic");
  const referralTopicField = document.getElementById("referralTopic");
  if (referralTopicField && topic) referralTopicField.value = topic.slice(0, 80);

  // JavaScript takes over validation so errors appear inline, next to each
  // field. Without JavaScript the browser's native validation still applies.
  contactForm.setAttribute("novalidate", "");

  const errorPanel = document.getElementById("contactError");
  const successPanel = document.getElementById("contactSuccess");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const fields = [...contactForm.querySelectorAll("input[required], select[required], textarea[required], input[type='url']")];

  function fieldValid(field) {
    const value = field.type === "checkbox" ? field.checked : field.value.trim();
    if (field.type === "checkbox") return value;
    if (field.required && !value) return false;
    if (!value) return true; // optional and blank
    if (field.minLength > 0 && value.length < field.minLength) return false;
    if (field.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (field.type === "url") return /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(value);
    return true;
  }

  function showFieldState(field) {
    const ok = fieldValid(field);
    const errorEl = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", ok ? "false" : "true");
    if (errorEl) {
      errorEl.textContent = ok ? "" : errorEl.getAttribute("data-message");
      errorEl.hidden = ok;
    }
    return ok;
  }

  fields.forEach((field) => {
    const evt = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "blur";
    field.addEventListener(evt, () => {
      if (field.type === "checkbox" || field.tagName === "SELECT" || field.value.trim() || field.getAttribute("aria-invalid") === "true") {
        showFieldState(field);
      }
    });
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") showFieldState(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    errorPanel.hidden = true;

    const invalid = fields.filter((field) => !showFieldState(field));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    const originalLabel = submitButton.textContent;
    submitButton.textContent = "Sending…";

    const body = new URLSearchParams(new FormData(contactForm)).toString();
    fetch(contactForm.getAttribute("action"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body,
    })
      .then((response) => response.json().catch(() => ({})).then((result) => ({ response, result })))
      .then(({ response, result }) => {
        // Only an explicit {"ok": true} from the script counts as sent, so a
        // server that ignores the post can never show a false "thank you".
        if (!response.ok || result.ok !== true) throw new Error("Submission not accepted");
        contactForm.hidden = true;
        successPanel.hidden = false;
        successPanel.focus();
      })
      .catch(() => {
        // Keep everything the visitor typed and let them try again.
        errorPanel.hidden = false;
        errorPanel.focus();
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
        submitButton.textContent = originalLabel;
      });
  });
}

// Speaking: loop a short YouTube clip (start/end seconds, optional slow motion) in the hero.
const ytClips = document.querySelectorAll("[data-yt-clip]");
if (ytClips.length) {
  window.onYouTubeIframeAPIReady = () => {
    ytClips.forEach((clip) => {
      const start = Number(clip.dataset.ytStart) || 0;
      const speed = Number(clip.dataset.ytSpeed) || 1;
      clip.ytPlayer = new YT.Player(clip.querySelector("iframe"), {
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.unloadModule("captions");
            e.target.setPlaybackRate(speed);
            e.target.playVideo();
            // Retry once the clip scrolls into view, in case the first autoplay was skipped.
            new IntersectionObserver((entries) => {
              if (entries.some((en) => en.isIntersecting) && e.target.getPlayerState() !== YT.PlayerState.PLAYING) e.target.playVideo();
            }).observe(clip);
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(start, true);
              e.target.playVideo();
            } else if (e.data === YT.PlayerState.PLAYING && e.target.getPlaybackRate() !== speed) {
              e.target.setPlaybackRate(speed);
            }
          },
        },
      });
    });
  };
  const api = document.createElement("script");
  api.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(api);
}

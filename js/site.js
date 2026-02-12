(() => {
  // -----------------------
  // THEME TOGGLE
  // -----------------------
  const root = document.documentElement;
  const STORAGE_KEY = "theme";
  const toggle = document.getElementById("themeToggle");

  function setTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleUI(theme);
  }

  function updateToggleUI(theme) {
    if (!toggle) return;

    const isDark = theme === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));

    const icon = toggle.querySelector("i");
    const label = toggle.querySelector("span");

    if (icon) {
      icon.classList.toggle("fa-moon", !isDark);
      icon.classList.toggle("fa-sun", isDark);
    }
    if (label) {
      label.textContent = isDark ? "Light" : "Dark";
    }
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;

    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  if (media) {
    media.addEventListener?.("change", () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== "dark" && saved !== "light") {
        setTheme(media.matches ? "dark" : "light");
      }
    });
  }

  // -----------------------
  // PROJECT FILTERS + SEARCH
  // -----------------------
  const searchInput = document.getElementById("projectSearch");
  const chips = Array.from(document.querySelectorAll(".chip-row .chip"));
  const cards = Array.from(document.querySelectorAll(".projects-grid .card"));
  const resultsNote = document.getElementById("resultsNote");

  // If you're not on the index page, these won't exist — so just stop.
  if (!searchInput || chips.length === 0 || cards.length === 0) return;

  let activeFilter = "all";
  let query = "";

  function normalize(str) {
    return (str || "").toLowerCase().trim();
  }

  function cardMatchesFilter(card) {
    if (activeFilter === "all") return true;
    const tags = normalize(card.getAttribute("data-tags"));
    return tags.split(/\s+/).includes(activeFilter);
  }

  function cardMatchesQuery(card) {
    if (!query) return true;

    const title = normalize(card.querySelector("h3")?.textContent);
    const bullets = normalize(card.querySelector(".bullets")?.textContent);
    const badges = normalize(card.querySelector(".badges")?.textContent);
    const tags = normalize(card.getAttribute("data-tags"));

    const haystack = `${title} ${bullets} ${badges} ${tags}`;
    return haystack.includes(query);
  }

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const show = cardMatchesFilter(card) && cardMatchesQuery(card);
      card.classList.toggle("is-hidden", !show);
      if (show) visibleCount++;
    });

    if (resultsNote) {
      const total = cards.length;
      if (!query && activeFilter === "all") {
        resultsNote.textContent = "";
      } else {
        const filterLabel = activeFilter === "all" ? "All" : activeFilter.toUpperCase();
        resultsNote.textContent = `Showing ${visibleCount} of ${total} projects (${filterLabel}${query ? `, search: "${query}"` : ""}).`;
      }
    }
  }

  // Chip click
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter || "all";
      applyFilters();
    });
  });

  // Search input
  searchInput.addEventListener("input", (e) => {
    query = normalize(e.target.value);
    applyFilters();
  });

  // Initial render
  applyFilters();
})();

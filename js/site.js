(function () {
    const root = document.documentElement;
    const btn = document.getElementById("themeToggle");

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        if (btn) {
            const isDark = theme === "dark";
            btn.setAttribute("aria-pressed", String(isDark));
            btn.innerHTML = isDark
                ? '<i class="fa-solid fa-sun" aria-hidden="true"></i><span>Light</span>'
                : '<i class="fa-solid fa-moon" aria-hidden="true"></i><span>Dark</span>';
        }
    }

    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
        applyTheme(saved);
    } else {
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
        applyTheme(prefersDark ? "dark" : "light");
    }

    btn?.addEventListener("click", () => {
        const current = root.getAttribute("data-theme");
        applyTheme(current === "dark" ? "light" : "dark");
    });

    const cards = Array.from(document.querySelectorAll(".projects-grid .card"));
    const search = document.getElementById("projectSearch");
    const chips = Array.from(document.querySelectorAll(".chip-row .chip"));
    const note = document.getElementById("resultsNote");

    if (cards.length && (search || chips.length)) {
        let activeFilter = "all";

        function matchesFilter(card) {
            const tags = (card.getAttribute("data-tags") || "").toLowerCase().trim();
            if (activeFilter === "all") return true;
            return tags.split(/\s+/).includes(activeFilter);
        }

        function matchesSearch(card) {
            const q = (search?.value || "").trim().toLowerCase();
            if (!q) return true;
            const text = (card.innerText || "").toLowerCase();
            const tags = (card.getAttribute("data-tags") || "").toLowerCase();
            return text.includes(q) || tags.includes(q);
        }

        function update() {
            let visible = 0;

            cards.forEach((card) => {
                const ok = matchesFilter(card) && matchesSearch(card);
                card.style.display = ok ? "" : "none";
                if (ok) visible++;
            });

            if (note) {
                note.textContent = `Showing ${visible} project${visible === 1 ? "" : "s"}.`;
            }
        }

        chips.forEach((chip) => {
            chip.addEventListener("click", () => {
                chips.forEach((c) => c.classList.remove("active"));
                chip.classList.add("active");
                activeFilter = chip.dataset.filter || "all";
                update();
            });
        });

        search?.addEventListener("input", update);
        update();
    }

    const toTop = document.querySelector(".to-top");
    function toggleToTop() {
        if (!toTop) return;
        const show = window.scrollY > 400;
        toTop.style.opacity = show ? "1" : "0";
        toTop.style.pointerEvents = show ? "auto" : "none";
    }

    toggleToTop();
    window.addEventListener("scroll", toggleToTop, { passive: true });
})();

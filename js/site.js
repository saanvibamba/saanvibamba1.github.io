(() => {
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
})();

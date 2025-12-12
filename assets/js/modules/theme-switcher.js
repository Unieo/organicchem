// assets/js/modules/theme-switcher.js
class ThemeSwitcher {
  constructor() {
    this.themeToggle = document.getElementById("theme-toggle");
    this.themeToggleContent = document.getElementById("theme-toggle-content");
    this.init();
  }

  init() {
    // Set initial theme
    this.setInitialTheme();

    // Header toggle
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Content area toggle
    if (this.themeToggleContent) {
      this.themeToggleContent.addEventListener("click", () =>
        this.toggleTheme()
      );
    }
  }

  setInitialTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    let theme = savedTheme || (prefersDark ? "dark" : "light");
    this.applyTheme(theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    this.applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    // Update all toggle buttons
    const toggles = document.querySelectorAll(
      ".theme-toggle, .theme-toggle-content"
    );
    toggles.forEach((toggle) => {
      const icon = toggle.querySelector("i");
      if (icon) {
        icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    });

    // Dispatch event for other components
    document.dispatchEvent(
      new CustomEvent("themeChange", { detail: { theme } })
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ThemeSwitcher();
});

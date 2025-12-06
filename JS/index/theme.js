// JS/index/theme.js - Updated for mobile nav
class ThemeManager {
  constructor() {
    this.theme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.createThemeToggle();
    this.setupEventListeners();
  }

  getStoredTheme() {
    return localStorage.getItem("theme");
  }

  getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.theme = theme;

    this.updateMetaThemeColor(theme);
  }

  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#1a1a2e" : "#667eea"
      );
    }
  }

  createThemeToggle() {
    if (document.querySelector(".theme-toggle")) {
      return;
    }

    const toggleHTML = `
      <button class="theme-toggle mobile-nav-link" aria-label="Toggle theme">
        <span class="theme-icon sun">☀️</span>
        <span class="theme-icon moon">🌙</span>
        <span>Toggle Theme</span>
      </button>
    `;

    // Add to both desktop and mobile nav
    const desktopNav = document.querySelector(".desktop-nav");
    const mobileNavLinks = document.querySelector(".mobile-nav-links");

    if (desktopNav) {
      desktopNav.insertAdjacentHTML("beforeend", toggleHTML);
    }

    if (mobileNavLinks) {
      mobileNavLinks.insertAdjacentHTML("beforeend", toggleHTML);
    }
  }

  toggleTheme() {
    const newTheme = this.theme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);

    const toggles = document.querySelectorAll(".theme-toggle");
    toggles.forEach((toggle) => {
      toggle.classList.add("rotating");
      setTimeout(() => {
        toggle.classList.remove("rotating");
      }, 500);
    });
  }

  setupEventListeners() {
    // Theme toggle click - using event delegation
    document.addEventListener("click", (e) => {
      if (e.target.closest(".theme-toggle")) {
        this.toggleTheme();
      }
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? "dark" : "light");
      }
    });

    // Keyboard shortcut (Alt + T)
    document.addEventListener("keydown", (e) => {
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (!window.themeManager) {
    window.themeManager = new ThemeManager();
  }
});

export default ThemeManager;

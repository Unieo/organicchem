// assets/js/core/app.js
import { Router } from "./router.js";
import { loadTemplate } from "./template-loader.js";

class OrganicChemApp {
  constructor() {
    this.router = new Router();
    this.currentPage = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    console.log("🚀 Organic Chemistry SPA Initializing...");

    try {
      // 1. Load essential templates first
      await this.loadEssentialTemplates();

      // 2. Initialize router
      this.router.init();

      // 3. Set up global event listeners
      this.setupEventListeners();

      // 4. Initialize lazy loading
      this.initLazyImages();

      // 5. Check for saved preferences
      this.restoreUserPreferences();

      this.isInitialized = true;
      console.log("✅ SPA Fully Initialized");

      // Dispatch app ready event
      document.dispatchEvent(new CustomEvent("app-ready"));
    } catch (error) {
      console.error("❌ App initialization failed:", error);
      this.showErrorState();
    }
  }

  async loadEssentialTemplates() {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
      throw new Error("App container not found");
    }

    // Remove initial loading screen
    const loadingScreen = appContainer.querySelector(".initial-loading");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => loadingScreen.remove(), 300);
    }

    // Create header container
    const headerContainer = document.createElement("div");
    headerContainer.id = "header-container";
    appContainer.prepend(headerContainer);

    // Create main content container
    const contentContainer = document.createElement("div");
    contentContainer.id = "content-container";
    appContainer.appendChild(contentContainer);

    // Load header template
    try {
      await loadTemplate("header", headerContainer);
      console.log("✅ Header loaded");
    } catch (error) {
      console.warn("⚠️ Using fallback header:", error);
      headerContainer.innerHTML = `
        <div class="fallback-header" style="
          background: var(--header-bg);
          padding: 15px 50px;
          border-bottom: 1px solid var(--border-color);
        ">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2 style="
              background: linear-gradient(135deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin: 0;
            ">
              <a href="/" data-link style="text-decoration: none; color: inherit;">
                Organic Chem Resources
              </a>
            </h2>
            <nav style="display: flex; gap: 20px;">
              <a href="/" data-link style="text-decoration: none; color: var(--text-color);">Home</a>
              <a href="/lessons/alcohols" data-link style="text-decoration: none; color: var(--text-color);">Alcohols</a>
            </nav>
          </div>
        </div>
      `;
    }
  }

  setupEventListeners() {
    // Theme change listener
    document.addEventListener("theme-changed", (e) => {
      const theme = e.detail.theme;
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          theme === "dark" ? "#121212" : "#667eea"
        );
      }
    });

    // Window resize optimizations
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        document.dispatchEvent(new CustomEvent("window-resized"));
      }, 100);
    });

    // Online/offline detection
    window.addEventListener("online", () => {
      console.log("📶 Back online");
      document.dispatchEvent(new CustomEvent("connection-restored"));
    });

    window.addEventListener("offline", () => {
      console.warn("📵 Offline mode");
      this.showOfflineNotification();
    });

    // Error boundary for unhandled errors
    window.addEventListener("error", (event) => {
      console.error("💥 Unhandled error:", event.error);
      // Don't break the app for non-critical errors
      event.preventDefault();
    });
  }

  initLazyImages() {
    // Check if lazy-images.js is loaded
    if (typeof window.LazyImages !== "undefined") {
      console.log("✅ LazyImages module detected");
      return;
    }

    // Fallback lazy loading
    const lazyImages = document.querySelectorAll("img[data-src]");
    if (lazyImages.length > 0) {
      console.log(`🖼️ Found ${lazyImages.length} lazy images (using fallback)`);

      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute("data-src");

              if (src) {
                img.src = src;
                img.removeAttribute("data-src");
                img.classList.add("loaded");

                // Handle WebP fallback
                img.onerror = () => {
                  const jpgSrc = src.replace(".webp", ".jpg");
                  img.src = jpgSrc;
                };
              }

              imageObserver.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.1,
        }
      );

      lazyImages.forEach((img) => imageObserver.observe(img));
    }
  }

  restoreUserPreferences() {
    // Restore sidebar state
    const sidebarCollapsed = localStorage.getItem("sidebarCollapsed");
    if (sidebarCollapsed === "true") {
      // Sidebar will be collapsed when lesson loads via router
      console.log("💾 Restoring sidebar: collapsed");
    }

    // Check for other preferences
    const fontSize = localStorage.getItem("fontSize");
    if (fontSize) {
      document.documentElement.style.fontSize = fontSize;
    }
  }

  showErrorState() {
    const appContainer = document.getElementById("app");
    if (!appContainer) return;

    appContainer.innerHTML = `
      <div class="error-state" style="
        padding: 40px;
        text-align: center;
        max-width: 600px;
        margin: 50px auto;
        background: var(--card-bg);
        border-radius: 12px;
        border: 2px solid #e74c3c;
      ">
        <div style="font-size: 3rem; color: #e74c3c; margin-bottom: 20px;">⚠️</div>
        <h2 style="color: #e74c3c; margin-bottom: 15px;">Application Error</h2>
        <p style="margin-bottom: 20px; color: var(--text-muted);">
          Something went wrong while loading the application.
        </p>
        <button onclick="location.reload()" style="
          padding: 10px 25px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        ">
          Reload Application
        </button>
        <p style="margin-top: 20px; font-size: 0.9rem; color: var(--text-muted);">
          If the problem persists, please check your console for errors.
        </p>
      </div>
    `;
  }

  showOfflineNotification() {
    // Create or show offline notification
    let notification = document.getElementById("offline-notification");

    if (!notification) {
      notification = document.createElement("div");
      notification.id = "offline-notification";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f39c12;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
      `;
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="fas fa-wifi-slash"></i>
          <span>You are currently offline</span>
        </div>
      `;
      document.body.appendChild(notification);

      // Auto-remove when back online
      const removeOnOnline = () => {
        notification.style.animation = "slideOut 0.3s ease forwards";
        setTimeout(() => notification.remove(), 300);
        window.removeEventListener("online", removeOnOnline);
      };
      window.addEventListener("online", removeOnOnline);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = "slideOut 0.3s ease forwards";
          setTimeout(() => notification.remove(), 300);
        }
      }, 5000);
    }
  }

  // Public API methods
  navigateTo(path) {
    if (this.router && typeof this.router.navigate === "function") {
      this.router.navigate(path);
    } else {
      window.location.href = path;
    }
  }

  getCurrentLesson() {
    const path = window.location.pathname;
    if (path.includes("/lessons/")) {
      return path.split("/")[2];
    }
    return null;
  }
}

// Create global app instance
const app = new OrganicChemApp();

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => app.init());
} else {
  // DOM already loaded
  setTimeout(() => app.init(), 0);
}

// Export for module usage
export { OrganicChemApp, app };

// Make app globally available for debugging
if (process.env.NODE_ENV === "development") {
  window.OrganicChemApp = OrganicChemApp;
  window.app = app;
}

// assets/js/modules/sidebar-manager.js - Add this at the VERY BEGINNING
(function () {
  console.log("🔄 Fixing body class and paths...");

  // 1. Add lesson-page class to body if missing
  if (window.location.pathname.includes("/lessons/")) {
    document.body.classList.add("lesson-page");
    console.log("✅ Added 'lesson-page' class to body");
  }

  // 2. Fix CSS paths if they're broken
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    if (
      link.href.includes("/assets/") &&
      !link.href.includes(window.location.origin)
    ) {
      // Fix the path
      const newHref = link.getAttribute("href").replace(/^\//, "");
      link.href = newHref;
      console.log("🔄 Fixed CSS path:", newHref);
    }
  });

  // 3. Force sidebar positioning (emergency fallback)
  setTimeout(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.style.cssText += `
                position: fixed !important;
                top: 80px !important;
                left: 0 !important;
                width: 280px !important;
                height: calc(100vh - 80px) !important;
                z-index: 100 !important;
            `;
      console.log("✅ Applied emergency sidebar fix");
    }
  }, 50);
})();

// sidebar-manager.js - Simplified and Working Version
class SidebarManager {
  constructor() {
    console.log("Sidebar Manager initialized");

    this.sidebar = document.querySelector(".sidebar");
    this.toggleBtn = document.getElementById("sidebar-toggle");
    this.closeBtn = document.querySelector(".sidebar-close");
    this.overlay = document.getElementById("sidebar-overlay");

    // Check if we're on a lesson page
    this.isLessonPage = document.body.classList.contains("lesson-page");

    if (this.sidebar && this.isLessonPage) {
      this.init();
    }
  }

  init() {
    // Load saved collapse state
    this.loadSavedState();

    // Set up event listeners
    this.setupEventListeners();

    // Handle responsive behavior
    this.handleResponsive();

    console.log("Sidebar Manager ready");
  }

  loadSavedState() {
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    const isCollapsed = savedCollapsed === "true";

    if (isCollapsed && window.innerWidth > 1024) {
      this.collapseSidebar(true);
    }
  }

  setupEventListeners() {
    // Toggle button (collapse/expand on desktop, show/hide on mobile)
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.handleToggle());
    }

    // Close button (mobile only)
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.closeMobileSidebar());
    }

    // Overlay click (mobile only)
    if (this.overlay) {
      this.overlay.addEventListener("click", () => this.closeMobileSidebar());
    }

    // Close sidebar when clicking links on mobile
    document.querySelectorAll(".sidebar-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 1024) {
          this.closeMobileSidebar();
        }
      });
    });

    // Handle window resize
    window.addEventListener("resize", () => this.handleResponsive());
  }

  handleToggle() {
    if (window.innerWidth <= 1024) {
      // Mobile: toggle sidebar visibility
      this.toggleMobileSidebar();
    } else {
      // Desktop: toggle collapse/expand
      this.toggleCollapse();
    }
  }

  toggleCollapse() {
    const isCollapsed = this.sidebar.classList.contains("collapsed");
    this.collapseSidebar(!isCollapsed);
  }

  collapseSidebar(collapse) {
    if (window.innerWidth <= 1024) return; // Don't collapse on mobile

    if (collapse) {
      this.sidebar.classList.add("collapsed");
      this.updateToggleButton(true);
      localStorage.setItem("sidebarCollapsed", "true");
    } else {
      this.sidebar.classList.remove("collapsed");
      this.updateToggleButton(false);
      localStorage.setItem("sidebarCollapsed", "false");
    }
  }

  updateToggleButton(isCollapsed) {
    if (!this.toggleBtn) return;

    const icon = this.toggleBtn.querySelector("i");
    const text = this.toggleBtn.querySelector("span");

    if (isCollapsed) {
      icon.className = "fas fa-chevron-right";
      text.textContent = "Expand";
    } else {
      icon.className = "fas fa-chevron-left";
      text.textContent = "Collapse";
    }
  }

  toggleMobileSidebar() {
    if (window.innerWidth > 1024) return;

    const isOpen = this.sidebar.classList.contains("active");

    if (isOpen) {
      this.closeMobileSidebar();
    } else {
      this.openMobileSidebar();
    }
  }

  openMobileSidebar() {
    this.sidebar.classList.add("active");

    if (this.overlay) {
      this.overlay.classList.add("active");
    }

    // Add mobile toggle button if it doesn't exist
    this.addMobileToggleButton();
  }

  closeMobileSidebar() {
    this.sidebar.classList.remove("active");

    if (this.overlay) {
      this.overlay.classList.remove("active");
    }

    // Remove mobile toggle button if it exists
    this.removeMobileToggleButton();
  }

  addMobileToggleButton() {
    // Only add if we're on mobile and button doesn't exist
    if (
      window.innerWidth > 1024 ||
      document.querySelector(".mobile-sidebar-toggle")
    ) {
      return;
    }

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "mobile-sidebar-toggle";
    toggleBtn.innerHTML = "☰";
    toggleBtn.setAttribute("aria-label", "Open sidebar");

    toggleBtn.addEventListener("click", () => this.openMobileSidebar());

    document.body.appendChild(toggleBtn);
  }

  removeMobileToggleButton() {
    const mobileToggle = document.querySelector(".mobile-sidebar-toggle");
    if (mobileToggle) {
      mobileToggle.remove();
    }
  }

  handleResponsive() {
    if (window.innerWidth > 1024) {
      // Desktop: ensure sidebar is visible and not in mobile mode
      this.sidebar.classList.remove("active");

      if (this.overlay) {
        this.overlay.classList.remove("active");
      }

      this.removeMobileToggleButton();

      // Restore saved collapse state
      const savedCollapsed = localStorage.getItem("sidebarCollapsed");
      if (savedCollapsed === "true") {
        this.collapseSidebar(true);
      } else {
        this.collapseSidebar(false);
      }
    } else {
      // Mobile: reset to default state
      this.sidebar.classList.remove("collapsed");
      this.updateToggleButton(false);
      this.closeMobileSidebar();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new SidebarManager();
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = SidebarManager;
}

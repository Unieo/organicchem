// JS/index/mobile-nav.js - Fixed for dropdown control
class MobileNavManager {
  constructor() {
    this.init();
  }

  init() {
    this.createMobileToggle();
    this.setupEventListeners();
    this.setupMobileNavDropdowns();
  }

  createMobileToggle() {
    if (window.innerWidth <= 768 && !document.querySelector(".nav-hamburger")) {
      const toggleHTML = `
        <button class="nav-hamburger" aria-label="Toggle navigation">
          ☰
        </button>
      `;

      const headerControls = document.querySelector(".header-controls");
      if (headerControls) {
        headerControls.insertAdjacentHTML("beforeend", toggleHTML);
      }
    }
  }

  setupMobileNavDropdowns() {
    // Close all mobile nav dropdowns initially
    this.closeAllMobileNavDropdowns();

    // Handle dropdown clicks in mobile nav
    document.addEventListener("click", (e) => {
      const dropdownBtn = e.target.closest(".mobile-nav .dropbtn-modern");
      if (dropdownBtn) {
        e.preventDefault();
        e.stopPropagation();

        const dropdown = dropdownBtn.closest(".dropdown-modern");
        this.toggleMobileNavDropdown(dropdown);
      }
    });
  }

  toggleMobileNavDropdown(dropdown) {
    const isActive = dropdown.classList.contains("active");

    // Close all other dropdowns in mobile nav
    this.closeAllMobileNavDropdowns();

    // Toggle current dropdown
    if (!isActive) {
      dropdown.classList.add("active");
    }
  }

  closeAllMobileNavDropdowns() {
    document
      .querySelectorAll(".mobile-nav .dropdown-modern")
      .forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
  }

  setupEventListeners() {
    // Mobile nav toggle
    document.addEventListener("click", (e) => {
      if (e.target.closest(".nav-hamburger")) {
        this.toggleMobileNav();
      }
    });

    // Close mobile nav when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".mobile-nav") &&
        !e.target.closest(".nav-hamburger") &&
        !e.target.closest(".dropdown-content-modern")
      ) {
        this.closeMobileNav();
        this.closeAllMobileNavDropdowns();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMobileNav();
        this.closeAllMobileNavDropdowns();
      }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.closeMobileNav();
        this.closeAllMobileNavDropdowns();
      }
    });
  }

  toggleMobileNav() {
    const mobileNav = document.querySelector(".mobile-nav");
    if (mobileNav) {
      mobileNav.classList.toggle("active");

      // Close all dropdowns when closing nav
      if (!mobileNav.classList.contains("active")) {
        this.closeAllMobileNavDropdowns();
      }
    }
  }

  closeMobileNav() {
    const mobileNav = document.querySelector(".mobile-nav");
    if (mobileNav) {
      mobileNav.classList.remove("active");
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.mobileNavManager = new MobileNavManager();
});

export default MobileNavManager;

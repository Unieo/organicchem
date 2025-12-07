// JS/index/dropdown.js
import { debounce } from "../shared/utils.js";

class DropdownManager {
  constructor() {
    this.dropdowns = new Set();
    this.mainResourcesBtn = null;
    this.init();
  }

  init() {
    this.setupDropdowns();
    this.setupMainResourcesButton();
    this.setupEventListeners();
  }

  setupDropdowns() {
    const dropdownElements = document.querySelectorAll(".dropdown-modern");

    dropdownElements.forEach((dropdown) => {
      this.dropdowns.add(dropdown);
      this.initializeDropdown(dropdown);
    });
  }

  initializeDropdown(dropdown) {
    const button = dropdown.querySelector(".dropbtn-modern");
    const content = dropdown.querySelector(".dropdown-content-modern");

    if (!button || !content) return;

    // Add click event to button
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDropdown(dropdown, content);
    });

    // Prevent dropdown from closing when clicking inside
    content.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  toggleDropdown(dropdown, content) {
    const isActive = dropdown.classList.contains("active");

    // Close all other dropdowns
    this.closeAllDropdowns();

    if (!isActive) {
      dropdown.classList.add("active");
      content.style.display = "block";
    } else {
      dropdown.classList.remove("active");
      content.style.display = "none";
    }
  }

  setupMainResourcesButton() {
    const mainResourcesBtn = document.querySelector(".resources-btn-main");
    const mainDropdown = mainResourcesBtn?.parentElement?.querySelector(
      ".dropdown-content-modern"
    );

    if (mainResourcesBtn && mainDropdown) {
      this.mainResourcesBtn = {
        button: mainResourcesBtn,
        dropdown: mainDropdown,
        parent: mainResourcesBtn.parentElement,
      };

      mainResourcesBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMainResourcesDropdown(mainDropdown);
      });

      // Prevent dropdown from closing when clicking inside it
      mainDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  }

  toggleMainResourcesDropdown(content) {
    const isVisible = content.classList.contains("show");

    // Close all regular dropdowns first
    this.closeAllDropdowns();

    if (!isVisible) {
      content.classList.add("show");
      content.style.display = "block";
    } else {
      content.classList.remove("show");
      content.style.display = "none";
    }
  }

  closeMainResourcesDropdown() {
    if (this.mainResourcesBtn) {
      this.mainResourcesBtn.dropdown.classList.remove("show");
      this.mainResourcesBtn.dropdown.style.display = "none";
    }
  }

  closeAllDropdowns() {
    // Close regular dropdowns
    this.dropdowns.forEach((dropdown) => {
      const content = dropdown.querySelector(".dropdown-content-modern");
      dropdown.classList.remove("active");
      if (content) {
        content.style.display = "none";
      }
    });

    // Close main resources dropdown
    this.closeMainResourcesDropdown();
  }

  setupEventListeners() {
    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
      this.closeAllDropdowns();
    });

    // Close dropdowns on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllDropdowns();
      }
    });

    // Handle window resize with debounce
    window.addEventListener(
      "resize",
      debounce(() => {
        this.handleResize();
      }, 250)
    );
  }

  handleResize() {
    // On mobile, ensure dropdowns are closed when switching orientation
    if (window.innerWidth <= 768) {
      this.closeAllDropdowns();
    }
  }

  // Public method to add new dropdown dynamically
  addDropdown(dropdownElement) {
    this.dropdowns.add(dropdownElement);
    this.initializeDropdown(dropdownElement);
  }

  // Public method to remove dropdown
  removeDropdown(dropdownElement) {
    this.dropdowns.delete(dropdownElement);
  }
}

// Initialize dropdown manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.dropdownManager = new DropdownManager();
});

// Export for use in other modules
export default DropdownManager;

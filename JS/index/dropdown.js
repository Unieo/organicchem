// JS/index/dropdown.js
import { debounce } from "../shared/utils.js";

class DropdownManager {
  constructor() {
    this.dropdowns = new Set();
    this.init();
  }

  init() {
    this.setupDropdowns();
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

  closeAllDropdowns() {
    this.dropdowns.forEach((dropdown) => {
      const content = dropdown.querySelector(".dropdown-content-modern");
      dropdown.classList.remove("active");
      if (content) {
        content.style.display = "none";
      }
    });
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
    // Additional resize handling if needed
    console.log("Window resized - dropdowns maintained");
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

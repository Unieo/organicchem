// assets/js/modules/navigation.js
class Navigation {
  constructor() {
    this.dropdowns = document.querySelectorAll(".dropdown-modern");
    this.mobileMenuBtn = document.querySelector(".mobile-menu-toggle");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.init();
  }

  init() {
    // Desktop dropdowns
    this.dropdowns.forEach((dropdown) => {
      const button = dropdown.querySelector(".dropbtn-modern");
      const content = dropdown.querySelector(".dropdown-content-modern");

      if (button && content) {
        dropdown.addEventListener("mouseenter", () => {
          content.style.display = "block";
        });

        dropdown.addEventListener("mouseleave", () => {
          content.style.display = "none";
        });
      }
    });

    // Mobile menu
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener("click", () => {
        document.querySelector(".desktop-nav").classList.toggle("mobile-open");
      });
    }

    // Smooth scroll for anchor links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href.startsWith("#")) {
          e.preventDefault();
          this.scrollToSection(href.substring(1));
        }
      });
    });
  }

  scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Navigation();
});

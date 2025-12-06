// JS/subpages/sidebar.js - Updated for new hamburger menu system
class SidebarManager {
  constructor() {
    this.sections = [];
    this.lastScrollY = window.scrollY;
    this.scrollDirection = "down";
    this.init();
  }

  init() {
    this.collectSections();
    this.setupScrollSpy();
    this.setupMobileSidebar();
    this.setupHeaderAnimation();
    this.setupMobileNav();
  }

  collectSections() {
    const sectionLinks = document.querySelectorAll('.chapter-link[href^="#"]');

    sectionLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const id = href.substring(1);
      const section = document.getElementById(id);

      if (section) {
        this.sections.push({
          id: id,
          element: section,
          link: link,
        });
      }
    });
  }

  setupScrollSpy() {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = document.querySelector(`.chapter-link[href="#${id}"]`);

        if (entry.isIntersecting) {
          document
            .querySelectorAll(".chapter-link")
            .forEach((l) => l.classList.remove("active"));
          if (link) link.classList.add("active");
        }
      });
    }, observerOptions);

    this.sections.forEach((section) => {
      observer.observe(section.element);
    });
  }

  setupMobileSidebar() {
    // Create overlay
    this.createOverlay();

    // Handle sidebar toggle from mobile nav
    document.addEventListener("click", (e) => {
      if (e.target.closest(".sidebar-toggle-mobile")) {
        this.toggleSidebar();
      }

      // Close sidebar when clicking overlay or links
      if (
        e.target.closest(".sidebar-overlay") ||
        (e.target.closest(".chapter-link") && window.innerWidth <= 768)
      ) {
        this.closeSidebar();
      }
    });

    // Close sidebar on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeSidebar();
        this.closeMobileNav();
      }
    });
  }

  setupMobileNav() {
    // Handle mobile nav hamburger
    document.addEventListener("click", (e) => {
      if (e.target.closest(".nav-hamburger")) {
        this.toggleMobileNav();
      }
    });

    // Close mobile nav when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".mobile-nav") &&
        !e.target.closest(".nav-hamburger")
      ) {
        this.closeMobileNav();
      }
    });
  }

  createOverlay() {
    if (!document.querySelector(".sidebar-overlay")) {
      const overlayHTML = `<div class="sidebar-overlay"></div>`;
      document.body.insertAdjacentHTML("beforeend", overlayHTML);
    }
  }

  toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".sidebar-overlay");

    if (sidebar && overlay) {
      sidebar.classList.toggle("active");
      overlay.classList.toggle("active");
      document.body.style.overflow = sidebar.classList.contains("active")
        ? "hidden"
        : "";

      // Close mobile nav when opening sidebar
      this.closeMobileNav();
    }
  }

  closeSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".sidebar-overlay");

    if (sidebar && overlay) {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  toggleMobileNav() {
    const mobileNav = document.querySelector(".mobile-nav");
    if (mobileNav) {
      mobileNav.classList.toggle("active");

      // Close sidebar when opening mobile nav
      this.closeSidebar();
    }
  }

  closeMobileNav() {
    const mobileNav = document.querySelector(".mobile-nav");
    if (mobileNav) {
      mobileNav.classList.remove("active");
    }
  }

  setupHeaderAnimation() {
    // Only set up header animation on mobile
    if (window.innerWidth <= 768) {
      let ticking = false;

      const updateHeader = () => {
        const header = document.querySelector(".header");
        const currentScrollY = window.scrollY;

        // Determine scroll direction
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
          // Scrolling down - hide header
          header.classList.add("hidden");
          this.scrollDirection = "down";
        } else {
          // Scrolling up - show header
          header.classList.remove("hidden");
          this.scrollDirection = "up";
        }

        // Add scrolled class for background effect
        if (currentScrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }

        this.lastScrollY = currentScrollY;
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateHeader);
          ticking = true;
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Handle window resize - remove header animation if switching to desktop
    window.addEventListener("resize", () => {
      const header = document.querySelector(".header");
      if (header && window.innerWidth > 768) {
        header.classList.remove("hidden", "scrolled");
        this.closeMobileNav();
        this.closeSidebar();
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.sidebarManager = new SidebarManager();
});

export default SidebarManager;

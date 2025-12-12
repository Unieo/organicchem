// assets/js/core/lazy-images.js
class LazyImages {
  constructor() {
    this.images = document.querySelectorAll("img[data-src]");
    this.observer = null;
    this.init();
  }

  init() {
    if ("IntersectionObserver" in window) {
      this.setupObserver();
    } else {
      this.loadAllImages(); // Fallback
    }
  }

  setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      }
    );

    this.images.forEach((img) => this.observer.observe(img));
  }

  loadImage(img) {
    const src = img.getAttribute("data-src");
    if (!src) return;

    img.src = src;
    img.removeAttribute("data-src");
    img.classList.add("loaded");

    // Handle WebP fallback
    img.onload = () => {
      img.style.opacity = "1";
    };

    img.onerror = () => {
      // Fallback to JPG if WebP fails
      const jpgSrc = src.replace(".webp", ".jpg");
      img.src = jpgSrc;
    };
  }

  loadAllImages() {
    this.images.forEach((img) => this.loadImage(img));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LazyImages();
});

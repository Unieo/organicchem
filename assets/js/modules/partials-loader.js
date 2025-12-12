// assets/js/modules/partials-loader.js
export async function loadPartials() {
  const partials = document.querySelectorAll("[data-include]");

  for (const element of partials) {
    const file = element.getAttribute("data-include");
    const attributes = element.dataset;

    try {
      const response = await fetch(file);
      let html = await response.text();

      // Replace template variables {{key}} with data attributes
      Object.keys(attributes).forEach((key) => {
        if (key !== "include") {
          // Skip data-include itself
          const value = attributes[key];
          html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
        }
      });

      element.outerHTML = html;
    } catch (error) {
      console.error(`Failed to load partial ${file}:`, error);
      element.innerHTML = `<div class="partial-error">Failed to load: ${file}</div>`;
    }
  }
}

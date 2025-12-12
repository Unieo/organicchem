// assets/js/core/template-loader.js

// Helper function to reinitialize scripts after template load
function reinitializeScripts(container) {
  console.log("🔄 Reinitializing scripts for container");

  // Reinitialize theme toggle if it exists
  const themeToggle =
    container.querySelector("#theme-toggle") ||
    document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      // Update icon
      const icon = this.querySelector("i");
      if (icon) {
        icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
    });
  }

  // Reinitialize dropdowns if they exist
  const dropdowns = container.querySelectorAll(".dropdown-modern");
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("mouseenter", function () {
      const content = this.querySelector(".dropdown-content-modern");
      if (content) content.style.display = "block";
    });

    dropdown.addEventListener("mouseleave", function () {
      const content = this.querySelector(".dropdown-content-modern");
      if (content) content.style.display = "none";
    });
  });

  // Reinitialize all [data-link] elements
  const links = container.querySelectorAll("[data-link]");
  links.forEach((link) => {
    // Remove existing listeners first (simplified approach)
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);

    // Router will handle clicks via event delegation
  });

  console.log(
    `✅ Reinitialized: ${themeToggle ? "theme, " : ""}${
      dropdowns.length
    } dropdowns, ${links.length} links`
  );
}

// Main template loading function
export async function loadTemplate(templateName, container, data = {}) {
  console.log(`📥 Loading template: ${templateName}`);

  try {
    const response = await fetch(`templates/${templateName}.html`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let html = await response.text();
    console.log(`✅ Template ${templateName} loaded (${html.length} chars)`);

    // Replace template variables if data provided
    if (Object.keys(data).length > 0) {
      html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
      });
    }

    if (container) {
      // Save current scroll position if needed
      const scrollTop = container.scrollTop;

      // Update container content
      container.innerHTML = html;

      // Restore scroll position
      container.scrollTop = scrollTop;

      // ✅ FIXED: Call reinitializeScripts directly, not as method
      setTimeout(() => {
        reinitializeScripts(container);
      }, 50);
    }

    return html;
  } catch (error) {
    console.error(`❌ Failed to load template ${templateName}:`, error);

    // Provide fallback content
    const fallbackContent = getFallbackTemplate(templateName);

    if (container) {
      container.innerHTML = fallbackContent;
    }

    throw error; // Re-throw so caller knows it failed
  }
}

// Fallback templates in case of failure
function getFallbackTemplate(templateName) {
  const fallbacks = {
    header: `
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
                        <a href="/" style="text-decoration: none; color: inherit;">
                            Organic Chem Resources
                        </a>
                    </h2>
                    <nav style="display: flex; gap: 20px;">
                        <a href="/" style="text-decoration: none; color: var(--text-color);">Home</a>
                        <a href="/lessons/alcohols" style="text-decoration: none; color: var(--text-color);">Alcohols</a>
                    </nav>
                </div>
            </div>
        `,

    footer: `
            <footer style="
                background: var(--card-bg);
                padding: 30px 50px;
                border-top: 1px solid var(--border-color);
                margin-top: 50px;
                text-align: center;
                color: var(--text-muted);
            ">
                <p>© 2025 Organic Chemistry Resources</p>
                <p>License: GPL v3</p>
            </footer>
        `,

    default: `
            <div class="template-error" style="
                padding: 20px;
                background: #f8d7da;
                color: #721c24;
                border-radius: 5px;
                margin: 20px 0;
            ">
                <p><strong>Template Error:</strong> Failed to load "${templateName}"</p>
                <p>Please check the console for details.</p>
            </div>
        `,
  };

  return fallbacks[templateName] || fallbacks.default;
}

// Export the reinitialize function separately if needed elsewhere
export { reinitializeScripts };

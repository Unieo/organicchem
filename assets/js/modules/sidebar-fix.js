// assets/js/modules/sidebar-fix.js - MINIMAL WORKING VERSION
document.addEventListener("DOMContentLoaded", function () {
  console.log("🔧 Sidebar Fix Loaded");

  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("sidebar-toggle");

  if (!sidebar || !toggleBtn) {
    console.error("❌ Sidebar or toggle button not found");
    return;
  }

  // Load saved state
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  if (isCollapsed) {
    collapseSidebar(true);
  }

  // Set up click event
  toggleBtn.addEventListener("click", function () {
    const currentlyCollapsed = sidebar.classList.contains("collapsed");
    collapseSidebar(!currentlyCollapsed);
  });

  function collapseSidebar(collapse) {
    const content = document.querySelector(".content-area");

    if (collapse) {
      // Collapse
      sidebar.classList.add("collapsed");
      sidebar.style.width = "60px";

      if (content) {
        content.style.marginLeft = "60px";
        content.style.width = "calc(100% - 60px)";
      }

      // Update button
      const icon = toggleBtn.querySelector("i");
      const text = toggleBtn.querySelector("span");
      if (icon) icon.className = "fas fa-chevron-right";
      if (text) text.textContent = "Expand";

      localStorage.setItem("sidebarCollapsed", "true");
    } else {
      // Expand
      sidebar.classList.remove("collapsed");
      sidebar.style.width = "280px";

      if (content) {
        content.style.marginLeft = "280px";
        content.style.width = "calc(100% - 280px)";
      }

      // Update button
      const icon = toggleBtn.querySelector("i");
      const text = toggleBtn.querySelector("span");
      if (icon) icon.className = "fas fa-chevron-left";
      if (text) text.textContent = "Collapse";

      localStorage.setItem("sidebarCollapsed", "false");
    }
  }

  console.log("✅ Sidebar fix ready");
});

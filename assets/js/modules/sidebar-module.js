// assets/js/modules/sidebar-module.js
export class SidebarModule {
  static init() {
    console.log("📐 SidebarModule initializing...");

    const sidebar = document.querySelector(".sidebar");
    const button = document.getElementById("sidebar-toggle");

    if (!sidebar || !button) {
      console.warn("⚠️ Sidebar elements not found yet");
      return false;
    }

    // Your sidebar logic here...
    console.log("✅ SidebarModule initialized");
    return true;
  }
}

// assets/js/core/router.js
export class Router {
  constructor() {
    this.routes = {
      "/": "home",
      "/lessons/:topic": "lesson",
      "/about": "about",
      "/contact": "contact",
    };
    this.appContainer = document.getElementById("app");
    this.contentContainer = document.getElementById("content-container");
    this.headerContainer = document.getElementById("header-container");

    // Topic order for navigation
    this.topicsOrder = [
      "haloalkanes",
      "haloarenes",
      "alcohols",
      "phenols",
      "ethers",
      "aldehydes",
      "ketones",
      "carboxylicacids",
      "amines",
    ];

    // Topic metadata
    this.topicMetadata = {
      haloalkanes: { title: "HaloAlkanes", color: "#ff6b6b" },
      haloarenes: { title: "HaloArenes", color: "#a29bfe" },
      alcohols: { title: "Alcohols", color: "#00cec9" },
      phenols: { title: "Phenols", color: "#fd79a8" },
      ethers: { title: "Ethers", color: "#fdcb6e" },
      aldehydes: { title: "Aldehydes", color: "#74b9ff" },
      ketones: { title: "Ketones", color: "#55efc4" },
      carboxylicacids: { title: "Carboxylic Acids", color: "#e17055" },
      amines: { title: "Amines", color: "#a29bfe" },
    };
  }

  init() {
    console.log("📡 Router Initializing...");

    // Handle initial page load
    this.handleRoute();

    // Handle browser back/forward buttons
    window.addEventListener("popstate", () => this.handleRoute());

    // Intercept all internal link clicks
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-link]");
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute("href"));
      }
    });

    // Keyboard navigation for lessons
    this.setupKeyboardNavigation();

    console.log("✅ Router Ready");
  }

  // NEW: Setup keyboard navigation for arrow keys
  setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      // Only listen for arrow keys when on a lesson page
      const isLessonPage = window.location.pathname.includes("/lessons/");
      if (!isLessonPage) return;

      // Prevent default if we're handling it
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const targetTopic = window.location.pathname.split("/")[2];
        const currentIndex = this.topicsOrder.indexOf(targetTopic);

        if (e.key === "ArrowLeft" && currentIndex > 0) {
          e.preventDefault();
          this.navigate(`/lessons/${this.topicsOrder[currentIndex - 1]}`);
        } else if (
          e.key === "ArrowRight" &&
          currentIndex < this.topicsOrder.length - 1
        ) {
          e.preventDefault();
          this.navigate(`/lessons/${this.topicsOrder[currentIndex + 1]}`);
        }
      }
    });
  }

  setLessonTitle(topic) {
    console.log(`🎯 Setting lesson title for: ${topic}`);

    // Format the topic name (alcohols → Alcohols)
    const formattedName = this.formatTopicName(topic);

    // Try different selectors to find where to put the title
    const titleSelectors = [
      ".content-title",
      "#content-title",
      "h1.content-title",
      ".lesson-content h1",
      "h1",
    ];

    let titleSet = false;

    // Try each selector
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = formattedName;
        console.log(`✅ Title set using selector: ${selector}`);
        titleSet = true;
        break;
      }
    }

    // Also update the browser tab title
    document.title = `${formattedName} - Organic Chem Resources`;

    if (!titleSet) {
      console.warn("⚠️ Could not find title element to update");
    }
  }

  // NEW: Format topic name properly
  formatTopicName(topicId) {
    if (this.topicMetadata[topicId]) {
      return this.topicMetadata[topicId].title;
    }
    // Fallback: capitalize first letter
    return topicId.charAt(0).toUpperCase() + topicId.slice(1);
  }

  // NEW: Get topic color
  getTopicColor(topicId) {
    return this.topicMetadata[topicId]?.color || "#667eea";
  }

  async loadAndPositionFooter() {
    try {
      console.log("🦶 Loading footer...");

      // Check if footer already exists
      let footerContainer = document.getElementById("footer-container");
      console.log("Footer container exists?", !!footerContainer);

      if (!footerContainer) {
        // Create footer container
        footerContainer = document.createElement("div");
        footerContainer.id = "footer-container";

        // Append to app (at the end)
        const app = document.getElementById("app");
        app.appendChild(footerContainer);
        console.log("Created new footer container");
      }

      // Load footer template
      const footerUrl = "/templates/footer.html";
      console.log("Fetching footer from:", footerUrl);

      const response = await fetch(footerUrl);
      console.log("Footer response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
      });

      if (!response.ok) {
        console.error("Footer fetch failed with status:", response.status);
        throw new Error(`Footer template not found: ${response.status}`);
      }

      const footerHTML = await response.text();
      console.log("Footer HTML loaded, length:", footerHTML.length);

      footerContainer.innerHTML = footerHTML;
      console.log("✅ Footer loaded and positioned");
      return true;
    } catch (error) {
      console.warn("⚠️ Could not load footer:", error);
      return false;
    }
  }

  async handleRoute() {
    const path = this.getCurrentPath();
    console.log("📡 Routing to:", path);

    try {
      // Remove loading state if present
      this.clearLoadingState();

      // Route to appropriate content
      if (path === "/" || path === "") {
        await this.loadHomePage();
      } else if (path.startsWith("/lessons/")) {
        const topic = path.split("/")[2];
        await this.loadLesson(topic);
      } else if (path === "/about") {
        await this.loadAboutPage();
      } else if (path === "/contact") {
        await this.loadContactPage();
      } else {
        await this.loadPage(path);
      }

      // Update active navigation
      this.updateActiveNav(path);
    } catch (error) {
      console.error("❌ Routing error:", error);
      this.showErrorPage();
    }
  }

  async navigate(path) {
    // Update browser history without reload
    window.history.pushState(null, null, path);
    await this.handleRoute();

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async loadHomePage() {
    try {
      console.log("🏠 Loading homepage...");

      // Load home content
      const response = await fetch("content/pages/home-content.html");
      const content = await response.text();

      // Update content container
      const contentContainer = document.getElementById("content-container");
      if (contentContainer) {
        contentContainer.innerHTML = content;
      }

      // Load footer
      await this.loadAndPositionFooter();

      console.log("✅ Homepage fully loaded");
    } catch (error) {
      console.error("❌ Failed to load homepage:", error);
      this.showErrorPage();
    }
  }

  async loadLesson(topic) {
    try {
      console.log(`📖 Loading lesson: ${topic}`);

      // Load lesson layout
      const layoutResponse = await fetch("/templates/lesson-layout.html");
      if (!layoutResponse.ok)
        throw new Error(`Layout not found: ${layoutResponse.status}`);

      const layout = await layoutResponse.text();
      console.log("✅ Lesson layout loaded");

      // Update content container
      const contentContainer = document.getElementById("content-container");
      if (contentContainer) {
        contentContainer.innerHTML = layout;
      }

      // ✅ CRITICAL: Execute scripts in the loaded layout
      this.executeScripts(contentContainer);

      // ✅ Initialize sidebar functionality
      await this.initializeSidebar();

      // Load lesson content
      const contentResponse = await fetch(
        `/content/lessons/${topic}/content.html`
      );
      if (!contentResponse.ok)
        throw new Error(`Content not found: ${contentResponse.status}`);

      const content = await contentResponse.text();
      console.log("✅ Lesson content loaded");

      // Find where to put the content
      const lessonContent =
        document.querySelector(".lesson-content") ||
        document.querySelector(".content-area");

      if (lessonContent) {
        lessonContent.innerHTML = content;
      }

      // Set lesson title
      this.setLessonTitle(topic);

      // Try to load sidebar data
      await this.loadLessonSidebar(topic);

      // NEW: Setup topic navigation
      this.setupTopicNavigation(topic);

      // Load footer
      await this.loadAndPositionFooter();

      console.log(`✅ Lesson ${topic} loaded successfully`);
    } catch (error) {
      console.error(`❌ Failed to load lesson ${topic}:`, error);
      this.showErrorPage();
    }
  }

  // NEW: Setup next/previous topic navigation
  setupTopicNavigation(currentTopic) {
    console.log(`🔗 Setting up topic navigation for: ${currentTopic}`);

    const currentIndex = this.topicsOrder.indexOf(currentTopic);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < this.topicsOrder.length - 1;

    // Get navigation buttons
    const prevButton = document.getElementById("prev-lesson");
    const nextButton = document.getElementById("next-lesson");
    const progressElement = document.getElementById("lesson-progress");

    // Update previous button
    if (prevButton) {
      if (hasPrevious) {
        const prevTopic = this.topicsOrder[currentIndex - 1];
        const prevTitle = this.formatTopicName(prevTopic);

        prevButton.href = `/lessons/${prevTopic}`;
        prevButton.innerHTML = `
          <i class="fas fa-arrow-left"></i>
          <span class="nav-topic-name">${prevTitle}</span>
          <span class="nav-topic-hint">Previous</span>
        `;
        prevButton.classList.remove("disabled");
        prevButton.style.opacity = "1";
        prevButton.style.pointerEvents = "auto";
      } else {
        prevButton.classList.add("disabled");
        prevButton.style.opacity = "0.5";
        prevButton.style.pointerEvents = "none";
      }
    }

    // Update next button
    if (nextButton) {
      if (hasNext) {
        const nextTopic = this.topicsOrder[currentIndex + 1];
        const nextTitle = this.formatTopicName(nextTopic);

        nextButton.href = `/lessons/${nextTopic}`;
        nextButton.innerHTML = `
          <span class="nav-topic-hint">Next</span>
          <span class="nav-topic-name">${nextTitle}</span>
          <i class="fas fa-arrow-right"></i>
        `;
        nextButton.classList.remove("disabled");
        nextButton.style.opacity = "1";
        nextButton.style.pointerEvents = "auto";
      } else {
        nextButton.classList.add("disabled");
        nextButton.style.opacity = "0.5";
        nextButton.style.pointerEvents = "none";
      }
    }

    // Update progress indicator if element exists
    if (progressElement) {
      const progressPercentage =
        ((currentIndex + 1) / this.topicsOrder.length) * 100;
      progressElement.innerHTML = `
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="progress-text">Topic ${currentIndex + 1} of ${
        this.topicsOrder.length
      }</div>
      `;
    }

    // Add keyboard shortcut hint
    const keyboardHint = document.querySelector(".keyboard-hint");
    if (!keyboardHint && (hasPrevious || hasNext)) {
      const contentNavigation = document.querySelector(".content-navigation");
      if (contentNavigation) {
        const hint = document.createElement("div");
        hint.className = "keyboard-hint";
        hint.innerHTML = `Navigate with <kbd>←</kbd> <kbd>→</kbd> arrow keys`;
        contentNavigation.parentNode.insertBefore(
          hint,
          contentNavigation.nextSibling
        );
      }
    }

    console.log(
      `✅ Navigation: ${hasPrevious ? "←" : ""}${currentTopic}${
        hasNext ? "→" : ""
      }`
    );
  }

  // NEW METHOD: Execute scripts in dynamically loaded content
  executeScripts(container) {
    if (!container) return;

    console.log("🔄 Executing scripts in loaded content");

    // Find all script tags
    const scripts = container.querySelectorAll("script");

    scripts.forEach((oldScript) => {
      // Create new script element (this will execute)
      const newScript = document.createElement("script");

      // Copy src or content
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }

      // Copy all attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // Add to body (will execute)
      document.body.appendChild(newScript);

      console.log(`✅ Executed script: ${oldScript.src || "inline"}`);
    });
  }

  // NEW METHOD: Initialize sidebar functionality
  async initializeSidebar() {
    console.log("📐 Initializing sidebar functionality...");

    // Wait a moment for DOM to be ready
    setTimeout(() => {
      const sidebar = document.querySelector(".sidebar");
      const toggleBtn = document.getElementById("sidebar-toggle");
      const content = document.querySelector(".content-area");

      if (!sidebar || !toggleBtn) {
        console.warn("⚠️ Sidebar elements not found yet, retrying...");
        // Retry after a delay
        setTimeout(() => this.initializeSidebar(), 100);
        return;
      }

      console.log("✅ Found sidebar elements");

      // Load saved state
      const savedState = localStorage.getItem("sidebarCollapsed");
      console.log("💾 Saved sidebar state:", savedState);

      // Apply initial state
      if (savedState === "true") {
        this.collapseSidebar(true, true);
      }

      // Set up click handler
      toggleBtn.addEventListener("click", () => {
        console.log("🖱️ Sidebar toggle clicked");
        const isCollapsed = sidebar.classList.contains("collapsed");
        this.collapseSidebar(!isCollapsed, false);
      });

      console.log("✅ Sidebar initialized and ready!");
    }, 100);
  }

  // NEW METHOD: Collapse/expand sidebar
  collapseSidebar(collapse, isInitial = false) {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.getElementById("sidebar-toggle");
    const content = document.querySelector(".content-area");

    if (!sidebar || !toggleBtn) return;

    console.log(`🎯 collapseSidebar(${collapse}, initial: ${isInitial})`);

    // Update class
    if (collapse) {
      sidebar.classList.add("collapsed");
    } else {
      sidebar.classList.remove("collapsed");
    }

    // Apply styles
    if (collapse) {
      // COLLAPSED
      sidebar.style.width = "60px";
      if (content) {
        content.style.marginLeft = "60px";
        content.style.width = "calc(100% - 60px)";
      }

      // Update button
      const icon = toggleBtn.querySelector("i");
      const text = toggleBtn.querySelector("span");
      if (icon) icon.className = "fas fa-chevron-right";
      if (text) {
        text.style.display = "none"; // Hide the text
      }

      // Style the button for collapsed state
      toggleBtn.style.justifyContent = "center";
      toggleBtn.style.padding = "10px";
      toggleBtn.style.width = "40px";
      toggleBtn.style.height = "40px";
      toggleBtn.style.margin = "10px auto";
      toggleBtn.style.borderRadius = "50%";

      // Center the topic icon
      const topicIcon = document.querySelector(".topic-icon");
      if (topicIcon) {
        topicIcon.style.margin = "20px auto";
        topicIcon.style.display = "block";
        topicIcon.style.width = "40px";
        topicIcon.style.height = "40px";
      }

      // Save to localStorage (not on initial load)
      if (!isInitial) {
        localStorage.setItem("sidebarCollapsed", "true");
        console.log("💾 Saved: collapsed=true");
      }
    } else {
      // EXPANDED
      sidebar.style.width = "280px";
      if (content) {
        content.style.marginLeft = "280px";
        content.style.width = "calc(100% - 280px)";
      }

      // Update button
      const icon = toggleBtn.querySelector("i");
      const text = toggleBtn.querySelector("span");
      if (icon) icon.className = "fas fa-chevron-left";
      if (text) {
        text.style.display = ""; // Show the text
        text.textContent = "Collapse";
      }

      // Reset button styles
      toggleBtn.style.justifyContent = "";
      toggleBtn.style.padding = "";
      toggleBtn.style.width = "";
      toggleBtn.style.height = "";
      toggleBtn.style.margin = "";
      toggleBtn.style.borderRadius = "";

      // Reset topic icon
      const topicIcon = document.querySelector(".topic-icon");
      if (topicIcon) {
        topicIcon.style.margin = "";
        topicIcon.style.display = "";
        topicIcon.style.width = "";
        topicIcon.style.height = "";
      }

      // Save to localStorage (not on initial load)
      if (!isInitial) {
        localStorage.setItem("sidebarCollapsed", "false");
        console.log("💾 Saved: collapsed=false");
      }
    }

    console.log(`✅ Sidebar ${collapse ? "collapsed" : "expanded"}`);
  }

  async loadAboutPage() {
    try {
      console.log("📄 Loading about page...");

      const response = await fetch("content/pages/about.html");
      const content = await response.text();

      const contentContainer = document.getElementById("content-container");
      if (contentContainer) {
        contentContainer.innerHTML = content;
      }

      await this.loadAndPositionFooter();
    } catch (error) {
      console.error("❌ Failed to load about page:", error);
      this.showErrorPage();
    }
  }

  async loadContactPage() {
    try {
      console.log("📧 Loading contact page...");

      const response = await fetch("content/pages/contact.html");
      const content = await response.text();

      const contentContainer = document.getElementById("content-container");
      if (contentContainer) {
        contentContainer.innerHTML = content;
      }

      await this.loadAndPositionFooter();
    } catch (error) {
      console.error("❌ Failed to load contact page:", error);
      this.showErrorPage();
    }
  }

  async loadPage(pageName) {
    try {
      console.log(`📄 Loading page: ${pageName}`);

      const response = await fetch(`content/pages/${pageName}.html`);
      const content = await response.text();

      const contentContainer = document.getElementById("content-container");
      if (contentContainer) {
        contentContainer.innerHTML = content;
      }

      await this.loadAndPositionFooter();
    } catch (error) {
      console.error(`❌ Failed to load page ${pageName}:`, error);
      this.showErrorPage();
    }
  }

  async loadLessonSidebar(topic) {
    try {
      console.log(`📋 Loading sidebar for: ${topic}`);

      const sidebarResponse = await fetch("/templates/sidebar-template.html");

      if (!sidebarResponse.ok) {
        console.warn("Sidebar template not found, skipping");
        return;
      }

      const sidebarHTML = await sidebarResponse.text();

      const sidebarContainer = document.querySelector(".sidebar");
      if (sidebarContainer) {
        sidebarContainer.innerHTML = sidebarHTML;

        // Try to load sidebar data
        const dataResponse = await fetch(
          `/content/lessons/${topic}/sidebar.json`
        );

        if (dataResponse.ok) {
          const sidebarData = await dataResponse.json();
          this.generateSidebarContent(sidebarContainer, sidebarData, topic);
        } else {
          console.warn("No sidebar.json found, using default");
          this.generateDefaultSidebar(sidebarContainer, topic);
        }
      }
    } catch (error) {
      console.warn("Sidebar failed to load (non-critical):", error);
    }
  }

  generateSidebarContent(container, data, topic) {
    console.log("Generating sidebar from data");

    // Update topic icon and title
    const topicIcon = container.querySelector("#topic-icon");
    const lessonTitle = container.querySelector("#lesson-title");
    const lessonSubtitle = container.querySelector("#lesson-subtitle");

    if (topicIcon && data.color) {
      topicIcon.style.backgroundColor = data.color;
      topicIcon.textContent = data.title.charAt(0);
    }

    if (lessonTitle) lessonTitle.textContent = data.title;
    if (lessonSubtitle) lessonSubtitle.textContent = data.subtitle;

    // Generate TOC
    const nav = container.querySelector("#sidebar-nav");
    if (!nav) return;

    let html = '<ul class="chapter-list">';

    data.chapters.forEach((chapter, index) => {
      html += `
            <li class="chapter-item">
                <a href="#${chapter.id}" class="chapter-link" data-scroll>
                    <span class="chapter-number">${index + 1}.</span>
                    ${chapter.title}
                </a>
        `;

      if (chapter.sections && chapter.sections.length > 0) {
        html += '<ul class="sub-chapter-list">';
        chapter.sections.forEach((section, subIndex) => {
          html += `
                    <li class="sub-chapter-item">
                        <a href="#${section.id}" class="sub-chapter-link" data-scroll>
                            ${section.title}
                        </a>
                    </li>
                `;
        });
        html += "</ul>";
      }

      html += "</li>";
    });

    html += "</ul>";
    nav.innerHTML = html;

    // Add scroll event listeners
    this.setupSidebarScroll();
  }

  generateDefaultSidebar(container, topic) {
    const name = topic.charAt(0).toUpperCase() + topic.slice(1);
    const nav = container.querySelector("#sidebar-nav");

    if (nav) {
      nav.innerHTML = `
            <div class="default-sidebar">
                <p>Table of contents will be generated from lesson content.</p>
                <p>Create a <code>sidebar.json</code> file for custom navigation.</p>
            </div>
        `;
    }
  }

  setupSidebarScroll() {
    // Add smooth scrolling to sidebar links
    document.querySelectorAll("[data-scroll]").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          });
        }
      });
    });
  }

  updateActiveNav(path) {
    // Update active state in navigation
    document.querySelectorAll("[data-link]").forEach((link) => {
      const linkPath = link.getAttribute("href");
      link.classList.toggle("active", linkPath === path);
    });
  }

  clearLoadingState() {
    const loadingElement = document.querySelector(".initial-loading");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }

  showErrorPage() {
    const contentContainer = document.getElementById("content-container");

    if (contentContainer) {
      contentContainer.innerHTML = `
            <div class="error-state">
                <h2>Page Not Found</h2>
                <p>The requested content could not be loaded.</p>
                <a href="/" data-link class="error-link">Return to Homepage</a>
            </div>
        `;
    }
  }

  getCurrentPath() {
    const basePath = "";
    let path = window.location.pathname;

    // Remove base path if present
    if (path.startsWith(basePath)) {
      path = path.substring(basePath.length);
    }

    // Remove trailing slash and .html extension
    path = path.replace(/\.html$/, "").replace(/\/$/, "");

    return path || "/";
  }
}

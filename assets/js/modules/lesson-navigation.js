// assets/js/modules/lesson-navigation.js
export class LessonNavigation {
  constructor() {
    this.topics = [
      { id: "haloalkanes", title: "HaloAlkanes", color: "#ff6b6b" },
      { id: "haloarenes", title: "HaloArenes", color: "#a29bfe" },
      { id: "alcohols", title: "Alcohols", color: "#00cec9" },
      { id: "phenols", title: "Phenols", color: "#fd79a8" },
      { id: "ethers", title: "Ethers", color: "#fdcb6e" },
      { id: "aldehydes", title: "Aldehydes", color: "#74b9ff" },
      { id: "ketones", title: "Ketones", color: "#55efc4" },
      { id: "carboxylicacids", title: "Carboxylic Acids", color: "#e17055" },
      { id: "amines", title: "Amines", color: "#a29bfe" },
    ];

    this.currentTopic = null;
  }

  init(currentTopic) {
    this.currentTopic = currentTopic;
    this.updateNavigation();
    this.setupKeyboardShortcuts();
  }

  updateNavigation() {
    const currentIndex = this.topics.findIndex(
      (t) => t.id === this.currentTopic
    );

    // Previous topic
    const prevTopic = currentIndex > 0 ? this.topics[currentIndex - 1] : null;
    const prevButton = document.getElementById("prev-lesson");

    if (prevButton && prevTopic) {
      prevButton.href = `/lessons/${prevTopic.id}`;
      prevButton.innerHTML = `
        <i class="fas fa-arrow-left"></i>
        <span class="nav-topic-name">${prevTopic.title}</span>
        <span class="nav-topic-hint">Previous</span>
      `;
      prevButton.style.opacity = "1";
      prevButton.style.pointerEvents = "auto";
    } else if (prevButton) {
      prevButton.style.opacity = "0.5";
      prevButton.style.pointerEvents = "none";
    }

    // Next topic
    const nextTopic =
      currentIndex < this.topics.length - 1
        ? this.topics[currentIndex + 1]
        : null;
    const nextButton = document.getElementById("next-lesson");

    if (nextButton && nextTopic) {
      nextButton.href = `/lessons/${nextTopic.id}`;
      nextButton.innerHTML = `
        <span class="nav-topic-hint">Next</span>
        <span class="nav-topic-name">${nextTopic.title}</span>
        <i class="fas fa-arrow-right"></i>
      `;
      nextButton.style.opacity = "1";
      nextButton.style.pointerEvents = "auto";
    } else if (nextButton) {
      nextButton.style.opacity = "0.5";
      nextButton.style.pointerEvents = "none";
    }

    // Update progress indicator
    this.updateProgressIndicator(currentIndex);
  }

  updateProgressIndicator(currentIndex) {
    const progressEl = document.getElementById("lesson-progress");
    if (!progressEl) return;

    const percentage = ((currentIndex + 1) / this.topics.length) * 100;
    progressEl.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percentage}%"></div>
      </div>
      <div class="progress-text">Topic ${currentIndex + 1} of ${
      this.topics.length
    }</div>
    `;
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Left arrow for previous
      if (e.key === "ArrowLeft" && !e.ctrlKey && !e.metaKey) {
        const prevButton = document.getElementById("prev-lesson");
        if (prevButton && prevButton.style.pointerEvents !== "none") {
          e.preventDefault();
          prevButton.click();
        }
      }

      // Right arrow for next
      if (e.key === "ArrowRight" && !e.ctrlKey && !e.metaKey) {
        const nextButton = document.getElementById("next-lesson");
        if (nextButton && nextButton.style.pointerEvents !== "none") {
          e.preventDefault();
          nextButton.click();
        }
      }
    });
  }

  // For dynamic topic loading
  static getTopicColor(topicId) {
    const topics = {
      haloalkanes: "#ff6b6b",
      haloarenes: "#a29bfe",
      alcohols: "#00cec9",
      phenols: "#fd79a8",
      ethers: "#fdcb6e",
      aldehydes: "#74b9ff",
      ketones: "#55efc4",
      carboxylicacids: "#e17055",
      amines: "#a29bfe",
    };
    return topics[topicId] || "#667eea";
  }
}

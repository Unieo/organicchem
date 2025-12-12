// assets/js/modules/reaction-renderer.js
class ReactionRenderer {
  constructor() {
    this.reactionContainers = document.querySelectorAll(".reaction-scheme");
    this.init();
  }

  init() {
    this.reactionContainers.forEach((container) => {
      this.renderReaction(container);
    });
  }

  renderReaction(container) {
    const data = container.dataset;

    // Example: Convert simple notation to formatted reaction
    if (data.reaction) {
      const reaction = data.reaction;
      const parts = reaction.split("->");

      if (parts.length === 2) {
        const reactants = this.formatChemicals(parts[0]);
        const products = this.formatChemicals(parts[1]);

        container.innerHTML = `
          <div class="reaction-equation">
            <span class="reactants">${reactants}</span>
            <span class="reaction-arrow">→</span>
            <span class="products">${products}</span>
          </div>
          ${
            data.conditions
              ? `<div class="reaction-conditions">Conditions: ${data.conditions}</div>`
              : ""
          }
        `;
      }
    }
  }

  formatChemicals(chemicalString) {
    // Convert H2O to H₂O, CH3OH to CH₃OH, etc.
    return chemicalString
      .replace(/(\d+)/g, "<sub>$1</sub>")
      .replace(/\+/g, " + ");
  }

  renderFromJSON(container, reactionData) {
    // For more complex reactions from JSON
    const html = `
      <div class="reaction-scheme-advanced">
        <div class="reaction-reactants">
          ${reactionData.reactants
            .map(
              (r) => `
            <div class="reactant">
              <span class="chemical">${this.formatChemicals(r.formula)}</span>
              ${
                r.catalyst
                  ? `<small class="catalyst">(${r.catalyst})</small>`
                  : ""
              }
            </div>
          `
            )
            .join(" + ")}
        </div>
        <div class="reaction-arrow">${reactionData.arrow || "→"}</div>
        <div class="reaction-products">
          ${reactionData.products
            .map(
              (p) => `
            <div class="product">
              <span class="chemical">${this.formatChemicals(p.formula)}</span>
              ${p.yield ? `<small class="yield">${p.yield}% yield</small>` : ""}
            </div>
          `
            )
            .join(" + ")}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ReactionRenderer();
});

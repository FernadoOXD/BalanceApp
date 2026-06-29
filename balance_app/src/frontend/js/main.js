import { AppHeader } from "./components/home/headerHome.js";
import { AppHero } from "./components/home/HeroHome.js";
import { AppFeatures } from "./components/home/CaracteristicasHome.js";
import { AppFooter } from "./components/Footer.js";

customElements.define("app-header", AppHeader);
customElements.define("app-hero", AppHero);
customElements.define("app-features", AppFeatures);
customElements.define("app-footer", AppFooter);

document.addEventListener("DOMContentLoaded", () => {
  const bookingButtons = document.querySelectorAll(".hero-btn, .btn-primary");
  bookingButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (button.tagName === "A" && button.getAttribute("href") === "#") {
        e.preventDefault();
        alert(
          "Funcionalidad de agenda en construcción. ¡Próximamente disponible!",
        );
      }
    });
  });
});

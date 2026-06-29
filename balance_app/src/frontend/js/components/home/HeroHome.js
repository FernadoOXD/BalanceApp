export class AppHero extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Alcanza tu peso ideal con un plan diseñado para ti</h1>
            <p class="hero-description">
              Descubre una forma saludable y sostenible de nutrir tu cuerpo. La Dra. Margarita te guiará paso a paso hacia tus objetivos de bienestar con planes de alimentación personalizados y seguimiento profesional.
            </p>
            <a href="#" class="hero-btn">
              Agendar mi primera cita
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
          <div class="hero-image-wrapper">
            <img src="assets/images/default_image.webp" alt="Dra. Margarita - Nutrióloga Profesional" class="hero-img">
          </div>
        </div>
      </section>
    `;
  }
}

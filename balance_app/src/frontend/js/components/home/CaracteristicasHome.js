export class AppFeatures extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="features" id="servicios">
        <div class="container">
          <div class="features-header">
            <h2 class="features-title">Un enfoque integral para tu salud</h2>
            <p class="features-subtitle">
              Nuestra metodología combina ciencia nutricional con herramientas prácticas para asegurar tu éxito a largo plazo.
            </p>
          </div>
          
          <div class="features-grid">
            <article class="feature-card">
              <div class="feature-icon-wrapper">
                <img src="assets/icons/tratamiento_menu.png" alt="Menú personalizado" class="feature-icon">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z"/>
                  <path d="M12 2v2v18"/
                </svg>
              </div>
              <h3 class="feature-card-title">Menús Personalizados</h3>
              <p class="feature-card-text">
                Planes de alimentación adaptados a tus gustos, estilo de vida y requerimientos nutricionales específicos, asegurando que disfrutes el proceso sin pasar hambre.
              </p>
            </article>

            <article class="feature-card">
              <div class="feature-icon-wrapper">
                <img src="assets/icons/rendimiento_menu.png" alt="Seguimiento de Progreso" class="feature-icon">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3 class="feature-card-title">Seguimiento de Progreso</h3>
              <p class="feature-card-text">
                Monitoreo constante de tu evolución con herramientas precisas. Ajustamos tu plan según tus resultados para mantener una mejora continua y motivación alta.
              </p>
            </article>

            <article class="feature-card">
              <div class="feature-icon-wrapper">
                <img src="assets/icons/agenda_menu.png" alt="Agenda tu cita !Ahora!" class="feature-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 class="feature-card-title">Agenda en Línea</h3>
              <p class="feature-card-text">
                Gestiona tus consultas de forma fácil y rápida desde cualquier dispositivo. Recibe recordatorios automáticos para que nunca pierdas una sesión importante.
              </p>
            </article>
          </div>
        </div>
      </section>
    `;
  }
}

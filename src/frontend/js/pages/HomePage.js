export class HomePage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initLogic();
  }

  render() {
    this.innerHTML = `
    <!-- ── Header de la pagina de inicio ── -->
      <header class="header">
        <div class="container">
          <a href="#" class="logo" aria-label="Balance App Inicio">
            <img src="assets/images/logo_horizontal.png" alt="Balance App Logo" class="logo-img">
          </a>
          
          <nav class="nav-menu" aria-label="Navegación principal">
            <a href="#servicios" class="nav-link">Servicios</a>
            <a href="#sobre-mi" class="nav-link">Sobre mí</a>
            <a href="#contacto" class="nav-link">Contacto</a>
            
            <div class="header-actions-mobile">
              <button class="btn btn-text"><a href="#/auth">Iniciar sesión</a></button>
              <button class="btn btn-primary"><a href="#/auth">Agendar cita</a></button>
            </div>
          </nav>
          
          <div class="header-actions">
            <button class="btn btn-text"><a href="#/auth">Iniciar sesión</a></button>
            <button class="btn btn-primary"><a href="#/auth">Agendar cita</a></button>
          </div>
          
          <button class="mobile-toggle" aria-label="Abrir menú de navegación" aria-expanded="false">
            &#9776;
          </button>
        </div>
      </header>
      <!-- ── Hero de la pagina de inicio ── -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Alcanza tu peso ideal con un plan diseñado para ti</h1>
            <p class="hero-description">
              Descubre una forma saludable y sostenible de nutrir tu cuerpo. La Dra. Margarita te guiará paso a paso hacia tus objetivos de bienestar con planes de alimentación personalizados y seguimiento profesional.
            </p>
            <a href="#/auth" class="hero-btn">
              Agendar mi primera cita
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
          <div class="hero-image-wrapper">
            <img src="assets/images/imagen_home_consultorio.png" alt="Dra. Margarita - Nutrióloga Profesional" class="hero-img">
          </div>
        </div>
      </section>
      <!-- ── Caracteristicas de la pagina de inicio ── -->
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
      <!-- ── Footer de la pagina ── -->
      <app-footer></app-footer>
        `;
  }

  initLogic() {
    const header = this.querySelector(".header");
    const toggleBtn = this.querySelector(".mobile-toggle");
    const navMenu = this.querySelector(".nav-menu");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });

    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        const isExpanded = navMenu.classList.contains("active");
        toggleBtn.setAttribute("aria-expanded", isExpanded ? "true" : "false");

        if (isExpanded) {
          toggleBtn.innerHTML = "&#10005;";
        } else {
          toggleBtn.innerHTML = "&#9776;";
        }
      });

      const navLinks = navMenu.querySelectorAll(".nav-link");
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          navMenu.classList.remove("active");
          toggleBtn.innerHTML = "&#9776;";
          toggleBtn.setAttribute("aria-expanded", "false");
        });
      });
    }
  }
}

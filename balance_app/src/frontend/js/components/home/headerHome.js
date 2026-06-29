export class AppHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initLogic();
  }

  render() {
    this.innerHTML = `
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
              <button class="btn btn-text">Iniciar sesión</button>
              <button class="btn btn-primary">Agendar cita</button>
            </div>
          </nav>
          
          <div class="header-actions">
            <button class="btn btn-text">Iniciar sesión</button>
            <button class="btn btn-primary">Agendar cita</button>
          </div>
          
          <button class="mobile-toggle" aria-label="Abrir menú de navegación" aria-expanded="false">
            &#9776;
          </button>
        </div>
      </header>
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

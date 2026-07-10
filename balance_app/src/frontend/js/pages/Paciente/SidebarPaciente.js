export class SidebarPaciente extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initLogic();
  }

  render() {
    // Nota: Le quité la clase 'sidebar__nav-link--active' que estaba fija en el Dashboard
    // para que el JavaScript decida cuál iluminar desde el inicio.
    this.innerHTML = `
      <aside class="sidebar">
        <div class="sidebar__header">
          <div class="sidebar__logo">
            <img src="assets/images/logo_horizontal.png" alt="BalanceApp" class="sidebar__logo-img">
          </div>
        </div>

        <div class="sidebar__profile">
          <div class="sidebar__profile-img">
            <img src="assets/images/default_user.png" alt="Paciente">
          </div>
          <div class="sidebar__profile-info">
            <h3 class="sidebar__profile-name">Nombre del Paciente</h3>
            <p class="sidebar__profile-title">Paciente</p>
          </div>
        </div>

        <button class="sidebar__new-patient-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Agendar Cita
        </button>

        <nav class="sidebar__nav">
          <ul class="sidebar__nav-list">
            <li class="sidebar__nav-item">
              <a href="#/paciente/dashboard" class="sidebar__nav-link">
                <svg class="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Dashboard
              </a>
            </li>
            <li class="sidebar__nav-item">
              <a href="#/paciente/agenda" class="sidebar__nav-link">
                <svg class="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Mi agenda
              </a>
            </li>
            <li class="sidebar__nav-item">
              <a href="#/paciente/rendimiento" class="sidebar__nav-link">
                <svg class="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                Rendimiento
              </a>
            </li>
            <li class="sidebar__nav-item">
              <a href="#/paciente/tratamiento" class="sidebar__nav-link">
                <svg class="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                Tratamiento
              </a>
            </li>
            <li class="sidebar__nav-item">
              <a href="#/paciente/settings" class="sidebar__nav-link">
                <svg class="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Settings
              </a>
            </li>
          </ul>
        </nav>

        <div class="sidebar__footer">
          <a href="#/help" class="sidebar__help-link">
            <svg class="sidebar__help-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Centro de Ayuda
          </a>
        </div>

        <button class="sidebar__mobile-toggle" aria-label="Abrir menú de navegación" aria-expanded="false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </aside>
    `;
  }

  initLogic() {
    const toggleBtn = this.querySelector(".sidebar__mobile-toggle");
    const sidebar = this.querySelector(".sidebar");
    const navLinks = this.querySelectorAll(".sidebar__nav-link");
    const newPatientBtn = this.querySelector(".sidebar__new-patient-btn"); // 1. Capturamos el botón

    if (!sidebar) return;

    // Función auxiliar para cerrar el menú en móviles
    const closeMobileMenu = () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("sidebar--mobile-open");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
      }
    };

    // Lógica para abrir/cerrar menú en móvil
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("sidebar--mobile-open");
        const isOpen = sidebar.classList.contains("sidebar--mobile-open");
        toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    // Cerrar menú al hacer clic en un enlace (en móvil)
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    // --- NUEVA LÓGICA PARA EL BOTÓN DE AGENDAR CITA ---
    if (newPatientBtn) {
      newPatientBtn.addEventListener("click", () => {
        // 2. Cambiamos el hash de la URL a la ruta de tu agenda
        window.location.hash = "#/paciente/agenda";
        
        // Cierra el menú si el usuario está desde un celular
        closeMobileMenu();
      });
    }

    // --- LÓGICA PARA ESTADO ACTIVO DINÁMICO ---
    const updateActiveLink = () => {
      const currentHash = window.location.hash || "#/paciente/dashboard";

      navLinks.forEach((link) => {
        // Removemos la clase activa de todos los enlaces
        link.classList.remove("sidebar__nav-link--active");

        // Si el href coincide con la URL actual, se ilumina
        if (link.getAttribute("href") === currentHash) {
          link.classList.add("sidebar__nav-link--active");
        }
      });
    };

    // Ejecuciones del detector de rutas
    updateActiveLink();
    window.addEventListener("hashchange", updateActiveLink);
  }
}

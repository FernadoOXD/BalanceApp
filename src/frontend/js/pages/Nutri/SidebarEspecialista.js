export class SidebarEspecialista extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initLogic();
  }

  render() {
    this.innerHTML = `
      <aside class="sidebar">
        <div class="sidebar__header">
          <div class="sidebar__logo">
            <img src="assets/images/logo_horizontal.png" alt="BalanceApp" class="sidebar__logo-img">
          </div>
        </div>

        <div class="sidebar__profile">
          <div class="sidebar__profile-img">
            <img src="assets/images/default_user.png" alt="Dr. Margarita">
          </div>
          <div class="sidebar__profile-info">
            <h3 class="sidebar__profile-name">Dr. Margarita</h3>
            <p class="sidebar__profile-title">Nutrióloga</p>
          </div>
        </div>

        <nav class="sidebar__nav">
          <ul class="sidebar__nav-list">
            <li class="sidebar__nav-item">
              <a href="#/especialista/dashboard" class="sidebar__nav-link">
                <img src="./assets/icons/dashboard.png" alt="Icono Dashboard" class="sidebar__nav-icon">
                Dashboard
              </a>
            </li>
            <li class="sidebar__nav-item">
              <a href="#/especialista/agenda" class="sidebar__nav-link">
                <img src="./assets/icons/calendario.png" alt="Icono Agenda" class="sidebar__nav-icon">
                Mi agenda
              </a>
            </li>
            <li class="sidebar__nav-item">
              <a href="#/especialista/lista-pacientes" class="sidebar__nav-link">
                <img src="./assets/icons/pacientes.png" alt="Icono Pacientes" class="sidebar__nav-icon">
                Pacientes
              </a>
            </li>
            <li class="sidebar__nav-item">
              <a href="#/especialista/tratamiento" class="sidebar__nav-link">
                <img src="./assets/icons/tratamiento.png" alt="Icono Tratamiento" class="sidebar__nav-icon">
                Tratamiento
              </a>
            </li>
            <li class="sidebar__nav-item">
              <a href="#/especialista/settings" class="sidebar__nav-link">
                <img src="./assets/icons/ajustes.png" alt="Icono Ajustes" class="sidebar__nav-icon">
                Ajustes
              </a>
            </li>
          </ul>
        </nav>

        <div class="sidebar__footer">
          <!-- Botón de Cerrar Sesión -->
          <a href="#" id="btn-open-logout" class="sidebar__help-link" style="color: var(--color-danger, #DC2626);">
            <svg class="sidebar__help-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-danger, #DC2626);">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
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

      <!-- ==========================================
           VENTANA MODAL: CONFIRMAR CERRAR SESIÓN
           ========================================== -->
      <div id="modal-logout" class="modal-overlay hidden">
        <div class="modal-content modal-small">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--border-color); padding-bottom:16px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px; color: var(--color-danger, #DC2626);">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <h3 style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin:0;">Cerrar Sesión</h3>
            </div>
            <button class="btn-close-modal close-modal-logout" style="background:transparent; border:none; font-size:16px; cursor:pointer; color: var(--text-secondary);">✖</button>
          </div>
          <div class="modal-body text-left" style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
            <p>¿Estás seguro de que deseas salir de tu cuenta? Tendrás que volver a ingresar tus credenciales para acceder al sistema.</p>
          </div>
          <div class="modal-footer centered-footer" style="display:flex; justify-content:flex-end; gap:12px; border-top:1px solid var(--border-color); padding-top:16px;">
            <button class="btn-cancel close-modal-logout">Cancelar</button>
            <button id="btn-confirm-logout" class="btn-danger-solid">Sí, cerrar sesión</button>
          </div>
        </div>
      </div>
    `;
  }

  initLogic() {
    const toggleBtn = this.querySelector(".sidebar__mobile-toggle");
    const sidebar = this.querySelector(".sidebar");
    const navLinks = this.querySelectorAll(".sidebar__nav-link");

    // Lógica para abrir/cerrar menú en móvil
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("sidebar--mobile-open");
      const isOpen = sidebar.classList.contains("sidebar--mobile-open");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Cerrar menú al hacer clic en un enlace (en móvil)
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("sidebar--mobile-open");
          toggleBtn.setAttribute("aria-expanded", "false");
        }
      });
    });

    // --- LÓGICA PARA ESTADO ACTIVO DINÁMICO ---
    const updateActiveLink = () => {
      const currentHash = window.location.hash || "#/dashboard";

      navLinks.forEach((link) => {
        link.classList.remove("sidebar__nav-link--active");
        if (link.getAttribute("href") === currentHash) {
          link.classList.add("sidebar__nav-link--active");
        }
      });
    };

    updateActiveLink();
    window.addEventListener("hashchange", updateActiveLink);

    // --- LÓGICA DEL MODAL DE CERRAR SESIÓN ---
    const btnOpenLogout = this.querySelector("#btn-open-logout");
    const modalLogout = this.querySelector("#modal-logout");
    const btnConfirmLogout = this.querySelector("#btn-confirm-logout");
    const closeButtons = this.querySelectorAll(".close-modal-logout");

    if (btnOpenLogout) {
      btnOpenLogout.addEventListener("click", (e) => {
        e.preventDefault();
        modalLogout.classList.remove("hidden");
      });
    }

    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        modalLogout.classList.add("hidden");
      });
    });

    //Cerrar Modal si se hace clic fuera del contenido
    if (modalLogout) {
      modalLogout.addEventListener("click", (e) => {
        if (e.target === modalLogout) {
          modalLogout.classList.add("hidden");
        }
      });
    }

    if (btnConfirmLogout) {
      btnConfirmLogout.addEventListener("click", () => {
        btnConfirmLogout.textContent = "Saliendo...";
        btnConfirmLogout.disabled = true;

        // Limpia todas las variables de sesión guardadas
        localStorage.clear();
        sessionStorage.clear();

        setTimeout(() => {
          window.location.href = "#/";
        }, 400);
      });
    }
  }
}

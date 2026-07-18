export class SidebarPaciente extends HTMLElement {
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
          <!-- ──────────── BOTÓN DE CERRAR SESIÓN ──────────── -->
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
    const newPatientBtn = this.querySelector(".sidebar__new-patient-btn");

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

    if (newPatientBtn) {
      newPatientBtn.addEventListener("click", () => {
        window.location.hash = "#/paciente/agenda";
        closeMobileMenu();
      });
    }

    // --- LÓGICA PARA ESTADO ACTIVO DINÁMICO ---
    const updateActiveLink = () => {
      const currentHash = window.location.hash || "#/paciente/dashboard";

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

    if (modalLogout) {
      modalLogout.addEventListener("click", (e) => {
        if (e.target === modalLogout) {
          modalLogout.classList.add("hidden");
        }
      });
    }

    //Confirmar Cierre de Sesión
    if (btnConfirmLogout) {
      btnConfirmLogout.addEventListener("click", () => {
        btnConfirmLogout.textContent = "Saliendo...";
        btnConfirmLogout.disabled = true;

        localStorage.clear();
        sessionStorage.clear();

        setTimeout(() => {
          window.location.href = "#/";
        }, 400);
      });
    }
  }
}

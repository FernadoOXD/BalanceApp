export class SettingPaciente extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initLogic();
  }

  render() {
    this.innerHTML = `
      <div class="layout-wrapper">
        <app-sidebar-paciente style="position: fixed;"></app-sidebar-paciente>
        
        <main class="settings-main">
          <!-- Icono de notificaciones superior -->
          <div class="top-nav-bar">
             <button class="btn-icon-only">
               <img src="./assets/icons/notificacion-negro.png" alt="Notificaciones" class="custom-icon">
             </button>
          </div>

          <!-- Encabezado Principal -->
          <header class="settings-header">
            <h1>Configuración</h1>
            <p>Gestiona tu cuenta.</p>
          </header>

          <div class="settings-container">
            
            <!-- 1. APARIENCIA -->
            <section class="settings-card">
              <div class="card-header-icon">
                <img src="./assets/icons/dia-y-noche.png" alt="Apariencia" class="custom-icon large-icon">
                <h2>Apariencia</h2>
              </div>
              <div class="divider"></div>
              <div class="settings-row">
                <div class="row-info">
                  <h3>Modo Oscuro</h3>
                  <p>Ajusta la interfaz para reducir la fatiga visual en entornos de poca luz.</p>
                </div>
                <div class="row-action">
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-dark-mode">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </section>

            <!-- 2. GESTIÓN DE CUENTA -->
            <section class="settings-card">
              <div class="card-header-icon">
                <img src="./assets/icons/gestion-de-usuarios.png" alt="Gestión" class="custom-icon large-icon">
                <h2>Gestión de Cuenta</h2>
              </div>
              <div class="divider"></div>
              <div class="settings-row">
                <div class="row-info">
                  <h3>Eliminar Cuenta</h3>
                  <p>Elimina permanentemente tu cuenta y todos tus datos asociados. Esta acción no se puede deshacer.</p>
                </div>
                <div class="row-action">
                  <button id="btn-open-delete" class="btn-outline-danger">Eliminar Cuenta</button>
                </div>
              </div>
            </section>

          </div>
        </main>

        <!-- ==========================================
             VENTANA MODAL: CONFIRMAR ELIMINACIÓN
             ========================================== -->
        <div id="modal-delete-account" class="modal-overlay hidden">
          <div class="modal-content modal-small">
            <div class="modal-header-danger">
              <img src="./assets/icons/peligro.png" alt="Alerta" class="custom-icon icon-danger">
              <h3>¿Eliminar cuenta?</h3>
            </div>
            <div class="modal-body text-left">
              <p>Esta acción es permanente y no se puede deshacer. Se perderán todos tus datos, citas y configuraciones. Si quieres volver a agendar una cita en algun momento se te sera mas dificil.</p>
            </div>
            <div class="modal-footer centered-footer">
              <button class="btn-cancel close-modal">Cancelar</button>
              <button id="btn-confirm-delete" class="btn-danger-solid">Confirmar Eliminación</button>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  initLogic() {
    // ==========================================
    // 1. LÓGICA DEL MODO OSCURO GLOBAL
    // ==========================================
    const toggleDarkMode = this.querySelector("#toggle-dark-mode");

    // Sincronizar el toggle con el estado guardado (main.js ya aplica la clase)
    if (localStorage.getItem("theme") === "dark") {
      if (toggleDarkMode) toggleDarkMode.checked = true;
    }

    if (toggleDarkMode) {
      toggleDarkMode.addEventListener("change", (e) => {
        if (e.target.checked) {
          document.body.classList.add("dark-mode");
          localStorage.setItem("theme", "dark");
        } else {
          document.body.classList.remove("dark-mode");
          localStorage.setItem("theme", "light");
        }
      });
    }

    // ==========================================
    // 2. LÓGICA DEL MODAL DE ELIMINACIÓN
    // ==========================================
    const modalDelete = this.querySelector("#modal-delete-account");

    this.addEventListener("click", (e) => {
      if (e.target.id === "btn-open-delete") {
        modalDelete.classList.remove("hidden");
      }

      if (e.target.classList.contains("close-modal")) {
        modalDelete.classList.add("hidden");
      }

      if (e.target === modalDelete) {
        modalDelete.classList.add("hidden");
      }
    });

    // ==========================================
    // 3. CONEXIÓN AL BACKEND: ELIMINAR CUENTA
    // ==========================================
    const btnConfirmDelete = this.querySelector("#btn-confirm-delete");
    if (btnConfirmDelete) {
      btnConfirmDelete.addEventListener("click", () =>
        this.executeDeleteAccount(),
      );
    }
  }

  async executeDeleteAccount() {
    const btnConfirmDelete = this.querySelector("#btn-confirm-delete");
    const modalDelete = this.querySelector("#modal-delete-account");

    try {
      btnConfirmDelete.textContent = "Eliminando...";
      btnConfirmDelete.disabled = true;

      /* ========================================================
         AQUÍ SE CONECTARÁ CON LA API PARA BORRAR EL REGISTRO
         const pacienteId = localStorage.getItem('userId'); // O de donde saques el ID
         await fetch(`https://api.com/pacientes/${pacienteId}`, {
           method: 'DELETE',
           headers: { 'Authorization': 'Bearer ' + tuToken }
         });
      ======================================================== */

      // Simulación de respuesta de red
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Cuenta eliminada exitosamente en la DB.");
      localStorage.clear(); // Limpiamos la sesión

      // Redirigir al inicio o login
      alert("Tu cuenta ha sido eliminada. Serás redirigido al inicio.");
      window.location.hash = "#/";
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      alert("Hubo un problema de conexión. Intenta de nuevo más tarde.");

      btnConfirmDelete.textContent = "Confirmar Eliminación";
      btnConfirmDelete.disabled = false;
      modalDelete.classList.add("hidden");
    }
  }
}

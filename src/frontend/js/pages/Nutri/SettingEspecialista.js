export class SettingEspecialista extends HTMLElement {
  constructor() {
    super();
    this.settingsData = null;
  }

  connectedCallback() {
    this.render();
    this.initLogic();
    this.loadData();
  }

  render() {
    this.innerHTML = `
      <div class="layout-wrapper">
        <app-sidebar-especialista style="position: fixed;"></app-sidebar-especialista>
        
        <main class="settings-main">
          <!-- Encabezado Principal -->
          <header class="settings-header">
            <h1>Configuración</h1>
            <p>Gestiona tu disponibilidad y preferencias.</p>
          </header>

          <div class="settings-container">
            
            <!-- 1. APARIENCIA -->
            <section class="settings-card">
              <div class="card-header-icon">
                <div class="icon-box icon-green-light">
                  <img src="./assets/icons/dia-y-noche.png" alt="Apariencia" class="custom-icon">
                </div>
                <div class="header-text">
                  <h2>Apariencia</h2>
                  <p>Personaliza la interfaz de la aplicación.</p>
                </div>
              </div>
              <div class="settings-row">
                <div class="row-info">
                  <h3>Modo Oscuro</h3>
                  <p>Cambia a un tema oscuro para reducir la fatiga visual.</p>
                </div>
                <div class="row-action">
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-dark-mode">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </section>

            <!-- 2. HORARIOS DE CITA -->
            <section class="settings-card">
              <div class="card-header-icon">
                <div class="icon-box icon-green-light">
                  <img src="assets/icons/relog-tiempo.png" alt="Horarios" class="custom-icon">
                </div>
                <div class="header-text">
                  <h2>Horarios de Cita</h2>
                  <p>Define tu disponibilidad regular para agendar pacientes.</p>
                </div>
              </div>
              
              <div class="schedule-table-container">
                <div class="schedule-header-row">
                  <span class="col-day">DÍA</span>
                  <span class="col-time">INICIO</span>
                  <span class="col-time">FIN</span>
                  <span class="col-active">ACTIVO</span>
                </div>
                
                <div id="schedule-rows-container">
                  <!-- Los días se inyectan vía JS -->
                </div>
              </div>

              <div class="divider"></div>

              <div class="settings-row">
                <div class="row-info">
                  <h3>Duración de Cita</h3>
                  <p>Tiempo estándar asignado a cada consulta.</p>
                </div>
                <div class="row-action">
                  <!-- Custom Dropdown (Igual al de la Agenda) -->
                  <div class="custom-dropdown" id="duration-dropdown">
                    <div class="dropdown-selected">
                      <span id="duration-selected-text">1 hora</span>
                      <img src="assets/icons/flecha-abajo.png" alt="Abrir" class="custom-icon dropdown-arrow">
                    </div>
                    <div class="dropdown-options">
                      <div class="dropdown-item" data-value="30">30 minutos</div>
                      <div class="dropdown-item" data-value="45">45 minutos</div>
                      <div class="dropdown-item active" data-value="60">1 hora</div>
                      <div class="dropdown-item" data-value="90">1.5 horas</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-footer-action">
                <button id="btn-save-schedule" class="btn-primary">Guardar Horarios</button>
              </div>
            </section>

            <!-- 3. NOTIFICACIONES -->
            <section class="settings-card">
              <div class="card-header-icon">
                <div class="icon-box icon-transparent">
                  <img src="./assets/icons/notificacion-negro.png" alt="Notificaciones" class="custom-icon">
                </div>
                <div class="header-text">
                  <h2>Notificaciones</h2>
                </div>
              </div>
              <div class="divider-full"></div>
              <div class="settings-row">
                <div class="row-info">
                  <h3>Alertas de Citas</h3>
                  <p>Recibe notificaciones cuando un paciente reserve o cancele.</p>
                </div>
                <div class="row-action">
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-notifications" checked>
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    `;
  }

  initLogic() {
    // ==========================================
    // LÓGICA DEL MODO OSCURO
    // ==========================================
    const toggleDarkMode = this.querySelector("#toggle-dark-mode");

    // Revisar si el usuario ya tenía el modo oscuro guardado
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
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
    // LÓGICA DE NOTIFICACIONES (PREPARADA)
    // ==========================================
    const toggleNotifications = this.querySelector("#toggle-notifications");
    if (toggleNotifications) {
      toggleNotifications.addEventListener("change", (e) => {
        const wantsNotifications = e.target.checked;
        console.log(
          "Estado de notificaciones interno actualizado:",
          wantsNotifications,
        );
        // Aquí podrías guardar este valor en localStorage o enviarlo a la API de inmediato
      });
    }

    // ==========================================
    // LÓGICA DEL CUSTOM DROPDOWN
    // ==========================================
    this.addEventListener("click", (e) => {
      const dropdown = e.target.closest(".custom-dropdown");
      const clickedItem = e.target.closest(".dropdown-item");
      const clickedSelected = e.target.closest(".dropdown-selected");
      const allDropdowns = this.querySelectorAll(".custom-dropdown");

      if (dropdown) {
        allDropdowns.forEach((d) => {
          if (d !== dropdown) d.classList.remove("open");
        });
        if (clickedSelected) dropdown.classList.toggle("open");

        if (clickedItem) {
          // Actualizar vista del select
          const newValue = clickedItem.getAttribute("data-value");
          const newText = clickedItem.textContent;
          this.querySelector("#duration-selected-text").textContent = newText;

          // Actualizar clase activa
          dropdown
            .querySelectorAll(".dropdown-item")
            .forEach((item) => item.classList.remove("active"));
          clickedItem.classList.add("active");

          dropdown.classList.remove("open");
        }
      } else {
        allDropdowns.forEach((d) => d.classList.remove("open"));
      }
    });

    // ==========================================
    // LÓGICA PARA GUARDAR HORARIOS
    // ==========================================
    const btnSave = this.querySelector("#btn-save-schedule");
    if (btnSave) {
      btnSave.addEventListener("click", () => this.saveScheduleToDB());
    }
  }

  async loadData() {
    try {
      /* ========================================================
         AQUÍ CONECTARÁS CON TU API. Ejemplo:
         const response = await fetch('https://tu-api.com/especialista/settings');
         this.settingsData = await response.json();
      ======================================================== */

      // MOCK DATA: Simula los datos de tu Base de Datos
      this.settingsData = {
        duration: 60,
        notifications: true,
        schedule: [
          {
            day: "Lunes",
            id: "lun",
            start: "08:00",
            end: "16:00",
            active: true,
          },
          {
            day: "Martes",
            id: "mar",
            start: "08:00",
            end: "16:00",
            active: true,
          },
          {
            day: "Miércoles",
            id: "mie",
            start: "08:00",
            end: "16:00",
            active: true,
          },
          {
            day: "Jueves",
            id: "jue",
            start: "08:00",
            end: "16:00",
            active: true,
          },
          {
            day: "Viernes",
            id: "vie",
            start: "08:00",
            end: "16:00",
            active: true,
          },
          {
            day: "Sábado",
            id: "sab",
            start: "08:00",
            end: "14:00",
            active: true,
          }, // Sábado termina antes
        ],
      };

      this.renderDynamicContent();
    } catch (error) {
      console.error("Error al cargar configuraciones:", error);
    }
  }

  renderDynamicContent() {
    if (!this.settingsData) return;

    // 1. Pintar Filas de Horarios
    const container = this.querySelector("#schedule-rows-container");
    if (container) {
      container.innerHTML = this.settingsData.schedule
        .map(
          (d) => `
        <div class="schedule-row" data-day="${d.id}">
          <div class="col-day"><strong>${d.day}</strong></div>
          <div class="col-time">
            <div class="input-icon-wrapper">
              <img src="./assets/icons/boton-editar.png" class="custom-icon tiny-icon">
              <input type="time" class="time-input start-time" value="${d.start}" ${d.active ? "" : "disabled"}>
            </div>
          </div>
          <div class="col-time">
            <div class="input-icon-wrapper">
              <img src="assets/icons/boton-editar.png" class="custom-icon tiny-icon">
              <input type="time" class="time-input end-time" value="${d.end}" ${d.active ? "" : "disabled"}>
            </div>
          </div>
          <div class="col-active">
            <label class="toggle-switch">
              <input type="checkbox" class="day-active-toggle" ${d.active ? "checked" : ""}>
              <span class="slider"></span>
            </label>
          </div>
        </div>
      `,
        )
        .join("");
    }

    // Evento para deshabilitar los inputs si se apaga el switch del día
    const dayToggles = this.querySelectorAll(".day-active-toggle");
    dayToggles.forEach((toggle) => {
      toggle.addEventListener("change", (e) => {
        const row = e.target.closest(".schedule-row");
        const inputs = row.querySelectorAll(".time-input");
        inputs.forEach((input) => (input.disabled = !e.target.checked));
      });
    });

    // 2. Setear estado del dropdown de duración
    const dropdown = this.querySelector("#duration-dropdown");
    if (dropdown) {
      const targetItem = dropdown.querySelector(
        `.dropdown-item[data-value="${this.settingsData.duration}"]`,
      );
      if (targetItem) {
        dropdown
          .querySelectorAll(".dropdown-item")
          .forEach((i) => i.classList.remove("active"));
        targetItem.classList.add("active");
        this.querySelector("#duration-selected-text").textContent =
          targetItem.textContent;
      }
    }
  }

  async saveScheduleToDB() {
    const btnSave = this.querySelector("#btn-save-schedule");

    // 1. Recolectar datos del DOM
    const schedulePayload = [];
    const rows = this.querySelectorAll(".schedule-row");

    rows.forEach((row) => {
      schedulePayload.push({
        id: row.getAttribute("data-day"),
        active: row.querySelector(".day-active-toggle").checked,
        start: row.querySelector(".start-time").value,
        end: row.querySelector(".end-time").value,
      });
    });

    const activeDurationItem = this.querySelector(".dropdown-item.active");
    const durationPayload = activeDurationItem
      ? activeDurationItem.getAttribute("data-value")
      : 60;

    const finalData = {
      schedule: schedulePayload,
      duration: parseInt(durationPayload),
    };

    try {
      btnSave.textContent = "Guardando...";
      btnSave.disabled = true;

      /* ========================================================
         AQUÍ HARÁS EL POST/PUT A TU API. Ejemplo:
         await fetch('https://tu-api.com/especialista/settings', {
           method: 'PUT',
           body: JSON.stringify(finalData)
         });
      ======================================================== */
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulación

      console.log("Datos listos para enviar a la DB:", finalData);

      btnSave.textContent = "¡Guardado con éxito!";
      btnSave.style.backgroundColor = "var(--color-green)";

      setTimeout(() => {
        btnSave.textContent = "Guardar Horarios";
        btnSave.style.backgroundColor = "var(--color-brand-dark)";
        btnSave.disabled = false;
      }, 2000);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al intentar guardar los horarios.");
      btnSave.textContent = "Guardar Horarios";
      btnSave.disabled = false;
    }
  }
}

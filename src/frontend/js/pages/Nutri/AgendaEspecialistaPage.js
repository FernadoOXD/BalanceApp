import { API_BASE_URL } from "../../../config.js";

export class AgendaEspecialistaPage extends HTMLElement {
  constructor() {
    super();
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.appointments = [];
    this.appointmentToCancel = null;
    this.appointmentToConclude = null; // NUEVO: Para guardar la cita a concluir
  }

  connectedCallback() {
    this.render();
    this.initLogic();
    this.loadData();
  }

  render() {
    this.innerHTML = `
      <div class="layout-wrapper">
        <app-sidebar-especialista></app-sidebar-especialista>
        
        <main class="agenda-main">
          <!-- Encabezado Principal -->
          <header class="agenda-header">
            <h1>Mi Agenda</h1>
            <p>Gestiona tus citas</p>
          </header>

          <div class="agenda-grid">
            <!-- 1. CALENDARIO DINÁMICO -->
            <section class="calendar-section">
              <div class="calendar-card panel-card">
                
                <div class="calendar-header">
                  <div class="calendar-title">
                    <!-- ICONO LOCAL: Calendario -->
                    <img src="/assets/icons/calendario.png" alt="Calendario" class="custom-icon large-icon">
                    <h2 id="month-year-display">Cargando...</h2>
                  </div>
                  <div class="calendar-nav">
                    <button id="btn-prev-month" class="nav-btn">
                      <!-- ICONO LOCAL: Flecha Izquierda -->
                      <img src="/assets/icons/flecha-izquierda.png" alt="Atrás" class="custom-icon">
                    </button>
                    <button id="btn-next-month" class="nav-btn">
                      <!-- ICONO LOCAL: Flecha Derecha -->
                      <img src="/assets/icons/flecha-derecha.png" alt="Adelante" class="custom-icon">
                    </button>
                  </div>
                </div>

                <div class="calendar-grid">
                  <div class="weekdays">
                    <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
                  </div>
                  <div class="days" id="calendar-days">
                    <!-- Los días se inyectan vía JS -->
                  </div>
                </div>

              </div>
            </section>

            <!-- 2. LISTA DE CITAS DEL DÍA -->
            <section class="appointments-section panel-card">
              <div class="appointments-header">
                <h2>Citas</h2>
                <span class="date-badge" id="selected-date-display">...</span>
              </div>
              
              <div class="appointments-list" id="appointments-list">
                <!-- Las tarjetas de citas se inyectan vía JS -->
              </div>


            </section>
          </div>
        </main>

        <!-- ==========================================
             VENTANA MODAL PARA CANCELAR CITA
             ========================================== -->
        <div id="modal-cancel" class="modal-overlay hidden">
          <div class="modal-content modal-small">
            <div class="modal-header">
              <h3>Cancelar Cita</h3>
              <button class="btn-close-modal close-cancel">✖</button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas cancelar esta cita? El paciente será notificado y el espacio quedará libre en tu agenda.</p>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel close-cancel">No, mantener</button>
              <button id="btn-confirm-cancel" class="btn-danger">Sí, cancelar cita</button>
            </div>
          </div>
        </div>

        <!-- ==========================================
             VENTANA MODAL PARA CONCLUIR CITA (NUEVO)
             ========================================== -->
        <div id="modal-conclude" class="modal-overlay hidden">
          <div class="modal-content modal-small">
            <div class="modal-header">
              <h3>Concluir Cita</h3>
              <button class="btn-close-modal close-conclude">✖</button>
            </div>
            <div class="modal-body">
              <p>¿Confirmas que esta cita se ha llevado a cabo de manera exitosa? Esta acción marcará la sesión como finalizada.</p>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel close-conclude">Revisar de nuevo</button>
              <button id="btn-confirm-conclude" class="btn-success">Confirmar Conclusión</button>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  initLogic() {
    const btnPrev = this.querySelector("#btn-prev-month");
    const btnNext = this.querySelector("#btn-next-month");

    if (btnPrev)
      btnPrev.addEventListener("click", () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.loadData(); // Recargar citas para el nuevo mes
      });
    if (btnNext)
      btnNext.addEventListener("click", () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.loadData(); // Recargar citas para el nuevo mes
      });

    this.addEventListener("click", (e) => {
      // Clic en un día
      const dayCell = e.target.closest(".day-cell");
      if (dayCell && !dayCell.classList.contains("empty")) {
        const [year, month, day] = dayCell.getAttribute("data-date").split("-");
        this.selectedDate = new Date(year, month - 1, day);
        this.renderCalendar();
        this.renderAppointments();
      }

      // Abrir Modal Cancelar
      const btnCancelAppt = e.target.closest(".trigger-cancel");
      if (btnCancelAppt) {
        this.appointmentToCancel = btnCancelAppt.getAttribute("data-id");
        this.querySelector("#modal-cancel").classList.remove("hidden");
      }

      // Cerrar Modales
      if (e.target.closest(".close-cancel")) this.closeModal("cancel");
      if (e.target.closest(".close-conclude")) this.closeModal("conclude");
      if (e.target.classList.contains("modal-overlay")) {
        this.closeModal("cancel");
        this.closeModal("conclude");
      }
    });

    // Confirmar Cancelación
    const btnConfirmCancel = this.querySelector("#btn-confirm-cancel");
    if (btnConfirmCancel)
      btnConfirmCancel.addEventListener("click", () =>
        this.executeStatusChange("Cancelada"),
      );

    // Confirmar Conclusión
    const btnConfirmConclude = this.querySelector("#btn-confirm-conclude");
    if (btnConfirmConclude)
      btnConfirmConclude.addEventListener("click", () =>
        this.executeStatusChange("Concluida"),
      );

    // Delegación del <select>
    this.addEventListener("click", (e) => {
      // ==========================================
      // LÓGICA DEL CUSTOM DROPDOWN
      // ==========================================
      const isDropdownClick = e.target.closest(".custom-dropdown");
      const allDropdowns = this.querySelectorAll(".custom-dropdown");

      if (isDropdownClick) {
        const dropdown = e.target.closest(".custom-dropdown");
        const clickedItem = e.target.closest(".dropdown-item");
        const clickedSelected = e.target.closest(".dropdown-selected");

        // 1. Cerrar cualquier otro dropdown que esté abierto
        allDropdowns.forEach((d) => {
          if (d !== dropdown) d.classList.remove("open");
        });

        // 2. Si da clic en la cajita principal, abre/cierra el menú
        if (clickedSelected) {
          dropdown.classList.toggle("open");
        }

        // 3. Si da clic en una opción ("Concluida")
        if (clickedItem) {
          const newValue = clickedItem.getAttribute("data-value");
          const appointmentId = dropdown.getAttribute("data-id");
          dropdown.classList.remove("open"); // Cerrar el menú

          if (newValue === "Concluida") {
            this.appointmentToConclude = appointmentId;
            this.querySelector("#modal-conclude").classList.remove("hidden");
          }
        }
      } else {
        // 4. Si da clic en cualquier otra parte de la pantalla, cerrar todos los dropdowns
        allDropdowns.forEach((d) => d.classList.remove("open"));
      }
    });
  }

  async loadData() {
    try {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();

      const response = await fetch(`${API_BASE_URL}/api/cita`);
      const data = await response.json();

      if (data.success) {
        const todasLasCitas = [
          ...(data.proximas || []),
          ...(data.historial || []),
        ];
        this.appointments = todasLasCitas.filter((cita) => {
          if (!cita.fecha) return false;
          const [citaYear, citaMonth] = cita.fecha.split("-").map(Number);
          return citaYear === year && citaMonth === month + 1;
        });
      } else {
        this.appointments = [];
      }

      this.renderCalendar();
      this.renderAppointments();
    } catch (error) {
      console.error("Error al cargar las citas:", error);
      this.appointments = [];
      this.renderCalendar();
      this.renderAppointments();
    }
  }

  renderCalendar() {
    const monthYearDisplay = this.querySelector("#month-year-display");
    const daysContainer = this.querySelector("#calendar-days");
    if (!monthYearDisplay || !daysContainer) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    monthYearDisplay.textContent = `${meses[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let calendarHTML = "";

    for (let i = 0; i < startDay; i++) {
      calendarHTML += `<div class="day-cell empty">${daysInPrevMonth - startDay + i + 1}</div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const cellDateStr = this.formatDateStr(new Date(year, month, i));
      const selectedDateStr = this.formatDateStr(this.selectedDate);
      const isSelected = cellDateStr === selectedDateStr ? "selected" : "";

      const dayAppointments = this.appointments.filter(
        (app) => app.fecha === cellDateStr,
      );
      let dotsHTML = "";
      if (dayAppointments.length > 0) {
        dotsHTML = '<div class="day-dots">';
        dayAppointments.slice(0, 3).forEach((app) => {
          const colorClass =
            app.estado === "Pendiente"
              ? "dot-yellow"
              : app.estado === "Concluida"
                ? "dot-green"
                : "dot-red";
          dotsHTML += `<span class="dot ${colorClass}"></span>`;
        });
        dotsHTML += "</div>";
      }

      calendarHTML += `
        <div class="day-cell ${isSelected}" data-date="${cellDateStr}">
          <span class="day-num">${i}</span>
          ${dotsHTML}
        </div>
      `;
    }

    const remainingCells = 42 - (startDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
      calendarHTML += `<div class="day-cell empty">${i}</div>`;
    }

    daysContainer.innerHTML = calendarHTML;
  }

  renderAppointments() {
    const listContainer = this.querySelector("#appointments-list");
    const dateDisplay = this.querySelector("#selected-date-display");
    if (!listContainer || !dateDisplay) return;

    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    dateDisplay.textContent = `${this.selectedDate.getDate()} de ${meses[this.selectedDate.getMonth()]}`;

    const dailyAppointments = this.appointments.filter(
      (app) => app.fecha === this.formatDateStr(this.selectedDate),
    );

    if (dailyAppointments.length === 0) {
      listContainer.innerHTML = `<div class="empty-state"><p>No tienes citas programadas para este día.</p></div>`;
      return;
    }

    listContainer.innerHTML = dailyAppointments
      .map((app) => {
        let statusControlHTML = "";
        let cancelBtnHTML = "";

        // El Select Estilizado
        if (app.estado === "Pendiente") {
          // SUSTITUIMOS EL <select> POR NUESTRO CUSTOM DROPDOWN
          statusControlHTML = `
          <div class="custom-dropdown" data-id="${app.id}">
            <div class="dropdown-selected">
              <span>Pendiente</span>
              <!-- ICONO LOCAL: Flecha abajo -->
              <img src="/assets/icons/flecha-abajo.png" alt="Abrir" class="custom-icon dropdown-arrow">
            </div>
            <div class="dropdown-options">
              <div class="dropdown-item active" data-value="Pendiente">Pendiente</div>
              <div class="dropdown-item" data-value="Concluida">Concluida</div>
            </div>
          </div>
        `;
          cancelBtnHTML = `<button class="btn-text-danger trigger-cancel" data-id="${app.id}">Cancelar cita</button>`;
        } else if (app.estado === "Concluida") {
          statusControlHTML = `<span class="badge badge-green">Concluida</span>`;
        } else if (app.estado === "Cancelada") {
          statusControlHTML = `<span class="badge badge-red">Cancelada</span>`;
        }

        return `
        <div class="appointment-card status-${app.estado.toLowerCase()}">
          <div class="appt-header">
            <h3>${app.paciente}</h3>
            ${statusControlHTML}
          </div>
          <div class="appt-time">
            <!-- ICONO LOCAL: Reloj -->
            <img src="/assets/icons/relog-tiempo.png" alt="Hora" class="custom-icon"> 
            ${app.hora}
          </div>
          <div class="appt-footer">
            <div class="appt-type">
              <!-- ICONO LOCAL: Tipo/Médico -->
              <img src="/assets/icons/tratamiento_menu.png" alt="Tipo" class="custom-icon"> 
              ${app.tipo}
            </div>
            ${cancelBtnHTML}
          </div>
        </div>
      `;
      })
      .join("");
  }

  // MÉTODO UNIFICADO PARA CONCLUIR O CANCELAR
  async executeStatusChange(newStatus) {
    const isCanceling = newStatus === "Cancelada";
    const targetId = isCanceling
      ? this.appointmentToCancel
      : this.appointmentToConclude;
    const btnId = isCanceling ? "#btn-confirm-cancel" : "#btn-confirm-conclude";
    const originalText = isCanceling
      ? "Sí, cancelar cita"
      : "Confirmar Conclusión";

    if (!targetId) return;

    try {
      const btnConfirm = this.querySelector(btnId);
      btnConfirm.textContent = "Procesando...";
      btnConfirm.disabled = true;

      const endpoint = isCanceling
        ? `${API_BASE_URL}/api/cita/${targetId}/cancelar`
        : `${API_BASE_URL}/api/cita/${targetId}/concluir`;

      const response = await fetch(endpoint, {
        method: "PATCH",
      });

      const data = await response.json();

      if (data.success) {
        // Actualizamos arreglo local
        const appt = this.appointments.find((a) => a.id == targetId);
        if (appt) appt.estado = newStatus;

        // Restaurar y repintar
        btnConfirm.textContent = originalText;
        btnConfirm.disabled = false;
        this.closeModal(isCanceling ? "cancel" : "conclude");
        this.renderAppointments();
        this.renderCalendar();
      } else {
        throw new Error(data.message || "Error al cambiar estado");
      }
    } catch (error) {
      console.error("Error al procesar:", error);
      alert("Error al intentar cambiar el estado de la cita: " + error.message);

      // Restaurar botón
      const btnConfirm = this.querySelector(btnId);
      btnConfirm.textContent = originalText;
      btnConfirm.disabled = false;
    }
  }

  closeModal(type) {
    if (type === "cancel") {
      this.querySelector("#modal-cancel").classList.add("hidden");
      this.appointmentToCancel = null;
    } else if (type === "conclude") {
      this.querySelector("#modal-conclude").classList.add("hidden");
      this.appointmentToConclude = null;
    }
  }

  formatDateStr(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}

export class RendimientoEspecialistaPage extends HTMLElement {
  constructor() {
    super();
    this.data = null;
    this.selectedPatientId = null;
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
        
        <main class="dashboard-main">
          <!-- Encabezado -->
          <header class="dashboard-header">
            <h1>Panel de Monitoreo Diario</h1>
            <div class="search-container">
              <span class="search-icon"><img src="assets/icons/Busqueda.png" alt="busquedaPaciente"></span>
              <input type="text" id="search-input" placeholder="Buscar pacientes...">
            </div>
          </header>

          <!-- Subtítulo -->
          <div class="dashboard-subheader">
            <p>Resumen de actividad y adherencia de pacientes asignados.</p>
          </div>

          <!-- Cuadrícula Principal -->
          <div class="dashboard-grid">
            
            <!-- Columna Izquierda -->
            <div class="col-left">
              <!-- Tarjetas de Resumen -->
              <div class="stats-container">
                <div class="stat-card">
                  <div class="stat-header">
                    <span>REPORTES HOY</span>
                    <span class="icon-check"></span>
                  </div>
                  <div class="stat-body">
                    <h2 id="val-reportes">0</h2>
                    <span class="stat-sub" id="val-total">/ 0 pacientes</span>
                  </div>
                  <div class="bg-waves"></div>
                </div>
              </div>

              <!-- Tabla de Seguimiento -->
              <div class="table-container">
                <h2>Seguimiento Clínico</h2>
                <div class="table-responsive-wrapper">
                  <table class="clinical-table">
                    <thead>
                      <tr>
                        <th>Paciente</th>
                        <th>Último Reporte</th>
                        <th>Apego Semanal</th>
                      </tr>
                    </thead>
                    <tbody id="table-body-pacientes">
                      <!-- Se llena vía JS -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Columna Derecha: Panel de Notas -->
            <aside class="col-right" id="panel-detalle-paciente">
              <!-- Se llena vía JS -->
            </aside>
          </div>
        </main>

        <!-- ==========================================
             VENTANA MODAL PARA AGREGAR NOTA 
             ========================================== -->
        <div id="modal-overlay" class="modal-overlay hidden">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Agregar Nota Clínica</h3>
              <button id="btn-close-modal" class="btn-icon">✖</button>
            </div>
            <div class="modal-body">
              <label for="titulo-nota">Título de la nota</label>
              <input type="text" id="titulo-nota" placeholder="Ej. Ajuste de Macronutrientes">
              
              <label for="texto-nota">Observaciones</label>
              <textarea id="texto-nota" rows="4" placeholder="Escribe el reporte del paciente aquí..."></textarea>
            </div>
            <div class="modal-footer">
              <button id="btn-cancel-modal" class="btn-cancel">Cancelar</button>
              <button id="btn-save-nota" class="btn-save">Guardar Nota</button>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  initLogic() {
    const modal = this.querySelector("#modal-overlay");
    const btnSave = this.querySelector("#btn-save-nota");

    // 1. Delegación de eventos global
    this.addEventListener("click", (e) => {
      // A. Clic en una fila de la tabla
      const tr = e.target.closest("tr[data-patient-id]");
      if (tr) {
        const newId = tr.getAttribute("data-patient-id");
        if (newId != this.selectedPatientId) {
          this.selectedPatientId = newId;
          this.renderDynamicContent();
        }
      }

      // B. Clic en el botón "+ Nota"
      if (e.target.closest("#trigger-add-note")) {
        if (modal) modal.classList.remove("hidden");
      }

      // C. Clic en botones de cerrar el modal
      if (
        e.target.closest("#btn-close-modal") ||
        e.target.closest("#btn-cancel-modal")
      ) {
        this.closeModal();
      }

      // D. NUEVO: Clic en el botón "Eliminar Nota"
      const btnDelete = e.target.closest(".btn-delete-note");
      if (btnDelete) {
        const noteId = btnDelete.getAttribute("data-note-id");
        this.deleteNoteFromDB(noteId);
      }
    });

    // 2. Cerrar modal al hacer clic en el fondo oscuro
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeModal();
      });
    }

    // 3. Guardar la nota
    if (btnSave) {
      btnSave.addEventListener("click", () => this.saveNoteToDB());
    }
  }

  async loadData() {
    try {
      // MOCK DATA (Simulación GET a DB)
      this.data = {
        resumen: { reportesHoy: 42, totalPacientes: 50 },
        pacientes: [
          {
            id: 1,
            iniciales: "FR",
            colorAvatar: "#06528A",
            fontColor: "#FFF",
            nombre: "Fernando Reyes",
            plan: "Plan Metabólico",
            ultimoReporte: "Hace 2 horas",
            alerta: false,
            apego: "95%",
          },
          {
            id: 2,
            iniciales: "AM",
            colorAvatar: "#9B3857",
            fontColor: "#FFF",
            nombre: "Agustin Mauricio",
            plan: "Deportivo",
            ultimoReporte: "Ayer, 18:30",
            alerta: false,
            apego: "70%",
          },
          {
            id: 3,
            iniciales: "CM",
            colorAvatar: "#FCE8E8",
            fontColor: "#C93B3B",
            nombre: "Carlos Mario",
            plan: "Control Diabetes",
            ultimoReporte: "Hace 3 días",
            alerta: true,
            apego: "45%",
          },
        ],
        detallePaciente: {
          1: {
            iniciales: "FR",
            nombre: "Fernando Reyes",
            estado: "Activo",
            historial: [
              {
                id: 101,
                tipo: "reciente",
                titulo: "Ajuste de Macronutrientes",
                fecha: "Hoy, 10:00",
                nota: "Paciente reporta buena saciedad. Se incrementa proteína en cena a 30g para favorecer recuperación muscular.",
              },
              {
                id: 102,
                tipo: "pasado",
                titulo: "Revisión de Sintomatología",
                fecha: "Hace 2 días",
                nota: "Inflamación post-comida reducida notablemente tras eliminar lácteos enteros. Continuar protocolo actual.",
              },
            ],
          },
          2: {
            iniciales: "AM",
            nombre: "Agustin Mauricio",
            estado: "Activo",
            historial: [
              {
                id: 201,
                tipo: "reciente",
                titulo: "Inicio de rutina",
                fecha: "Ayer",
                nota: "Paciente completó su primera semana de adaptación a hipertrofia.",
              },
            ],
          },
          3: {
            iniciales: "CM",
            nombre: "Carlos Mario",
            estado: "En riesgo",
            historial: [
              {
                id: 301,
                tipo: "pasado",
                titulo: "Alerta de glucosa",
                fecha: "Hace 3 días",
                nota: "Se recomienda ajuste urgente en los carbohidratos de la comida principal.",
              },
            ],
          },
        },
      };

      if (this.data.pacientes && this.data.pacientes.length > 0) {
        this.selectedPatientId = this.data.pacientes[0].id;
      }
      this.renderDynamicContent();
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  }

  renderDynamicContent() {
    if (!this.data) return;

    const valReportes = this.querySelector("#val-reportes");
    const valTotal = this.querySelector("#val-total");
    if (valReportes) valReportes.textContent = this.data.resumen.reportesHoy;
    if (valTotal)
      valTotal.textContent = `/ ${this.data.resumen.totalPacientes} pacientes`;

    const tableBody = this.querySelector("#table-body-pacientes");
    if (tableBody) {
      tableBody.innerHTML = this.data.pacientes
        .map(
          (p) => `
        <tr data-patient-id="${p.id}" class="${p.id == this.selectedPatientId ? "row-selected" : ""}">
          <td>
            <div class="patient-info-cell">
              <div class="avatar" style="background-color: ${p.colorAvatar}; color: ${p.fontColor};">
                ${p.iniciales}
              </div>
              <div class="patient-details">
                <strong>${p.nombre}</strong>
                <span>${p.plan}</span>
              </div>
            </div>
          </td>
          <td class="${p.alerta ? "text-danger" : ""}">${p.ultimoReporte}</td>
          <td class="text-apego">${p.apego}</td>
        </tr>
      `,
        )
        .join("");
    }
    this.renderPatientDetails();
  }

  renderPatientDetails() {
    if (!this.data || !this.data.detallePaciente[this.selectedPatientId])
      return;

    const paciente = this.data.detallePaciente[this.selectedPatientId];
    const panel = this.querySelector("#panel-detalle-paciente");

    if (panel) {
      panel.innerHTML = `
        <div class="profile-header">
          <div class="avatar large" style="background-color: #06528A; color: white;">
            ${paciente.iniciales}
          </div>
          <div class="profile-names">
            <h2>${paciente.nombre}</h2>
            <span class="status-badge ${paciente.estado === "Activo" ? "badge-green" : "badge-red"}">
              ${paciente.estado}
            </span>
          </div>
        </div>

        <div class="history-container">
          <div class="history-header">
            <h3 class="section-title">HISTORIAL CLÍNICO</h3>
            <button class="btn-add-note" id="trigger-add-note">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
               Nota
            </button>
          </div>
          <div class="timeline">
            <!-- AGREGAMOS EL BOTÓN DE ELIMINAR A CADA NOTA -->
            ${paciente.historial
              .map(
                (h) => `
              <div class="timeline-item">
                <div class="timeline-node ${h.tipo === "reciente" ? "node-green" : "node-gray"}"></div>
                <div class="timeline-content">
                  <div class="timeline-title-row">
                    <h4>${h.titulo}</h4>
                    <div class="timeline-actions">
                      <span class="timeline-date">${h.fecha}</span>
                      <button class="btn-delete-note" data-note-id="${h.id}" title="Eliminar nota">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                  <p>${h.nota}</p>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `;
    }
  }

  closeModal() {
    const modal = this.querySelector("#modal-overlay");
    if (modal) modal.classList.add("hidden");

    const inputTitulo = this.querySelector("#titulo-nota");
    const inputTexto = this.querySelector("#texto-nota");
    if (inputTitulo) inputTitulo.value = "";
    if (inputTexto) inputTexto.value = "";
  }

  async saveNoteToDB() {
    const tituloInput = this.querySelector("#titulo-nota")?.value.trim();
    const textoInput = this.querySelector("#texto-nota")?.value.trim();

    if (!tituloInput || !textoInput) {
      alert("Por favor, llena ambos campos para guardar la nota.");
      return;
    }

    const nuevaNota = {
      titulo: tituloInput,
      nota: textoInput,
      pacienteId: this.selectedPatientId,
    };

    try {
      const btnSave = this.querySelector("#btn-save-nota");
      let textOriginal = "Guardar Nota";
      if (btnSave) {
        textOriginal = btnSave.textContent;
        btnSave.textContent = "Guardando...";
        btnSave.disabled = true;
      }

      /* ========================================================
         AQUÍ HARÁS EL POST A TU API
      ======================================================== */
      await new Promise((resolve) => setTimeout(resolve, 800));

      this.data.detallePaciente[this.selectedPatientId].historial.unshift({
        id: Date.now(),
        tipo: "reciente",
        titulo: nuevaNota.titulo,
        fecha: "Justo ahora",
        nota: nuevaNota.nota,
      });

      if (btnSave) {
        btnSave.textContent = textOriginal;
        btnSave.disabled = false;
      }

      this.closeModal();
      this.renderPatientDetails();
    } catch (error) {
      console.error("Error al guardar la nota:", error);
      alert("Hubo un error al guardar la nota.");
    }
  }

  // ===============================================
  // NUEVO: MÉTODO PARA ELIMINAR NOTA
  // ===============================================
  async deleteNoteFromDB(noteId) {
    const confirmacion = confirm(
      "¿Estás seguro de que deseas eliminar esta nota clínica?",
    );
    if (!confirmacion) return;

    try {
      /* ========================================================
         AQUÍ HARÁS EL DELETE A TU API. Ejemplo:
         await fetch(`https://tu-api.com/notas/${noteId}`, { method: 'DELETE' });
      ======================================================== */

      // MOCK UPDATE: Actualizamos estado local filtrando la nota eliminada
      const paciente = this.data.detallePaciente[this.selectedPatientId];
      paciente.historial = paciente.historial.filter(
        (nota) => nota.id != noteId,
      );

      // Repintamos solo el panel de historial para que desaparezca
      this.renderPatientDetails();
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
      alert("Hubo un problema al intentar eliminar la nota.");
    }
  }
}

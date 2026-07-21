import { API_BASE_URL } from "../../../config.js";

export class TratamientoEspecialistaPage extends HTMLElement {
  constructor() {
    super();
    // 1. Datos inicializados vacíos (se llenarán con la base de datos)
    this.pacientes = [];
    this.pacientesRecientes = [];
    this.sugerenciasBusqueda = [];

    this.loading = false;
    this.errorOccurred = false;
    this.vistaAsignar = false;
    this.vistaPerfil = false;
    this.pacienteSeleccionado = null;
    this.editandoTratamiento = false;
    this.viendoModalExcel = false;
    this.modoModalSoloLectura = false;
    this.viendoModalEjercicios = false;

    // 2. URL dinámica basada en tu configuración global
    this.apiUrl = `${API_BASE_URL}/api/tratamiento`;
  }

  async connectedCallback() {
    this.render();
    await this.fetchPacientesDesdeBD();
  }

  // ... tu código anterior ...

  async fetchPacientesDesdeBD() {
    try {
      this.loading = true;
      this.renderDinamico();

      const response = await fetch(this.apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const datosCrudos = await response.json();

      // PARCHE DE NORMALIZACIÓN
      // PARCHE DE NORMALIZACIÓN Y PARSEO JSON
      // PARCHE DE NORMALIZACIÓN Y PARSEO JSON
      this.pacientes = datosCrudos.map((p) => {
        let menuParseado = null;
        if (p.menuExcel) {
          try {
            menuParseado =
              typeof p.menuExcel === "string"
                ? JSON.parse(p.menuExcel)
                : p.menuExcel;
          } catch (e) {
            console.error("Error al leer el menú desde la BD", e);
          }
        }

        // 👇 NUEVA LÓGICA: ¿Tiene un tratamiento activo?
        // Es activo si tiene objetivo, plan alimenticio o ejercicios.
        const tieneTratamiento = Boolean(
          (p.tratamiento && p.tratamiento.trim() !== "") ||
          (p.alimentacion && p.alimentacion.trim() !== "") ||
          (p.ejercicioDescripcion && p.ejercicioDescripcion.trim() !== ""),
        );

        return {
          ...p,
          menuExcel: menuParseado,
          nombre:
            p.nombre ||
            `${p.nombres || ""} ${p.apellidoPaterno || ""}`.trim() ||
            "Paciente Sin Nombre",
          id: p.id || p.idPaciente || "S/N",
          iniciales:
            (p.nombres ? p.nombres.charAt(0) : "P") +
            (p.apellidoPaterno ? p.apellidoPaterno.charAt(0) : ""),
          tieneTratamiento: tieneTratamiento, // <--- Guardamos la bandera
        };
      });

      // 👇 NUEVO: Separamos las listas. El grid principal SOLO mostrará a los activos.
      this.pacientesRecientes = this.pacientes.filter(
        (p) => p.tieneTratamiento,
      );
    } catch (error) {
      console.error(
        "Error al conectar con la BD para obtener pacientes:",
        error,
      );
      this.errorOccurred = true;
    } finally {
      this.loading = false;
      this.renderDinamico();
    }
  }

  renderDinamico() {
    if (this.vistaPerfil) {
      this.renderMiniPerfil();
    } else if (this.vistaAsignar) {
      this.renderSeccionAsignar();
    } else {
      this.renderListaRecientes();
    }
  }

  renderListaRecientes() {
    const container = this.querySelector("#pacientes-container");
    if (!container) return;

    if (this.loading) {
      container.innerHTML = `<div class="status-message"><p>Cargando pacientes desde el servidor...</p></div>`;
      return;
    }

    if (this.errorOccurred) {
      container.innerHTML = `<div class="status-message empty"><p>No se pudo conectar con el servidor.</p></div>`;
      return;
    }

    if (this.pacientesRecientes.length === 0) {
      container.innerHTML = `<div class="status-message empty"><p>No hay tratamientos registrados en el sistema.</p></div>`;
      return;
    }

    container.innerHTML = this.pacientesRecientes
      .map(
        (paciente) => `
      <div class="paciente-card" data-id="${paciente.id}">
        <div class="card-header" style="border-bottom: 1px solid var(--border-color);">
          <div class="avatar" style="background: var(--bg-avatar-large); color: var(--text-primary);">${paciente.iniciales || "P"}</div>
          <div class="paciente-info">
            <h3 style="color: var(--text-primary);">${paciente.nombre}</h3>
            <span class="paciente-id" style="color: var(--text-muted);">ID: ${paciente.id}</span>
          </div>
          <span class="badge ${paciente.alimentacion ? "status-activo" : "status-pendiente"}">
            ${paciente.alimentacion ? "Activo" : "Pendiente"}
          </span>
        </div>
        <div class="card-body">
          <div class="row-objetivo" style="color: var(--text-secondary);">
            <strong style="color: var(--text-primary);">Objetivo:</strong> 
            <span>${paciente.tratamiento || "Sin definir"}</span>
          </div>
          <p style="color: var(--text-secondary);">
            <img src="assets/icons/manzanaVerde.png" alt="Alimentación" class="card-icon">
            <strong style="color: var(--text-primary);">Plan:</strong> ${paciente.alimentacion || "No asignada"}
          </p>
          <p style="color: var(--text-secondary);">
            <img src="assets/icons/pesasVerde.png" alt="Ejercicio" class="card-icon">
            <strong style="color: var(--text-primary);">Rutina:</strong> ${paciente.ejercicio ? "Asignada (Ver detalle)" : "No asignado"}
          </p>
        </div>
        <div class="card-footer" style="border-top: 1px solid var(--border-color);">
          <button class="btn-perfil" data-id="${paciente.id}" style="background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color);">
            <img src="assets/icons/perfilVerde.png" alt="Perfil" class="btn-icon"> Ver Perfil / Editar
          </button>
          <button class="btn-delete" data-id="${paciente.id}" style="background: var(--btn-bg); border: 1px solid var(--border-color);">
            <img src="assets/icons/eliminarRojo.png" alt="Eliminar" class="btn-icon">
          </button>
        </div>
      </div>
    `,
      )
      .join("");

    this.setupCardActions();
  }

  renderSugerencias(filtrados) {
    const dropdown = this.querySelector("#search-dropdown");
    if (!dropdown) return;

    if (filtrados.length === 0) {
      dropdown.innerHTML = `<div class="dropdown-item empty" style="color: var(--text-muted);">No se encontraron pacientes</div>`;
      dropdown.style.display = "block";
      return;
    }

    dropdown.innerHTML = filtrados
      .map(
        (p) => `
      <div class="dropdown-item" data-id="${p.id}" style="border-bottom: 1px solid var(--border-dropdown); background: var(--bg-card);">
        <span class="dropdown-name" style="color: var(--text-primary);">${p.nombre}</span>
        <span class="dropdown-id" style="color: var(--text-muted);">ID: ${p.id}</span>
      </div>
    `,
      )
      .join("");

    dropdown.style.display = "block";

    dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        const seleccionado = this.pacientes.find(
          (p) => p.id === id || p.id == id,
        );
        if (seleccionado) {
          this.pacienteSeleccionado = seleccionado;
          this.vistaPerfil = true;
          this.editandoTratamiento = false;
          dropdown.style.display = "none";
          this.querySelector("#search-input").value = "";
          this.renderDinamico();
        }
      });
    });
  }

  renderMiniPerfil() {
    const container = this.querySelector("#main-workspace");
    if (!container) return;

    const p = this.pacienteSeleccionado;
    const diasSemana = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
      "Domingo",
    ];

    container.innerHTML = `
      <div class="mini-perfil-modal-view perfil-vista-ampliada" style="text-align: left; background: var(--bg-card); color: var(--text-primary);">
        <div class="mini-perfil-close-row">
          <button id="btn-cerrar-perfil" class="close-x-btn" style="color: var(--text-primary);">×</button>
        </div>

        <!-- ENCABEZADO -->
        <div class="mini-perfil-card-header" style="border-bottom: 1px solid var(--border-color);">
          <div class="mp-avatar-container">
            <div class="avatar large-avatar" style="background: var(--bg-avatar-large); color: var(--text-primary);">${p.iniciales || "P"}</div>
          </div>
          <div class="mp-user-info">
            <h2 style="color: var(--text-primary);">${p.nombre}</h2>
            <span class="paciente-id" style="color: var(--text-muted);">ID: ${p.id}</span>
          </div>
          <div class="mp-meta-data">
            <div>
              <span class="meta-label" style="color: var(--text-muted);">EDAD</span>
              <p class="meta-value" style="color: var(--text-secondary);">${p.edad || "N/A"}</p>
            </div>
            <div>
              <span class="meta-label" style="color: var(--text-muted);">TELÉFONO</span>
              <p class="meta-value" style="color: var(--text-secondary);">${p.telefono || "N/A"}</p>
            </div>
          </div>
        </div>

        <!-- SECCIÓN TRATAMIENTO ALINEADA A LA IZQUIERDA -->
        <div class="mini-perfil-tratamientos-section" style="text-align: left;">
          
          <!-- FILA DE BOTONES DE ACCIÓN -->
          <div class="section-title-row modification-buttons-bar" style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button id="btn-add-treatment" class="btn-primary-sm" style="background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color);">Añadir tratamiento</button>
            <button id="btn-add-exercise-modular" class="btn-primary-sm" style="background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color);">Añadir ejercicios</button>
          </div>
          
          <h3 style="margin-bottom: 15px; color: var(--text-primary);">Tratamiento asignado</h3>

          <div class="mp-tratamiento-content-box" style="background: var(--bg-body); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
            ${
              this.editandoTratamiento
                ? `
              <!-- FORMULARIO MODULAR PARA TRATAMIENTO BASE -->
              <form id="form-asignar-tratamiento" class="form-perfil-modular" style="display: flex; flex-direction: column; gap: 15px;">
                <div class="form-group">
                  <label style="font-weight: bold; display: block; margin-bottom: 5px; color: var(--text-primary);">Objetivo del Paciente</label>
                  <input type="text" id="input-objetivo" value="${p.tratamiento || ""}" style="width: 100%; padding: 8px; background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--form-border);" required>
                </div>
                <div class="form-group">
                  <label style="font-weight: bold; display: block; margin-bottom: 5px; color: var(--text-primary);">Plan Alimenticio Base</label>
                  <input type="text" id="input-plan" value="${p.alimentacion || ""}" style="width: 100%; padding: 8px; background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--form-border);" required>
                </div>
                <div class="form-group">
                  <label style="font-weight: bold; display: block; margin-bottom: 5px; color: var(--text-primary);">Descripción del Ejercicio (Vistazo Rápido)</label>
                  <textarea id="input-ejercicio-desc" style="width: 100%; padding: 8px; height: 60px; background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--form-border);" placeholder="Ej. Cardio moderado y enfoque en fuerza...">${p.ejercicioDescripcion || ""}</textarea>
                </div>

                <div style="margin-top: 5px;">
                  <button type="button" id="btn-abrir-excel" class="btn-primary-sm" style="background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color);">Añadir menú</button>
                </div>

                <div class="form-actions-row" style="margin-top: 10px;">
                  <button type="submit" id="btn-guardar-base" class="btn-primary-sm" style="background: var(--color-brand); color: var(--text-primary); border: none;">Guardar Tratamiento</button>
                  <button type="button" id="btn-cancelar-tratamiento" class="btn-perfil" style="margin-left: 10px; background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color);">Cancelar</button>
                </div>
              </form>
            `
                : `
              <!-- TARJETA INFERIOR: CONTENIDO CARGADO A LA IZQUIERDA -->
              <div class="tratamiento-activo-detalle" style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
                
                <div class="datos-plan-izquierda" style="flex-grow: 1; line-height: 1.6; color: var(--text-secondary);">
                  <div class="mp-row-info">
                    <strong style="color: var(--text-primary);">Objetivo del paciente:</strong>
                    <p style="margin: 4px 0 12px 0;">${p.tratamiento || "No se ha definido un objetivo."}</p>
                  </div>
                  <div class="mp-row-info">
                    <strong style="color: var(--text-primary);">Plan alimenticio:</strong>
                    <p style="margin: 4px 0 12px 0;">${p.alimentacion || "Ningún plan asignado a este perfil."}</p>
                  </div>
                  <div class="mp-row-info">
                    <strong style="color: var(--text-primary);">Descripción de ejercicios (Tipo):</strong>
                    <p style="margin: 4px 0 12px 0;">${p.ejercicioDescripcion || "Sin descripción corta."}</p>
                  </div>
                </div>

                <div class="botones-accion-derecha" style="display: flex; gap: 10px; flex-shrink: 0; margin-left: 20px;">
                  <button id="btn-ver-ejercicios" class="btn-primary-sm" style="background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color);">Ver ejercicios</button>
                  <button id="btn-ver-menu" class="btn-primary-sm" style="background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color);">Ver menú completo</button>
                </div>

              </div>
            `
            }
          </div>
        </div>
      </div>

      <!-- APARTADO MODAL/VENTANA COMPLETA INTERACTIVA PARA EL EXCEL -->
      ${
        this.viendoModalExcel
          ? `
        <div class="excel-fullscreen-modal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--bg-modal-overlay); display: flex; justify-content: center; align-items: center; z-index: 9999;">
          <div class="excel-modal-content" style="background: var(--bg-card); width: 95%; max-width: 1500px; height: 90vh; border-radius: 12px; padding: 25px; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 style="margin: 0; color: var(--text-primary);">
                Planificación del Menú Semanal — ${p.nombre} ${this.modoModalSoloLectura ? "(Vista de consulta)" : ""}
              </h3>
              <button id="btn-close-excel-modal" style="background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted);">&times;</button>
            </div>
            
            <div style="overflow: auto; flex-grow: 1; border: 1px solid var(--table-border); border-radius: 4px; margin-bottom: 15px; background: var(--bg-body);">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; min-width: 1100px;">
                <thead>
                  <tr style="background: var(--table-header-bg); position: sticky; top: 0; z-index: 10;">
                    <th style="border: 1px solid var(--table-border); padding: 12px; width: 200px; color: var(--text-primary);">Comida / Horario</th>
                    ${diasSemana.map((d) => `<th style="border: 1px solid var(--table-border); padding: 12px; color: var(--text-primary);">${d}</th>`).join("")}
                  </tr>
                </thead>
                <tbody id="tbody-excel-rows">
                  ${(p.menuExcel && p.menuExcel.length > 0
                    ? p.menuExcel
                    : [
                        { comida: "Desayuno" },
                        { comida: "Media Mañana" },
                        { comida: "Comida" },
                        { comida: "Merienda" },
                        { comida: "Cena" },
                      ]
                  )
                    .map(
                      (fila, index) => `
                    <tr style="background: ${index % 2 === 0 ? "var(--bg-card)" : "var(--table-first-col-bg)"}">
                      <td style="border: 1px solid var(--table-border); padding: 6px; background: var(--table-first-col-bg); vertical-align: middle;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                          ${
                            !this.modoModalSoloLectura
                              ? `
                            <button type="button" class="btn-delete-row" data-index="${index}" style="background: none; border: none; cursor: pointer; padding: 0 4px; display: flex; align-items: center;">
                              <img src="assets/icons/eliminarRojo.png" alt="Eliminar Fila" class="excel-row-delete-icon" style="width: 16px; height: 16px;">
                            </button>
                          `
                              : ""
                          }
                          <input type="text" class="excel-cell-input row-meal-name" value="${fila.comida || ""}" 
                            ${this.modoModalSoloLectura ? "disabled" : ""} 
                            style="width: 100%; border: none; font-weight: bold; background: transparent; outline: none; color: var(--text-primary);">
                        </div>
                      </td>
                      ${diasSemana
                        .map(
                          (d) => `
                        <td style="border: 1px solid var(--table-border); padding: 6px; vertical-align: top;">
                          <textarea class="excel-cell-input row-day-value" data-dia="${d}"
                            ${this.modoModalSoloLectura ? "disabled" : ""} 
                            style="width: 100%; border: none; background: transparent; outline: none; font-family: inherit; font-size: 13px; resize: none; overflow: hidden; display: block; box-sizing: border-box; color: var(--text-secondary);"
                            rows="2"
                            oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px';"
                          >${fila[d] || ""}</textarea>
                        </td>
                      `,
                        )
                        .join("")}
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                ${
                  !this.modoModalSoloLectura
                    ? `
                  <button type="button" id="btn-excel-add-row" class="btn-perfil" style="background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color); padding: 8px 15px; border-radius: 5px;">+ Añadir Fila Personalizada</button>
                `
                    : '<span style="color: var(--text-muted); font-size: 13px; font-style: italic;">Modo de solo lectura activado. Para modificar, entra en "Añadir tratamiento".</span>'
                }
              </div>
              <div style="display: flex; gap: 10px;">
                ${
                  !this.modoModalSoloLectura
                    ? `
                  <button type="button" id="btn-excel-save" class="btn-primary-sm" style="padding: 10px 20px; background: var(--color-brand); color: var(--text-primary); border: none;">Guardar Tabla de Menú</button>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      `
          : ""
      }

      <!-- MODAL DE PLANIFICACIÓN DE EJERCICIOS -->
      ${
        this.viendoModalEjercicios
          ? `
        <div class="exercise-fullscreen-modal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--bg-modal-overlay); display: flex; justify-content: center; align-items: center; z-index: 9999;">
          <div class="exercise-modal-content" style="background: var(--bg-card); width: 90%; max-width: 700px; border-radius: 12px; padding: 25px; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 style="margin: 0; color: var(--text-primary);">
                ${this.modoModalSoloLectura ? "Rutina de Ejercicios" : "Asignar Notas de Ejercicios"} — ${p.nombre}
              </h3>
              <button id="btn-close-exercise-modal" style="background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted);">&times;</button>
            </div>

            <div style="margin-bottom: 20px; flex-grow: 1;">
              ${
                this.modoModalSoloLectura
                  ? `
                <div style="background: var(--bg-body); border: 1px solid var(--border-color); border-radius: 6px; padding: 15px; min-height: 200px; max-height: 450px; overflow-y: auto; white-space: pre-line; line-height: 1.6; font-size: 14px; color: var(--text-secondary);">
                  ${p.ejercicio ? p.ejercicio : `<span style="color: var(--text-muted); font-style: italic;">No se han asignado ejercicios todavía.</span>`}
                </div>
              `
                  : `
                <label style="font-weight: bold; display: block; margin-bottom: 8px; font-size: 14px; color: var(--text-primary);">Escribe los ejercicios, series y repeticiones:</label>
                <!-- ID corregido aquí a 'textarea-notes-ejercicio' -->
                <textarea id="textarea-notes-ejercicio" 
                  placeholder="Escribe un ejercicio y presiona Enter para crear otra viñeta..." 
                  style="width: 100%; height: 250px; padding: 12px; border: 1px solid var(--form-border); background: var(--bg-body); color: var(--text-secondary); border-radius: 6px; font-family: inherit; font-size: 14px; line-height: 1.6; resize: vertical; outline: none; box-sizing: border-box;"
                >${p.ejercicio || "• "}</textarea>
                <span style="font-size: 12px; color: var(--text-muted); display: block; margin-top: 4px;">Cada salto de línea agregará un punto (•) de forma automática para mantener el orden.</span>
              `
              }
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              ${
                !this.modoModalSoloLectura
                  ? `
                <button type="button" id="btn-save-exercise" class="btn-primary-sm" style="padding: 10px 20px; background: var(--color-brand); color: var(--text-primary); border: none;">Guardar Ejercicios</button>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      `
          : ""
      }
    `;

    if (this.viendoModalExcel) {
      setTimeout(() => {
        this.querySelectorAll("#tbody-excel-rows textarea").forEach((el) => {
          el.style.height = "";
          el.style.height = el.scrollHeight + "px";
        });
      }, 40);
    }

    if (this.viendoModalEjercicios && !this.modoModalSoloLectura) {
      const tx = this.querySelector("#textarea-notes-ejercicio");
      if (tx) {
        tx.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const start = tx.selectionStart;
            const end = tx.selectionEnd;
            const value = tx.value;
            tx.value =
              value.substring(0, start) + "\n• " + value.substring(end);
            tx.selectionStart = tx.selectionEnd = start + 3;
          }
        });
      }
    }

    this.setupEventListenersPerfil();
  }

  renderSeccionAsignar() {
    const container = this.querySelector("#main-workspace");
    if (!container) return;

    container.innerHTML = `
      <header class="content-header">
        <div class="header-text">
          <h1 style="color: var(--text-primary);">Asignar Nuevo Tratamiento</h1>
          <p style="color: var(--text-secondary);">Busca directamente al paciente en el sistema para iniciar la configuración de su nuevo plan modular.</p>
        </div>
        <button id="btn-regresar" class="btn-perfil" style="background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color);">Volver al listado</button>
      </header>

      <section class="search-bar-section">
        <div class="search-input-wrapper" style="position: relative;">
          <img src="assets/icons/Busqueda.png" alt="Buscar" class="search-icon">
          <input type="text" id="search-asignar-input" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--form-border);" placeholder="Escribe el nombre del paciente para asignación directa...">
        </div>
      </section>

      <section class="tratamientos-section">
        <div id="resultado-busqueda-asignar" class="pacientes-grid">
          <div class="status-message" style="color: var(--text-muted);"><p>Escribe en el buscador para localizar al paciente.</p></div>
        </div>
      </section>
    `;

    this.setupEventListenersAsignar();
  }

  render() {
    this.innerHTML = `
      <div class="gestion-tratamientos-container" style="background: var(--bg-body);">
        <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
        
        <div class="main-content-wrapper" id="main-workspace">
          <header class="content-header">
            <div class="header-text">
              <h1 style="color: var(--text-primary);">Gestión de Tratamientos</h1>
              <p style="color: var(--text-secondary);">Busca un paciente, abre su mini-perfil y edita su menú alimenticio o ejercicio opcional de forma modular.</p>
            </div>
          </header>

          <section class="search-bar-section">
            <div class="search-container-relative" style="position: relative; flex-grow: 1;">
              <div class="search-input-wrapper">
                <img src="assets/icons/Busqueda.png" alt="Buscar" class="search-icon">
                <input type="text" id="search-input" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--form-border);" placeholder="Buscar paciente por nombre..." autocomplete="off">
              </div>
              <div id="search-dropdown" class="search-suggest-dropdown" style="display: none; background: var(--bg-card); border: 1px solid var(--border-dropdown);"></div>
            </div>
            
            <button id="btn-asignar-nuevo" class="btn-primary" style="background: var(--color-brand); color: var(--text-primary); border: none;">
              <img src="assets/icons/añadir.png" alt="Nuevo" class="btn-icon-white"> Nuevo Tratamiento
            </button>
          </section>

          <section class="tratamientos-section">
            <h2 style="color: var(--text-primary);">
              <img src="assets/icons/reciente.png" alt="Historial" class="section-icon"> 
              Tratamientos Recientes y Activos
            </h2>
            <div id="pacientes-container" class="pacientes-grid"></div>
          </section>
        </div>
      </div>
    `;

    this.setupEventListenersPrincipal();
    this.renderDinamico();
  }

  setupEventListenersPrincipal() {
    const searchInput = this.querySelector("#search-input");
    const dropdown = this.querySelector("#search-dropdown");
    const btnAsignarNuevo = this.querySelector("#btn-asignar-nuevo");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query === "") {
          if (dropdown) dropdown.style.display = "none";
          return;
        }

        const filtrados = this.pacientes.filter(
          (paciente) =>
            !paciente.tieneTratamiento &&
            paciente.nombre.toLowerCase().includes(query),
        );

        this.renderSugerencias(filtrados);
      });

      document.addEventListener("click", (e) => {
        if (!this.contains(e.target) && dropdown) {
          dropdown.style.display = "none";
        }
      });
    }

    if (btnAsignarNuevo) {
      btnAsignarNuevo.addEventListener("click", () => {
        this.vistaAsignar = true;
        this.vistaPerfil = false;
        this.renderDinamico();
      });
    }
  }

  setupEventListenersAsignar() {
    const btnRegresar = this.querySelector("#btn-regresar");
    const searchAsignar = this.querySelector("#search-asignar-input");
    const resultadosContainer = this.querySelector(
      "#resultado-busqueda-asignar",
    );

    if (btnRegresar) {
      btnRegresar.addEventListener("click", () => {
        this.vistaAsignar = false;
        this.render();
      });
    }

    if (searchAsignar && resultadosContainer) {
      searchAsignar.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query === "") {
          resultadosContainer.innerHTML = `<div class="status-message" style="color: var(--text-muted);"><p>Escribe en el buscador para localizar al paciente.</p></div>`;
          return;
        }

        const filtrados = this.pacientes.filter(
          (paciente) =>
            !paciente.tieneTratamiento &&
            paciente.nombre.toLowerCase().includes(query),
        );

        if (filtrados.length === 0) {
          resultadosContainer.innerHTML = `<div class="status-message no-results" style="color: var(--text-muted);"><p>No se encontraron pacientes.</p></div>`;
          return;
        }

        resultadosContainer.innerHTML = filtrados
          .map(
            (paciente) => `
          <div class="paciente-card" data-id="${paciente.id}">
            <div class="card-header" style="border-bottom: 1px solid var(--border-color);">
              <div class="avatar" style="background: var(--bg-avatar-large); color: var(--text-primary);">${paciente.iniciales || "P"}</div>
              <div class="paciente-info">
                <h3 style="color: var(--text-primary);">${paciente.nombre}</h3>
                <span class="paciente-id" style="color: var(--text-muted);">ID: ${paciente.id}</span>
              </div>
            </div>
            <div class="card-footer" style="border-top: 1px solid var(--border-color);">
              <button class="btn-primary btn-seleccionar-directo" data-id="${paciente.id}" style="width: 100%; justify-content: center; background: var(--color-brand); color: var(--text-primary); border: none;">
                Seleccionar Paciente
              </button>
            </div>
          </div>
        `,
          )
          .join("");

        this.setupAccionesAsignarDirecto();
      });
    }
  }

  setupEventListenersPerfil() {
    const p = this.pacienteSeleccionado;
    if (!p) return;

    this.querySelector("#btn-cerrar-perfil")?.addEventListener("click", () => {
      this.vistaPerfil = false;
      this.editandoTratamiento = false;
      this.viendoModalExcel = false;
      this.viendoModalEjercicios = false;
      this.pacienteSeleccionado = null;
      this.render();
    });

    this.querySelector("#btn-add-treatment")?.addEventListener("click", () => {
      this.editandoTratamiento = true;
      this.renderMiniPerfil();
    });

    this.querySelector("#btn-add-exercise-modular")?.addEventListener(
      "click",
      () => {
        this.modoModalSoloLectura = false;
        this.viendoModalEjercicios = true;
        this.renderMiniPerfil();
      },
    );

    this.querySelector("#btn-cancelar-tratamiento")?.addEventListener(
      "click",
      () => {
        this.editandoTratamiento = false;
        this.renderMiniPerfil();
      },
    );

    // 4. GUARDAR TRATAMIENTO BASE (Petición PUT al servidor)
    this.querySelector("#form-asignar-tratamiento")?.addEventListener(
      "submit",
      async (e) => {
        e.preventDefault();

        const btnGuardar = this.querySelector("#btn-guardar-base");
        const textoOriginal = btnGuardar.textContent;
        btnGuardar.textContent = "Guardando...";
        btnGuardar.disabled = true;

        const payload = {
          objetivo: this.querySelector("#input-objetivo").value,
          alimentacion: this.querySelector("#input-plan").value,
          ejercicioDescripcion: this.querySelector("#input-ejercicio-desc")
            .value,
        };

        try {
          const response = await fetch(`${this.apiUrl}/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok)
            throw new Error("Fallo al actualizar el tratamiento base");

          // Actualizamos los datos en memoria
          p.objetivo = payload.objetivo;
          p.tratamiento = payload.objetivo;
          p.alimentacion = payload.alimentacion;
          p.ejercicioDescripcion = payload.ejercicioDescripcion;
          p.tieneTratamiento = true; // <--- ¡AQUÍ NACE COMO PACIENTE ACTIVO!

          // Lo metemos al arreglo de recientes para que aparezca en el Grid
          if (!this.pacientesRecientes.some((pac) => pac.id === p.id)) {
            this.pacientesRecientes.push(p);
          } else {
            this.pacientesRecientes = this.pacientesRecientes.map((pac) =>
              pac.id === p.id ? p : pac,
            );
          }

          this.editandoTratamiento = false;
          this.renderDinamico(); // Actualiza la pantalla para que aparezca en la tarjeta
          this.renderMiniPerfil();
        } catch (error) {
          console.error(error);
          alert("Error al intentar guardar el tratamiento en el servidor.");
          btnGuardar.textContent = textoOriginal;
          btnGuardar.disabled = false;
        }
      },
    );

    this.querySelector("#btn-abrir-excel")?.addEventListener("click", () => {
      this.modoModalSoloLectura = false;
      this.viendoModalExcel = true;
      this.renderMiniPerfil();
    });

    this.querySelector("#btn-ver-menu")?.addEventListener("click", () => {
      this.modoModalSoloLectura = true;
      this.viendoModalExcel = true;
      this.renderMiniPerfil();
    });

    this.querySelector("#btn-ver-ejercicios")?.addEventListener("click", () => {
      this.modoModalSoloLectura = true;
      this.viendoModalEjercicios = true;
      this.renderMiniPerfil();
    });

    if (this.viendoModalExcel) {
      this.querySelector("#btn-close-excel-modal")?.addEventListener(
        "click",
        () => {
          this.viendoModalExcel = false;
          this.renderMiniPerfil();
        },
      );

      this.querySelector("#btn-excel-add-row")?.addEventListener(
        "click",
        () => {
          this.sincronizarEstructuraExcelTemporal();
          if (!p.menuExcel) p.menuExcel = [];
          p.menuExcel.push({
            comida: "Nueva Fila",
            Lunes: "",
            Martes: "",
            Miercoles: "",
            Jueves: "",
            Viernes: "",
            Sabado: "",
            Domingo: "",
          });
          this.renderMiniPerfil();
        },
      );

      this.querySelectorAll(".btn-delete-row").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.sincronizarEstructuraExcelTemporal();
          const index = parseInt(
            e.currentTarget.getAttribute("data-index"),
            10,
          );
          if (p.menuExcel && p.menuExcel[index]) {
            p.menuExcel.splice(index, 1);
            this.renderMiniPerfil();
          }
        });
      });

      // 5. GUARDAR MENÚ EXCEL (Petición PUT al servidor)
      // 5. GUARDAR MENÚ EXCEL (Petición PUT al servidor)
      this.querySelector("#btn-excel-save")?.addEventListener(
        "click",
        async (e) => {
          const btn = e.currentTarget;
          const textoOriginal = btn.textContent;
          btn.textContent = "Guardando...";
          btn.disabled = true;

          this.sincronizarEstructuraExcelTemporal();

          try {
            const response = await fetch(`${this.apiUrl}/${p.id}/menu`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },

              body: JSON.stringify({ menuExcel: JSON.stringify(p.menuExcel) }),
            });

            if (!response.ok) throw new Error("Fallo al guardar el menú");

            this.viendoModalExcel = false;
            this.renderMiniPerfil();
          } catch (error) {
            console.error(error);
            alert("Error al guardar el menú de dieta en el servidor.");
            btn.textContent = textoOriginal;
            btn.disabled = false;
          }
        },
      );
    }

    if (this.viendoModalEjercicios) {
      this.querySelector("#btn-close-exercise-modal")?.addEventListener(
        "click",
        () => {
          this.viendoModalEjercicios = false;
          this.renderMiniPerfil();
        },
      );

      // 6. GUARDAR RUTINA DE EJERCICIOS (Petición PUT al servidor)
      this.querySelector("#btn-save-exercise")?.addEventListener(
        "click",
        async (e) => {
          const btn = e.currentTarget;
          const textoOriginal = btn.textContent;
          btn.textContent = "Guardando...";
          btn.disabled = true;

          const txtValue = this.querySelector(
            "#textarea-notes-ejercicio",
          )?.value;
          const nuevoEjercicio =
            txtValue && txtValue.trim() !== "•" ? txtValue.trim() : "";

          try {
            const response = await fetch(`${this.apiUrl}/${p.id}/ejercicio`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ejercicio: nuevoEjercicio }),
            });

            if (!response.ok) throw new Error("Fallo al guardar ejercicios");

            p.ejercicio = nuevoEjercicio;
            this.pacientesRecientes = this.pacientesRecientes.map((pac) =>
              pac.id === p.id ? p : pac,
            );

            this.viendoModalEjercicios = false;
            this.renderMiniPerfil();
          } catch (error) {
            console.error(error);
            alert("Error al guardar las rutinas en el servidor.");
            btn.textContent = textoOriginal;
            btn.disabled = false;
          }
        },
      );
    }
  }

  sincronizarEstructuraExcelTemporal() {
    const p = this.pacienteSeleccionado;
    const filasHtml = this.querySelectorAll("#tbody-excel-rows tr");
    const diasSemana = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
      "Domingo",
    ];
    const nuevoMenuExcel = [];

    filasHtml.forEach((tr) => {
      const inputComida = tr.querySelector(".row-meal-name");
      if (!inputComida) return;

      const filaObjeto = { comida: inputComida.value };
      const inputsDias = tr.querySelectorAll(".row-day-value");

      inputsDias.forEach((input, index) => {
        const dia = diasSemana[index];
        filaObjeto[dia] = input.value;
      });

      nuevoMenuExcel.push(filaObjeto);
    });

    p.menuExcel = nuevoMenuExcel;
  }

  setupCardActions() {
    this.querySelectorAll(".btn-perfil").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const pacienteId = e.currentTarget.getAttribute("data-id");
        const encontrado = this.pacientes.find(
          (p) => p.id === pacienteId || p.id == pacienteId,
        );
        if (encontrado) {
          this.pacienteSeleccionado = encontrado;
          this.vistaPerfil = true;
          this.editandoTratamiento = false;
          this.renderDinamico();
        }
      });
    });

    // 7. ELIMINAR PACIENTE (Petición DELETE real)
    this.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const pacienteId = e.currentTarget.getAttribute("data-id");
        const confirmar = confirm(
          `¿Estás seguro? ¿Quieres eliminar el tratamiento de este paciente?`,
        );

        if (confirmar) {
          try {
            const response = await fetch(`${this.apiUrl}/${pacienteId}`, {
              method: "DELETE",
            });

            if (!response.ok) throw new Error("Error al eliminar del servidor");

            this.pacientesRecientes = this.pacientesRecientes.filter(
              (p) => p.id !== pacienteId && p.id != pacienteId,
            );
            this.pacientes = this.pacientes.filter(
              (p) => p.id !== pacienteId && p.id != pacienteId,
            );

            this.renderListaRecientes();
          } catch (error) {
            console.error("No se pudo borrar en el servidor.", error);
            alert("No se pudo eliminar al paciente de la base de datos.");
          }
        }
      });
    });
  }

  setupAccionesAsignarDirecto() {
    this.querySelectorAll(".btn-seleccionar-directo").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const pacienteId = e.currentTarget.getAttribute("data-id");
        const encontrado = this.pacientes.find(
          (p) => p.id === pacienteId || p.id == pacienteId,
        );
        if (encontrado) {
          this.pacienteSeleccionado = encontrado;
          this.vistaAsignar = false;
          this.vistaPerfil = true;
          this.editandoTratamiento = true;
          this.renderDinamico();
        }
      });
    });
  }
}

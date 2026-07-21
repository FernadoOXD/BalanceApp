const crearFilaRegistro24hVacia = (
  comida = "",
  colIds = [
    "comida",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ],
) => {
  const row = {};
  colIds.forEach((id, idx) => {
    row[id] = idx === 0 ? comida : "";
  });
  return row;
};

const crearFilaFrecuenciaVacia = (
  grupo = "",
  colIds = ["grupoAlimento", "frecuencia", "observaciones"],
) => {
  const row = {};
  colIds.forEach((id, idx) => {
    row[id] = idx === 0 ? grupo : "";
  });
  return row;
};

const crearExpedienteVacio = () => {
  const colFrecuenciaDefault = [
    { id: "grupoAlimento", nombre: "Grupo Alimentario" },
    { id: "frecuencia", nombre: "Frecuencia" },
    { id: "observaciones", nombre: "Observaciones" },
  ];
  const colRegistroDefault = [
    { id: "comida", nombre: "Comida / Horario" },
    { id: "lunes", nombre: "Lunes" },
    { id: "martes", nombre: "Martes" },
    { id: "miercoles", nombre: "Miércoles" },
    { id: "jueves", nombre: "Jueves" },
    { id: "viernes", nombre: "Viernes" },
    { id: "sabado", nombre: "Sábado" },
    { id: "domingo", nombre: "Domingo" },
  ];

  return {
    fecha: new Date().toISOString().split("T")[0],
    nombrePaciente: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    sexo: "Femenino",
    edad: "",
    ocupacion: "",
    procedencia: "",
    escolaridad: "",
    ejercicio: "",
    objetivo: "",
    altura: "",
    peso: "",
    talla: "",
    imc: "",
    cintura: "",
    clinicos: {
      alcohol: "No",
      tabaco: "No",
      habitosToxicos: "• ",
      patologias: "",
      gastritis: "No",
      colitis: "No",
      estrenimiento: "No",
      hemorroides: "No",
      medicamentos: "",
      alergias: "• ",
      antecedentesFamiliares: "• ",
    },
    antropometria: {
      biceps: "",
      triceps: "",
      suprailiaco: "",
      musloPliegue: "",
      piernaPliegue: "",
      brazoContraido: "",
      brazoRelajado: "",
      antebrazo: "",
      muneca: "",
      cadera: "",
      musloCinta: "",
      pantorrilla: "",
      tobillo: "",
      humero: "",
      rodilla: "",
    },
    columnasFrecuencia: colFrecuenciaDefault,
    frecuenciaAlimentos: [
      crearFilaFrecuenciaVacia("Lácteos", colFrecuenciaDefault.map((c) => c.id)),
      crearFilaFrecuenciaVacia("Leguminosas", colFrecuenciaDefault.map((c) => c.id)),
      crearFilaFrecuenciaVacia("Carnes/Pescados", colFrecuenciaDefault.map((c) => c.id)),
      crearFilaFrecuenciaVacia("Cereales", colFrecuenciaDefault.map((c) => c.id)),
    ],
    columnasRegistro24h: colRegistroDefault,
    recordatorio24h: [
      crearFilaRegistro24hVacia("Desayuno", colRegistroDefault.map((c) => c.id)),
      crearFilaRegistro24hVacia("Media Mañana", colRegistroDefault.map((c) => c.id)),
      crearFilaRegistro24hVacia("Comida", colRegistroDefault.map((c) => c.id)),
      crearFilaRegistro24hVacia("Merienda", colRegistroDefault.map((c) => c.id)),
      crearFilaRegistro24hVacia("Cena", colRegistroDefault.map((c) => c.id)),
    ],
    diagnosticoGeneral: "",
    observaciones: "• ",
  };
};

export class ListPacientesEspecialistaPage extends HTMLElement {
  constructor() {
    super();
    this.vistaActual = "lista";
    this.pacienteSeleccionado = null;
    this.mostrarModalDiagnostico = false;

    // Control para modal de resumen de citas pasadas
    this.mostrarModalResumenCita = false;
    this.citaSeleccionadaDetalle = null;

    // Control para modal de cita programada
    this.mostrarModalCitaProgramada = false;
    this.citaProgramadaActual = null;

    this.limitePacientes = 3;
    this.limiteCitas = 4;

    // ARREGLOS 100% VACÍOS (Aguardando respuesta del servidor)
    this.pacientes = [];
    this.todasLasCitas = [];
    this.historialExpedientes = [];
    this.expedientes = {};

    this.tablaRegistro24hTemporal = [];
    this.tablaFrecuenciaTemporal = [];
    this.columnasFrecuenciaTemporal = [];
    this.columnasRegistro24hTemporal = [];

    this.cerrarMenuContextualGlobal = this.cerrarMenuContextualGlobal.bind(this);
  }

  async connectedCallback() {
    await this.cargarPacientesDesdeBackend();
    await this.cargarCitasDesdeBackend();
    this.render();
    document.addEventListener("click", this.cerrarMenuContextualGlobal);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.cerrarMenuContextualGlobal);
  }

  // ==========================================
  // CONEXIÓN CON EL BACKEND (MÉTODOS API)
  // ==========================================
  async cargarPacientesDesdeBackend() {
    try {
      const respuesta = await fetch("http://localhost:5000/api/paciente");
      if (respuesta.ok) {
        const listaBD = await respuesta.json();
        if (Array.isArray(listaBD)) {
          this.pacientes = listaBD.map((p) => {
            const nombreCompleto = `${p.nombre || ''} ${p.apellidoPaterno || ''}`.trim() || p.nombrePaciente || "Paciente";
            const inis = (p.nombre ? p.nombre[0] : "P") + (p.apellidoPaterno ? p.apellidoPaterno[0] : "");
            return {
              id: p.idPaciente || p.id || "PAC-000",
              nombre: nombreCompleto,
              iniciales: inis.toUpperCase(),
              avatar: p.avatar || "assets/avatars/carlos.png",
              ultimoReporte: p.ultimoReporte || "Sin registros",
              estado: p.estado || "Activo",
              esNuevo: p.esNuevo || false,
            };
          });
        }
      }
    } catch (error) {
      console.warn("No se pudo conectar a /api/paciente.", error);
    }
  }

  async cargarCitasDesdeBackend() {
    try {
      const respuesta = await fetch("http://localhost:5000/api/cita");
      if (respuesta.ok) {
        const citasBD = await respuesta.json();
        if (Array.isArray(citasBD)) {
          this.todasLasCitas = citasBD;
        }
      }
    } catch (error) {
      console.warn("No se pudo obtener las citas de Javalin.", error);
    }
  }

  async obtenerExpedienteDelBackend(pacienteId) {
    try {
      const respuesta = await fetch(`http://localhost:5000/api/expediente/${pacienteId}`);
      if (respuesta.ok) {
        const datosExpediente = await respuesta.json();
        this.expedientes[pacienteId] = datosExpediente;
      }
    } catch (error) {
      console.error("Error al consultar expediente:", error);
    }
  }

  async obtenerDetallesCitaBackend(citaId, pacienteId, fechaIso) {
    try {
      const expCoincidente = this.historialExpedientes.find(
        (entry) => entry.pacienteId === pacienteId && entry.datos.fecha === fechaIso
      );

      if (expCoincidente) {
        return {
          peso: expCoincidente.datos.peso || "---",
          imc: expCoincidente.datos.imc || "---",
          grasa: "---",
          cintura: expCoincidente.datos.cintura || "---",
          diagnostico: expCoincidente.datos.diagnosticoGeneral || "Sin diagnóstico.",
          observaciones: expCoincidente.datos.observaciones || "Sin notas.",
        };
      }
      return null;
    } catch (error) {
      console.error("Error pidiendo detalles de cita:", error);
      return null;
    }
  }

  esPacienteNuevo(pacienteId) {
    const citasPaciente = this.todasLasCitas.filter(
      (c) => (c.pacienteId === pacienteId || c.idPaciente === pacienteId) && 
             (c.estatus === "Activo" || c.estatus === "Confirmada" || c.estatus === "Completada")
    );
    const expedientesPaciente = this.historialExpedientes.filter(
      (entry) => entry.pacienteId === pacienteId
    );
    return citasPaciente.length <= 1 && expedientesPaciente.length <= 1;
  }

  formatearFechaEs(fechaStr) {
    if (!fechaStr) return "---";
    const partes = String(fechaStr).split("-");
    if (partes.length === 3) {
      const mesIdx = parseInt(partes[1], 10);
      const mesNombre = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ][mesIdx - 1] || partes[1];
      return `${partes[2]} de ${mesNombre} de ${partes[0]}`;
    }
    return fechaStr;
  }

  setupAutoResizeTextareas() {
    setTimeout(() => {
      const textareas = this.querySelectorAll(".textarea-dinamica");
      textareas.forEach((textarea) => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.addEventListener("input", () => {
          textarea.style.height = "auto";
          textarea.style.height = `${textarea.scrollHeight}px`;
        });
      });
    }, 0);
  }

  setupBulletTextareas() {
    const bulletFields = this.querySelectorAll(".textarea-bullet");
    bulletFields.forEach((textarea) => {
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const value = textarea.value;
          textarea.value = value.substring(0, start) + "\n• " + value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 3;
          textarea.dispatchEvent(new Event("input"));
        }
      });
    });
  }

  async cambiarVista(nuevaVista, idPaciente = null) {
    this.vistaActual = nuevaVista;
    this.mostrarModalDiagnostico = false;
    this.mostrarModalResumenCita = false;
    this.mostrarModalCitaProgramada = false;

    if (idPaciente) {
      this.pacienteSeleccionado = this.pacientes.find((p) => p.id === idPaciente) || null;
    }

    if (nuevaVista === "lista" || nuevaVista === "perfil") {
      this.limitePacientes = 3;
      this.limiteCitas = 4;
    }

    if (nuevaVista === "ver-expediente") {
      const pId = this.pacienteSeleccionado?.id;
      if (pId) {
        await this.obtenerExpedienteDelBackend(pId);
      }
    }

    if (nuevaVista === "crear-expediente") {
      const p = this.pacienteSeleccionado;
      const exp = (p && this.expedientes[p.id]) ? this.expedientes[p.id] : crearExpedienteVacio();

      this.columnasFrecuenciaTemporal = JSON.parse(
        JSON.stringify(
          exp.columnasFrecuencia || [
            { id: "grupoAlimento", nombre: "Grupo Alimentario" },
            { id: "frecuencia", nombre: "Frecuencia" },
            { id: "observaciones", nombre: "Observaciones" },
          ],
        ),
      );
      this.tablaFrecuenciaTemporal = JSON.parse(
        JSON.stringify(exp.frecuenciaAlimentos || []),
      );

      this.columnasRegistro24hTemporal = JSON.parse(
        JSON.stringify(
          exp.columnasRegistro24h || [
            { id: "comida", nombre: "Comida / Horario" },
            { id: "lunes", nombre: "Lunes" },
            { id: "martes", nombre: "Martes" },
            { id: "miercoles", nombre: "Miércoles" },
            { id: "jueves", nombre: "Jueves" },
            { id: "viernes", nombre: "Viernes" },
            { id: "sabado", nombre: "Sábado" },
            { id: "domingo", nombre: "Domingo" },
          ],
        ),
      );
      this.tablaRegistro24hTemporal = JSON.parse(
        JSON.stringify(exp.recordatorio24h || []),
      );
    }

    this.render();
  }

  render() {
    if (this.vistaActual === "lista") this.innerHTML = this.getTemplateLista();
    else if (this.vistaActual === "perfil") this.innerHTML = this.getTemplatePerfil();
    else if (this.vistaActual === "ver-expediente") this.innerHTML = this.getTemplateVerExpediente();
    else if (this.vistaActual === "crear-expediente") this.innerHTML = this.getTemplateFormularioExpediente();
    else if (this.vistaActual === "historial-lista") this.innerHTML = this.getTemplateHistorialLista();

    this.setupEventListeners();

    if (this.vistaActual === "crear-expediente") {
      this.setupAutoResizeTextareas();
      this.setupBulletTextareas();
      this.renderTablasDinamicasFormulario();
    }
  }

  getTemplateLista() {
    const pacientesVisibles = this.pacientes.slice(0, this.limitePacientes);
    const estaExpandidoPacientes = this.limitePacientes > 3;

    return `
      <div class="main-layout-container">
        <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
        <div class="workspace-wrapper">
          <header class="topbar-green">
            <h1 class="topbar-title">Pacientes</h1>
            <div class="search-context-container">
              <div class="search-bar-inner">
                <img src="assets/icons/Busqueda.png" alt="Buscar" class="search-icon-img">
                <input type="text" id="global-search-input" placeholder="Buscar pacientes..." autocomplete="off">
              </div>
              <div id="dropdown-clientes-nuevos" class="dropdown-floating hidden-dropdown">
                <div class="dropdown-header-toggle">
                  <span>Clientes nuevos</span>
                  <label class="switch-toggle">
                    <input type="checkbox" id="toggle-new-clients">
                    <span class="slider-round"></span>
                  </label>
                </div>
                <div id="dropdown-results-list" class="dropdown-results-list"></div>
              </div>
            </div>
            <div class="notification-icon-wrapper">
              <img src="assets/icons/notificaciones.png" alt="Notificaciones">
            </div>
          </header>

          <main class="main-workspace">
            <div class="content-heading-bar">
              <div>
                <h2>Gestión de Pacientes</h2>
                <p>Administra y da seguimiento a tus pacientes activos.</p>
              </div>
            </div>

            <h3 class="section-subtitle-label">Atendidos recientemente</h3>

            <div class="table-data-container">
              <table class="patients-data-table">
                <thead>
                  <tr>
                    <th class="col-paciente">PACIENTE</th>
                    <th class="col-reporte">ÚLTIMO REPORTE</th>
                    <th class="col-cumplimiento">ESTADO CUMPLIMIENTO</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    pacientesVisibles.length === 0
                      ? `<tr><td colspan="3" style="text-align:center; padding: 20px; color: var(--text-muted);">No hay pacientes registrados aún.</td></tr>`
                      : pacientesVisibles.map((p) => `
                        <tr class="row-paciente-item" data-id="${p.id}">
                          <td class="cell-profile-wrapper">
                            <div class="avatar-circle">
                              <img src="${p.avatar}" alt="${p.nombre}" class="avatar-img" onerror="this.style.display='none'">
                              <span>${p.iniciales}</span>
                            </div>
                            <div class="patient-name-id">
                              <h4>${p.nombre}</h4>
                              <span>ID: ${p.id}</span>
                            </div>
                          </td>
                          <td class="cell-standard-text">${p.ultimoReporte}</td>
                          <td class="cell-standard-text">${p.estado}</td>
                        </tr>
                      `).join("")
                  }
                </tbody>
              </table>
              ${
                this.pacientes.length > 3
                  ? `
                  <div class="table-footer-load-more" id="footer-toggle-pacientes">
                    <span>${estaExpandidoPacientes ? "Ver menos..." : "Ver más..."}</span>
                    <span class="arrow-indicator">${estaExpandidoPacientes ? "▲" : "▼"}</span>
                  </div>
                `
                  : ""
              }
            </div>
          </main>
        </div>
      </div>
    `;
  }

  getTemplatePerfil() {
    const p = this.pacienteSeleccionado;
    if (!p) {
      return `
        <div class="main-layout-container">
          <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
          <div class="workspace-wrapper">
            <header class="topbar-green">
              <div class="header-back-flow">
                <button class="btn-back-apple" id="btn-regresar-lista"><span class="chevron-apple">‹</span></button>
                <h1 class="topbar-title">Perfil del Paciente</h1>
              </div>
            </header>
            <main class="main-workspace centered-workspace" style="padding: 40px; text-align:center;">
              <p style="color:var(--text-muted);">Selecciona un paciente de la lista para ver su perfil.</p>
            </main>
          </div>
        </div>
      `;
    }

    const citasDelPaciente = this.todasLasCitas.filter(c => c.pacienteId === p.id || c.idPaciente === p.id);
    const citasVisibles = citasDelPaciente.slice(0, this.limiteCitas);
    const estaExpandidoCitas = this.limiteCitas > 4;

    return `
      <div class="main-layout-container">
        <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
        <div class="workspace-wrapper">
          <header class="topbar-green">
            <div class="header-back-flow">
              <button class="btn-back-apple" id="btn-regresar-lista" title="Volver">
                <span class="chevron-apple">‹</span>
              </button>
              <h1 class="topbar-title">Perfil del Paciente</h1>
            </div>
            <div class="notification-icon-wrapper">
              <img src="assets/icons/notificaciones.png" alt="Notificaciones">
            </div>
          </header>

          <div class="perfil-grid-layout">
            <div>
              <div class="perfil-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                <div class="header-left-info">
                  <div class="avatar-large" style="background: var(--bg-avatar-large);">
                    <img src="${p.avatar}" alt="${p.nombre}" class="avatar-img" onerror="this.style.display='none'">
                    <span>${p.iniciales}</span>
                  </div>
                  <div>
                    <h2>${p.nombre}</h2>
                    <p class="role-label">Paciente</p>
                    <span class="id-label">ID: ${p.id}</span>
                  </div>
                </div>
                
                <div class="header-actions-container" style="display: flex; flex-direction: column; gap: 10px; align-items: flex-end; justify-content: center;">
                  <button class="btn-header-action" id="btn-anadir-nuevo-expediente" style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; padding: 8px 14px; border: 1.5px solid var(--border-color); border-radius: 6px; background-color: var(--btn-bg); color: var(--btn-text); font-weight: 600; font-size: 13px; cursor: pointer; width: 230px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                    <img src="assets/icons/añadir.png" alt="Añadir" style="width:16px; height:16px; object-fit: contain;">
                    <span>Añadir Nueva Evaluación</span>
                  </button>
                  <button class="btn-header-action" id="btn-ver-expediente" style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; padding: 8px 14px; border: 1.5px solid var(--border-color); border-radius: 6px; background-color: var(--btn-bg); color: var(--btn-text); font-weight: 600; font-size: 13px; cursor: pointer; width: 230px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                    <img src="assets/icons/reciente.png" alt="Expediente" style="width:16px; height:16px; object-fit: contain;">
                    <span>Ver Expediente Completo</span>
                  </button>
                  <button class="btn-header-action" id="btn-ver-diagnostico" style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; padding: 8px 14px; border: 1.5px solid var(--border-color); border-radius: 6px; background-color: var(--btn-bg); color: var(--btn-text); font-weight: 600; font-size: 13px; cursor: pointer; width: 230px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                    <img src="assets/icons/notas.png" alt="Diagnóstico" style="width:16px; height:16px; object-fit: contain;">
                    <span>Ver Diagnósticos</span>
                  </button>
                </div>
              </div>

              <div class="card-container-white stability-margin-top">
                <h3 class="card-title-sub">Citas Pasadas</h3>
                <table class="citas-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Doctor</th>
                      <th>Estatus</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    ${
                      citasVisibles.length === 0
                        ? `<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding:15px;">Sin citas registradas para este paciente.</td></tr>`
                        : citasVisibles.map((c) => `
                          <tr>
                            <td>${c.fecha}</td>
                            <td>${c.doctor || c.nombreEspecialista || "Atención General"}</td>
                            <td><span class="badge-activo">${c.estatus}</span></td>
                            <td class="cell-align-right">
                              <button class="btn-table-details btn-ver-resumen-cita" data-id="${c.id}" data-fecha="${c.fecha}" data-fecha-iso="${c.fechaIso || c.fecha}" data-doctor="${c.doctor || 'Especialista'}">
                                Ver Detalles
                              </button>
                            </td>
                          </tr>
                        `).join("")
                    }
                  </tbody>
                </table>
                ${
                  citasDelPaciente.length > 4
                    ? `
                    <div class="center-action-row">
                      <button class="btn-table-details load-more-btn-padding" id="btn-toggle-citas">
                        ${estaExpandidoCitas ? "Ver menos" : "Ver más"}
                      </button>
                    </div>
                  `
                    : ""
                }
              </div>
            </div>

            <div>
              <div class="card-container-white">
                <h3 class="card-title-sub tight-margin">Cita Programada</h3>
                <p class="no-appointments-label">Sin citas programadas registradas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${this.mostrarModalDiagnostico ? this.getTemplateModalDiagnostico() : ""}
      ${this.mostrarModalResumenCita ? this.getTemplateModalResumenCita() : ""}
    `;
  }

  getTemplateModalResumenCita() {
    const p = this.pacienteSeleccionado;
    const data = this.citaSeleccionadaDetalle;
    if (!data || !p) return "";

    return `
      <div class="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--bg-modal-overlay); display: flex; align-items: center; justify-content: center; z-index: 5000; padding: 20px; box-sizing: border-box;">
        <div class="modal-resumen-card" style="background: var(--bg-card); width: 100%; max-width: 550px; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.4); font-family: inherit; display: flex; flex-direction: column;">
          <div style="background: var(--table-header-bg); padding: 20px 24px; border-bottom: 1px solid var(--border-color); position: relative;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: var(--text-primary);">Resumen de Cita — ${data.fecha}</h3>
          </div>
          <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
            <div>
              <h5 style="margin:0; color:var(--text-primary);">${p.nombre} (ID: ${p.id})</h5>
            </div>
            <div>
              <strong style="color:var(--text-primary);">Diagnóstico:</strong>
              <p style="color:var(--text-secondary); margin-top:4px;">${data.diagnostico}</p>
            </div>
          </div>
          <div style="padding: 16px 24px; background: var(--bg-body); text-align: center;">
            <button type="button" id="btn-cerrar-resumen-cita" style="padding: 10px 40px; font-size: 14px; color: var(--text-muted); background: var(--bg-modal-close); border: 1.5px solid var(--border-color); border-radius: 6px; cursor: pointer;">
              Cerrar 
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getTemplateModalDiagnostico() {
    const p = this.pacienteSeleccionado;
    const exp = p ? this.expedientes[p.id] : null;

    return `
      <div class="modal-overlay" style="background: var(--bg-modal-overlay);">
        <div class="modal-diagnostic-card" style="background: var(--bg-card); color: var(--text-primary);">
          <div class="modal-diagnostic-header" style="border-bottom: 1px solid var(--border-color);">
            <h3>Diagnóstico Nutricional</h3>
            <button type="button" id="btn-cerrar-modal-diagnostico" class="modal-close-btn" style="color: var(--text-primary);">×</button>
          </div>
          ${
            exp
              ? `
            <div class="modal-name">
              <p><strong>Paciente:</strong> ${p.nombre}</p>
            </div>
            <br>
            <div class="modal-2col">
              <p><strong>Altura:</strong> ${exp.altura || "---"} m</p>
              <p><strong>Peso:</strong> ${exp.peso || "---"} kg</p>
              <p><strong>Talla:</strong> ${exp.talla || "---"} m</p>
              <p><strong>IMC:</strong> ${exp.imc || "---"}</p>
            </div>
            <div class="modal-diagnostic-body">
              <p style="border:none; margin-top:10px; color: var(--text-secondary);">
                <strong>Diagnóstico General:</strong><br>
                ${exp.diagnosticoGeneral || "No se ha redactado un diagnóstico aún."}
              </p>
            </div>
          `
              : `
            <p class="modal-empty-state" style="color: var(--text-muted); padding:20px;">Este paciente aún no tiene un expediente clínico registrado para ver su diagnóstico.</p>
          `
          }
        </div>
      </div>
    `;
  }

  getTemplateVerExpediente() {
    const p = this.pacienteSeleccionado;
    const exp = p ? this.expedientes[p.id] : null;

    if (!p || !exp) {
      return `
        <div class="main-layout-container">
          <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
          <div class="workspace-wrapper" style="display: flex; flex-direction: column; min-height: 100vh;">
            <header class="topbar-green">
              <div class="header-back-flow">
                <button class="btn-back-apple" id="btn-regresar-perfil"><span class="chevron-apple">‹</span></button>
                <h1 class="topbar-title">Expediente Clínico</h1>
              </div>
            </header>
            <main class="main-workspace centered-workspace" style="flex: 1; display: flex; align-items: center; justify-content: center; background-color: var(--bg-body); padding: 20px;">
              <div class="card-container-white centered-card" style="background: var(--bg-card); max-width: 500px; width: 100%; text-align: center; padding: 40px 30px;">
                <p class="no-appointments-label" style="margin-bottom: 24px; font-size: 15px; color: var(--text-muted);">
                  No hay expediente clínico registrado para este paciente en la base de datos.
                </p>
                <button class="btn-nuevo-paciente" id="btn-anadir-expediente" style="background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color);">
                  <img src="assets/icons/añadirBlanco.png" alt="Añadir" style="width:14px; height:14px; margin-right:6px;">
                  Añadir Expediente
                </button>
              </div>
            </main>
          </div>
        </div>
      `;
    }

    const colsFrecuencia = exp.columnasFrecuencia || [
      { id: "grupoAlimento", nombre: "Grupo Alimentario" },
      { id: "frecuencia", nombre: "Frecuencia" },
      { id: "observaciones", nombre: "Observaciones" },
    ];

    const colsRegistro = exp.columnasRegistro24h || [
      { id: "comida", nombre: "Comida / Horario" },
      { id: "lunes", nombre: "Lunes" },
      { id: "martes", nombre: "Martes" },
      { id: "miercoles", nombre: "Miércoles" },
      { id: "jueves", nombre: "Jueves" },
      { id: "viernes", nombre: "Viernes" },
      { id: "sabado", nombre: "Sábado" },
      { id: "domingo", nombre: "Domingo" },
    ];

    return `
      <div class="main-layout-container">
        <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
        <div class="workspace-wrapper">
          <header class="topbar-green">
            <div class="header-back-flow">
              <button class="btn-back-apple" id="btn-regresar-perfil"><span class="chevron-apple">‹</span></button>
              <h1 class="topbar-title">Expediente de ${exp.nombrePaciente || p.nombre}</h1>
            </div>
            <div class="header-actions-container">
              <button class="btn-header-action" id="btn-editar-expediente">
                <img src="assets/icons/notas.png" alt="Editar" style="width:14px;height:14px;"> Editar
              </button>
            </div>
          </header>

          <main class="main-workspace scrollable-content">
            <div class="card-container-white content-flex-stack">
              <h2 class="section-title-bordered" style="font-size: 20px; font-weight:700; margin-bottom: 20px; border-bottom: 2px solid var(--border-main); padding-bottom: 10px; color: var(--text-primary);">VALORACIÓN DEL ESTADO NUTRICIO</h2>

              <h3 class="card-title-sub">1. Datos Generales de la Paciente</h3>
              <table class="citas-table" style="margin-bottom: 25px;">
                <tr><td><strong>Nombre Completo:</strong> ${exp.nombrePaciente || "---"}</td><td><strong>Sexo:</strong> ${exp.sexo || "---"}</td><td><strong>Edad:</strong> ${exp.edad || "---"} años</td></tr>
                <tr><td><strong>Ocupación:</strong> ${exp.ocupacion || "---"}</td><td><strong>Procedencia:</strong> ${exp.procedencia || "---"}</td><td><strong>Escolaridad:</strong> ${exp.escolaridad || "---"}</td></tr>
                <tr><td colspan="2"><strong>Actividad Física:</strong> ${exp.ejercicio || "---"}</td><td><strong>Fecha Evaluación:</strong> ${this.formatearFechaEs(exp.fecha)}</td></tr>
                <tr><td colspan="3"><strong>Objetivo Nutricional:</strong> ${exp.objetivo || "---"}</td></tr>
              </table>

              <h3 class="card-title-sub">2. Diagnóstico Antropométrico e Indicadores</h3>
              <table class="citas-table" style="margin-bottom: 25px;">
                <tr><td><strong>Peso:</strong> ${exp.peso || "---"} kg</td><td><strong>Talla:</strong> ${exp.talla || "---"} m</td></tr>
                <tr><td><strong>IMC:</strong> ${exp.imc || "---"}</td><td><strong>Circunferencia Cintura:</strong> ${exp.cintura || "---"} cm</td></tr>
              </table>

              <h3 class="card-title-sub">3. Diagnóstico General</h3>
              <div class="satisfaccion-bordered-box" style="margin-bottom: 25px; padding: 15px; color: var(--text-secondary);">
                ${exp.diagnosticoGeneral || "No se redactó diagnóstico general."}
              </div>

              <h3 class="card-title-sub">4. Observaciones</h3>
              <div class="satisfaccion-bordered-box" style="padding: 15px; color: var(--text-secondary);">
                ${exp.observaciones || "Sin observaciones adicionales."}
              </div>
            </div>
          </main>
        </div>
      </div>
    `;
  }

  getTemplateFormularioExpediente() {
    const p = this.pacienteSeleccionado;
    const exp = (p && this.expedientes[p.id]) ? this.expedientes[p.id] : crearExpedienteVacio();

    return `
      <div class="main-layout-container">
        <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
        <div class="workspace-wrapper">
          <header class="topbar-green">
            <div class="header-back-flow">
              <button type="button" class="btn-back-apple" id="btn-cancelar-formulario"><span class="chevron-apple">‹</span></button>
              <h1 class="topbar-title">Añadir / Configurar Registro Clínico</h1>
            </div>
          </header>

          <main class="main-workspace scrollable-content">
            <form id="expediente-form" class="main-form-structure">
              
              <div class="card-container-white">
                <h3 class="card-title-sub">1. Datos Generales de la Paciente</h3>
                <div class="form-grid-3-col">
                  <label>Nombres: <input type="text" id="form-nombrePaciente" value="${exp.nombrePaciente || (p ? p.nombre : "")}" required></label>
                  <label>Apellido Paterno: <input type="text" id="form-apellidoPaterno" value="${exp.apellidoPaterno || ""}" required></label>
                  <label>Apellido Materno: <input type="text" id="form-apellidoMaterno" value="${exp.apellidoMaterno || ""}"></label>
                </div>
                <div class="form-grid-3-col">
                  <label>Sexo:
                    <select id="form-sexo">
                      <option value="Femenino" ${exp.sexo === "Femenino" ? "selected" : ""}>Femenino</option>
                      <option value="Masculino" ${exp.sexo === "Masculino" ? "selected" : ""}>Masculino</option>
                    </select>
                  </label>
                  <label>Edad: <input type="number" id="form-edad" value="${exp.edad || ""}" required></label>
                  <label>Ocupación: <input type="text" id="form-ocupacion" value="${exp.ocupacion || ""}"></label>
                </div>
                <div class="form-grid-3-col">
                  <label>Procedencia: <input type="text" id="form-procedencia" value="${exp.procedencia || ""}"></label>
                  <label>Escolaridad: <input type="text" id="form-escolaridad" value="${exp.escolaridad || ""}"></label>
                  <label>Actividad física: <input type="text" id="form-ejercicio" value="${exp.ejercicio || ""}"></label>
                </div>
                <div class="form-grid-3-col">
                  <label>Fecha Evaluación: <input type="date" id="form-fecha" value="${exp.fecha || ""}"></label>
                </div>
                <label>Objetivo Clínico:
                  <textarea id="form-objetivo" class="textarea-dinamica auto-expand">${exp.objetivo || ""}</textarea>
                </label>
              </div>

              <div class="card-container-white">
                <h3 class="card-title-sub">2. Diagnóstico Antropométrico e Indicadores</h3>
                <div class="form-grid-3-col">
                  <label>Altura (m): <input type="number" step="0.01" id="form-altura" value="${exp.altura || ""}" required></label>
                  <label>Peso (kg): <input type="number" step="0.1" id="form-peso" value="${exp.peso || ""}" required></label>
                  <label>Talla (m): <input type="number" step="0.01" id="form-talla" value="${exp.talla || ""}" required></label>
                </div>
                <div class="form-grid-2-col">
                  <label>IMC: <input type="number" step="0.1" id="form-imc" value="${exp.imc || ""}"></label>
                  <label>Circunferencia de Cintura (cm): <input type="number" step="0.1" id="form-cintura" value="${exp.cintura || ""}"></label>
                </div>
              </div>

              <div class="card-container-white">
                <h3 class="card-title-sub">3. Diagnóstico Clínico</h3>
                <label>Diagnóstico General:
                  <textarea id="form-diagnosticoGeneral" class="textarea-dinamica auto-expand" placeholder="Escriba el diagnóstico...">${exp.diagnosticoGeneral || ""}</textarea>
                </label>
                <label>Observaciones:
                  <textarea id="form-observaciones" class="textarea-dinamica textarea-bullet auto-expand" placeholder="• Observaciones...">${exp.observaciones || "• "}</textarea>
                </label>
              </div>

              <div style="margin-top: 25px; display:flex; justify-content: flex-end;">
                <button type="submit" class="btn-nuevo-paciente" style="padding: 12px 30px; background: var(--btn-bg); color: var(--btn-text); border: 1px solid var(--border-color);">
                  <img src="assets/icons/añadirBlanco.png" alt="Guardar" style="width:14px;height:14px;margin-right:8px;">
                  Guardar Expediente
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    `;
  }

  renderTablasDinamicasFormulario() {
    // Renderizado estándar de tablas dinámicas si es necesario
  }

  setupEventListeners() {
    const btnRegresar = this.querySelector("#btn-regresar-lista");
    if (btnRegresar) {
      btnRegresar.addEventListener("click", () => this.cambiarVista("lista"));
    }

    const footerPacientes = this.querySelector("#footer-toggle-pacientes");
    if (footerPacientes) {
      footerPacientes.addEventListener("click", () => {
        this.limitePacientes = this.limitePacientes > 3 ? 3 : 10;
        this.render();
      });
    }

    const btnToggleCitas = this.querySelector("#btn-toggle-citas");
    if (btnToggleCitas) {
      btnToggleCitas.addEventListener("click", () => {
        this.limiteCitas = this.limiteCitas > 4 ? 4 : this.todasLasCitas.length;
        this.render();
      });
    }

    this.querySelectorAll(".row-paciente-item").forEach((row) => {
      row.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        this.cambiarVista("perfil", id);
      });
    });

    const btnAnadirNuevoExpediente = this.querySelector("#btn-anadir-nuevo-expediente");
    if (btnAnadirNuevoExpediente) {
      btnAnadirNuevoExpediente.addEventListener("click", () => this.cambiarVista("crear-expediente"));
    }

    const btnVerExpediente = this.querySelector("#btn-ver-expediente");
    if (btnVerExpediente) {
      btnVerExpediente.addEventListener("click", () => this.cambiarVista("ver-expediente"));
    }

    const btnVerDiagnostico = this.querySelector("#btn-ver-diagnostico");
    if (btnVerDiagnostico) {
      btnVerDiagnostico.addEventListener("click", () => {
        this.mostrarModalDiagnostico = true;
        this.render();
      });
    }

    const btnCerrarModalDiagnostico = this.querySelector("#btn-cerrar-modal-diagnostico");
    if (btnCerrarModalDiagnostico) {
      btnCerrarModalDiagnostico.addEventListener("click", () => {
        this.mostrarModalDiagnostico = false;
        this.render();
      });
    }

    const btnRegresarPerfil = this.querySelector("#btn-regresar-perfil");
    if (btnRegresarPerfil) {
      btnRegresarPerfil.addEventListener("click", () => this.cambiarVista("perfil"));
    }

    const btnAnadirExpediente = this.querySelector("#btn-anadir-expediente");
    if (btnAnadirExpediente) {
      btnAnadirExpediente.addEventListener("click", () => this.cambiarVista("crear-expediente"));
    }

    const btnEditarExpediente = this.querySelector("#btn-editar-expediente");
    if (btnEditarExpediente) {
      btnEditarExpediente.addEventListener("click", () => this.cambiarVista("crear-expediente"));
    }

    const btnCancelarFormulario = this.querySelector("#btn-cancelar-formulario");
    if (btnCancelarFormulario) {
      btnCancelarFormulario.addEventListener("click", () => {
        const p = this.pacienteSeleccionado;
        const destino = (p && this.expedientes[p.id]) ? "ver-expediente" : "perfil";
        this.cambiarVista(destino);
      });
    }

    const formExpediente = this.querySelector("#expediente-form");
    if (formExpediente) {
      formExpediente.addEventListener("submit", async (e) => {
        e.preventDefault();
        const pId = this.pacienteSeleccionado?.id;
        if (!pId) return;

        const nuevoExpedienteStruct = {
          idPaciente: pId,
          fecha: this.querySelector("#form-fecha").value,
          nombrePaciente: this.querySelector("#form-nombrePaciente").value,
          apellidoPaterno: this.querySelector("#form-apellidoPaterno").value,
          apellidoMaterno: this.querySelector("#form-apellidoMaterno").value,
          sexo: this.querySelector("#form-sexo").value,
          edad: parseInt(this.querySelector("#form-edad").value, 10) || 0,
          ocupacion: this.querySelector("#form-ocupacion").value,
          procedencia: this.querySelector("#form-procedencia").value,
          escolaridad: this.querySelector("#form-escolaridad").value,
          ejercicio: this.querySelector("#form-ejercicio").value,
          objetivo: this.querySelector("#form-objetivo").value,
          altura: parseFloat(this.querySelector("#form-altura").value) || 0,
          peso: parseFloat(this.querySelector("#form-peso").value) || 0,
          talla: parseFloat(this.querySelector("#form-talla").value) || 0,
          imc: parseFloat(this.querySelector("#form-imc").value) || 0,
          cintura: parseFloat(this.querySelector("#form-cintura").value) || 0,
          observaciones: this.querySelector("#form-observaciones").value,
          diagnosticoGeneral: this.querySelector("#form-diagnosticoGeneral").value,
        };

        try {
          const respuesta = await fetch("http://localhost:5000/api/expediente", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoExpedienteStruct)
          });

          if (respuesta.ok) {
            alert("¡Expediente guardado exitosamente!");
            this.expedientes[pId] = JSON.parse(JSON.stringify(nuevoExpedienteStruct));
            this.cambiarVista("ver-expediente");
          } else {
            alert("Error en el servidor al guardar.");
          }
        } catch (error) {
          console.error("Error al conectar con la API:", error);
        }
      });
    }

    const searchInput = this.querySelector("#global-search-input");
    const dropdown = this.querySelector("#dropdown-clientes-nuevos");
    const resultsList = this.querySelector("#dropdown-results-list");
    const toggleNewClients = this.querySelector("#toggle-new-clients");

    if (searchInput) {
      const filtrarYMostrarResultados = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query === "") {
          if (dropdown) dropdown.classList.add("hidden-dropdown");
          return;
        }

        const soloNuevos = toggleNewClients ? toggleNewClients.checked : false;

        const filtrados = this.pacientes.filter((p) => {
          const coincideNombre = p.nombre.toLowerCase().includes(query);
          const coincideId = p.id.toLowerCase().includes(query);
          const coincideFiltro = coincideNombre || coincideId;
          const esNuevoReal = this.esPacienteNuevo(p.id);

          return soloNuevos ? (coincideFiltro && esNuevoReal) : coincideFiltro;
        });

        if (filtrados.length === 0) {
          resultsList.innerHTML =
            '<div class="dropdown-empty-state" style="padding:12px; font-size:13px; color:var(--text-muted); text-align:center;">No se encontraron pacientes</div>';
        } else {
          resultsList.innerHTML = filtrados
            .map((p) => `
              <div class="dropdown-item-row" data-id="${p.id}" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:pointer; border-bottom:1px solid var(--border-color);">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div class="avatar-circle small-avatar">
                    <img src="${p.avatar}" alt="${p.nombre}" class="avatar-img" onerror="this.style.display='none'">
                    <span>${p.iniciales}</span>
                  </div>
                  <div class="patient-name-id">
                    <h4 style="margin:0; font-size:14px; color:var(--text-primary);">${p.nombre}</h4>
                    <span style="font-size:12px; color:var(--text-muted);">ID: ${p.id}</span>
                  </div>
                </div>
                ${
                  this.esPacienteNuevo(p.id)
                    ? `<span style="background:var(--color-sidebar-active-bg, #22c55e); color:#fff; font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px;">NUEVO</span>`
                    : ''
                }
              </div>
            `).join("");
        }

        if (dropdown) dropdown.classList.remove("hidden-dropdown");
        this.setupDropdownRowClicks();
      };

      searchInput.addEventListener("input", filtrarYMostrarResultados);
      if (toggleNewClients) {
        toggleNewClients.addEventListener("change", filtrarYMostrarResultados);
      }
    }

    document.addEventListener("click", (e) => {
      if (!this.querySelector(".search-context-container")?.contains(e.target)) {
        if (dropdown) dropdown.classList.add("hidden-dropdown");
      }
    });
  }

  setupDropdownRowClicks() {
    this.querySelectorAll(".dropdown-item-row").forEach((row) => {
      row.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        const dropdown = this.querySelector("#dropdown-clientes-nuevos");
        if (dropdown) dropdown.classList.add("hidden-dropdown");
        this.cambiarVista("perfil", id);
      });
    });
  }

  cerrarMenuContextualGlobal() {
    const menuExistente = document.getElementById("menu-contextual-tabla");
    if (menuExistente) menuExistente.remove();
  }
}

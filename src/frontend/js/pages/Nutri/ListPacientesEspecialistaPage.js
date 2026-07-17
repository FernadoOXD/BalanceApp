const crearFilaRegistro24hVacia = (comida = "", colIds = ['comida', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']) => {
  const row = {};
  colIds.forEach((id, idx) => {
    row[id] = idx === 0 ? comida : "";
  });
  return row;
};

const crearFilaFrecuenciaVacia = (grupo = "", colIds = ['grupoAlimento', 'frecuencia', 'observaciones']) => {
  const row = {};
  colIds.forEach((id, idx) => {
    row[id] = idx === 0 ? grupo : "";
  });
  return row;
};

const crearExpedienteVacio = () => {
  const colFrecuenciaDefault = [
    { id: 'grupoAlimento', nombre: 'Grupo Alimentario' },
    { id: 'frecuencia', nombre: 'Frecuencia' },
    { id: 'observaciones', nombre: 'Observaciones' }
  ];
  const colRegistroDefault = [
    { id: 'comida', nombre: 'Comida / Horario' },
    { id: 'lunes', nombre: 'Lunes' },
    { id: 'martes', nombre: 'Martes' },
    { id: 'miercoles', nombre: 'Miércoles' },
    { id: 'jueves', nombre: 'Jueves' },
    { id: 'viernes', nombre: 'Viernes' },
    { id: 'sabado', nombre: 'Sábado' },
    { id: 'domingo', nombre: 'Domingo' }
  ];

  return {
    fecha: new Date().toISOString().split('T')[0],
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
      antecedentesFamiliares: "• "
    },
    antropometria: {
      biceps: "", triceps: "", suprailiaco: "", musloPliegue: "", piernaPliegue: "",
      brazoContraido: "", brazoRelajado: "", antebrazo: "", muneca: "", cadera: "",
      musloCinta: "", pantorrilla: "", tobillo: "", humero: "", rodilla: ""
    },
    columnasFrecuencia: colFrecuenciaDefault,
    frecuenciaAlimentos: [
      crearFilaFrecuenciaVacia("Lácteos", colFrecuenciaDefault.map(c => c.id)),
      crearFilaFrecuenciaVacia("Leguminosas", colFrecuenciaDefault.map(c => c.id)),
      crearFilaFrecuenciaVacia("Carnes/Pescados", colFrecuenciaDefault.map(c => c.id)),
      crearFilaFrecuenciaVacia("Cereales", colFrecuenciaDefault.map(c => c.id))
    ],
    columnasRegistro24h: colRegistroDefault,
    recordatorio24h: [
      crearFilaRegistro24hVacia("Desayuno", colRegistroDefault.map(c => c.id)),
      crearFilaRegistro24hVacia("Media Mañana", colRegistroDefault.map(c => c.id)),
      crearFilaRegistro24hVacia("Comida", colRegistroDefault.map(c => c.id)),
      crearFilaRegistro24hVacia("Merienda", colRegistroDefault.map(c => c.id)),
      crearFilaRegistro24hVacia("Cena", colRegistroDefault.map(c => c.id))
    ],
    diagnosticoGeneral: "",
    observaciones: "• "
  };
};

export class ListPacientesEspecialistaPage extends HTMLElement {
  constructor() {
    super();
    this.vistaActual = 'lista';
    this.pacienteSeleccionado = null;
    this.mostrarModalDiagnostico = false;

    this.limitePacientes = 3;
    this.limiteCitas = 4;

    this.pacientes = [
      { id: "PAC-1042", nombre: "Carlos Mendoza", iniciales: "CM", avatar: "assets/avatars/carlos.png", ultimoReporte: "Hace 2 días", estado: "Alta (92%)", esNuevo: true },
      { id: "PAC-1043", nombre: "Laura Sánchez", iniciales: "LS", avatar: "assets/avatars/laura.png", ultimoReporte: "Hoy, 09:30 AM", estado: "Baja (45%)", esNuevo: false },
      { id: "PAC-1044", nombre: "Leon S. Kennedy", iniciales: "LK", avatar: "assets/avatars/leon.png", ultimoReporte: "Ayer", estado: "Media (78%)", esNuevo: true },
      { id: "PAC-1045", nombre: "Roberto Silva", iniciales: "RS", avatar: "assets/avatars/roberto.png", ultimoReporte: "Ayer", estado: "Media (78%)", esNuevo: false },
      { id: "PAC-1046", nombre: "Diana Prince", iniciales: "DP", avatar: "assets/avatars/diana.png", ultimoReporte: "Hace 3 días", estado: "Alta (95%)", esNuevo: true }
    ];

    this.todasLasCitas = [
      { fecha: "25 May 2024", doctor: "Dr. Margarita", estatus: "Activo" },
      { fecha: "18 May 2024", doctor: "Dr. Margarita", estatus: "Activo" },
      { fecha: "11 May 2024", doctor: "Dr. Margarita", estatus: "Activo" },
      { fecha: "04 May 2024", doctor: "Dr. Margarita", estatus: "Activo" },
      { fecha: "27 Apr 2024", doctor: "Dr. Margarita", estatus: "Activo" },
      { fecha: "20 Apr 2024", doctor: "Dr. Margarita", estatus: "Activo" }
    ];

    this.historialExpedientes = [];
    this.tablaRegistro24hTemporal = [];
    this.tablaFrecuenciaTemporal = [];
    this.columnasFrecuenciaTemporal = [];
    this.columnasRegistro24hTemporal = [];

    this.expedientes = {
      "PAC-1043": {
        ...crearExpedienteVacio(),
        fecha: "2020-10-23",
        nombrePaciente: "Deysi Alejandra Ruiz Hernández",
        apellidoPaterno: "Ruiz",
        apellidoMaterno: "Hernández",
        edad: 28,
        ocupacion: "Ama de casa",
        procedencia: "Tuxtla Gutiérrez, Chiapas",
        escolaridad: "Primaria",
        ejercicio: "No realiza",
        objetivo: "Aplicar la metodología adecuada para realizar diagnósticos del estado nutricio en la juventud...",
        altura: 1.48,
        peso: 43.3,
        talla: 1.48,
        imc: 19.7,
        cintura: 73.8,
        frecuenciaAlimentos: [
          { grupoAlimento: "Lácteos", frecuencia: "Diario, 2 veces al día", observaciones: "Leche entera" },
          { grupoAlimento: "Leguminosas", frecuencia: "Diario, 1 o 2 veces al día", observaciones: "Frijoles refritos" }
        ],
        recordatorio24h: [
          { comida: "Desayuno", lunes: "Huevo (2 piezas) con chorizo (20 g)", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: "" },
          { comida: "Media Mañana", lunes: "Fruta picada", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: "" },
          { comida: "Comida", lunes: "Pollo asado con arroz", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: "" },
          { comida: "Merienda", lunes: "Galletas de avena", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: "" },
          { comida: "Cena", lunes: "Cereal con leche", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: "" }
        ],
        diagnosticoGeneral: "Paciente con estado nutricio adecuado.",
        observaciones: "• Ninguna.\n• Mantener hidratación.",
        clinicos: {
          alcohol: "No", tabaco: "No", habitosToxicos: "• Ninguno reportado", patologias: "Ninguna", gastritis: "No", colitis: "No", estrenimiento: "No", hemorroides: "No", medicamentos: "Ninguno", alergias: "• Ninguna reportada", antecedentesFamiliares: "• Sin antecedentes familiares relevantes reportados"
        },
        antropometria: {
          biceps: 12, triceps: 12, suprailiaco: 12, musloPliegue: 21, piernaPliegue: 20,
          brazoContraido: 23, brazoRelajado: 26, antebrazo: 21, muneca: 14, cadera: 87,
          musloCinta: 82.6, pantorrilla: 23.2, tobillo: 20, humero: 5.8, rodilla: 8.9
        }
      }
    };

    this.historialExpedientes.push({
      identificadorHistorial: `${this.formatearFechaEs(this.expedientes["PAC-1043"].fecha)} - ${this.expedientes["PAC-1043"].nombrePaciente}`,
      pacienteId: "PAC-1043",
      datos: JSON.parse(JSON.stringify(this.expedientes["PAC-1043"]))
    });

    this.cerrarMenuContextualGlobal = this.cerrarMenuContextualGlobal.bind(this);
  }

  connectedCallback() {
    this.render();
    document.addEventListener('click', this.cerrarMenuContextualGlobal);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.cerrarMenuContextualGlobal);
  }

  // Función para convertir fecha "2020-10-23" a "23 de Octubre de 2020"
  formatearFechaEs(fechaStr) {
    if (!fechaStr) return '---';
    const partes = String(fechaStr).split('-');
    if (partes.length === 3) {
      const meses = ['Octubre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const mesIdx = parseInt(partes[1], 10);
      const mesNombre = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][mesIdx - 1] || partes[1];
      return `${partes[2]} de ${mesNombre} de ${partes[0]}`;
    }
    return fechaStr;
  }

  setupAutoResizeTextareas() {
    setTimeout(() => {
      const textareas = this.querySelectorAll('.textarea-dinamica');
      textareas.forEach(textarea => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

        textarea.addEventListener('input', () => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        });
      });
    }, 0);
  }

  setupBulletTextareas() {
    const bulletFields = this.querySelectorAll('.textarea-bullet');
    bulletFields.forEach(textarea => {
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const value = textarea.value;

          textarea.value = value.substring(0, start) + '\n• ' + value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 3;
          textarea.dispatchEvent(new Event('input'));
        }
      });
    });
  }

  cambiarVista(nuevaVista, idPaciente = null) {
    this.vistaActual = nuevaVista;
    this.mostrarModalDiagnostico = false;

    if (idPaciente) {
      this.pacienteSeleccionado = this.pacientes.find(p => p.id === idPaciente) || this.pacientes[2];
    }

    if (nuevaVista === 'lista' || nuevaVista === 'perfil') {
      this.limitePacientes = 3;
      this.limiteCitas = 4;
    }

    if (nuevaVista === 'crear-expediente') {
      const p = this.pacienteSeleccionado;
      const exp = this.expedientes[p.id] || crearExpedienteVacio();
      
      this.columnasFrecuenciaTemporal = JSON.parse(JSON.stringify(exp.columnasFrecuencia || [
        { id: 'grupoAlimento', nombre: 'Grupo Alimentario' },
        { id: 'frecuencia', nombre: 'Frecuencia' },
        { id: 'observaciones', nombre: 'Observaciones' }
      ]));
      this.tablaFrecuenciaTemporal = JSON.parse(JSON.stringify(exp.frecuenciaAlimentos || []));

      this.columnasRegistro24hTemporal = JSON.parse(JSON.stringify(exp.columnasRegistro24h || [
        { id: 'comida', nombre: 'Comida / Horario' },
        { id: 'lunes', nombre: 'Lunes' },
        { id: 'martes', nombre: 'Martes' },
        { id: 'miercoles', nombre: 'Miércoles' },
        { id: 'jueves', nombre: 'Jueves' },
        { id: 'viernes', nombre: 'Viernes' },
        { id: 'sabado', nombre: 'Sábado' },
        { id: 'domingo', nombre: 'Domingo' }
      ]));
      this.tablaRegistro24hTemporal = JSON.parse(JSON.stringify(exp.recordatorio24h || []));
    }

    this.render();
  }

  render() {
    if (this.vistaActual === 'lista') this.innerHTML = this.getTemplateLista();
    else if (this.vistaActual === 'perfil') this.innerHTML = this.getTemplatePerfil();
    else if (this.vistaActual === 'ver-expediente') this.innerHTML = this.getTemplateVerExpediente();
    else if (this.vistaActual === 'crear-expediente') this.innerHTML = this.getTemplateFormularioExpediente();
    else if (this.vistaActual === 'historial-lista')  this.innerHTML = this.getTemplateHistorialLista();
    this.setupEventListeners();

    if (this.vistaActual === 'crear-expediente') {
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
                    <input type="checkbox" id="toggle-new-clients" checked>
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
              <button class="btn-nuevo-paciente"><span>+</span> Nuevo Paciente</button>
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
                  ${pacientesVisibles.map(p => `
                    <tr class="row-paciente-item" data-id="${p.id}">
                      <td class="cell-profile-wrapper">
                        <div class="avatar-circle">
                          <img src="${p.avatar}" alt="${p.nombre}" class="avatar-img">
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
                  `).join('')}
                </tbody>
              </table>
              <div class="table-footer-load-more" id="footer-toggle-pacientes">
                <span>${estaExpandidoPacientes ? 'Ver menos...' : 'Ver mas...'}</span>
                <span class="arrow-indicator">${estaExpandidoPacientes ? '▲' : '▼'}</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    `;
  }

  getTemplatePerfil() {
    const p = this.pacienteSeleccionado || this.pacientes[2];
    const citasVisibles = this.todasLasCitas.slice(0, this.limiteCitas);
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
                  <div class="avatar-large">
                    <img src="${p.avatar}" alt="${p.nombre}" class="avatar-img">
                  </div>
                  <div>
                    <h2>${p.nombre}</h2>
                    <p class="role-label">Paciente</p>
                    <span class="id-label">ID: ${p.id}</span>
                  </div>
                </div>
                

                <div class="header-actions-container" style="display: flex; flex-direction: column; gap: 10px; align-items: flex-end; justify-content: center;">
                  <button class="btn-header-action" id="btn-anadir-nuevo-expediente" style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; padding: 8px 14px; border: 1.5px solid #0f5132; border-radius: 6px; background: #ffffff; color: #000000; font-weight: 600; font-size: 13px; cursor: pointer; width: 230px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <img src="assets/icons/añadir.png" alt="Añadir" style="width:16px; height:16px; object-fit: contain;">
                    <span>Añadir Nueva Evaluación</span>
                  </button>
                  <button class="btn-header-action" id="btn-ver-expediente" style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; padding: 8px 14px; border: 1.5px solid #0f5132; border-radius: 6px; background: #ffffff; color: #000000; font-weight: 600; font-size: 13px; cursor: pointer; width: 230px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <img src="assets/icons/reciente.png" alt="Expediente" style="width:16px; height:16px; object-fit: contain;">
                    <span>Ver Expediente Completo</span>
                  </button>
                  <button class="btn-header-action" id="btn-ver-diagnostico" style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; padding: 8px 14px; border: 1.5px solid #0f5132; border-radius: 6px; background: #ffffff; color: #000000; font-weight: 600; font-size: 13px; cursor: pointer; width: 230px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
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
                    ${citasVisibles.map(c => `
                      <tr>
                        <td>${c.fecha}</td>
                        <td>${c.doctor}</td>
                        <td><span class="badge-activo">${c.estatus}</span></td>
                        <td class="cell-align-right"><button class="btn-table-details">Ver Detalles</button></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <div class="center-action-row">
                  <button class="btn-table-details load-more-btn-padding" id="btn-toggle-citas">
                    ${estaExpandidoCitas ? 'Ver menos' : 'Ver más'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div class="card-container-white">
                <h3 class="card-title-sub tight-margin">Cita Programada</h3>
                <p class="no-appointments-label">No hay citas programadas para hoy</p>
                <div class="next-appointment-box">
                  <span class="next-appointment-title">Siguiente Cita:</span>
                  <p class="next-appointment-date">25 May, 10:00 AM</p>
                </div>
                <button class="btn-table-details full-width-btn">Ver Detalles de la Cita</button>
              </div>

              <div class="card-container-white">
                <h3 class="card-title-sub uppercase-gray-title">Nivel de Satisfacción</h3>
                <div class="satisfaccion-bordered-box">
                  <h4 class="satisfaccion-main-title">Satisfacción:</h4>
                  <div class="satisfaccion-row">
                    <strong class="satisfaccion-meta-label">Se siente:</strong>
                    <span>Muy Bien</span>
                  </div>
                  <div class="satisfaccion-row no-border-bottom">
                    <strong class="satisfaccion-meta-label">Seguimiento de la dieta:</strong>
                    <span>Algunos deslices</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${this.mostrarModalDiagnostico ? this.getTemplateModalDiagnostico() : ''}
    `;
  }

  getTemplateModalDiagnostico() {
    const p = this.pacienteSeleccionado || this.pacientes[2];
    const exp = this.expedientes[p.id];

    return `
      <div class="modal-overlay">
        <div class="modal-diagnostic-card">
          <div class="modal-diagnostic-header">
            <h3>Diagnóstico Nutricional</h3>
            <button type="button" id="btn-cerrar-modal-diagnostico" class="modal-close-btn">×</button>
          </div>
          ${exp ? `
            <div class ="modal-diagnostic-name">
              <p><strong>Paciente:</strong> ${p.nombre}</p>
            </div>
            <br>
            <div class="modal-2col">
              
              <p><strong>Altura:</strong> ${exp.altura || 'Sin registrar'} m</p>
              <p><strong>Peso:</strong> ${exp.peso || 'Sin registrar'} kg</p>
              <p><strong>Talla:</strong> ${exp.talla || 'Sin registrar'} m</p>
              <p><strong>IMC:</strong> ${exp.imc || 'Sin registrar'}</p>
            </div>
            <div class="modal-diagnostic-body">
              <p style="border:none; margin-top:10px;">
                <strong>Diagnóstico General:</strong><br>
                 ${exp.diagnosticoGeneral || 'No se ha redactado un diagnóstico aún.'}
              </p>
            </div>
          ` : `
            <p class="modal-empty-state">Este paciente aún no tiene un expediente clínico registrado para ver su diagnóstico.</p>
          `}
        </div>
      </div>
    `;
  }

  getTemplateVerExpediente() {
    const p = this.pacienteSeleccionado || this.pacientes[2];
    const exp = this.expedientes[p.id];

    if (!exp) {
      return `
        <div class="main-layout-container">
          <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
          <div class="workspace-wrapper" style="display: flex; flex-direction: column; min-height: 100vh;">
            <header class="topbar-green">
              <div class="header-back-flow">
                <button class="btn-back-apple" id="btn-regresar-perfil"><span class="chevron-apple">‹</span></button>
                <h1 class="topbar-title">Expediente Clínico - ${p.nombre}</h1>
              </div>
            </header>
            
            <main class="main-workspace centered-workspace" style="flex: 1; display: flex; align-items: center; justify-content: center; background-color: #f5f7f6; padding: 20px;">
              <div class="card-container-white centered-card" style="max-width: 500px; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
                <p class="no-appointments-label standard-margin-bottom" style="margin-bottom: 24px; font-size: 15px; color: #64748b; font-weight: 500;">
                  No hay expedientes clínicos registrados para este paciente.
                </p>
                <button class="btn-nuevo-paciente no-float" id="btn-anadir-expediente" style="display: inline-flex; align-items: center; justify-content: center;">
                  <img src="assets/icons/añadir.png" alt="Añadir" style="width:14px; height:14px; margin-right:6px;">
                  Añadir Expediente
                </button>
              </div>
            </main>
          </div>
        </div>
      `;
    }

    const colsFrecuencia = exp.columnasFrecuencia || [
      { id: 'grupoAlimento', nombre: 'Grupo Alimentario' },
      { id: 'frecuencia', nombre: 'Frecuencia' },
      { id: 'observaciones', nombre: 'Observaciones' }
    ];

    const colsRegistro = exp.columnasRegistro24h || [
      { id: 'comida', nombre: 'Comida / Horario' },
      { id: 'lunes', nombre: 'Lunes' },
      { id: 'martes', nombre: 'Martes' },
      { id: 'miercoles', nombre: 'Miércoles' },
      { id: 'jueves', nombre: 'Jueves' },
      { id: 'viernes', nombre: 'Viernes' },
      { id: 'sabado', nombre: 'Sábado' },
      { id: 'domingo', nombre: 'Domingo' }
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
              <button class="btn-header-action" id="btn-ir-historial">
                <img src="assets/icons/reciente.png" alt="Historial" style="width:14px;height:14px;">
                Historial de Evaluaciones
              </button>
              <button class="btn-header-action" id="btn-editar-expediente">
                <img src="assets/icons/notas.png" alt="Editar" style="width:14px;height:14px;">
                Editar 
              </button>
              <button class="btn-header-action btn-danger-action" id="btn-eliminar-expediente">
                <img src="assets/icons/eliminarRojo.png" alt="Eliminar" style="width:14px;height:14px;">
                Eliminar
              </button>
            </div>
          </header>

          <main class="main-workspace scrollable-content">
            <div class="card-container-white content-flex-stack">
              <h2 class="section-title-bordered" style="font-size: 20px; font-weight:700; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">VALORACIÓN DEL ESTADO NUTRICIO</h2>

              <h3 class="card-title-sub">1. Datos Generales de la Paciente</h3>
              <table class="citas-table" style="margin-bottom: 25px;">
                <tr><td><strong>Nombre Completo:</strong> ${exp.nombrePaciente}</td><td><strong>Sexo:</strong> ${exp.sexo}</td><td><strong>Edad:</strong> ${exp.edad} años</td></tr>
                <tr><td><strong>Ocupación:</strong> ${exp.ocupacion}</td><td><strong>Procedencia:</strong> ${exp.procedencia}</td><td><strong>Escolaridad:</strong> ${exp.escolaridad}</td></tr>
                <tr><td colspan="2"><strong>Actividad Física:</strong> ${exp.ejercicio}</td><td><strong>Fecha Evaluación:</strong> ${this.formatearFechaEs(exp.fecha)}</td></tr>
                <tr><td colspan="3"><strong>Objetivo Nutricional:</strong> ${exp.objetivo}</td></tr>
              </table>

              <h3 class="card-title-sub">2. Diagnóstico Antropométrico e Indicadores</h3>
              <table class="citas-table" style="margin-bottom: 25px;">
                <tr><td><strong>Peso:</strong> ${exp.peso} kg</td><td><strong>Talla:</strong> ${exp.talla} m</td></tr>
                <tr><td><strong>IMC:</strong> ${exp.imc}</td><td><strong>Circunferencia Cintura (CC):</strong> ${exp.cintura} cm</td></tr>
              </table>

              <h3 class="card-title-sub">3. Datos Clínicos Complementarios</h3>
              <table class="citas-table" style="margin-bottom: 25px;">
                <tr><td><strong>Gastritis:</strong> ${exp.clinicos?.gastritis || 'No'}</td><td><strong>Colitis:</strong> ${exp.clinicos?.colitis || 'No'}</td><td><strong>Estreñimiento:</strong> ${exp.clinicos?.estrenimiento || 'No'}</td></tr>
                <tr><td><strong>Hemorroides:</strong> ${exp.clinicos?.hemorroides || 'No'}</td><td><strong>Alcohol:</strong> ${exp.clinicos?.alcohol || 'No'}</td><td><strong>Tabaco:</strong> ${exp.clinicos?.tabaco || 'No'}</td></tr>
                <tr><td colspan="3"><strong>Hábitos Tóxicos:</strong><br><div style="white-space: pre-wrap; padding: 5px 0;">${exp.clinicos?.habitosToxicos || '• Ninguno'}</div></td></tr>
                <tr><td colspan="3"><strong>Patologías Previas:</strong><br><div style="white-space: pre-wrap; padding: 5px 0;">${exp.clinicos?.patologias || 'Ninguna'}</div></td></tr>
                <tr><td colspan="3"><strong>Alergias:</strong><br><div style="white-space: pre-wrap; padding: 5px 0;">${exp.clinicos?.alergias || 'Ninguna registrada.'}</div></td></tr>
                <tr><td colspan="3"><strong>Antecedentes Familiares:</strong><br><div style="white-space: pre-wrap; padding: 5px 0;">${exp.clinicos?.antecedentesFamiliares || 'Ninguno registrado.'}</div></td></tr>
                <tr><td colspan="3"><strong>Medicamentos o Suplementos:</strong><br><div style="white-space: pre-wrap; padding: 5px 0;">${exp.clinicos?.medicamentos || 'Ninguno'}</div></td></tr>
              </table>

              <h3 class="card-title-sub">4. Mediciones Corporales Específicas</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
                <div>
                  <h4 style="font-size: 14px; font-weight:700; margin-bottom: 10px;">Pliegues Cutáneos</h4>
                  <table class="citas-table">
                    <tr><td>Bíceps: ${exp.antropometria?.biceps || 0} mm</td><td>Tríceps: ${exp.antropometria?.triceps || 0} mm</td></tr>
                    <tr><td>Suprailiaco: ${exp.antropometria?.suprailiaco || 0} mm</td><td>Muslo: ${exp.antropometria?.musloPliegue || 0} mm</td></tr>
                    <tr><td colspan="2">Pierna: ${exp.antropometria?.piernaPliegue || 0} mm</td></tr>
                  </table>
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight:700; margin-bottom: 10px;">Circunferencias y Diámetros</h4>
                  <table class="citas-table">
                    <tr><td>B. Contraído: ${exp.antropometria?.brazoContraido || 0} cm</td><td>B. Relajado: ${exp.antropometria?.brazoRelajado || 0} cm</td></tr>
                    <tr><td>Antebrazo: ${exp.antropometria?.antebrazo || 0} cm</td><td>Muñeca: ${exp.antropometria?.muneca || 0} cm</td></tr>
                    <tr><td>Cadera: ${exp.antropometria?.cadera || 0} cm</td><td>Muslo: ${exp.antropometria?.musloCinta || 0} cm</td></tr>
                    <tr><td>Pantorrilla: ${exp.antropometria?.pantorrilla || 0} cm</td><td>Tobillo: ${exp.antropometria?.tobillo || 0} cm</td></tr>
                    <tr><td>Húmero: ${exp.antropometria?.humero || 0} cm</td><td>Rodilla: ${exp.antropometria?.rodilla || 0} cm</td></tr>
                  </table>
                </div>
              </div>

              <h3 class="card-title-sub">5. Tabla de Frecuencia de Consumo de Alimentos</h3>
              <div class="table-data-container scrollable-table-x" style="margin-bottom: 25px; overflow-x: auto; width: 100%; display: block;">
                <table class="citas-table" style="min-width: 100%;">
                  <thead>
                    <tr style="background:#f8fafc;">
                      ${colsFrecuencia.map(col => `
                        <th style="padding: 10px; font-weight: 600; min-width: 150px;">${col.nombre}</th>
                      `).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${(exp.frecuenciaAlimentos || []).map(row => `
                      <tr>
                        ${colsFrecuencia.map((col, idx) => `
                          <td style="${idx === 0 ? 'font-weight:700;' : ''} padding: 10px; min-width: 150px; vertical-align: top; word-break: break-word; white-space: pre-wrap;">${row[col.id] || '---'}</td>
                        `).join('')}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <h3 class="card-title-sub">6. Registro de 24 Horas</h3>
              <div class="table-data-container scrollable-table-x" style="margin-bottom: 25px; overflow-x: auto; width: 100%; display: block;">
                <table class="patients-data-table" style="min-width: 100%;">
                  <thead>
                    <tr style="background:#f8fafc;">
                      ${colsRegistro.map(col => `
                        <th style="padding: 10px; font-weight: 600; min-width: 150px;">${col.nombre}</th>
                      `).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${(exp.recordatorio24h || []).map(row => `
                      <tr>
                        ${colsRegistro.map((col, idx) => `
                          <td style="${idx === 0 ? 'background: #f8fafc; font-weight:600;' : ''} padding: 12px 10px; min-width: 150px; vertical-align: top; word-break: break-word; white-space: pre-wrap;">${row[col.id] || ''}</td>
                        `).join('')}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <h3 class="card-title-sub">7. Diagnóstico General</h3>
              <div class="satisfaccion-bordered-box" style="margin-bottom: 25px; padding: 15px;">
                ${exp.diagnosticoGeneral || 'No se redactó diagnóstico general en esta consulta.'}
              </div>

              <h3 class="card-title-sub">8. Observaciones</h3>
              <div class="satisfaccion-bordered-box" style="padding: 15px;">
                ${exp.observaciones || 'Sin observaciones adicionales.'}
              </div>
            </div>
          </main>
        </div>
      </div>
    `;
  }

  // Generador de lista de tarjetas para el historial
  renderListaTarjetasHistorial(lista, termino = '') {
    if (lista.length === 0) {
      return `
        <div class="card-container-white history-empty-state">
          <p>${termino ? `No se encontraron evaluaciones que coincidan con "${termino}".` : 'No se han encontrado registros previos en el historial de este paciente.'}</p>
        </div>
      `;
    }
    return lista.map((entry, index) => `
      <div class="card-container-white tarjeta-historial-click" data-fecha="${entry.datos.fecha}" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; transition: all 0.2s;">
        <div>
          <span style="font-weight:700; color:#0f172a; display:block;">
            Evaluación del ${this.formatearFechaEs(entry.datos.fecha)} ${index === 0 && !termino ? '<span style="background:#e2f0d9; color:#0f5132; padding:2px 8px; border-radius:10px; font-size:11px; margin-left:8px;">Más Reciente</span>' : ''}
          </span>
          <span style="font-size:13px; color:#475569; display:block; margin-top:4px;"><strong>Paciente:</strong> ${entry.datos.nombrePaciente}</span>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px; color:#64748b; display:block;">Peso / IMC</span>
          <strong style="color:#0f172a;">${entry.datos.peso} kg / ${entry.datos.imc}</strong>
        </div>
      </div>
    `).join('');
  }

  getTemplateHistorialLista() {
    const p = this.pacienteSeleccionado || this.pacientes[2];
    const historialesFiltrados = this.historialExpedientes
      .filter(entry => entry.pacienteId === p.id)
      .sort((a, b) => new Date(b.datos.fecha) - new Date(a.datos.fecha));

    return `
      <div class="main-layout-container">
        <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
        <div class="workspace-wrapper">
          <header class="topbar-green">
            <div class="header-back-flow">
              <button class="btn-back-apple" id="btn-cancelar-historial" title="Volver a Expediente">
                <span class="chevron-apple">‹</span>
              </button>
              <h1 class="topbar-title">Historial de Evaluaciones - ${p.nombre}</h1>
            </div>
          </header>

          <main class="main-workspace scrollable-content">
            <div class="card-container-white search-card-panel" style="margin-bottom: 20px;">
              <h3 class="search-panel-title" style="margin:0 0 10px 0; font-size:16px;">Buscar evaluación en el historial</h3>
              <div class="search-control-inline" style="display:flex; gap:10px;">
                <input type="text" id="buscar-expedientes-input" placeholder="Escribe día, mes o año (Ej: 23 de Octubre, 2020)..." style="flex:1; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; outline:none;" autocomplete="off">
                <button type="button" id="btn-buscar-expediente-historico" class="btn-header-action" style="color:#1e293b; border-color:#cbd5e1; background:#fff;">
                  <img src="assets/icons/Busqueda.png" alt="Buscar" style="width:14px;height:14px;margin-right:6px;">
                  Buscar
                </button>
              </div>
            </div>

            <div class="card-container-white" style="margin-bottom: 20px;">
              <h2 style="font-size:18px; font-weight:700; margin:0 0 5px 0;">Línea de Tiempo Clínico</h2>
              <p style="margin:0; color:#475569; font-size:14px;">Escribe arriba para filtrar en tiempo real. Haz clic en la tarjeta deseada para ver su evaluación médica.</p>
            </div>

            <div id="historial-list-container" class="history-cards-stack" style="display:flex; flex-direction:column; gap:15px;">
              ${this.renderListaTarjetasHistorial(historialesFiltrados)}
            </div>
          </main>
        </div>
      </div>
    `;
  }

  // Filtrado en tiempo real (tipo YouTube)
  filtrarHistorialLive(query = '') {
    const p = this.pacienteSeleccionado || this.pacientes[2];
    const termino = query.trim().toLowerCase();
    const container = this.querySelector('#historial-list-container');
    if (!container) return;

    const historialesFiltrados = this.historialExpedientes
      .filter(entry => entry.pacienteId === p.id)
      .sort((a, b) => new Date(b.datos.fecha) - new Date(a.datos.fecha))
      .filter(entry => {
        if (!termino) return true;
        const fechaOrig = `${entry.datos?.fecha || ''}`.toLowerCase();
        const fechaFormateada = this.formatearFechaEs(entry.datos?.fecha).toLowerCase();
        const fechaPartes = fechaOrig.split('-').reverse().join('/'); // dd/mm/yyyy
        const nombre = `${entry.datos?.nombrePaciente || ''} ${entry.datos?.apellidoPaterno || ''} ${entry.datos?.apellidoMaterno || ''}`.toLowerCase();
        return fechaOrig.includes(termino) || fechaFormateada.includes(termino) || fechaPartes.includes(termino) || nombre.includes(termino);
      });

    container.innerHTML = this.renderListaTarjetasHistorial(historialesFiltrados, query);
    this.setupHistorialCardClicks();
  }

  getTemplateFormularioExpediente() {
    const p = this.pacienteSeleccionado;
    const exp = this.expedientes[p.id] || crearExpedienteVacio();

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
                  <label>Nombres: <input type="text" id="form-nombrePaciente" value="${exp.nombrePaciente || ''}" required></label>
                  <label>Apellido Paterno: <input type="text" id="form-apellidoPaterno" value="${exp.apellidoPaterno || ''}" required></label>
                  <label>Apellido Materno: <input type="text" id="form-apellidoMaterno" value="${exp.apellidoMaterno || ''}" required></label>
                </div>
                <div class="form-grid-3-col">
                  <label>Sexo:
                    <select id="form-sexo">
                      <option value="Femenino" ${exp.sexo === 'Femenino' ? 'selected' : ''}>Femenino</option>
                      <option value="Masculino" ${exp.sexo === 'Masculino' ? 'selected' : ''}>Masculino</option>
                    </select>
                  </label>
                  <label>Edad: <input type="number" id="form-edad" value="${exp.edad || ''}" required></label>
                  <label>Ocupación: <input type="text" id="form-ocupacion" value="${exp.ocupacion || ''}"></label>
                </div>
                <div class="form-grid-3-col">
                  <label>Procedencia: <input type="text" id="form-procedencia" value="${exp.procedencia || ''}"></label>
                  <label>Escolaridad: <input type="text" id="form-escolaridad" value="${exp.escolaridad || ''}"></label>
                  <label>Actividad física (Ejercicio): <input type="text" id="form-ejercicio" value="${exp.ejercicio || ''}" placeholder="Ej: No realiza"></label>
                </div>
                <div class="form-grid-3-col">
                  <label>Fecha Evaluación: <input type="date" id="form-fecha" value="${exp.fecha || ''}"></label>
                </div>
                <label>Objetivo Clínico:
                  <textarea id="form-objetivo" class="textarea-dinamica auto-expand">${exp.objetivo || ''}</textarea>
                </label>
              </div>

              <div class="card-container-white">
                <h3 class="card-title-sub">2. Diagnóstico Antropométrico e Indicadores</h3>
                <div class="form-grid-3-col">
                  <label>Altura (m): <input type="number" step="0.01" id="form-altura" value="${exp.altura || ''}" required></label>
                  <label>Peso (kg): <input type="number" step="0.1" id="form-peso" value="${exp.peso || ''}" required></label>
                  <label>Talla (m): <input type="number" step="0.01" id="form-talla" value="${exp.talla || ''}" required></label>
                </div>
                <div class="form-grid-2-col">
                  <label>Índice de Masa Corporal (IMC): <input type="number" step="0.1" id="form-imc" value="${exp.imc || ''}"></label>
                  <label>Circunferencia de Cintura (CC) (cm): <input type="number" step="0.1" id="form-cintura" value="${exp.cintura || ''}"></label>
                </div>
              </div>

              <div class="card-container-white">
                <h3 class="card-title-sub">3. Datos Clínicos Complementarios</h3>
                <div class="form-grid-3-col">
                  <label>Gastritis: <select id="form-gastritis">
                    <option value="No" ${exp.clinicos?.gastritis === 'No' ? 'selected' : ''}>No</option>
                    <option value="Sí" ${exp.clinicos?.gastritis === 'Sí' ? 'selected' : ''}>Sí</option>
                  </select></label>
                  <label>Colitis: <select id="form-colitis">
                    <option value="No" ${exp.clinicos?.colitis === 'No' ? 'selected' : ''}>No</option>
                    <option value="Sí" ${exp.clinicos?.colitis === 'Sí' ? 'selected' : ''}>Sí</option>
                  </select></label>
                  <label>Estreñimiento: <select id="form-estrenimiento">
                    <option value="No" ${exp.clinicos?.estrenimiento === 'No' ? 'selected' : ''}>No</option>
                    <option value="Sí" ${exp.clinicos?.estrenimiento === 'Sí' ? 'selected' : ''}>Sí</option>
                  </select></label>
                </div>
                <div class="form-grid-3-col">
                  <label>Hemorroides: <select id="form-hemorroides">
                    <option value="No" ${exp.clinicos?.hemorroides === 'No' ? 'selected' : ''}>No</option>
                    <option value="Sí" ${exp.clinicos?.hemorroides === 'Sí' ? 'selected' : ''}>Sí</option>
                  </select></label>
                  <label>Alcohol Excesivo: <select id="form-alcohol">
                    <option value="No" ${exp.clinicos?.alcohol === 'No' ? 'selected' : ''}>No</option>
                    <option value="Sí" ${exp.clinicos?.alcohol === 'Sí' ? 'selected' : ''}>Sí</option>
                  </select></label>
                  <label>Hábito de Tabaco: <select id="form-tabaco">
                    <option value="No" ${exp.clinicos?.tabaco === 'No' ? 'selected' : ''}>No</option>
                    <option value="Sí" ${exp.clinicos?.tabaco === 'Sí' ? 'selected' : ''}>Sí</option>
                  </select></label>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
                  <label>Hábitos Tóxicos (Presiona ENTER para nueva viñeta):
                    <textarea id="form-habitosToxicos" class="textarea-dinamica textarea-bullet auto-expand" placeholder="• Sin hábitos tóxicos reportados">${exp.clinicos?.habitosToxicos || '• '}</textarea>
                  </label>
                  <label>Patologías Previas:
                    <textarea id="form-patologias" class="textarea-dinamica auto-expand" placeholder="Ej: Hipertensión, Diabetes">${exp.clinicos?.patologias || ''}</textarea>
                  </label>
                </div>

                <label>Alergias (Presiona ENTER para nueva viñeta):
                  <textarea id="form-alergias" class="textarea-dinamica textarea-bullet auto-expand" placeholder="• Sin alergias conocidas">${exp.clinicos?.alergias || '• '}</textarea>
                </label>

                <label>Antecedentes Familiares (Presiona ENTER para nueva viñeta):
                  <textarea id="form-antecedentesFamiliares" class="textarea-dinamica textarea-bullet auto-expand" placeholder="• Sin antecedentes familiares relevantes">${exp.clinicos?.antecedentesFamiliares || '• '}</textarea>
                </label>

                <label>Medicamentos o Suplementos:
                  <textarea id="form-medicamentos" class="textarea-dinamica auto-expand" placeholder="Ej: Metformina 850mg c/12hrs">${exp.clinicos?.medicamentos || ''}</textarea>
                </label>
              </div>

              <div class="card-container-white">
                <h3 class="card-title-sub">4. Mediciones Corporales Específicas</h3>
                <h4 style="font-size:14px;font-weight:700;margin-bottom:10px;">Pliegues Cutáneos (mm)</h4>
                <div class="form-grid-3-col">
                  <label>Bíceps: <input type="number" id="form-biceps" value="${exp.antropometria?.biceps || ''}"></label>
                  <label>Tríceps: <input type="number" id="form-triceps" value="${exp.antropometria?.triceps || ''}"></label>
                  <label>Suprailiaco: <input type="number" id="form-suprailiaco" value="${exp.antropometria?.suprailiaco || ''}"></label>
                </div>
                <div class="form-grid-2-col">
                  <label>Muslo: <input type="number" id="form-musloPliegue" value="${exp.antropometria?.musloPliegue || ''}"></label>
                  <label>Pierna: <input type="number" id="form-piernaPliegue" value="${exp.antropometria?.piernaPliegue || ''}"></label>
                </div>

                <h4 style="font-size:14px;font-weight:700;margin:20px 0 10px 0;">Circunferencias (cm) y Diámetros (cm)</h4>
                <div class="form-grid-3-col">
                  <label>Brazo Contraído: <input type="number" step="0.1" id="form-brazoContraido" value="${exp.antropometria?.brazoContraido || ''}"></label>
                  <label>Brazo Relajado: <input type="number" step="0.1" id="form-brazoRelajado" value="${exp.antropometria?.brazoRelajado || ''}"></label>
                  <label>Antebrazo: <input type="number" step="0.1" id="form-antebrazo" value="${exp.antropometria?.antebrazo || ''}"></label>
                </div>
                <div class="form-grid-3-col">
                  <label>Muñeca: <input type="number" step="0.1" id="form-muneca" value="${exp.antropometria?.muneca || ''}"></label>
                  <label>Cadera: <input type="number" step="0.1" id="form-cadera" value="${exp.antropometria?.cadera || ''}"></label>
                  <label>Muslo (Cinta): <input type="number" step="0.1" id="form-musloCinta" value="${exp.antropometria?.musloCinta || ''}"></label>
                </div>
                <div class="form-grid-3-col">
                  <label>Pantorrilla: <input type="number" step="0.1" id="form-pantorrilla" value="${exp.antropometria?.pantorrilla || ''}"></label>
                  <label>Tobillo: <input type="number" step="0.1" id="form-tobillo" value="${exp.antropometria?.tobillo || ''}"></label>
                  <label>Diámetro Húmero: <input type="number" step="0.1" id="form-humero" value="${exp.antropometria?.humero || ''}"></label>
                </div>
                <div class="form-grid-3-col">
                  <label>Diámetro Rodilla: <input type="number" step="0.1" id="form-rodilla" value="${exp.antropometria?.rodilla || ''}"></label>
                </div>
              </div>

              <div class="card-container-white">
                <h3 class="card-title-sub" style="margin-bottom: 2px;">5. Frecuencia de Consumo de Alimentos</h3>
                <p style="font-size: 11px; color:#64748b; margin-bottom: 12px; font-weight:600;">💡 Tip: Da click derecho sobre cualquier celda para Añadir/Eliminar filas o columnas de forma rápida, y edita el nombre de los cabezales si lo necesitas.</p>
                <div class="table-data-container scrollable-table-x" style="overflow-x: auto; width: 100%; display: block;">
                  <table class="patients-data-table" id="tabla-dinamica-frecuencias" style="min-width: 100%;">
                    <thead id="thead-tabla-frecuencias"></thead>
                    <tbody id="body-tabla-frecuencias"></tbody>
                  </table>
                </div>
              </div>

              <div class="card-container-white">
                <h3 class="card-title-sub" style="margin-bottom: 2px;">6. Registro de 24 Horas</h3>
                <p style="font-size: 11px; color:#64748b; margin-bottom: 12px; font-weight:600;">💡 Tip: Da click derecho sobre cualquier celda para Añadir/Eliminar filas o columnas de forma rápida, y edita el nombre de los cabezales si lo necesitas.</p>
                <div class="table-data-container scrollable-table-x" style="overflow-x: auto; width: 100%; display: block;">
                  <table class="patients-data-table" id="tabla-dinamica-registro24h" style="min-width: 100%;">
                    <thead id="thead-tabla-registro24h"></thead>
                    <tbody id="body-tabla-registro24h"></tbody>
                  </table>
                </div>
              </div>

              <div class="card-container-white">
                <h3 class="card-title-sub">7. Diagnóstico Clínico</h3>
                <label>Diagnóstico General:
                  <textarea id="form-diagnosticoGeneral" class="textarea-dinamica auto-expand" placeholder="Escriba su diagnóstico general aquí...">${exp.diagnosticoGeneral || ''}</textarea>
                </label>

                <label>Observaciones (Presiona ENTER para nueva viñeta):
                  <textarea id="form-observaciones" class="textarea-dinamica textarea-bullet auto-expand" placeholder="• Liste aquí las observaciones que tuvo durante la cita...">${exp.observaciones || '• '}</textarea>
                </label>
              </div>

              <div style="margin-top: 25px; display:flex; justify-content: flex-end;">
                <button type="submit" class="btn-nuevo-paciente" style="padding: 12px 30px;">
                  <img src="assets/icons/añadir.png" alt="Guardar" style="width:14px;height:14px;margin-right:8px;">
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
    const styleReset = `
      <style>
        .input-header-frecuencia:focus, .input-header-registro24h:focus,
        .input-celda-frecuencia:focus, .input-celda-registro24h:focus {
          outline: none !important; border: none !important; box-shadow: none !important; background: transparent !important;
        }
      </style>
    `;

    const theadFrecuencias = this.querySelector('#thead-tabla-frecuencias');
    const bodyFrecuencias = this.querySelector('#body-tabla-frecuencias');
    if (theadFrecuencias && bodyFrecuencias) {
      theadFrecuencias.innerHTML = styleReset + `
        <tr style="background:#f1f5f9;">
          ${this.columnasFrecuenciaTemporal.map((col, colIdx) => `
            <th class="context-cell-frecuencia" data-col-index="${colIdx}" style="padding: 10px; min-width: 150px; vertical-align: top; border-bottom: 2px solid #cbd5e1;">
              <textarea spellcheck="false" class="input-header-frecuencia" rows="1" style="font-weight:700; width:100%; border:none !important; outline:none !important; box-shadow:none !important; background:transparent !important; resize:none; overflow:hidden; font-family:inherit; font-size:inherit; word-break:break-word; color:#0f172a; padding:0; margin:0;" data-col-index="${colIdx}">${col.nombre}</textarea>
            </th>
          `).join('')}
        </tr>
      `;
      bodyFrecuencias.innerHTML = this.tablaFrecuenciaTemporal.map((row, rowIdx) => `
        <tr class="context-row-frecuencia" data-row-index="${rowIdx}">
          ${this.columnasFrecuenciaTemporal.map((col, colIdx) => `
            <td class="context-cell-frecuencia" data-row-index="${rowIdx}" data-col-index="${colIdx}" style="padding: 8px 10px; min-width: 150px; vertical-align: top; border-bottom: 1px solid #e2e8f0;">
              <textarea spellcheck="false" class="input-celda-frecuencia" rows="1" style="${colIdx === 0 ? 'font-weight:700;' : ''} width:100%; border:none !important; outline:none !important; box-shadow:none !important; background:transparent !important; resize:none; overflow:hidden; font-family:inherit; font-size:inherit; word-break:break-word; color:#1e293b; padding:0; margin:0;" data-row-index="${rowIdx}" data-field="${col.id}" placeholder="${colIdx === 1 ? 'Ej: 2 veces/día' : colIdx === 2 ? 'Detalles...' : ''}">${row[col.id] || ''}</textarea>
            </td>
          `).join('')}
        </tr>
      `).join('');
    }

    const theadRegistro = this.querySelector('#thead-tabla-registro24h');
    const bodyRegistro24h = this.querySelector('#body-tabla-registro24h');
    if (theadRegistro && bodyRegistro24h) {
      theadRegistro.innerHTML = styleReset + `
        <tr style="background:#f1f5f9;">
          ${this.columnasRegistro24hTemporal.map((col, colIdx) => `
            <th class="context-cell-registro" data-col-index="${colIdx}" style="padding: 10px; min-width: 150px; vertical-align: top; border-bottom: 2px solid #cbd5e1;">
              <textarea spellcheck="false" class="input-header-registro24h" rows="1" style="font-weight:700; width:100%; border:none !important; outline:none !important; box-shadow:none !important; background:transparent !important; resize:none; overflow:hidden; font-family:inherit; font-size:inherit; word-break:break-word; color:#0f172a; padding:0; margin:0;" data-col-index="${colIdx}">${col.nombre}</textarea>
            </th>
          `).join('')}
        </tr>
      `;
      bodyRegistro24h.innerHTML = this.tablaRegistro24hTemporal.map((row, rowIdx) => `
        <tr class="context-row-registro" data-row-index="${rowIdx}">
          ${this.columnasRegistro24hTemporal.map((col, colIdx) => `
            <td class="context-cell-registro" data-row-index="${rowIdx}" data-col-index="${colIdx}" style="${colIdx === 0 ? 'background:#f8fafc; font-weight:700;' : ''} padding: 8px 10px; min-width: 150px; vertical-align: top; border-bottom: 1px solid #e2e8f0;">
              <textarea spellcheck="false" class="input-celda-registro24h" rows="1" style="${colIdx === 0 ? 'font-weight:700;' : ''} width:100%; border:none !important; outline:none !important; box-shadow:none !important; background:transparent !important; resize:none; overflow:hidden; font-family:inherit; font-size:inherit; word-break:break-word; color:#1e293b; padding:0; margin:0;" data-row-index="${rowIdx}" data-field="${col.id}">${row[col.id] || ''}</textarea>
            </td>
          `).join('')}
        </tr>
      `).join('');
    }

    setTimeout(() => {
      this.querySelectorAll('.input-header-frecuencia, .input-header-registro24h, .input-celda-frecuencia, .input-celda-registro24h').forEach(textarea => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      });
    }, 0);

    this.setupListenersTablasDinamicas();
    this.setupMenuContextualTablas();
  }

  setupMenuContextualTablas() {
    const celdasFrecuencia = this.querySelectorAll('.context-cell-frecuencia');
    celdasFrecuencia.forEach(cell => {
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rowIndex = cell.hasAttribute('data-row-index') ? parseInt(cell.getAttribute('data-row-index'), 10) : -1;
        const colIndex = parseInt(cell.getAttribute('data-col-index'), 10);
        this.mostrarMenuContextualPersonalizado(e.clientX, e.clientY, 'frecuencia', rowIndex, colIndex);
      });
    });

    const celdasRegistro = this.querySelectorAll('.context-cell-registro');
    celdasRegistro.forEach(cell => {
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rowIndex = cell.hasAttribute('data-row-index') ? parseInt(cell.getAttribute('data-row-index'), 10) : -1;
        const colIndex = parseInt(cell.getAttribute('data-col-index'), 10);
        this.mostrarMenuContextualPersonalizado(e.clientX, e.clientY, 'registro', rowIndex, colIndex);
      });
    });
  }

  mostrarMenuContextualPersonalizado(x, y, tipoTabla, rowIndex, colIndex) {
    this.cerrarMenuContextualGlobal();

    const menu = document.createElement('div');
    menu.id = 'menu-contextual-tabla';
    menu.style.position = 'fixed';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.background = '#ffffff';
    menu.style.border = '1px solid #cbd5e1';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    menu.style.padding = '6px 0';
    menu.style.zIndex = '10000';
    menu.style.minWidth = '180px';

    const itemAnadirFila = document.createElement('div');
    itemAnadirFila.innerText = 'Añadir fila abajo';
    this.estilizarItemMenuContextual(itemAnadirFila);
    itemAnadirFila.addEventListener('click', () => {
      const insertIdx = rowIndex !== -1 ? rowIndex + 1 : (tipoTabla === 'frecuencia' ? this.tablaFrecuenciaTemporal.length : this.tablaRegistro24hTemporal.length);
      if (tipoTabla === 'frecuencia') {
        const newRow = {};
        this.columnasFrecuenciaTemporal.forEach((col, idx) => { newRow[col.id] = idx === 0 ? "Nuevo Grupo" : ""; });
        this.tablaFrecuenciaTemporal.splice(insertIdx, 0, newRow);
      } else {
        const newRow = {};
        this.columnasRegistro24hTemporal.forEach((col, idx) => { newRow[col.id] = idx === 0 ? "Nueva Comida" : ""; });
        this.tablaRegistro24hTemporal.splice(insertIdx, 0, newRow);
      }
      this.renderTablasDinamicasFormulario();
    });
    menu.appendChild(itemAnadirFila);

    if (rowIndex !== -1) {
      const itemEliminarFila = document.createElement('div');
      itemEliminarFila.innerText = 'Eliminar esta fila';
      this.estilizarItemMenuContextual(itemEliminarFila);
      itemEliminarFila.style.color = '#ef4444';
      itemEliminarFila.addEventListener('click', () => {
        if (tipoTabla === 'frecuencia') {
          this.tablaFrecuenciaTemporal.splice(rowIndex, 1);
        } else {
          this.tablaRegistro24hTemporal.splice(rowIndex, 1);
        }
        this.renderTablasDinamicasFormulario();
      });
      menu.appendChild(itemEliminarFila);
    }

    const divisor = document.createElement('div');
    divisor.style.height = '1px';
    divisor.style.background = '#e2e8f0';
    divisor.style.margin = '4px 0';
    menu.appendChild(divisor);

    const itemAnadirColumna = document.createElement('div');
    itemAnadirColumna.innerText = 'Añadir columna a la derecha';
    this.estilizarItemMenuContextual(itemAnadirColumna);
    itemAnadirColumna.addEventListener('click', () => {
      const newColId = 'col_' + Date.now();
      const newColObj = { id: newColId, nombre: 'Nueva Columna' };
      if (tipoTabla === 'frecuencia') {
        this.columnasFrecuenciaTemporal.splice(colIndex + 1, 0, newColObj);
        this.tablaFrecuenciaTemporal.forEach(row => { row[newColId] = ""; });
      } else {
        this.columnasRegistro24hTemporal.splice(colIndex + 1, 0, newColObj);
        this.tablaRegistro24hTemporal.forEach(row => { row[newColId] = ""; });
      }
      this.renderTablasDinamicasFormulario();
    });
    menu.appendChild(itemAnadirColumna);

    const itemEliminarColumna = document.createElement('div');
    itemEliminarColumna.innerText = 'Eliminar esta columna';
    this.estilizarItemMenuContextual(itemEliminarColumna);
    itemEliminarColumna.style.color = '#ef4444';
    itemEliminarColumna.addEventListener('click', () => {
      if (tipoTabla === 'frecuencia') {
        if (this.columnasFrecuenciaTemporal.length <= 1) {
          alert('La tabla debe conservar al menos una columna.');
          return;
        }
        const colToRemove = this.columnasFrecuenciaTemporal[colIndex];
        this.columnasFrecuenciaTemporal.splice(colIndex, 1);
        this.tablaFrecuenciaTemporal.forEach(row => { delete row[colToRemove.id]; });
      } else {
        if (this.columnasRegistro24hTemporal.length <= 1) {
          alert('La tabla debe conservar al menos una columna.');
          return;
        }
        const colToRemove = this.columnasRegistro24hTemporal[colIndex];
        this.columnasRegistro24hTemporal.splice(colIndex, 1);
        this.tablaRegistro24hTemporal.forEach(row => { delete row[colToRemove.id]; });
      }
      this.renderTablasDinamicasFormulario();
    });
    menu.appendChild(itemEliminarColumna);

    document.body.appendChild(menu);
  }

  estilizarItemMenuContextual(item) {
    item.style.padding = '8px 14px';
    item.style.fontSize = '13px';
    item.style.fontWeight = '500';
    item.style.cursor = 'pointer';
    item.style.transition = 'background 0.1s ease';
    
    item.addEventListener('mouseenter', () => {
      item.style.background = '#f1f5f9';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = 'transparent';
    });
  }

  cerrarMenuContextualGlobal() {
    const menuExistente = document.getElementById('menu-contextual-tabla');
    if (menuExistente) {
      menuExistente.remove();
    }
  }

  setupListenersTablasDinamicas() {
    const autoResize = (target) => {
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    };

    this.querySelectorAll('.input-header-frecuencia').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-col-index'), 10);
        this.columnasFrecuenciaTemporal[idx].nombre = e.target.value;
        autoResize(e.target);
      });
    });

    this.querySelectorAll('.input-header-registro24h').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-col-index'), 10);
        this.columnasRegistro24hTemporal[idx].nombre = e.target.value;
        autoResize(e.target);
      });
    });

    this.querySelectorAll('.input-celda-frecuencia').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-row-index'), 10);
        const campo = e.target.getAttribute('data-field');
        this.tablaFrecuenciaTemporal[idx][campo] = e.target.value;
        autoResize(e.target);
      });
    });

    this.querySelectorAll('.input-celda-registro24h').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-row-index'), 10);
        const campo = e.target.getAttribute('data-field');
        this.tablaRegistro24hTemporal[idx][campo] = e.target.value;
        autoResize(e.target);
      });
    });
  }

  // Listener para clics en tarjetas del historial
  setupHistorialCardClicks() {
    this.querySelectorAll('.tarjeta-historial-click').forEach(tarjeta => {
      tarjeta.addEventListener('click', (e) => {
        const fechaSeleccionada = e.currentTarget.getAttribute('data-fecha');
        const pId = this.pacienteSeleccionado?.id;
        if (!pId) return;

        const coincidencia = this.historialExpedientes.find(entry =>
          entry.pacienteId === pId && entry.datos.fecha === fechaSeleccionada
        );

        if (coincidencia) {
          this.expedientes[pId] = JSON.parse(JSON.stringify(coincidencia.datos));
          this.cambiarVista('ver-expediente');
        }
      });
    });
  }

  setupEventListeners() {
    const btnRegresar = this.querySelector('#btn-regresar-lista');
    if (btnRegresar) {
      btnRegresar.addEventListener('click', () => this.cambiarVista('lista'));
    }

    const footerPacientes = this.querySelector('#footer-toggle-pacientes');
    if (footerPacientes) {
      footerPacientes.addEventListener('click', () => {
        this.limitePacientes = this.limitePacientes > 3 ? 3 : this.pacientes.length;
        this.render();
      });
    }

    const btnToggleCitas = this.querySelector('#btn-toggle-citas');
    if (btnToggleCitas) {
      btnToggleCitas.addEventListener('click', () => {
        this.limiteCitas = this.limiteCitas > 4 ? 4 : this.todasLasCitas.length;
        this.render();
      });
    }

    this.querySelectorAll('.row-paciente-item').forEach(row => {
      row.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.cambiarVista('perfil', id);
      });
    });

    const btnAnadirNuevoExpediente = this.querySelector('#btn-anadir-nuevo-expediente');
    if (btnAnadirNuevoExpediente) {
      btnAnadirNuevoExpediente.addEventListener('click', () => this.cambiarVista('crear-expediente'));
    }

    const btnVerExpediente = this.querySelector('#btn-ver-expediente');
    if (btnVerExpediente) {
      btnVerExpediente.addEventListener('click', () => this.cambiarVista('ver-expediente'));
    }

    const btnVerDiagnostico = this.querySelector('#btn-ver-diagnostico');
    if (btnVerDiagnostico) {
      btnVerDiagnostico.addEventListener('click', () => {
        this.mostrarModalDiagnostico = true;
        this.render();
      });
    }

    const btnCerrarModalDiagnostico = this.querySelector('#btn-cerrar-modal-diagnostico');
    if (btnCerrarModalDiagnostico) {
      btnCerrarModalDiagnostico.addEventListener('click', () => {
        this.mostrarModalDiagnostico = false;
        this.render();
      });
    }

    const btnRegresarPerfil = this.querySelector('#btn-regresar-perfil');
    if (btnRegresarPerfil) {
      btnRegresarPerfil.addEventListener('click', () => this.cambiarVista('perfil'));
    }

    const btnAnadirExpediente = this.querySelector('#btn-anadir-expediente');
    if (btnAnadirExpediente) {
      btnAnadirExpediente.addEventListener('click', () => this.cambiarVista('crear-expediente'));
    }

    const btnEditarExpediente = this.querySelector('#btn-editar-expediente');
    if (btnEditarExpediente) {
      btnEditarExpediente.addEventListener('click', () => this.cambiarVista('crear-expediente'));
    }

    const btnCancelarFormulario = this.querySelector('#btn-cancelar-formulario');
    if (btnCancelarFormulario) {
      btnCancelarFormulario.addEventListener('click', () => {
        const destino = this.expedientes[this.pacienteSeleccionado?.id] ? 'ver-expediente' : 'perfil';
        this.cambiarVista(destino);
      });
    }

    const btnEliminarExpediente = this.querySelector('#btn-eliminar-expediente');
    if (btnEliminarExpediente) {
      btnEliminarExpediente.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar este expediente? No se puede recuperar.')) {
          delete this.expedientes[this.pacienteSeleccionado?.id];
          this.cambiarVista('ver-expediente');
        }
      });
    }

    const btnIrHistorial = this.querySelector('#btn-ir-historial');
    if (btnIrHistorial) {
      btnIrHistorial.addEventListener('click', () => {
        this.cambiarVista('historial-lista');
      });
    }

    const btnCancelarHistorial = this.querySelector('#btn-cancelar-historial');
    if (btnCancelarHistorial) {
      btnCancelarHistorial.addEventListener('click', () => {
        this.cambiarVista('ver-expediente');
      });
    }

    // Configuración de búsqueda en tiempo real en el Historial
    const inputBuscarHist = this.querySelector('#buscar-expedientes-input');
    const btnBuscarHist = this.querySelector('#btn-buscar-expediente-historico');
    if (inputBuscarHist) {
      inputBuscarHist.addEventListener('input', (e) => {
        this.filtrarHistorialLive(e.target.value);
      });
      inputBuscarHist.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.filtrarHistorialLive(inputBuscarHist.value);
        }
      });
    }
    if (btnBuscarHist && inputBuscarHist) {
      btnBuscarHist.addEventListener('click', (e) => {
        e.preventDefault();
        this.filtrarHistorialLive(inputBuscarHist.value);
      });
    }

    this.setupHistorialCardClicks();

    const formExpediente = this.querySelector('#expediente-form');
    if (formExpediente) {
      formExpediente.addEventListener('submit', (e) => {
        e.preventDefault();
        const pId = this.pacienteSeleccionado?.id;

        if (!pId) return;

        const nuevoExpedienteStruct = {
          fecha: this.querySelector('#form-fecha').value,
          nombrePaciente: this.querySelector('#form-nombrePaciente').value,
          apellidoPaterno: this.querySelector('#form-apellidoPaterno').value,
          apellidoMaterno: this.querySelector('#form-apellidoMaterno').value,
          sexo: this.querySelector('#form-sexo').value,
          edad: parseInt(this.querySelector('#form-edad').value, 10) || 0,
          ocupacion: this.querySelector('#form-ocupacion').value,
          procedencia: this.querySelector('#form-procedencia').value,
          escolaridad: this.querySelector('#form-escolaridad').value,
          ejercicio: this.querySelector('#form-ejercicio').value,
          objetivo: this.querySelector('#form-objetivo').value,
          altura: parseFloat(this.querySelector('#form-altura').value) || 0,
          peso: parseFloat(this.querySelector('#form-peso').value) || 0,
          talla: parseFloat(this.querySelector('#form-talla').value) || 0,
          imc: parseFloat(this.querySelector('#form-imc').value) || 0,
          cintura: parseFloat(this.querySelector('#form-cintura').value) || 0,
          clinicos: {
            alcohol: this.querySelector('#form-alcohol').value,
            tabaco: this.querySelector('#form-tabaco').value,
            habitosToxicos: this.querySelector('#form-habitosToxicos').value,
            patologias: this.querySelector('#form-patologias').value,
            gastritis: this.querySelector('#form-gastritis').value,
            colitis: this.querySelector('#form-colitis').value,
            estrenimiento: this.querySelector('#form-estrenimiento').value,
            hemorroides: this.querySelector('#form-hemorroides').value,
            medicamentos: this.querySelector('#form-medicamentos').value,
            alergias: this.querySelector('#form-alergias').value,
            antecedentesFamiliares: this.querySelector('#form-antecedentesFamiliares').value
          },
          columnasFrecuencia: JSON.parse(JSON.stringify(this.columnasFrecuenciaTemporal)),
          frecuenciaAlimentos: JSON.parse(JSON.stringify(this.tablaFrecuenciaTemporal)),
          columnasRegistro24h: JSON.parse(JSON.stringify(this.columnasRegistro24hTemporal)),
          recordatorio24h: JSON.parse(JSON.stringify(this.tablaRegistro24hTemporal)),
          observaciones: this.querySelector('#form-observaciones').value,
          diagnosticoGeneral: this.querySelector('#form-diagnosticoGeneral').value,
          antropometria: {
            biceps: parseFloat(this.querySelector('#form-biceps').value) || 0,
            triceps: parseFloat(this.querySelector('#form-triceps').value) || 0,
            suprailiaco: parseFloat(this.querySelector('#form-suprailiaco').value) || 0,
            musloPliegue: parseFloat(this.querySelector('#form-musloPliegue').value) || 0,
            piernaPliegue: parseFloat(this.querySelector('#form-piernaPliegue').value) || 0,
            brazoContraido: parseFloat(this.querySelector('#form-brazoContraido').value) || 0,
            brazoRelajado: parseFloat(this.querySelector('#form-brazoRelajado').value) || 0,
            antebrazo: parseFloat(this.querySelector('#form-antebrazo').value) || 0,
            muneca: parseFloat(this.querySelector('#form-muneca').value) || 0,
            cadera: parseFloat(this.querySelector('#form-cadera').value) || 0,
            musloCinta: parseFloat(this.querySelector('#form-musloCinta').value) || 0,
            pantorrilla: parseFloat(this.querySelector('#form-pantorrilla').value) || 0,
            tobillo: parseFloat(this.querySelector('#form-tobillo').value) || 0,
            humero: parseFloat(this.querySelector('#form-humero').value) || 0,
            rodilla: parseFloat(this.querySelector('#form-rodilla').value) || 0
          }
        };

        this.expedientes[pId] = JSON.parse(JSON.stringify(nuevoExpedienteStruct));

        const nombreCompleto = `${nuevoExpedienteStruct.nombrePaciente} ${nuevoExpedienteStruct.apellidoPaterno} ${nuevoExpedienteStruct.apellidoMaterno}`.trim();
        this.historialExpedientes.push({
          identificadorHistorial: `${this.formatearFechaEs(nuevoExpedienteStruct.fecha)} - ${nombreCompleto}`,
          pacienteId: pId,
          datos: JSON.parse(JSON.stringify(nuevoExpedienteStruct))
        });

        this.cambiarVista('ver-expediente');
      });
    }

    const searchInput = this.querySelector('#global-search-input');
    const dropdown = this.querySelector('#dropdown-clientes-nuevos');
    const resultsList = this.querySelector('#dropdown-results-list');
    const toggleNewClients = this.querySelector('#toggle-new-clients');

    if (searchInput) {
      const filtrarYMostrarResultados = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query === '') {
          if (dropdown) dropdown.classList.add('hidden-dropdown');
          return;
        }

        const soloNuevos = toggleNewClients ? toggleNewClients.checked : false;
        const filtrados = this.pacientes.filter(p => {
          const coincideNombre = p.nombre.toLowerCase().includes(query);
          return soloNuevos ? (coincideNombre && p.esNuevo) : coincideNombre;
        });

        if (filtrados.length === 0) {
          resultsList.innerHTML = '<div class="dropdown-empty-state">No hay coincidencias</div>';
        } else {
          resultsList.innerHTML = filtrados.map(p => `
            <div class="dropdown-item-row" data-id="${p.id}">
              <div class="avatar-circle small-avatar">
                <img src="${p.avatar}" alt="${p.nombre}" class="avatar-img">
                <span>${p.iniciales}</span>
              </div>
              <div class="patient-name-id">
                <h4>${p.nombre}</h4>
                <span>ID: ${p.id}</span>
              </div>
            </div>
          `).join('');
        }

        if (dropdown) dropdown.classList.remove('hidden-dropdown');
        this.setupDropdownRowClicks();
      };

      searchInput.addEventListener('input', filtrarYMostrarResultados);
      if (toggleNewClients) {
        toggleNewClients.addEventListener('change', filtrarYMostrarResultados);
      }
    }

    document.addEventListener('click', (e) => {
      if (!this.querySelector('.search-context-container')?.contains(e.target)) {
        if (dropdown) dropdown.classList.add('hidden-dropdown');
      }
    });
  }

  setupDropdownRowClicks() {
    this.querySelectorAll('.dropdown-item-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const dropdown = this.querySelector('#dropdown-clientes-nuevos');
        if (dropdown) dropdown.classList.add('hidden-dropdown');
        this.cambiarVista('perfil', id);
      });
    });
  }
}
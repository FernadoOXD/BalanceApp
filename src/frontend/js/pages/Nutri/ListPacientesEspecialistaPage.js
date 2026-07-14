export class ListPacientesEspecialistaPage extends HTMLElement {
  constructor() {
    super();
    this.vistaActual = 'lista';
    this.pacienteSeleccionado = null;

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

    this.expedientes = {
      "PAC-1043": {
        fecha: "2020-10-23",
        nombrePaciente: "Deysi Alejandra Ruiz Hernández",
        sexo: "Femenino",
        edad: 28,
        ocupacion: "Ama de casa",
        procedencia: "Tuxtla Gutiérrez, Chiapas",
        escolaridad: "Primaria",
        ejercicio: "No realiza",
        objetivo: "Aplicar la metodología adecuada para realizar diagnósticos del estado nutricio en la juventud...",
        peso: 43.3,
        talla: 1.48,
        imc: 19.7,
        cintura: 73.8,
        clinicos: {
          alcohol: "No",
          tabaco: "No",
          gastritis: "No",
          colitis: "No",
          estrenimiento: "No",
          hemorroides: "No",
          medicamentos: "Ninguno"
        },
        frecuenciaAlimentos: "Lácteos: Leche (diario, 2 veces al día).\nLeguminosas: Frijol (diario, 1 o 2 veces al día).",
        recordatorio24h: "Desayuno (9:00 am): Huevo (2 piezas) con chorizo (20 g)...",
        antropometria: {
          biceps: 12,
          triceps: 12,
          suprailiaco: 12,
          musloPliegue: 21,
          piernaPliegue: 20,
          brazoContraido: 23,
          brazoRelajado: 26,
          antebrazo: 21,
          muneca: 14,
          cadera: 87,
          musloCinta: 82.6,
          pantorrilla: 23.2,
          tobillo: 20,
          humero: 5.8,
          rodilla: 8.9
        }
      }
    };
  }

  connectedCallback() {
    this.render();
  }

  setupAutoResizeTextareas() {
    const textareas = this.querySelectorAll('.textarea-dinamica');
    textareas.forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;

      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      });
    });
  }

  cambiarVista(nuevaVista, idPaciente = null) {
    this.vistaActual = nuevaVista;

    if (idPaciente) {
      this.pacienteSeleccionado = this.pacientes.find(p => p.id === idPaciente) || this.pacientes[2];
    }

    if (nuevaVista === 'lista' || nuevaVista === 'perfil') {
      this.limitePacientes = 3;
      this.limiteCitas = 4;
    }

    this.render();
  }

  render() {
    if (this.vistaActual === 'lista') this.innerHTML = this.getTemplateLista();
    else if (this.vistaActual === 'perfil') this.innerHTML = this.getTemplatePerfil();
    else if (this.vistaActual === 'ver-expediente') this.innerHTML = this.getTemplateVerExpediente();
    else if (this.vistaActual === 'crear-expediente') this.innerHTML = this.getTemplateFormularioExpediente();

    this.setupEventListeners();

    if (this.vistaActual === 'crear-expediente') {
      this.setupAutoResizeTextareas();
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
              <div id="dropdown-clientes-nuevos" class="dropdown-floating" style="display: none;">
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
              <img src="assets/icons/notificacionBlanca.png" alt="Notificaciones">
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
                    <th style="width: 40%;">PACIENTE</th>
                    <th style="width: 30%;">ÚLTIMO REPORTE</th>
                    <th style="width: 30%;">ESTADO CUMPLIMIENTO</th>
                  </tr>
                </thead>
                <tbody>
                  ${pacientesVisibles.map(p => `
                    <tr class="row-paciente-item" data-id="${p.id}">
                      <td class="cell-profile-wrapper">
                        <div class="avatar-circle">
                          <img src="${p.avatar}" alt="${p.nombre}" onerror="this.style.display='none';">
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
              <img src="assets/icons/notificacionBlanca.png" alt="Notificaciones">
              <div class="user-avatar-topbar"></div>
            </div>
          </header>

          <div class="perfil-grid-layout">
            <div>
              <div class="perfil-card-header">
                <div class="header-left-info">
                  <div class="avatar-large">
                    <img src="${p.avatar}" alt="${p.nombre}" onerror="this.style.display='none';">
                  </div>
                  <div>
                    <h2>${p.nombre}</h2>
                    <p class="role-label">Paciente</p>
                    <span class="id-label">ID: ${p.id}</span>
                  </div>
                </div>
                <div class="actions-buttons-header">
                  <button class="btn-outline-action" id="btn-ver-expediente">📂 Ver Expediente Completo</button>
                  <button class="btn-outline-action">📋 Ver Diagnósticos</button>
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
                        <td style="text-align: right;"><button class="btn-table-details">Ver Detalles</button></td>
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
                  <p class="next-appointment-date">Siguiente Cita: 25 May, 10:00 AM</p>
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
    `;
  }

  getTemplateVerExpediente() {
    const p = this.pacienteSeleccionado;
    const exp = this.expedientes[p.id];

    if (!exp) {
      return `
        <div class="main-layout-container">
          <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
          <div class="workspace-wrapper">
            <header class="topbar-green">
              <div class="header-back-flow">
                <button class="btn-back-apple" id="btn-regresar-perfil"><span class="chevron-apple">‹</span></button>
                <h1 class="topbar-title">Expediente Clínico - ${p.nombre}</h1>
              </div>
            </header>
            <main class="main-workspace" style="text-align: center; padding-top: 50px;">
              <div class="card-container-white" style="max-width: 500px; margin: 0 auto; padding: 40px;">
                <p class="no-appointments-label" style="font-size: 1.2rem; margin-bottom: 20px;">No hay expedientes clínicos registrados para este paciente.</p>
                <button class="btn-nuevo-paciente" id="btn-anadir-expediente" style="float: none; margin: 0 auto;">+ Añadir Expediente</button>
              </div>
            </main>
          </div>
        </div>
      `;
    }

    return `
      <div class="main-layout-container">
        <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
        <div class="workspace-wrapper">
          <header class="topbar-green">
            <div class="header-back-flow">
              <button class="btn-back-apple" id="btn-regresar-perfil"><span class="chevron-apple">‹</span></button>
              <h1 class="topbar-title">Expediente de ${exp.nombrePaciente || p.nombre}</h1>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; margin-right: 20px;">
              <button class="btn-outline-action" id="btn-editar-expediente" style="background: white; color: #2e7d32;">✏️ Editar Expediente</button>
              <button class="btn-outline-action" id="btn-eliminar-expediente" style="background: #c62828; color: white; border-color: #c62828;">🗑️ Eliminar</button>
            </div>
          </header>

          <main class="main-workspace" style="padding: 20px; overflow-y: auto; max-height: calc(100vh - 80px);">
            <div class="card-container-white" style="display: flex; flex-direction: column; gap: 20px;">
              <h2 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 5px; margin-bottom: 15px;">VALORACIÓN DEL ESTADO NUTRICIO</h2>
              
              <h3 style="color:#555;">1. Datos Generales de la Paciente</h3>
              <table class="citas-table">
                <tr><td><strong>Nombre Completo:</strong> ${exp.nombrePaciente}</td><td><strong>Sexo:</strong> ${exp.sexo}</td><td><strong>Edad:</strong> ${exp.edad} años</td></tr>
                <tr><td><strong>Ocupación:</strong> ${exp.ocupacion}</td><td><strong>Procedencia:</strong> ${exp.procedencia}</td><td><strong>Escolaridad:</strong> ${exp.escolaridad}</td></tr>
                <tr><td colspan="2"><strong>Actividad Física:</strong> ${exp.ejercicio}</td><td><strong>Fecha Evaluación:</strong> ${exp.fecha}</td></tr>
                <tr><td colspan="3"><strong>Objetivo Nutricional:</strong> ${exp.objetivo}</td></tr>
              </table>

              <h3 style="color:#555;">2. Diagnóstico Antropométrico e Indicadores</h3>
              <table class="citas-table">
                <tr><td><strong>Peso:</strong> ${exp.peso} kg</td><td><strong>Talla:</strong> ${exp.talla} m</td></tr>
                <tr><td><strong>IMC:</strong> ${exp.imc}</td><td><strong>Circunferencia Cintura (CC):</strong> ${exp.cintura} cm</td></tr>
              </table>

              <h3 style="color:#555;">3. Datos Clínicos Complementarios</h3>
              <table class="citas-table">
                <tr><td><strong>Gastritis:</strong> ${exp.clinicos.gastritis}</td><td><strong>Colitis:</strong> ${exp.clinicos.colitis}</td><td><strong>Estreñimiento:</strong> ${exp.clinicos.estrenimiento}</td></tr>
                <tr><td><strong>Hemorroides:</strong> ${exp.clinicos.hemorroides}</td><td><strong>Alcohol:</strong> ${exp.clinicos.alcohol}</td><td><strong>Tabaco:</strong> ${exp.clinicos.tabaco}</td></tr>
                <tr><td colspan="3"><strong>Medicamentos o Suplementos:</strong> ${exp.clinicos.medicamentos}</td></tr>
              </table>

              <h3 style="color:#555;">4. Mediciones Corporales Específicas</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <h4 style="color:#2e7d32;">Pliegues Cutáneos</h4>
                  <table class="citas-table">
                    <tr><td>Bíceps: ${exp.antropometria.biceps} mm</td><td>Tríceps: ${exp.antropometria.triceps} mm</td></tr>
                    <tr><td>Suprailiaco: ${exp.antropometria.suprailiaco} mm</td><td>Muslo: ${exp.antropometria.musloPliegue} mm</td></tr>
                    <tr><td colspan="2">Pierna: ${exp.antropometria.piernaPliegue} mm</td></tr>
                  </table>
                </div>
                <div>
                  <h4 style="color:#2e7d32;">Circunferencias y Diámetros</h4>
                  <table class="citas-table">
                    <tr><td>B. Contraído: ${exp.antropometria.brazoContraido} cm</td><td>B. Relajado: ${exp.antropometria.brazoRelajado} cm</td></tr>
                    <tr><td>Antebrazo: ${exp.antropometria.antebrazo} cm</td><td>Muñeca: ${exp.antropometria.muneca} cm</td></tr>
                    <tr><td>Cadera: ${exp.antropometria.cadera} cm</td><td>Muslo: ${exp.antropometria.musloCinta} cm</td></tr>
                    <tr><td>Pantorrilla: ${exp.antropometria.pantorrilla} cm</td><td>Tobillo: ${exp.antropometria.tobillo} cm</td></tr>
                    <tr><td>Húmero (Diámetro): ${exp.antropometria.humero} cm</td><td>Rodilla (Diámetro): ${exp.antropometria.rodilla} cm</td></tr>
                  </table>
                </div>
              </div>

              <h3 style="color:#555;">5. Frecuencia de Consumo de Alimentos</h3>
              <div class="satisfaccion-bordered-box" style="white-space: pre-line; background: #fdfdfd; padding: 12px; font-size: 0.95rem;">${exp.frecuenciaAlimentos}</div>

              <h3 style="color:#555;">6. Recordatorio de 24 Horas</h3>
              <div class="satisfaccion-bordered-box" style="white-space: pre-line; background: #f9f9f9; padding: 15px; line-height: 1.5;">${exp.recordatorio24h}</div>
            </div>
          </main>
        </div>
      </div>
    `;
  }

  getTemplateFormularioExpediente() {
    const p = this.pacienteSeleccionado;
    const exp = this.expedientes[p.id] || {
      fecha: new Date().toISOString().split('T')[0],
      nombrePaciente: "",
      sexo: "Femenino",
      edad: "",
      ocupacion: "",
      procedencia: "",
      escolaridad: "",
      ejercicio: "",
      objetivo: "",
      peso: "",
      talla: "",
      imc: "",
      cintura: "",
      clinicos: { alcohol: "No", tabaco: "No", gastritis: "No", colitis: "No", estrenimiento: "No", hemorroides: "No", medicamentos: "Ninguno" },
      frecuenciaAlimentos: "",
      recordatorio24h: "",
      antropometria: { biceps: "", triceps: "", suprailiaco: "", musloPliegue: "", piernaPliegue: "", brazoContraido: "", brazoRelajado: "", antebrazo: "", muneca: "", cadera: "", musloCinta: "", pantorrilla: "", tobillo: "", humero: "", rodilla: "" }
    };

    return `
      <div class="main-layout-container">
        <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
        <div class="workspace-wrapper">
          <header class="topbar-green">
            <div class="header-back-flow">
              <button type="button" class="btn-back-apple" id="btn-cancelar-formulario">‹</button>
              <h1 class="topbar-title">Añadir / Configurar Registro Clínico</h1>
            </div>
          </header>

          <main class="main-workspace" style="padding: 20px; overflow-y: auto; max-height: calc(100vh - 80px);">
            <form id="expediente-form" class="card-container-white" style="display: flex; flex-direction: column; gap: 20px;">
              
              <h3 style="color: #2e7d32; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin: 0;">1. Datos Generales de la Paciente</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
                <label>Nombre Completo: <input type="text" id="form-nombrePaciente" value="${exp.nombrePaciente}" required></label>
                <label>Apellido Paterno: <input type="text" id="form-apellidoPaterno" value="${exp.apellidoPaterno}" required></label>
                <label>Apellido Materno: <input type="text" id="form-apellidoMaterno" value="${exp.apellidoMaterno}" required></label>
                <label>Sexo:
                 <select id="form-sexo">
                    <option value="Femenino" ${exp.sexo === 'Femenino' ? 'selected' : ''}>Femenino</option>
                    <option value="Masculino" ${exp.sexo === 'Masculino' ? 'selected' : ''}>Masculino</option>
                  </select>
                </label>
                <label>Edad: <input type="number" id="form-edad" value="${exp.edad}" required></label>
                <label>Ocupación: <input type="text" id="form-ocupacion" value="${exp.ocupacion}"></label>
                <label>Procedencia: <input type="text" id="form-procedencia" value="${exp.procedencia}"></label>
                <label>Escolaridad: <input type="text" id="form-escolaridad" value="${exp.escolaridad}"></label>
                <label>Actividad física (Ejercicio): <input type="text" id="form-ejercicio" value="${exp.ejercicio}" placeholder="Ej: No realiza"></label>
                <label>Fecha Evaluación: <input type="date" id="form-fecha" value="${exp.fecha}"></label>
              </div>
              <label>Objetivo Clínico:
                <textarea id="form-objetivo" class="textarea-dinamica" style="width:100%; min-height:40px; resize:none; overflow:hidden;">${exp.objetivo}</textarea>
              </label>

              <h3 style="color: #2e7d32; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 10px;">2. Diagnóstico Antropométrico e Indicadores</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
                <label>Peso (kg): <input type="number" step="0.1" id="form-peso" value="${exp.peso}" required></label>
                <label>Talla (m): <input type="number" step="0.01" id="form-talla" value="${exp.talla}" required></label>
                <label>Índice de Masa Corporal (IMC): <input type="number" step="0.1" id="form-imc" value="${exp.imc}"></label>
                <label>Circunferencia de Cintura (CC) (cm): <input type="number" step="0.1" id="form-cintura" value="${exp.cintura}"></label>
              </div>

              <h3 style="color: #2e7d32; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 10px;">3. Datos Clínicos Complementarios</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                <label>Gastritis: <input type="text" id="form-gastritis" value="${exp.clinicos.gastritis}" placeholder="No / Sí"></label>
                <label>Colitis: <input type="text" id="form-colitis" value="${exp.clinicos.colitis}"></label>
                <label>Estreñimiento: <input type="text" id="form-estrenimiento" value="${exp.clinicos.estrenimiento}"></label>
                <label>Hemorroides: <input type="text" id="form-hemorroides" value="${exp.clinicos.hemorroides || 'No'}"></label>
                <label>Alcohol Excesivo: <input type="text" id="form-alcohol" value="${exp.clinicos.alcohol}"></label>
                <label>Hábito de Tabaco: <input type="text" id="form-tabaco" value="${exp.clinicos.tabaco}"></label>
              </div>
              <label>Medicamentos o Suplementos: <input type="text" id="form-medicamentos" value="${exp.clinicos.medicamentos}" style="width:100%;"></label>

              <h3 style="color: #2e7d32; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 10px;">4. Mediciones Corporales Específicas</h3>
              <h4 style="margin:0; color:#555;">Pliegues Cutáneos (mm)</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">
                <label>Bíceps: <input type="number" id="form-biceps" value="${exp.antropometria.biceps}"></label>
                <label>Tríceps: <input type="number" id="form-triceps" value="${exp.antropometria.triceps}"></label>
                <label>Suprailiaco: <input type="number" id="form-suprailiaco" value="${exp.antropometria.suprailiaco}"></label>
                <label>Muslo: <input type="number" id="form-musloPliegue" value="${exp.antropometria.musloPliegue}"></label>
                <label>Pierna: <input type="number" id="form-piernaPliegue" value="${exp.antropometria.piernaPliegue}"></label>
              </div>

              <h4 style="margin:0; color:#555;">Circunferencias (Cinta en cm) y Diámetros (Antropómetro en cm)</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;">
                <label>Brazo Contraído: <input type="number" step="0.1" id="form-brazoContraido" value="${exp.antropometria.brazoContraido}"></label>
                <label>Brazo Relajado: <input type="number" step="0.1" id="form-brazoRelajado" value="${exp.antropometria.brazoRelajado}"></label>
                <label>Antebrazo: <input type="number" step="0.1" id="form-antebrazo" value="${exp.antropometria.antebrazo}"></label>
                <label>Muñeca: <input type="number" step="0.1" id="form-muneca" value="${exp.antropometria.muneca}"></label>
                <label>Cadera: <input type="number" step="0.1" id="form-cadera" value="${exp.antropometria.cadera}"></label>
                <label>Muslo (Cinta): <input type="number" step="0.1" id="form-musloCinta" value="${exp.antropometria.musloCinta}"></label>
                <label>Pantorrilla: <input type="number" step="0.1" id="form-pantorrilla" value="${exp.antropometria.pantorrilla}"></label>
                <label>Tobillo: <input type="number" step="0.1" id="form-tobillo" value="${exp.antropometria.tobillo}"></label>
                <label>Diámetro Húmero: <input type="number" step="0.1" id="form-humero" value="${exp.antropometria.humero}"></label>
                <label>Diámetro Rodilla: <input type="number" step="0.1" id="form-rodilla" value="${exp.antropometria.rodilla}"></label>
              </div>

              <h3 style="color: #2e7d32; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 10px;">5. Hábitos y Frecuencias Dietéticas</h3>
              <label>Frecuencia de Consumo de Alimentos (Destacados/Notas):
                <textarea id="form-frecuenciaAlimentos" class="textarea-dinamica" style="width:100%; min-height:60px; resize:none; overflow:hidden;" placeholder="Ej: Lácteos, Cereales...">${exp.frecuenciaAlimentos}</textarea>
              </label>

              <label>Recordatorio de 24 horas Completo (Estructurado por horarios):
                <textarea id="form-recordatorio" class="textarea-dinamica" style="width:100%; min-height:100px; resize:none; overflow:hidden;" placeholder="Desayuno (9:00 am): ...&#10;Comida (3:00 pm): ...">${exp.recordatorio24h}</textarea>
              </label>

              <button type="submit" class="btn-nuevo-paciente" style="float:none; align-self: flex-end; padding: 12px 40px; margin-top: 15px;">💾 Guardar Todo el Expediente</button>
            </form>
          </main>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const btnRegresar = this.querySelector('#btn-regresar-lista');
    if (btnRegresar) { btnRegresar.addEventListener('click', () => this.cambiarVista('lista')); }

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

    const btnVerExpediente = this.querySelector('#btn-ver-expediente');
    if (btnVerExpediente) {
      btnVerExpediente.addEventListener('click', () => this.cambiarVista('ver-expediente'));
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
        const destino = this.expedientes[this.pacienteSeleccionado.id] ? 'ver-expediente' : 'perfil';
        this.cambiarVista(destino);
      });
    }

    const btnEliminarExpediente = this.querySelector('#btn-eliminar-expediente');
    if (btnEliminarExpediente) {
      btnEliminarExpediente.addEventListener('click', () => {
        if (confirm('¿Carnal, estás seguro de que quieres borrar todo este expediente? No se puede recuperar.')) {
          delete this.expedientes[this.pacienteSeleccionado.id];
          this.cambiarVista('ver-expediente');
        }
      });
    }

    const formExpediente = this.querySelector('#expediente-form');
    if (formExpediente) {
      formExpediente.addEventListener('submit', (e) => {
        e.preventDefault();
        const pId = this.pacienteSeleccionado.id;

        this.expedientes[pId] = {
          fecha: this.querySelector('#form-fecha').value,
          nombrePaciente: this.querySelector('#form-nombrePaciente').value,
          sexo: this.querySelector('#form-sexo').value,
          edad: parseInt(this.querySelector('#form-edad').value) || 0,
          ocupacion: this.querySelector('#form-ocupacion').value,
          procedencia: this.querySelector('#form-procedencia').value,
          escolaridad: this.querySelector('#form-escolaridad').value,
          ejercicio: this.querySelector('#form-ejercicio').value,
          objetivo: this.querySelector('#form-objetivo').value,
          peso: parseFloat(this.querySelector('#form-peso').value) || 0,
          talla: parseFloat(this.querySelector('#form-talla').value) || 0,
          imc: parseFloat(this.querySelector('#form-imc').value) || 0,
          cintura: parseFloat(this.querySelector('#form-cintura').value) || 0,
          clinicos: {
            alcohol: this.querySelector('#form-alcohol').value,
            tabaco: this.querySelector('#form-tabaco').value,
            gastritis: this.querySelector('#form-gastritis').value,
            colitis: this.querySelector('#form-colitis').value,
            estrenimiento: this.querySelector('#form-estrenimiento').value,
            hemorroides: this.querySelector('#form-hemorroides').value,
            medicamentos: this.querySelector('#form-medicamentos').value
          },
          frecuenciaAlimentos: this.querySelector('#form-frecuenciaAlimentos').value,
          recordatorio24h: this.querySelector('#form-recordatorio').value,
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
          if (dropdown) dropdown.style.display = 'none';
          return;
        }
        const soloNuevos = toggleNewClients ? toggleNewClients.checked : false;
        const filtrados = this.pacientes.filter(p => {
          const coincideNombre = p.nombre.toLowerCase().includes(query);
          return soloNuevos ? (coincideNombre && p.esNuevo) : coincideNombre;
        });
        
        if (filtrados.length === 0) {
          resultsList.innerHTML = `<div class="dropdown-empty-state">No hay coincidencias</div>`;
        } else {
          resultsList.innerHTML = filtrados.map(p => `
            <div class="dropdown-item-row" data-id="${p.id}">
              <div class="avatar-circle small-avatar">
                <img src="${p.avatar}" alt="${p.nombre}" onerror="this.style.display='none';">
                <span>${p.iniciales}</span>
              </div>
              <div class="patient-name-id">
                <h4>${p.nombre}</h4>
                <span>ID: ${p.id}</span>
              </div>
            </div>
          `).join('');
        }
        if (dropdown) dropdown.style.display = 'block';
        this.setupDropdownRowClicks();
      };

      searchInput.addEventListener('input', filtrarYMostrarResultados);
      if (toggleNewClients) { toggleNewClients.addEventListener('change', filtrarYMostrarResultados); }
    }

    document.addEventListener('click', (e) => {
      if (!this.querySelector('.search-context-container')?.contains(e.target)) {
        if (dropdown) dropdown.style.display = 'none';
      }
    });
  }

  setupDropdownRowClicks() {
    this.querySelectorAll('.dropdown-item-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const dropdown = this.querySelector('#dropdown-clientes-nuevos');
        if (dropdown) dropdown.style.display = 'none';
        this.cambiarVista('perfil', id);
      });
    });
  }
}


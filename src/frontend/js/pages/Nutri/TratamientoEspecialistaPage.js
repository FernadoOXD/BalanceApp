export class TratamientoEspecialistaPage extends HTMLElement {
  constructor() {
    super();
    this.pacientes = [];
    this.pacientesFiltrados = [];
    this.loading = true; 
    this.errorOccurred = false; 
    this.vistaAsignar = false; // Controla si se muestra la búsqueda directa para nuevo tratamiento
    
    this.apiUrl = "http://localhost:3000/api/tratamientos"; 
  }

  async connectedCallback() {
    this.render();
    await this.fetchPacientesDesdeBD();
  }

  async fetchPacientesDesdeBD() {
    try {
      this.loading = true;
      this.errorOccurred = false;
      
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      this.pacientes = await response.json();
      this.pacientesFiltrados = [...this.pacientes];
      
    } catch (error) {
      console.error("Error al conectar con la Base de Datos:", error);
      this.errorOccurred = true;
      this.pacientes = [];
      this.pacientesFiltrados = [];
    } finally {
      this.loading = false;
      this.renderDinamico();
    }
  }

  renderDinamico() {
    if (this.vistaAsignar) {
      this.renderSeccionAsignar();
    } else {
      this.renderListaTratamientos();
    }
  }

  renderListaTratamientos() {
    const container = this.querySelector('#pacientes-container');
    if (!container) return;

    if (this.loading) {
      container.innerHTML = `<div class="status-message"><p>Cargando...</p></div>`;
      return;
    }

    if (this.errorOccurred) {
      container.innerHTML = `<div class="status-message error"><p>Hubo un error al conectar con el servidor.</p></div>`;
      return;
    }

    if (this.pacientes.length === 0) {
      container.innerHTML = `<div class="status-message empty"><p>No hay tratamientos.</p></div>`;
      return;
    }

    if (this.pacientesFiltrados.length === 0) {
      container.innerHTML = `<div class="status-message no-results"><p>No se encontraron pacientes.</p></div>`;
      return;
    }

    container.innerHTML = this.pacientesFiltrados.map(paciente => `
      <div class="paciente-card" data-id="${paciente.id}">
        <div class="card-header">
          <div class="avatar">${paciente.iniciales || 'P'}</div>
          <div class="paciente-info">
            <h3>${paciente.nombre}</h3>
            <span class="paciente-id">ID: ${paciente.id}</span>
          </div>
          <span class="badge">${paciente.tratamiento || 'Sin Tratamiento'}</span>
        </div>
        <div class="card-body">
          <p>
            <img src="assets/icons/manzanaVerde.png" alt="Alimentación" class="card-icon">
            <strong>Alimentación:</strong> ${paciente.alimentacion || 'No asignada'}
          </p>
          <p>
            <img src="assets/icons/pesasVerde.png" alt="Ejercicio" class="card-icon">
            <strong>Ejercicio:</strong> ${paciente.ejercicio || 'No asignado'}
          </p>
        </div>
        <div class="card-footer">
          <button class="btn-perfil" data-id="${paciente.id}">
            <img src="assets/icons/perfilVerde.png" alt="Perfil" class="btn-icon"> Ver Perfil / Editar
          </button>
          <button class="btn-delete" data-id="${paciente.id}">
            <img src="assets/icons/eliminarRojo.png" alt="Eliminar" class="btn-icon">
          </button>
        </div>
      </div>
    `).join('');

    this.setupCardActions();
  }

  renderSeccionAsignar() {
    const container = this.querySelector('#main-workspace');
    if (!container) return;

    container.innerHTML = `
      <header class="content-header">
        <div class="header-text">
          <h1>Asignar Nuevo Tratamiento</h1>
          <p>Busca directamente al paciente en el sistema para iniciar la configuración de su nuevo plan modular.</p>
        </div>
        <button id="btn-regresar" class="btn-perfil">Volver al listado</button>
      </header>

      <section class="search-bar-section">
        <div class="search-input-wrapper">
          <img src="assets/icons/Busqueda.png" alt="Buscar" class="search-icon">
          <input type="text" id="search-asignar-input" placeholder="Escribe el nombre del paciente para asignación directa...">
        </div>
      </section>

      <section class="tratamientos-section">
        <div id="resultado-busqueda-asignar" class="pacientes-grid">
          <div class="status-message"><p>Escribe en el buscador para localizar al paciente.</p></div>
        </div>
      </section>
    `;

    this.setupEventListenersAsignar();
  }

  render() {
    this.innerHTML = `
      <div class="gestion-tratamientos-container">
        <app-sidebar-especialista class="sidebar-wrapper"></app-sidebar-especialista>
        
        <div class="main-content-wrapper" id="main-workspace">
          <header class="content-header">
            <div class="header-text">
              <h1>Gestión de Tratamientos</h1>
              <p>Busca un paciente, abre su mini-perfil y edita su menú alimenticio o ejercicio opcional de forma modular.</p>
            </div>
          </header>

          <section class="search-bar-section">
            <div class="search-input-wrapper">
              <img src="assets/icons/Busqueda.png" alt="Buscar" class="search-icon">
              <input type="text" id="search-input" placeholder="Buscar paciente por nombre...">
            </div>
            <button id="btn-asignar-nuevo" class="btn-primary">
              <img src="assets/icons/añadir.png" alt="Nuevo" class="btn-icon-white"> Nuevo Tratamiento
            </button>
          </section>

          <section class="tratamientos-section">
            <h2>
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
    const searchInput = this.querySelector('#search-input');
    const btnAsignarNuevo = this.querySelector('#btn-asignar-nuevo');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        this.pacientesFiltrados = this.pacientes.filter(paciente => 
          paciente.nombre.toLowerCase().includes(query)
        );
        this.renderListaTratamientos(); 
      });
    }

    if (btnAsignarNuevo) {
      btnAsignarNuevo.addEventListener('click', () => {
        this.vistaAsignar = true;
        this.renderDinamico();
      });
    }
  }

  setupEventListenersAsignar() {
    const btnRegresar = this.querySelector('#btn-regresar');
    const searchAsignar = this.querySelector('#search-asignar-input');
    const resultadosContainer = this.querySelector('#resultado-busqueda-asignar');

    if (btnRegresar) {
      btnRegresar.addEventListener('click', () => {
        this.vistaAsignar = false;
        this.pacientesFiltrados = [...this.pacientes];
        this.render(); 
      });
    }

    if (searchAsignar && resultadosContainer) {
      searchAsignar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === "") {
          resultadosContainer.innerHTML = `<div class="status-message"><p>Escribe en el buscador para localizar al paciente.</p></div>`;
          return;
        }

        const filtrados = this.pacientes.filter(paciente => paciente.nombre.toLowerCase().includes(query));

        if (filtrados.length === 0) {
          resultadosContainer.innerHTML = `<div class="status-message no-results"><p>No se encontraron pacientes registrados con ese nombre.</p></div>`;
          return;
        }

        resultadosContainer.innerHTML = filtrados.map(paciente => `
          <div class="paciente-card" data-id="${paciente.id}">
            <div class="card-header">
              <div class="avatar">${paciente.iniciales || 'P'}</div>
              <div class="paciente-info">
                <h3>${paciente.nombre}</h3>
                <span class="paciente-id">ID: ${paciente.id}</span>
              </div>
            </div>
            <div class="card-footer">
              <button class="btn-primary btn-seleccionar-directo" data-id="${paciente.id}" style="width: 100%; justify-content: center;">
                Seleccionar Paciente
              </button>
            </div>
          </div>
        `).join('');

        this.setupAccionesAsignarDirecto();
      });
    }
  }

  setupCardActions() {
    this.querySelectorAll('.btn-perfil').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pacienteId = e.currentTarget.getAttribute('data-id');
        console.log(`Navegando hacia la siguiente vista: Mini perfil del Paciente ID: ${pacienteId}`);
        // Aquí meterás la lógica para renderizar o enrutar hacia la siguiente vista
      });
    });

    this.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pacienteId = e.currentTarget.getAttribute('data-id');
        console.log(`Eliminar o pausar tratamiento del Paciente ID: ${pacienteId}`);
      });
    });
  }

  setupAccionesAsignarDirecto() {
    this.querySelectorAll('.btn-seleccionar-directo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pacienteId = e.currentTarget.getAttribute('data-id');
        console.log(`Paciente seleccionado para nuevo tratamiento directo. ID: ${pacienteId}`);
        // Aquí irá la lógica de la pantalla de creación del plan de tratamiento
      });
    });
  }
}
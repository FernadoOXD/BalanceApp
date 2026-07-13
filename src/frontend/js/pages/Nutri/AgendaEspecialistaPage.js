export class AgendaEspecialistaPage extends HTMLElement {
  constructor() {
    super();
    this.currentMonth = 9; // Octubre
    this.currentYear = 2024;
    
    this.eventos = [
      { dia: 1, mes: 9, anio: 2024, titulo: "9:00 J. Doe", clase: "bg-dark-green" },
      { dia: 3, mes: 9, anio: 2024, titulo: "14:00 M. Smith", clase: "bg-dark-green" },
      { dia: 3, mes: 9, anio: 2024, titulo: "16:00 L. Gomez", clase: "bg-gray" },
      { dia: 8, mes: 9, anio: 2024, titulo: "10:00 A. Perez", clase: "text-red" }
    ];
  }

  connectedCallback() {
    this.render();
    this.renderCalendar();
  }

  render() {
    this.innerHTML = `
    <app-sidebar-especialista active-page="agenda"></app-sidebar-especialista>
      <div class="sidebar-layout">
        <main class="sidebar-content">
          <header class="agenda-topbar">
            <h1>Mi Agenda</h1>
            <p>Gestiona tus citas</p>
          </header>
          <div class="agenda-workspace">
            <section class="calendar-container">
              <div class="calendar-header">
                <button id="prev-month">◀</button>
                <h2 id="calendar-title"></h2>
                <button id="next-month">▶</button>
              </div>
              <div class="calendar-grid" id="calendar-grid"></div>
            </section>
            <aside class="appointments-sidebar">
              <h2>Citas para hoy</h2>
              <div id="appointments-list">
                <div class="appointment-card">
                  <strong>Ana Perez</strong><span class="status-badge status-pending">Pendiente ▾</span>
                  <p>10:00 AM - Consulta inicial</p>
                </div>
                <div class="appointment-card">
                  <strong>Carlos Ruiz</strong><span class="status-badge status-confirmed">Confirmada ▾</span>
                  <p>12:30 PM - Seguimiento</p>
                </div>
                <div class="appointment-card">
                  <strong>Maria Silva</strong><span class="status-badge status-canceled">Cancelada ▾</span>
                  <p>03:00 PM - Plan Dieta</p>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    `;
    this.querySelector("#prev-month").addEventListener("click", () => { this.currentMonth--; this.renderCalendar(); });
    this.querySelector("#next-month").addEventListener("click", () => { this.currentMonth++; this.renderCalendar(); });
  }

  renderCalendar() {
    const grid = this.querySelector("#calendar-grid");
    const title = this.querySelector("#calendar-title");
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    title.textContent = `${meses[this.currentMonth]} ${this.currentYear}`;
    
    // Generar encabezados (LUN a DOM) asegurando los 7 elementos
    let html = `
      <div class="day-name">LUN</div><div class="day-name">MAR</div><div class="day-name">MIE</div>
      <div class="day-name">JUE</div><div class="day-name">VIE</div><div class="day-name">SAB</div><div class="day-name">DOM</div>
    `;

    // Calcular espacios vacíos (Oct 2024 empieza en Martes -> 1 espacio)
    const primerDia = new Date(this.currentYear, this.currentMonth, 1).getDay();
    let espacios = (primerDia === 0) ? 6 : primerDia - 1;

    for (let i = 0; i < espacios; i++) {
      html += `<div class="calendar-cell" style="background:transparent; border:none;"></div>`;
    }

    const diasEnMes = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const eventosDia = this.eventos.filter(e => e.dia === dia && e.mes === this.currentMonth);
      let evs = eventosDia.map(e => `<div class="event ${e.clase}">${e.titulo}</div>`).join("");
      html += `<div class="calendar-cell"><span class="date-number">${dia}</span>${evs}</div>`;
    }
    grid.innerHTML = html;
  }
}
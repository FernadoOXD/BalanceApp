export class DashboardEspecialistaPage extends HTMLElement {
  constructor() {
    super();
    this.demografia = null;
    this.diagnosticos = null;
    this.evolucion = null;
  }

  async connectedCallback() {
    this.render();
    await this.loadData();
  }

  render() {
    this.innerHTML = `
      <div class="layout-wrapper">
        <app-sidebar-especialista style="position: fixed;"></app-sidebar-especialista>
        
        <main class="dashboard-main" style="margin-left: 260px; padding: 40px; width: calc(100% - 260px);">
          <header class="dashboard-header" style="margin-bottom: 32px;">
            <h1 style="font-size: 32px; font-weight: 800; color: var(--text-primary);">Panel Estadístico Clínico</h1>
            <p style="color: var(--text-secondary);">Métricas y evolución de pacientes.</p>
          </header>
          
          <div class="grid-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 24px;">
              <!-- Gráfica 1: Histograma Demográfico -->
              <div class="card panel-card" style="background: var(--bg-card); padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <h3 style="margin-bottom: 16px; color: var(--text-primary);">Perfil Demográfico (Edades)</h3>
                  <div id="graficaEdades"></div>
              </div>

              <!-- Gráfica 2: Frecuencia Relativa (Pastel/Dona) -->
              <div class="card panel-card" style="background: var(--bg-card); padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <h3 style="margin-bottom: 16px; color: var(--text-primary);">Distribución de Diagnósticos</h3>
                  <div id="graficaDiagnosticos"></div>
              </div>

              <!-- Gráfica 3: Tasa de Cambio (Líneas) -->
              <div class="card panel-card" style="grid-column: 1 / -1; background: var(--bg-card); padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <h3 style="margin-bottom: 16px; color: var(--text-primary);">Evolución de Tasa de Cambio (Peso Kg)</h3>
                  <div id="graficaEvolucion"></div>
              </div>
          </div>
        </main>
      </div>
    `;
  }

  async loadData() {
    try {
      // MOCK DATA: Datos inyectados directamente para la presentación
      // Cuando tu backend en Java esté listo, simplemente borrarás esto y usarás el fetch.

      this.demografia = [
        { rango: "18-25 años", frecuencia: 12 },
        { rango: "26-35 años", frecuencia: 35 },
        { rango: "36-45 años", frecuencia: 22 },
        { rango: "46-55 años", frecuencia: 8 },
      ];

      this.diagnosticos = [
        { descripcionPrincipal: "Obesidad Grado 1", cantidad: 45 },
        { descripcionPrincipal: "Sobrepeso", cantidad: 30 },
        { descripcionPrincipal: "Normopeso", cantidad: 15 },
        { descripcionPrincipal: "Desnutrición leve", cantidad: 10 },
      ];

      this.evolucion = [
        { fechaMedicion: "2026-04-10", pesoKg: 88.5, porcentajeGrasa: 28.5 },
        { fechaMedicion: "2026-05-15", pesoKg: 86.2, porcentajeGrasa: 27.0 },
        { fechaMedicion: "2026-06-20", pesoKg: 84.0, porcentajeGrasa: 25.5 },
        { fechaMedicion: "2026-07-10", pesoKg: 82.5, porcentajeGrasa: 24.2 },
      ];

      // Una vez cargados los datos locales, pintamos las gráficas
      this.renderCharts();
    } catch (error) {
      console.error("Error al cargar los datos estadísticos:", error);
    }
  }

  renderCharts() {
    // 1. Histograma
    const rangos = this.demografia.map((item) => item.rango);
    const frecuencias = this.demografia.map((item) => item.frecuencia);
    new ApexCharts(this.querySelector("#graficaEdades"), {
      chart: { type: "bar", height: 300, toolbar: { show: false } },
      series: [{ name: "Pacientes", data: frecuencias }],
      xaxis: { categories: rangos },
      colors: ["#0F5132"], // Color marca BalanceApp
      plotOptions: { bar: { borderRadius: 4 } },
    }).render();

    // 2. Dona
    const descripciones = this.diagnosticos.map(
      (item) => item.descripcionPrincipal,
    );
    const cantidades = this.diagnosticos.map((item) => item.cantidad);
    new ApexCharts(this.querySelector("#graficaDiagnosticos"), {
      chart: { type: "donut", height: 320 },
      series: cantidades,
      labels: descripciones,
      colors: ["#10B981", "#F59E0B", "#3B82F6", "#EF4444"],
      stroke: { show: false },
    }).render();

    // 3. Líneas
    const fechas = this.evolucion.map((item) => item.fechaMedicion);
    const pesos = this.evolucion.map((item) => item.pesoKg);
    new ApexCharts(this.querySelector("#graficaEvolucion"), {
      chart: { type: "line", height: 350, toolbar: { show: false } },
      stroke: { curve: "smooth", width: 3 },
      series: [{ name: "Peso (Kg)", data: pesos }],
      xaxis: { categories: fechas },
      yaxis: { title: { text: "Kilogramos" } },
      markers: {
        size: 6,
        colors: ["#10B981"],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      colors: ["#10B981"],
    }).render();
  }
}

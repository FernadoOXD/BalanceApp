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
      <style>
        .layout-wrapper {
          display: flex;
          min-height: 100vh;
        }
        
        /* FIX DEFINITIVO PARA EL DESBORDAMIENTO DE APEXCHARTS */
        .panel-card div[id^="grafica"] {
          width: 100% !important;
          max-width: 100% !important;
          position: relative !important;
        }
        
        @media (max-width: 768px) {
          .layout-wrapper {
            flex-direction: column;
          }
          app-sidebar-especialista {
            position: relative !important;
            width: 100% !important;
          }
          .dashboard-main {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 24px 16px !important;
          }
          .grid-container {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .panel-card {
            grid-column: auto !important;
            padding: 24px !important;
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          /* Forzar a que la leyenda de ApexCharts no flote sobre otros elementos */
          .apexcharts-canvas {
            height: auto !important;
          }
          .apexcharts-legend {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            justify-content: center !important;
            padding-top: 20px !important;
            padding-bottom: 10px !important;
            display: flex !important;
            flex-wrap: wrap !important;
          }
        }
      </style>

      <div class="layout-wrapper">
        <app-sidebar-especialista style="position: fixed;"></app-sidebar-especialista>
        
        <main class="dashboard-main" style="margin-left: 260px; padding: 40px; width: calc(100% - 260px); min-width: 0; transition: all 0.3s ease;">
          <header class="dashboard-header" style="margin-bottom: 32px;">
            <h1 style="font-size: 32px; font-weight: 800; color: var(--text-primary);">Panel Estadístico Clínico</h1>
            <p style="color: var(--text-secondary);">Métricas y evolución de pacientes.</p>
          </header>
          
          <div class="grid-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
              <!-- Gráfica 1: Histograma Demográfico -->
              <div class="card panel-card" style="background: var(--bg-card); padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); min-width: 0;">
                  <h3 style="margin-bottom: 16px; color: var(--text-primary);">Perfil Demográfico (Edades)</h3>
                  <div id="graficaEdades"></div>
              </div>

              <!-- Gráfica 2: Frecuencia Relativa (Pastel/Dona) -->
              <div class="card panel-card" style="background: var(--bg-card); padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); min-width: 0;">
                  <h3 style="margin-bottom: 16px; color: var(--text-primary);">Distribución de Diagnósticos</h3>
                  <div id="graficaDiagnosticos"></div>
              </div>

              <!-- Gráfica 3: Tasa de Cambio (Líneas) -->
              <div class="card panel-card" style="grid-column: 1 / -1; background: var(--bg-card); padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); min-width: 0;">
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
      chart: { type: "bar", height: 300, toolbar: { show: false }, width: "100%" },
      series: [{ name: "Pacientes", data: frecuencias }],
      xaxis: { categories: rangos },
      colors: ["#0F5132"], 
      plotOptions: { bar: { borderRadius: 4 } },
    }).render();

    // 2. Dona (Con el fix de leyendas nativas limpias)
    const descripciones = this.diagnosticos.map(
      (item) => item.descripcionPrincipal,
    );
    const cantidades = this.diagnosticos.map((item) => item.cantidad);
    new ApexCharts(this.querySelector("#graficaDiagnosticos"), {
      chart: { type: "donut", height: 320, width: "100%" },
      series: cantidades,
      labels: descripciones,
      colors: ["#10B981", "#F59E0B", "#3B82F6", "#EF4444"],
      stroke: { show: false },
      legend: { position: "right" },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: 380
          },
          legend: { 
            position: "bottom"
          }
        }
      }]
    }).render();

    // 3. Líneas
    const fechas = this.evolucion.map((item) => item.fechaMedicion);
    const pesos = this.evolucion.map((item) => item.pesoKg);
    new ApexCharts(this.querySelector("#graficaEvolucion"), {
      chart: { type: "line", height: 350, toolbar: { show: false }, width: "100%" },
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
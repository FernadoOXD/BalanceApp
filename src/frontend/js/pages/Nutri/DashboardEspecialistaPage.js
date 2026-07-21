import { API_BASE_URL } from '../../../config.js';

export class DashboardEspecialistaPage extends HTMLElement {
  constructor() {
    super();
    this.demografia = [];
    this.diagnosticos = [];
  }

  async connectedCallback() {
    this.render();
    await this.loadData();
  }

  render() {
    this.innerHTML = `
      <style>
        * { box-sizing: border-box; }
        .layout-wrapper { display: flex; min-height: 100vh; width: 100%; }
        .panel-card div[id^="grafica"] { width: 100% !important; max-width: 100% !important; position: relative !important; }
        .panel-card { overflow: hidden; }
        .apexcharts-canvas { width: 100% !important; }

        @media (min-width: 1200px) {
          .dashboard-main { margin-left: 260px !important; width: calc(100% - 260px) !important; padding: 40px !important; }
          .grid-container { grid-template-columns: repeat(2, 1fr) !important; gap: 28px !important; }
        }
        @media (max-width: 991px) {
          .layout-wrapper { flex-direction: column; }
          app-sidebar-especialista { position: relative !important; width: 100% !important; }
          .dashboard-main { margin-left: 0 !important; width: 100% !important; padding: 20px !important; }
          .grid-container { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      </style>

      <div class="layout-wrapper">
        <app-sidebar-especialista style="position: fixed;"></app-sidebar-especialista>
        
        <main class="dashboard-main" style="margin-left: 260px; padding: 40px; width: calc(100% - 260px); min-width: 0;">
          <header class="dashboard-header" style="margin-bottom: 32px;">
            <h1 style="font-size: 32px; font-weight: 800; color: var(--text-primary);">Panel Estadístico Clínico</h1>
            <p style="color: var(--text-secondary);">Métricas demográficas y distribución de diagnósticos.</p>
          </header>
          
          <div class="grid-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px;">
              <!-- Gráfica 1: Histograma con Campana de Gauss -->
              <div class="card panel-card" style="background: var(--bg-card); padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <h3 style="margin-bottom: 16px; color: var(--text-primary);">Perfil Demográfico (Edades & Gauss)</h3>
                  <div id="graficaEdades"></div>
              </div>

              <!-- Gráfica 2: Frecuencia Relativa (Dona) -->
              <div class="card panel-card" style="background: var(--bg-card); padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <h3 style="margin-bottom: 16px; color: var(--text-primary);">Distribución de Diagnósticos</h3>
                  <div id="graficaDiagnosticos"></div>
              </div>
          </div>
        </main>
      </div>
    `;
  }

  async loadData() {
    try {
      this.demografia = [];
      this.diagnosticos = [];

      // 1. Petición Demografía
      const demografiaResponse = await fetch(`${API_BASE_URL}/api/estadisticas/demografia`);
      const demografiaData = await demografiaResponse.json();
      if (demografiaData.success && demografiaData.distribucion) {
        this.demografia = Object.entries(demografiaData.distribucion).map(([rango, frecuencia]) => ({ rango, frecuencia }));
      }

      // 2. Petición Diagnósticos
      const diagnosticosResponse = await fetch(`${API_BASE_URL}/api/estadisticas/diagnosticos`);
      const diagnosticosData = await diagnosticosResponse.json();
      if (diagnosticosData.success && diagnosticosData.diagnosticos) {
        this.diagnosticos = diagnosticosData.diagnosticos.map(d => ({
          descripcionPrincipal: d.descripcionPrincipal || "Sin especificar",
          cantidad: d.frecuenciaAbsoluta || 0
        }));
      }

    } catch (error) {
      console.warn("Error al cargar datos estadísticos:", error);
    } finally {
      this.renderCharts();
    }
  }

  renderCharts() {
    const elEdades = this.querySelector("#graficaEdades");
    const elDiag = this.querySelector("#graficaDiagnosticos");

    if (!elEdades || !elDiag) return;

    elEdades.innerHTML = "";
    elDiag.innerHTML = "";

    // 1. Render Histograma + Gauss
    const rangos = this.demografia.map((item) => item.rango);
    const frecuencias = this.demografia.map((item) => item.frecuencia);

    const midpoints = this.demografia.map(item => {
      const match = item.rango.match(/(\d+)-(\d+)/);
      return match ? (parseInt(match[1]) + parseInt(match[2])) / 2 : 25;
    });

    const totalFrecuencia = frecuencias.reduce((a, b) => a + b, 0) || 1;
    let mean = midpoints.reduce((a, b) => a + b, 0) / midpoints.length || 30;
    let stdDev = 8;

    let sumSqDiff = 0;
    for (let i = 0; i < midpoints.length; i++) {
      sumSqDiff += (frecuencias[i] || 0) * Math.pow(midpoints[i] - mean, 2);
    }
    stdDev = Math.sqrt(sumSqDiff / totalFrecuencia) || 5;

    const normalCurveData = midpoints.map(x => {
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const pdf = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      return Number((pdf * totalFrecuencia * 8).toFixed(2));
    });

    new ApexCharts(elEdades, {
      chart: { type: "line", height: 350, toolbar: { show: false }, width: "100%" },
      series: [
        { name: "Frecuencia (Pacientes)", type: "bar", data: frecuencias },
        { name: "Curva Normal (Gauss)", type: "line", data: normalCurveData }
      ],
      stroke: { width: [0, 3], curve: 'smooth' },
      xaxis: { categories: rangos, labels: { style: { fontSize: '12px' } } },
      yaxis: { title: { text: "Cantidad de Pacientes" } },
      colors: ["#0F5132", "#10B981"],
      plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
      dataLabels: { enabled: false },
      markers: { size: [0, 4], colors: ["#10B981"] }
    }).render();

    // 2. Render Gráfico de Dona
    const descripciones = this.diagnosticos.map((item) => item.descripcionPrincipal);
    const cantidades = this.diagnosticos.map((item) => item.cantidad);
    
    new ApexCharts(elDiag, {
      chart: { type: "donut", height: 350, width: "100%" },
      series: cantidades,
      labels: descripciones,
      colors: ["#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6"],
      stroke: { show: false },
      legend: { position: "right", fontSize: '13px' },
      dataLabels: { enabled: false }
    }).render();
  }
}
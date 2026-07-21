import { API_BASE_URL } from '../../../config.js';

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
        * {
          box-sizing: border-box;
        }

        .layout-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        /* FIX DEFINITIVO PARA EL DESBORDAMIENTO DE APEXCHARTS */
        .panel-card div[id^="grafica"] {
          width: 100% !important;
          max-width: 100% !important;
          position: relative !important;
        }

        .panel-card {
          overflow: hidden;
        }

        .apexcharts-canvas {
          width: 100% !important;
        }

        /* Desktop grande (1920px+) */
        @media (min-width: 1920px) {
          .dashboard-main {
            margin-left: 280px !important;
            width: calc(100% - 280px) !important;
            padding: 48px !important;
          }
          .grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px !important;
          }
          .dashboard-header h1 {
            font-size: 36px !important;
          }
        }

        /* Desktop estándar (1440px - 1919px) */
        @media (min-width: 1440px) and (max-width: 1919px) {
          .dashboard-main {
            margin-left: 260px !important;
            width: calc(100% - 260px) !important;
            padding: 40px !important;
          }
          .grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 28px !important;
          }
        }

        /* Laptop grande (1200px - 1439px) */
        @media (min-width: 1200px) and (max-width: 1439px) {
          .dashboard-main {
            margin-left: 240px !important;
            width: calc(100% - 240px) !important;
            padding: 32px !important;
          }
          .grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
          .dashboard-header h1 {
            font-size: 28px !important;
          }
        }

        /* Laptop/Tablet grande (992px - 1199px) */
        @media (min-width: 992px) and (max-width: 1199px) {
          .dashboard-main {
            margin-left: 220px !important;
            width: calc(100% - 220px) !important;
            padding: 28px !important;
          }
          .grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          .dashboard-header h1 {
            font-size: 26px !important;
          }
          .panel-card {
            padding: 20px !important;
          }
        }

        /* Tablet (768px - 991px) */
        @media (min-width: 768px) and (max-width: 991px) {
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
            padding: 24px !important;
          }
          .grid-container {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .panel-card {
            grid-column: auto !important;
            padding: 20px !important;
          }
          .dashboard-header h1 {
            font-size: 24px !important;
          }
          .apexcharts-legend {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            justify-content: center !important;
            padding-top: 16px !important;
            display: flex !important;
            flex-wrap: wrap !important;
          }
        }

        /* Móvil (max 767px) */
        @media (max-width: 767px) {
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
            padding: 20px 16px !important;
          }
          .grid-container {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .panel-card {
            grid-column: auto !important;
            padding: 20px !important;
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .dashboard-header {
            margin-bottom: 24px !important;
          }
          .dashboard-header h1 {
            font-size: 22px !important;
          }
          .dashboard-header p {
            font-size: 14px !important;
          }
          .panel-card h3 {
            font-size: 16px !important;
            margin-bottom: 12px !important;
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
            padding-top: 16px !important;
            padding-bottom: 8px !important;
            display: flex !important;
            flex-wrap: wrap !important;
            font-size: 12px !important;
          }
        }

        /* Móvil pequeño (max 480px) */
        @media (max-width: 480px) {
          .dashboard-main {
            padding: 16px 12px !important;
          }
          .dashboard-header h1 {
            font-size: 20px !important;
          }
          .panel-card {
            padding: 16px !important;
            border-radius: 16px !important;
          }
          .grid-container {
            gap: 12px !important;
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
          
          <div class="grid-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
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
      // Fase 4: Consumo de datos pre-calculados del backend
      
      // 1. Obtener demografía (distribución de edades)
      const demografiaResponse = await fetch(`${API_BASE_URL}/api/estadisticas/demografia`);
      const demografiaData = await demografiaResponse.json();
      
      if (demografiaData.success) {
        this.demografia = Object.entries(demografiaData.distribucion).map(([rango, frecuencia]) => ({
          rango: rango + " años",
          frecuencia: frecuencia
        }));
      }

      // 2. Obtener distribución de diagnósticos
      const diagnosticosResponse = await fetch(`${API_BASE_URL}/api/estadisticas/diagnosticos`);
      const diagnosticosData = await diagnosticosResponse.json();
      
      if (diagnosticosData.success) {
        this.diagnosticos = diagnosticosData.diagnosticos.map(d => ({
          descripcionPrincipal: d.descripcionPrincipal,
          cantidad: d.frecuenciaAbsoluta
        }));
      }

      // 3. Obtener evolución de un paciente (usando paciente ID 21 como ejemplo)
      // En producción, esto debería obtenerse del paciente seleccionado
      const evolucionResponse = await fetch(`${API_BASE_URL}/api/estadisticas/evolucion/21`);
      const evolucionData = await evolucionResponse.json();
      
      if (evolucionData.success && evolucionData.mediciones.length > 0) {
        this.evolucion = evolucionData.mediciones;
      } else {
        // Fallback a datos de ejemplo si no hay mediciones
        this.evolucion = [];
      }

      this.renderCharts();
    } catch (error) {
      console.error("Error al cargar los datos estadísticos:", error);
      // Fallback a datos de ejemplo en caso de error
      this.demografia = [
        { rango: "18-25 años", frecuencia: 0 },
        { rango: "26-35 años", frecuencia: 0 },
        { rango: "36-45 años", frecuencia: 0 },
        { rango: "46-55 años", frecuencia: 0 },
      ];
      this.diagnosticos = [];
      this.evolucion = [];
      this.renderCharts();
    }
  }

  renderCharts() {
    // 1. Histograma
    const rangos = this.demografia.map((item) => item.rango);
    const frecuencias = this.demografia.map((item) => item.frecuencia);
    new ApexCharts(this.querySelector("#graficaEdades"), {
      chart: { 
        type: "bar", 
        height: 350, 
        toolbar: { show: false }, 
        width: "100%",
        parentHeightOffset: 0
      },
      series: [{ name: "Pacientes", data: frecuencias }],
      xaxis: { 
        categories: rangos,
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      colors: ["#0F5132"], 
      plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
      dataLabels: { enabled: false },
      responsive: [
        {
          breakpoint: 1920,
          options: {
            chart: { height: 350 },
            plotOptions: { bar: { columnWidth: '55%' } }
          }
        },
        {
          breakpoint: 1440,
          options: {
            chart: { height: 320 },
            plotOptions: { bar: { columnWidth: '60%' } }
          }
        },
        {
          breakpoint: 1200,
          options: {
            chart: { height: 300 },
            plotOptions: { bar: { columnWidth: '65%' } }
          }
        },
        {
          breakpoint: 992,
          options: {
            chart: { height: 280 },
            plotOptions: { bar: { columnWidth: '70%' } }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: 300 },
            xaxis: {
              labels: {
                style: {
                  fontSize: '11px'
                },
                rotate: -45
              }
            }
          }
        },
        {
          breakpoint: 480,
          options: {
            chart: { height: 250 },
            xaxis: {
              labels: {
                style: {
                  fontSize: '10px'
                },
                rotate: -45
              }
            }
          }
        }
      ]
    }).render();

    // 2. Dona (Con el fix de leyendas nativas limpias)
    const descripciones = this.diagnosticos.map(
      (item) => item.descripcionPrincipal,
    );
    const cantidades = this.diagnosticos.map((item) => item.cantidad);
    new ApexCharts(this.querySelector("#graficaDiagnosticos"), {
      chart: { 
        type: "donut", 
        height: 350, 
        width: "100%",
        parentHeightOffset: 0
      },
      series: cantidades,
      labels: descripciones,
      colors: ["#10B981", "#F59E0B", "#3B82F6", "#EF4444"],
      stroke: { show: false },
      legend: { 
        position: "right",
        fontSize: '13px',
        itemMargin: { horizontal: 8, vertical: 4 }
      },
      dataLabels: {
        enabled: false
      },
      responsive: [
        {
          breakpoint: 1920,
          options: {
            chart: { height: 350 },
            legend: { fontSize: '14px' }
          }
        },
        {
          breakpoint: 1440,
          options: {
            chart: { height: 320 },
            legend: { fontSize: '13px' }
          }
        },
        {
          breakpoint: 1200,
          options: {
            chart: { height: 300 },
            legend: { fontSize: '12px' }
          }
        },
        {
          breakpoint: 992,
          options: {
            chart: { height: 280 },
            legend: { fontSize: '11px' }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: 350 },
            legend: { 
              position: "bottom",
              fontSize: '12px',
              itemMargin: { horizontal: 8, vertical: 6 }
            }
          }
        },
        {
          breakpoint: 480,
          options: {
            chart: { height: 300 },
            legend: { 
              position: "bottom",
              fontSize: '11px',
              itemMargin: { horizontal: 6, vertical: 4 }
            }
          }
        }
      ]
    }).render();

    // 3. Líneas
    const fechas = this.evolucion.map((item) => item.fechaMedicion);
    const pesos = this.evolucion.map((item) => item.pesoKg);
    new ApexCharts(this.querySelector("#graficaEvolucion"), {
      chart: { 
        type: "line", 
        height: 400, 
        toolbar: { show: false }, 
        width: "100%",
        parentHeightOffset: 0
      },
      stroke: { curve: "smooth", width: 3 },
      series: [{ name: "Peso (Kg)", data: pesos }],
      xaxis: { 
        categories: fechas,
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: { 
        title: { text: "Kilogramos" },
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      markers: {
        size: 6,
        colors: ["#10B981"],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      colors: ["#10B981"],
      dataLabels: { enabled: false },
      responsive: [
        {
          breakpoint: 1920,
          options: {
            chart: { height: 400 },
            stroke: { width: 3 }
          }
        },
        {
          breakpoint: 1440,
          options: {
            chart: { height: 350 },
            stroke: { width: 3 }
          }
        },
        {
          breakpoint: 1200,
          options: {
            chart: { height: 320 },
            stroke: { width: 2.5 }
          }
        },
        {
          breakpoint: 992,
          options: {
            chart: { height: 300 },
            stroke: { width: 2.5 }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: 350 },
            stroke: { width: 2 },
            markers: { size: 5 },
            xaxis: {
              labels: {
                style: { fontSize: '11px' },
                rotate: -45
              }
            }
          }
        },
        {
          breakpoint: 480,
          options: {
            chart: { height: 280 },
            stroke: { width: 2 },
            markers: { size: 4 },
            xaxis: {
              labels: {
                style: { fontSize: '10px' },
                rotate: -45
              }
            },
            yaxis: {
              labels: {
                style: { fontSize: '10px' }
              }
            }
          }
        }
      ]
    }).render();
  }
}
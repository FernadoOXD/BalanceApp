export class TratamientoPacientePage extends HTMLElement {
  constructor() {
    super();
    this.data = null;
  }

  connectedCallback() {
    this.render();
    this.initLogic();
    this.loadData();
  }

  render() {
    this.innerHTML = `
      <div class="layout-wrapper">
        <app-sidebar-paciente style="position: fixed;"></app-sidebar-paciente>
        
        <main class="tratamiento-main" id="pdf-content-area">
          <!-- Encabezado Principal -->
          <header class="tratamiento-header">
            <h1>Plan de Tratamiento</h1>
            <p>Tu plan personalizado de nutrición y ejercicio.</p>
          </header>

          <!-- 1. Tarjetas de Resumen (Títulos e iconos estáticos, valores dinámicos) -->
          <section class="summary-cards-container" id="summary-container">
            
            <div class="summary-card">
              <img class="icon-box" src="./assets/icons/objetivo.png" alt="Objetivo">
              <div class="summary-info">
                <span class="summary-title">OBJETIVO PRINCIPAL</span>
                <h3 class="summary-value" id="val-objetivo">Cargando...</h3>
              </div>
            </div>

            <div class="summary-card">
              <img class="icon-box" src="./assets/icons/dieta.png" alt="Dieta">
              <div class="summary-info">
                <span class="summary-title">PLAN NUTRICIONAL BASE</span>
                <h3 class="summary-value" id="val-nutricion">Cargando...</h3>
              </div>
            </div>

            <div class="summary-card">
              <img class="icon-box" src="./assets/icons/aptitud-fisica.png" alt="Ejercicio">
              <div class="summary-info">
                <span class="summary-title">ENFOQUE FÍSICO</span>
                <h3 class="summary-value" id="val-fisico">Cargando...</h3>
              </div>
            </div>

          </section>

          <!-- 2. Menú Semanal -->
          <section class="menu-section">
            <div class="section-header">
              <h2 class="section-title">
                Menú Semanal
              </h2>
              <button id="btn-download-pdf" class="btn-text">Descargar PDF</button>
            </div>
            
            <div class="table-responsive-wrapper">
              <table class="menu-table">
                <thead>
                  <tr>
                    <th>COMIDA</th>
                    <th>LUNES</th>
                    <th>MARTES</th>
                    <th>MIÉRCOLES</th>
                    <th>JUEVES</th>
                    <th>VIERNES</th>
                    <th>SÁBADO</th>
                    <th>DOMINGO</th>
                  </tr>
                </thead>
                <tbody id="menu-tbody">
                  <!-- Las filas de comida se inyectan aquí -->
                </tbody>
              </table>
            </div>
          </section>

          <!-- 3. Ejercicios Asignados -->
          <section class="exercise-section">
            <div class="section-header">
              <h2 class="section-title">
                Ejercicios Asignados
              </h2>
              <span class="badge badge-green" id="rutina-tag">Cargando...</span>
            </div>

            <div class="exercise-grid" id="exercise-container">
              <!-- Las tarjetas de ejercicio se inyectan aquí -->
            </div>
          </section>
        </main>
      </div>
    `;
  }

  initLogic() {
    const btnDownload = this.querySelector("#btn-download-pdf");
    if (btnDownload) {
      btnDownload.addEventListener("click", () => this.descargarPDF());
    }
  }

  async loadData() {
    try {
      /* ========================================================
         AQUÍ SE CONECTARÁ CON LA API. Ejemplo:
         const response = await fetch('https://api.com/tratamiento/1');
         this.data = await response.json();
      ======================================================== */

      // MOCK DATA: Modificado para enviar solo los valores del resumen
      this.data = {
        resumen: {
          objetivo: "Pérdida de grasa y tonificación",
          nutricion: "Dieta Mediterránea - 1800 kcal",
          fisico: "Cardio moderado, enfoque a fuerza",
        },
        menuSemanal: [
          {
            tipo: "Desayuno",
            lunes: "Avena con manzana y canela, té verde.",
            martes: "Tostada integral con aguacate y huevo, café solo.",
            miercoles: "Batido de proteínas con plátano y espinacas.",
            jueves: "Yogur griego con frutos rojos y chía.",
            viernes: "Tortilla francesa de 2 huevos, infusión.",
            sabado: "Pancakes de avena con sirope sin azúcar.",
            domingo: "Bowl de frutas con granola y yogur.",
          },
          {
            tipo: "Comida",
            lunes: "Pollo a la plancha con quinoa y brócoli.",
            martes: "Salmón al horno con patata asada y espárragos.",
            miercoles: "Ensalada de garbanzos, tomate, pepino y atún.",
            jueves: "Lentejas con verduras (sin chorizo).",
            viernes: "Merluza en salsa verde con guisantes.",
            sabado: "Ternera a la plancha con ensalada mixta.",
            domingo: "Paella de marisco (porción controlada).",
          },
          {
            tipo: "Merienda",
            lunes: "Un puñado de almendras.",
            martes: "Manzana cortada con crema de cacahuete.",
            miercoles: "Queso fresco batido.",
            jueves: "Zanahorias baby con hummus.",
            viernes: "Tortitas de arroz.",
            sabado: "Batido de frutas (sin azúcar añadido).",
            domingo: "Un puñado de nueces.",
          },
          {
            tipo: "Cena",
            lunes: "Sopa de verduras, tortilla de claras.",
            martes: "Pescado blanco al papillote con calabacín.",
            miercoles: "Ensalada caprese con pechuga de pavo.",
            jueves: "Crema de calabaza, hamburguesa de pollo.",
            viernes: "Pizza con base de coliflor y vegetales.",
            sabado: "Revuelto de setas y gambas.",
            domingo: "Gazpacho, pechuga a la plancha.",
          },
        ],
        rutina: {
          etiqueta: "Rutina de Fuerza (3 días/semana)",
          ejercicios: [
            {
              nombre: "Sentadillas (Squats)",
              grupo: "Tren Inferior",
              instrucciones:
                "Mantener la espalda recta y bajar hasta formar ángulo de 90 grados.",
              metricas: [
                { label: "Series", valor: "3" },
                { label: "Repeticiones", valor: "12-15" },
                { label: "Descanso", valor: "60s" },
              ],
            },
            {
              nombre: "Flexiones (Push-ups)",
              grupo: "Tren Superior",
              instrucciones:
                "Apoyar rodillas si es necesario. Core activo durante el movimiento.",
              metricas: [
                { label: "Series", valor: "3" },
                { label: "Repeticiones", valor: "10-12" },
                { label: "Descanso", valor: "60s" },
              ],
            },
            {
              nombre: "Plancha Abdominal (Plank)",
              grupo: "Core",
              instrucciones:
                "Alinear cuerpo de pies a cabeza, contraer glúteos y abdomen.",
              metricas: [
                { label: "Series", valor: "3" },
                { label: "Duración", valor: "45 seg" },
                { label: "Descanso", valor: "30s" },
              ],
            },
            {
              nombre: "Remo con Mancuerna",
              grupo: "Espalda",
              instrucciones:
                "Apoyar rodilla y mano en un banco. Tirar hacia la cadera.",
              metricas: [
                { label: "Series", valor: "3" },
                { label: "Repeticiones", valor: "12 x lado" },
                { label: "Descanso", valor: "60s" },
              ],
            },
            {
              nombre: "Caminata Rápida",
              grupo: "Cardio",
              instrucciones:
                "Ritmo constante que permita mantener una conversación leve.",
              metricas: [
                { label: "Frecuencia", valor: "Días alternos" },
                { label: "Duración", valor: "30-40 min" },
              ],
            },
          ],
        },
      };

      this.renderDynamicContent();
    } catch (error) {
      console.error("Error al cargar el plan de tratamiento:", error);
    }
  }

  renderDynamicContent() {
    if (!this.data) return;

    const valObjetivo = this.querySelector("#val-objetivo");
    const valNutricion = this.querySelector("#val-nutricion");
    const valFisico = this.querySelector("#val-fisico");

    if (valObjetivo) valObjetivo.textContent = this.data.resumen.objetivo;
    if (valNutricion) valNutricion.textContent = this.data.resumen.nutricion;
    if (valFisico) valFisico.textContent = this.data.resumen.fisico;

    // Llenar Tabla del Menú Semanal
    const menuTbody = this.querySelector("#menu-tbody");
    if (menuTbody) {
      menuTbody.innerHTML = this.data.menuSemanal
        .map(
          (fila) => `
        <tr>
          <td class="meal-type">${fila.tipo}</td>
          <td>${fila.lunes}</td>
          <td>${fila.martes}</td>
          <td>${fila.miercoles}</td>
          <td>${fila.jueves}</td>
          <td>${fila.viernes}</td>
          <td>${fila.sabado}</td>
          <td>${fila.domingo}</td>
        </tr>
      `,
        )
        .join("");
    }

    //Llenar Sección de Ejercicios
    const rutinaTag = this.querySelector("#rutina-tag");
    if (rutinaTag) rutinaTag.textContent = this.data.rutina.etiqueta;

    const exerciseContainer = this.querySelector("#exercise-container");
    if (exerciseContainer) {
      exerciseContainer.innerHTML = this.data.rutina.ejercicios
        .map(
          (ejercicio) => `
        <div class="exercise-card">
          <div class="exercise-header">
            <h4>${ejercicio.nombre}</h4>
            <span class="exercise-badge">${ejercicio.grupo}</span>
          </div>
          <p class="exercise-instruction">${ejercicio.instrucciones}</p>
          <div class="exercise-metrics">
            ${ejercicio.metricas
              .map(
                (metrica) => `
              <div class="metric-block">
                <span class="metric-label">${metrica.label}</span>
                <span class="metric-value">${metrica.valor}</span>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `,
        )
        .join("");
    }
  }

  async descargarPDF() {
    const btnDownload = this.querySelector("#btn-download-pdf");
    const elemento = this.querySelector("#pdf-content-area");

    if (!elemento) return;

    // 1. Cambiar el estado del botón mientras se procesa
    const textoOriginal = btnDownload.textContent;
    btnDownload.textContent = "Generando PDF...";
    btnDownload.disabled = true;

    try {
      // 2. Configurar el formato del PDF
      const opciones = {
        margin: [15, 10, 15, 10], // Márgenes: top, left, bottom, right
        filename: "Plan_Tratamiento_BalanceApp.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2, // Mejora la resolución del texto
          useCORS: true, // Permite cargar imágenes/iconos externos si los hay
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a3", // Usamos A3 para dar espacio a las 7 columnas del menú
          orientation: "portrait",
        },
      };

      // 3. Ocultar el botón temporalmente para que NO salga impreso en el PDF
      btnDownload.style.visibility = "hidden";

      // 4. Ejecutar la librería (usa await porque es una promesa)
      await html2pdf().set(opciones).from(elemento).save();
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un problema al intentar descargar el documento.");
    } finally {
      // 5. Restaurar la vista y el botón a la normalidad
      btnDownload.style.visibility = "visible";
      btnDownload.textContent = textoOriginal;
      btnDownload.disabled = false;
    }
  }
}

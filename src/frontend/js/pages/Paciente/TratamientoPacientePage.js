import { API_BASE_URL } from "../../../config.js";

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

          <!-- Contenedor para mostrar error si no hay plan asignado -->
          <div id="error-tratamiento" class="validation-error hidden" style="margin-bottom: 20px;">
             <span class="alert-icon">ℹ️</span>
             <p>Aún no tienes un plan de tratamiento asignado por tu nutriólogo.</p>
          </div>

          <div id="tratamiento-content">
            <!-- 1. Tarjetas de Resumen -->
            <section class="summary-cards-container" id="summary-container">
              
              <div class="summary-card">
                <img class="icon-box" src="/assets/icons/objetivo.png" alt="Objetivo">
                <div class="summary-info">
                  <span class="summary-title">OBJETIVO PRINCIPAL</span>
                  <h3 class="summary-value" id="val-objetivo">Cargando...</h3>
                </div>
              </div>

              <div class="summary-card">
                <img class="icon-box" src="/assets/icons/dieta.png" alt="Dieta">
                <div class="summary-info">
                  <span class="summary-title">PLAN NUTRICIONAL BASE</span>
                  <h3 class="summary-value" id="val-nutricion">Cargando...</h3>
                </div>
              </div>

              <div class="summary-card">
                <img class="icon-box" src="/assets/icons/aptitud-fisica.png" alt="Ejercicio">
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
          </div>
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
      const idPaciente = localStorage.getItem("idPaciente");

      if (!idPaciente) {
        console.error("No hay sesión activa en localStorage.");
        return;
      }

      // Conexión real a tu backend
      const response = await fetch(
        `${API_BASE_URL}/api/paciente/tratamiento/${idPaciente}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error en el servidor: Código ${response.status}`);
      }

      this.data = await response.json();

      // Asegurarse de que el contenido principal sea visible y pintar datos
      this.querySelector("#tratamiento-content").classList.remove("hidden");
      this.renderDynamicContent();
    } catch (error) {
      console.error("Error al cargar el plan de tratamiento:", error);

      // Ocultar el contenido vacío y mostrar el mensaje amigable
      const mainContent = this.querySelector("#tratamiento-content");
      const errorDiv = this.querySelector("#error-tratamiento");

      if (mainContent) mainContent.classList.add("hidden");
      if (errorDiv) errorDiv.classList.remove("hidden");
    }
  }

  renderDynamicContent() {
    if (!this.data) return;

    // 1. TARJETAS DE RESUMEN (Mapeo directo desde Tratamiento.java)
    const valObjetivo = this.querySelector("#val-objetivo");
    const valNutricion = this.querySelector("#val-nutricion");
    const valFisico = this.querySelector("#val-fisico");

    if (valObjetivo)
      valObjetivo.textContent = this.data.objetivo || "No especificado";
    if (valNutricion)
      valNutricion.textContent = this.data.alimentacion || "No especificado";
    if (valFisico)
      valFisico.textContent =
        this.data.ejercicioDescripcion || "No especificado";

    // 2. MENÚ SEMANAL (Parsear el String JSON y respetar mayúsculas de la nutrióloga)
    const menuTbody = this.querySelector("#menu-tbody");
    if (menuTbody) {
      if (this.data.menuExcel) {
        try {
          // Convertimos el texto de MySQL a un Array real
          const menuParseado =
            typeof this.data.menuExcel === "string"
              ? JSON.parse(this.data.menuExcel)
              : this.data.menuExcel;

          menuTbody.innerHTML = menuParseado
            .map(
              (fila) => `
            <tr>
              <td class="meal-type"><strong>${fila.comida || ""}</strong></td>
              <td>${fila.Lunes || "-"}</td>
              <td>${fila.Martes || "-"}</td>
              <td>${fila.Miercoles || "-"}</td>
              <td>${fila.Jueves || "-"}</td>
              <td>${fila.Viernes || "-"}</td>
              <td>${fila.Sabado || "-"}</td>
              <td>${fila.Domingo || "-"}</td>
            </tr>
          `,
            )
            .join("");
        } catch (e) {
          console.error("Error al leer el menú:", e);
          menuTbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Error al cargar el menú.</td></tr>`;
        }
      } else {
        menuTbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Aún no se ha asignado un menú semanal.</td></tr>`;
      }
    }

    // 3. EJERCICIOS (Mostrar el bloque de texto con viñetas)
    const rutinaTag = this.querySelector("#rutina-tag");
    const exerciseContainer = this.querySelector("#exercise-container");

    if (rutinaTag)
      rutinaTag.textContent = this.data.ejercicioDescripcion
        ? "Rutina Personalizada"
        : "Sin rutina";

    if (exerciseContainer) {
      if (this.data.ejercicio) {
        // En lugar de tarjetas complejas, pintamos el texto respetando los saltos de línea (white-space: pre-line)
        exerciseContainer.innerHTML = `
          <div style="background: var(--bg-card, #fff); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color, #eaeaea); width: 100%; white-space: pre-line; line-height: 1.8; color: var(--text-secondary, #444); font-size: 15px;">
            ${this.data.ejercicio}
          </div>
        `;
        // Ajustamos el grid para que ocupe todo el ancho
        exerciseContainer.style.gridTemplateColumns = "1fr";
      } else {
        exerciseContainer.innerHTML = `
          <div style="padding: 20px; color: var(--text-muted, gray);">
            No hay ejercicios detallados asignados a tu plan.
          </div>
        `;
      }
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
        margin: [15, 10, 15, 10],
        filename: "Plan_Tratamiento_BalanceApp.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a3",
          orientation: "portrait",
        },
      };

      // 3. Ocultar el botón temporalmente para que NO salga impreso en el PDF
      btnDownload.style.visibility = "hidden";

      // 4. Ejecutar la librería
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

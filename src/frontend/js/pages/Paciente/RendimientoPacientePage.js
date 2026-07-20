  import { API_BASE_URL } from '../../../config.js';
  export class RendimientoPacientePage extends HTMLElement {
    connectedCallback() {
      this.render();
      this.initLogic();
      this.loadUserProfile();
    }

    render() {
      this.innerHTML = `
      <div class="paciente-layout">
      <app-sidebar-paciente style="position: fixed;"></app-sidebar-paciente>
        
        <main class="rendimiento-main">
          <header class="rendimiento-header">
            <h1>Hola, <span id="user-name-display">Usuario</span></h1>
            <span class="rendimiento-date" id="current-date-display">Cargando fecha...</span>
          </header>

          <div id="validation-alert" class="validation-error hidden">
            <span class="alert-icon">⚠️</span>
            <p>Por favor, completa todos los campos obligatorios antes de enviar.</p>
          </div>

          <form id="daily-report-form" class="report-form-container">
            
            <section class="card-section">
              <h2 class="card-title">
                <img src="assets/icons/menuVerde.png" alt="DietaIcon" class="menuIcon"> 
                Seguimiento de Dieta
              </h2>
              <p class="card-instruction">¿Cómo te fue con las comidas hoy?</p>
              
              <div class="dieta-grid-options">
                <button type="button" class="dieta-btn-card" data-value="100">
                  <img src="./assets/icons/cara-feliz.png" alt="Excelente" class="mood-icon">
                  <span class="btn-text-main">Seguí la dieta 100%</span>
                </button>
                
                <button type="button" class="dieta-btn-card" data-value="deslices">
                  <img src="./assets/icons/cara-neutra.png" alt="Regular" class="mood-icon">
                  <span class="btn-text-main">Algunos deslices</span>
                </button>
                
                <button type="button" class="dieta-btn-card" data-value="no">
                  <img src="./assets/icons/cara-triste.png" alt="Mal" class="mood-icon">
                  <span class="btn-text-main">No la seguí</span>
                </button>
              </div>
              <span id="error-dieta" class="field-error-msg hidden">Selecciona una opción</span>
            </section>

            <section class="card-section">
              <h2 class="card-title">
                <img src="assets/icons/menuVerde.png" alt="AguaIcon" class="menuIcon">
                Vasos de agua (250ml)
              </h2>
              <div class="water-counter-container" style="display: flex; align-items: center; justify-content: center; gap: 20px; padding: 10px 0;">
                <button type="button" id="btn-water-minus" class="water-btn" style="cursor:pointer; width:35px; height:35px; border-radius:50%; border:1px solid #ced4da; background:#fff; font-size:18px;">-</button>
                <div style="text-align: center;">
                  <span id="water-count" style="font-size: 32px; font-weight: 700; color: #0d624b; display: block;">4</span>
                  <span class="water-unit-text" style="font-size: 12px; color: #868e96;">Aprox. 1 Litro</span>
                </div>
                <button type="button" id="btn-water-plus" class="water-btn" style="cursor:pointer; width:35px; height:35px; border-radius:50%; border:1px solid #0d624b; background:#0d624b; color:#fff; font-size:18px;">+</button>
              </div>
            </section>

            <section class="card-section">
              <h2 class="card-title">
                <img src="assets/icons/pesas.png" alt="ActdFisica" class="PesasIcon"> 
                Actividad Física
              </h2>
              
              <div class="input-field-group">
                <label>Tipo de Ejercicio</label>
                <div class="select-wrapper-custom">
                  <select id="exercise-type" class="custom-form-input">
                    <option value="">Selecciona una actividad</option>
                    <option value="caminar">Caminar</option>
                    <option value="correr">Correr / Cardio</option>
                    <option value="gimnasio">Gimnasio / Pesas</option>
                  </select>
                </div>
                <span id="error-ejercicio" class="field-error-msg hidden">Selecciona el tipo de actividad</span>
              </div>

              <div class="input-field-group">
                <label>Duración (minutos)</label>
                <input type="number" id="exercise-duration" class="custom-form-input" placeholder="Ej. 45">
                <span id="error-duracion" class="field-error-msg hidden">Ingresa los minutos</span>
              </div>

              <div class="input-field-group checkbox-alignment">
                <label class="custom-checkbox-container">
                  <input type="checkbox" id="exercise-completed">
                  <span class="checkmark-box"></span>
                  ¿Completaste tu rutina planeada?
                </label>
              </div>
            </section>

            <section class="card-section">
              <h2 class="card-title">
                <img src="assets/icons/notas.png" alt="NotasIcon" class="notasIcon"> 
                Notas Adicionales
              </h2>
              <div class="input-field-group">
                <label>¿Cómo te sentiste hoy? ¿Algún antojo o molestia?</label>
                <textarea id="report-notes" class="custom-form-textarea" placeholder="¿Cómo te sentiste hoy? ¿Algún antojo o molestia?"></textarea>
              </div>
            </section>

            <div class="form-submit-wrapper">
              <button type="submit" class="btn-send-report">
                <span class="submit-icon">➤</span> Enviar Reporte
              </button>
            </div>

          </form>
        </main>
      </div>
      `;
    }

    initLogic() {
      let cantVasos = 4;
      const waterCountLabel = this.querySelector("#water-count");
      const waterUnitLabel = this.querySelector(".water-unit-text");
      const btnMinus = this.querySelector("#btn-water-minus");
      const btnPlus = this.querySelector("#btn-water-plus");

      const actualizarAguaUI = () => {
        if (!waterCountLabel || !waterUnitLabel) return;
        waterCountLabel.textContent = cantVasos;
        const litros = (cantVasos * 0.25).toFixed(2).replace(".00", "");
        waterUnitLabel.textContent = `Aprox. ${litros} Litro${litros === "1" ? "" : "s"}`;
      };

      if (btnMinus && btnPlus) {
        btnMinus.addEventListener("click", () => {
          if (cantVasos > 0) {
            cantVasos--;
            actualizarAguaUI();
          }
        });

        btnPlus.addEventListener("click", () => {
          cantVasos++;
          actualizarAguaUI();
        });
      }

      const dietaButtons = this.querySelectorAll(".dieta-btn-card");
      let dietaSeleccionada = null;

      dietaButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          dietaButtons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          dietaSeleccionada = btn.dataset.value;
          const errDieta = this.querySelector("#error-dieta");
          if (errDieta) errDieta.classList.add("hidden");
        });
      });

      const form = this.querySelector("#daily-report-form");
      const validationAlert = this.querySelector("#validation-alert");
      const exerciseType = this.querySelector("#exercise-type");
      const exerciseDuration = this.querySelector("#exercise-duration");

      if (form) {
      // 1. Agregamos 'async' aquí
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let esValido = true;

        if (validationAlert) validationAlert.classList.add("hidden");
        this.querySelectorAll(".field-error-msg").forEach((m) =>
          m.classList.add("hidden"),
        );

        if (!dietaSeleccionada) {
          const errDieta = this.querySelector("#error-dieta");
          if (errDieta) errDieta.classList.remove("hidden");
          esValido = false;
        }

        if (exerciseType && !exerciseType.value) {
          const errEj = this.querySelector("#error-ejercicio");
          if (errEj) errEj.classList.remove("hidden");
          esValido = false;
        }

        if (
          exerciseDuration &&
          (!exerciseDuration.value || exerciseDuration.value <= 0)
        ) {
          const errDur = this.querySelector("#error-duracion");
          if (errDur) errDur.classList.remove("hidden");
          esValido = false;
        }

        if (!esValido) {
          if (validationAlert) validationAlert.classList.remove("hidden");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        // 2. Empaquetamos los datos del formulario
        const payload = {
          dieta: dietaSeleccionada,
          vasosAgua: cantVasos,
          ejercicio: exerciseType.value,
          duracion: exerciseDuration.value,
          completado: this.querySelector("#exercise-completed")?.checked || false,
          notas: this.querySelector("#report-notes")?.value || "",
        };

        console.log("Reporte validado y listo:", payload);

        // ==========================================
        // 3. CONEXIÓN AL BACKEND JAVALIN
        // ==========================================
        const submitBtn = this.querySelector(".btn-send-report");
        const originalText = submitBtn.innerHTML;
        const pacienteId = localStorage.getItem("userId");

        if (!pacienteId) {
          alert("Error: No se encontró tu sesión. Por favor, inicia sesión nuevamente.");
          window.location.hash = "/auth"; 
          return;
        }

        try {
          submitBtn.innerHTML = `<span class="submit-icon">⏳</span> Enviando...`;
          submitBtn.disabled = true;

          // Inyectamos el API_BASE_URL
          const response = await fetch(`${API_BASE_URL}/api/paciente/rendimiento?paciente_id=${pacienteId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
             throw new Error("Error al guardar el reporte en el servidor");
          }

          alert("¡Reporte diario enviado exitosamente!");
          
          // Limpiar el formulario para el día siguiente
          form.reset();
          dietaButtons.forEach((b) => b.classList.remove("active"));
          dietaSeleccionada = null;
          cantVasos = 4;
          actualizarAguaUI();

        } catch (error) {
          console.error("Error al enviar reporte:", error);
          alert("Hubo un problema al enviar tu reporte. Intenta de nuevo.");
        } finally {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      });
    }
    }

    loadUserProfile() {
      const nameDisplay = this.querySelector("#user-name-display");
      if (nameDisplay) {
        const savedName = localStorage.getItem("userName");
        nameDisplay.textContent =
          savedName && savedName.trim() !== "" ? savedName : "Usuario";
      }

      const dateDisplay = this.querySelector("#current-date-display");
      if (dateDisplay) {
        const today = new Date();
        const options = {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        };

        let formatted = today.toLocaleDateString("es-ES", options);
        dateDisplay.textContent =
          formatted.charAt(0).toUpperCase() + formatted.slice(1);
      }
    }
  }


export class DashboardPaciente extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initLogic();
    this.loadUserProfile();
  }

  render() {
    this.innerHTML = `
      <div class="dashboard-container">
        
        <main class="main-content">
          <header class="main-header">
            <h1>Hola, <span class="text-highlight" id="user-name-display">...</span></h1>
            <span class="main-header__date" id="current-date-display">Cargando fecha...</span>
          </header>

          <section class="report-card">
            <div class="report-card__header">
              <h2>Reporte Diario</h2>
            </div>
            
            <div class="report-card__body">
              <p class="report-instructions">Complete de manera honesta el siguiente formulario:</p>

              <form id="daily-report-form">
                <div class="report-grid">
                  
                  <div class="report-block">
                    <h3>A: Seguimiento de Dieta</h3>
                    <div class="dieta-options">
                      <button type="button" class="dieta-btn" data-value="100">
                        <span class="dieta-icon check">✓</span> Seguí la dieta 100%
                      </button>
                      <button type="button" class="dieta-btn" data-value="deslices">
                        <span class="dieta-icon warning">~</span> Algunos deslices
                      </button>
                      <button type="button" class="dieta-btn" data-value="no">
                        <span class="dieta-icon cross">✕</span> No la seguí
                      </button>
                    </div>
                  </div>

                  <div class="report-block">
                    <h3>B: Actividad Física</h3>
                    <p class="report-subinstructions">Recomendaciones asignadas por tu nutrióloga:</p>
                    
                    <div id="exercise-recommendations-container" class="recommendations-box">
                      <p class="placeholder-text">Cargando recommendations de ejercicio asignadas...</p>
                    </div>

                    <div class="form-group-dash">
                      <label>Tipo de Ejercicio Realizado</label>
                      <select id="exercise-type" class="dash-input">
                        <option value="">Selecciona una actividad</option>
                        <option value="caminar">Caminar</option>
                        <option value="correr">Correr / Cardio</option>
                        <option value="gimnasio">Gimnasio / Pesas</option>
                      </select>
                    </div>
                    <div class="form-group-dash">
                      <label>Duración (minutos)</label>
                      <input type="number" id="exercise-duration" class="dash-input" placeholder="Ej. 45">
                    </div>
                    <div class="form-group-dash">
                      <label>¿Completaste tu rutina planeada?</label>
                      <div class="toggle-buttons">
                        <button type="button" class="toggle-btn" data-status="si">Sí</button>
                        <button type="button" class="toggle-btn" data-status="no">No</button>
                      </div>
                    </div>
                  </div>

                  <div class="report-block recipe-block">
                    <h3>C: Receta Asignada</h3>
                    <p class="report-subinstructions">Indicaciones y minutas vigentes de tu nutrióloga:</p>
                    
                    <div id="recipe-preview-container" class="recipe-preview-box">
                      <p class="placeholder-text">No hay recetas cargadas o asignadas para el día de hoy.</p>
                    </div>
                  </div>

                  <div class="report-block">
                    <h3>D: Notas Adicionales</h3>
                    <label>¿Cómo te sentiste hoy? ¿Algún antojo o molestia?</label>
                    <textarea id="report-notes" class="dash-textarea" placeholder="Escribe aquí cómo te has sentido, si tuviste ansiedad, fatiga o algún logro..."></textarea>
                  </div>

                </div>

                <div class="form-actions-dash">
                  <button type="submit" class="btn-submit-report">[ Enviar Reporte ]</button>
                </div>
              </form>
            </div>
          </section>
        </main>

      </div>
    `;
  }

  initLogic() {
    const setupSelectableButtons = (buttonSelector, activeClass) => {
      const buttons = this.querySelectorAll(buttonSelector);
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          buttons.forEach(b => b.classList.remove(activeClass));
          btn.classList.add(activeClass);
        });
      });
    };

    setupSelectableButtons(".dieta-btn", "dieta-btn--active");
    setupSelectableButtons(".toggle-btn", "toggle-btn--active");

    const form = this.querySelector("#daily-report-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const selectedDieta = this.querySelector(".dieta-btn--active")?.dataset.value;
      const exercise = this.querySelector("#exercise-type").value;
      const duration = this.querySelector("#exercise-duration").value;
      const completedRoutine = this.querySelector(".toggle-btn--active")?.dataset.status;
      const notes = this.querySelector("#report-notes").value;

      console.log("Reporte Diario Listo para Enviar:", {
        dieta: selectedDieta || "No seleccionada",
        ejercicio: exercise,
        duracionMinutos: duration,
        rutinaCompletada: completedRoutine || "No especificado",
        notas: notes
      });

      alert("¡Reporte diario enviado con éxito!");
    });
  }

  loadUserProfile() {
    // 1. Manejo dinámico del nombre
    const nameDisplay = this.querySelector("#user-name-display");
    const savedName = localStorage.getItem("userName") || "Usuario";
    if (nameDisplay) {
      nameDisplay.textContent = savedName;
    }

    // 2. Manejo dinámico e internacionalizado de la fecha real
    const dateDisplay = this.querySelector("#current-date-display");
    if (dateDisplay) {
      const today = new Date();
      
      // Formateador nativo de JS para obtener la estructura: "día_semana, día de mes de año"
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let formattedDate = today.toLocaleDateString('es-ES', options);
      
      // Forzar la primera letra de la fecha a mayúscula para fines estéticos (ej: "Lunes...")
      formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      
      dateDisplay.textContent = formattedDate;
    }
  }
}
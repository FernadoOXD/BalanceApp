import { API_BASE_URL } from "../../../config.js";

export class AgendamientoEncuestaPage extends HTMLElement {
  connectedCallback() {
    this.abortController = new AbortController();
    this.specialistSettings = null;
    this.render();
    this.initElements();
    this.initState();
    this.loadSpecialistSettings();
    this.initLogic();
  }

  disconnectedCallback() {
    this.abortController.abort();
  }

  render() {
    this.innerHTML = `
<div class="nutricore-layout">
  <!-- ── Header Global ── -->
  <header class="n-header">
    <div class="n-header__brand">
      <img src="./assets/images/logo_horizontal.png" width="200px" height="100px" alt="Logo">
    </div>
    <div class="n-header__actions">
      <button class="n-icon-btn" aria-label="Perfil de usuario">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
    </div>
  </header>

  <main class="n-main-content">
    <!-- ── Stepper (Indicador de progreso) ── -->
    <div class="n-stepper">
      <div class="n-stepper__step n-stepper__step--active" id="step-1-indicator">
        <div class="n-stepper__circle">1</div>
        <span class="n-stepper__label">Agenda</span>
      </div>
      <div class="n-stepper__line n-stepper__line--active"></div>
      <div class="n-stepper__step" id="step-2-indicator">
        <div class="n-stepper__circle">2</div>
        <span class="n-stepper__label">Cuestionario Inicial</span>
      </div>
    </div>

    <!-- ==========================================
         FASE 1: AGENDAMIENTO (SCHEDULE)
         ========================================== -->
    <section id="phase-schedule" class="n-phase n-phase--active">
      <div class="n-card">
        <div class="n-card__header">
          <h2>Selecciona Fecha y Hora</h2>
          <p>Elige el espacio preferido para tu cita.</p>
        </div>
        
        <div class="n-schedule-container">
          <!-- Calendario Dinámico -->
          <div class="n-calendar">
            <div class="n-calendar__header">
              <button type="button" class="n-calendar__nav-btn" id="btn-prev-month" aria-label="Mes anterior">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <h3 class="n-calendar__month" id="calendar-month-label"></h3>
              <button type="button" class="n-calendar__nav-btn" id="btn-next-month" aria-label="Mes siguiente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
            
            <div class="n-calendar__grid" id="calendar-grid">
              <span class="n-calendar__day-name">Do</span><span class="n-calendar__day-name">Lu</span><span class="n-calendar__day-name">Ma</span><span class="n-calendar__day-name">Mi</span><span class="n-calendar__day-name">Ju</span><span class="n-calendar__day-name">Vi</span><span class="n-calendar__day-name">Sa</span>
            </div>
          </div>

          <!-- Horarios Disponibles -->
          <div class="n-times">
            <h4 class="n-times__title">Horarios Disponibles</h4>
            <div class="n-times__grid">
              <p class="n-times__empty">Selecciona una fecha para ver los horarios disponibles.</p>
            </div>
          </div>
        </div>

        <div class="n-card__footer">
          <button type="button" class="n-btn n-btn--outline"><a href="#/paciente/agenda" style="text-decoration:none; color:inherit;">Volver</a></button>
          <button type="button" id="btn-next-phase" class="n-btn n-btn--primary">
            Siguiente 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ==========================================
         FASE 2: ENCUESTA CLÍNICA (GRÁFICAS)
         ========================================== -->
    <section id="phase-survey" class="n-phase" style="display: none;">
      <div class="n-card n-card--large">
        <div class="n-card__header">
          <h2>Información Previa a la Consulta</h2>
          <p>Estos datos ayudarán a la especialista a preparar tu expediente clínico.</p>
        </div>

        <form id="survey-form" class="n-survey-form">
          
          <fieldset class="n-form-section">
            <legend class="n-form-section__title">Datos Demográficos y Físicos</legend>
            <p class="n-form-sublabel mb-3">Información utilizada para calcular tu perfil base (Histograma).</p>
            
            <div class="n-form-grid n-form-grid--2cols">
              <div class="n-form-group">
                <label class="n-form-label">Fecha de Nacimiento</label>
                <input type="date" class="n-input" name="fechaNacimiento" required>
              </div>
              
              <div class="n-form-group">
                <label class="n-form-label">Género</label>
                <select class="n-select" name="genero" required>
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div class="n-form-group">
                <label class="n-form-label">Peso actual aproximado (kg)</label>
                <input type="number" class="n-input" name="pesoKg" step="0.1" placeholder="Ej. 70.5" required>
              </div>

              <div class="n-form-group">
                <label class="n-form-label">Estatura (cm)</label>
                <input type="number" class="n-input" name="estaturaCm" placeholder="Ej. 175" required>
              </div>
            </div>
          </fieldset>

          <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 32px 0;">

          <fieldset class="n-form-section">
            <legend class="n-form-section__title">Motivo y Antecedentes</legend>
            <p class="n-form-sublabel mb-3">Información para conocer las incidencias de consulta (Gráfica de Dona).</p>
            
            <div class="n-form-group">
              <label class="n-form-label">Motivo principal de la consulta</label>
              <select class="n-select" name="motivoConsulta" required>
                <option value="">Seleccione...</option>
                <option value="Pérdida de peso">Pérdida de peso</option>
                <option value="Aumento de masa muscular">Aumento de masa muscular</option>
                <option value="Control de enfermedad">Control de enfermedad crónica</option>
                <option value="Nutrición deportiva">Nutrición deportiva</option>
                <option value="Educación nutricional">Educación nutricional general</option>
              </select>
            </div>

            <div class="n-form-group">
              <label class="n-form-label">Enfermedades diagnosticadas en familiares directos</label>
              <input type="text" class="n-input" name="antecedenteFamiliares" placeholder="Ej. Diabetes, Hipertensión (Escribe 'Ninguna' si no aplica)" required>
            </div>

            <div class="n-form-group">
              <label class="n-form-label">Alergias o intolerancias alimentarias</label>
              <input type="text" class="n-input" name="alergiaIntolerancia" placeholder="Ej. Intolerancia a la lactosa, alergia al maní (Escribe 'Ninguna' si no aplica)" required>
            </div>
          </fieldset>

          <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 32px 0;">

          <fieldset class="n-form-section">
            <legend class="n-form-section__title">Hábitos Diarios</legend>
            <p class="n-form-sublabel mb-3">Esta información forma tu línea base de progreso (Gráfica de Líneas).</p>

            <div class="n-form-group">
              <label class="n-form-label">Medicamentos o suplementos que consumes actualmente</label>
              <input type="text" class="n-input" name="medicamentoActual" placeholder="Ej. Omeprazol, Proteína Whey (Escribe 'Ninguno' si no aplica)" required>
            </div>

            <div class="n-form-group">
              <label class="n-form-label">Consumo de bebidas alcohólicas o tabaco</label>
              <input type="text" class="n-input" name="habitoToxico" placeholder="Ej. Ocasional, Frecuente (Escribe 'Ninguno' si no aplica)" required>
            </div>
          </fieldset>

          <!-- Submit de la Encuesta -->
          <div class="n-card__footer mt-4">
            <button type="button" id="btn-prev-phase" class="n-btn n-btn--outline">Volver</button>
            <button type="submit" class="n-btn n-btn--primary">Finalizar Registro y Guardar</button>
          </div>
        </form>
      </div>
    </section>
  </main>
</div>
    `;
  }

  initElements() {
    this.phaseSchedule = this.querySelector("#phase-schedule");
    this.phaseSurvey = this.querySelector("#phase-survey");

    this.btnNextPhase = this.querySelector("#btn-next-phase");
    this.btnPrevPhase = this.querySelector("#btn-prev-phase");

    this.calendarDays = this.querySelectorAll(
      ".n-calendar__day:not(.n-calendar__day--muted)",
    );
    this.timeButtons = this.querySelectorAll(".n-time-btn");

    this.surveyForm = this.querySelector("#survey-form");

    this.step2Indicator = this.querySelector("#step-2-indicator");
    this.stepperLines = this.querySelectorAll(".n-stepper__line");
  }

  initState() {
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();

    const initialSelectedTime = this.querySelector(".n-time-btn--selected");

    this.state = {
      selectedDate: null,
      selectedTime: initialSelectedTime
        ? initialSelectedTime.textContent
        : null,
      currentPhase: 1,
    };
  }

  async loadSpecialistSettings() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion`);
      if (response.ok) {
        this.specialistSettings = await response.json();
      } else {
        console.warn("No se pudo cargar la configuración, usando predeterminados (todos los días hábiles).");
        this.specialistSettings = null;
      }

      // Regenerar el calendario con los settings cargados
      this._renderCalendar();
    } catch (error) {
      console.error("Error al cargar configuraciones del especialista:", error);
    }
  }

  _isDayActive(dayOfWeek) {
    if (!this.specialistSettings || !this.specialistSettings.schedule) {
      return true; // Si no hay settings, permitir todos los días
    }

    const dayMap = {
      0: "dom", // Domingo
      1: "lun", // Lunes
      2: "mar", // Martes
      3: "mie", // Miércoles
      4: "jue", // Jueves
      5: "vie", // Viernes
      6: "sab", // Sábado
    };

    const dayId = dayMap[dayOfWeek];
    const scheduleItem = this.specialistSettings.schedule.find(
      (item) => item.id === dayId,
    );

    return scheduleItem && scheduleItem.active;
  }

  _getScheduleForDay(dayOfWeek) {
    if (!this.specialistSettings || !this.specialistSettings.schedule) {
      return null;
    }

    const dayMap = {
      0: "dom",
      1: "lun",
      2: "mar",
      3: "mie",
      4: "jue",
      5: "vie",
      6: "sab",
    };

    const dayId = dayMap[dayOfWeek];
    return this.specialistSettings.schedule.find((item) => item.id === dayId);
  }

  _generateTimeSlots(start, end, durationMinutes) {
    const timeSlots = [];
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    while (currentMinutes + durationMinutes <= endMinutes) {
      const slotHour = Math.floor(currentMinutes / 60);
      const slotMinute = currentMinutes % 60;
      const period = slotHour >= 12 ? "PM" : "AM";
      const displayHour =
        slotHour > 12 ? slotHour - 12 : slotHour === 0 ? 12 : slotHour;
      const displayMinute = slotMinute.toString().padStart(2, "0");
      timeSlots.push(`${displayHour}:${displayMinute} ${period}`);
      currentMinutes += durationMinutes;
    }

    return timeSlots;
  }

  _renderTimeSlots(dayOfWeek) {
    const schedule = this._getScheduleForDay(dayOfWeek);
    const timesGrid = this.querySelector(".n-times__grid");

    if (!schedule || !schedule.active) {
      timesGrid.innerHTML =
        "<p class='n-times__empty'>No hay horarios disponibles para este día.</p>";
      return;
    }

    const duration = this.specialistSettings?.duration || 60;
    const timeSlots = this._generateTimeSlots(
      schedule.start,
      schedule.end,
      duration,
    );

    timesGrid.innerHTML = timeSlots
      .map(
        (time) => `
        <button type="button" class="n-time-btn">${time}</button>
      `,
      )
      .join("");

    // Re-attach event listeners to new time buttons
    this.timeButtons = this.querySelectorAll(".n-time-btn");
    const signal = this.abortController.signal;
    this.timeButtons.forEach((timeBtn) => {
      timeBtn.addEventListener(
        "click",
        (e) => {
          this._handleTimeSelection(e.target);
        },
        { signal },
      );
    });
  }

  initLogic() {
    const signal = this.abortController.signal;

    const btnPrevMonth = this.querySelector("#btn-prev-month");
    const btnNextMonth = this.querySelector("#btn-next-month");

    btnPrevMonth.addEventListener(
      "click",
      () => {
        this.currentMonth--;
        if (this.currentMonth < 0) {
          this.currentMonth = 11;
          this.currentYear--;
        }
        this._renderCalendar();
      },
      { signal },
    );

    btnNextMonth.addEventListener(
      "click",
      () => {
        this.currentMonth++;
        if (this.currentMonth > 11) {
          this.currentMonth = 0;
          this.currentYear++;
        }
        this._renderCalendar();
      },
      { signal },
    );

    this._renderCalendar();

    this.btnNextPhase.addEventListener(
      "click",
      () => {
        this._attemptNextPhase();
      },
      { signal },
    );

    this.btnPrevPhase.addEventListener(
      "click",
      () => {
        this._goToPhase(1);
      },
      { signal },
    );

    this.surveyForm.addEventListener(
      "submit",
      (e) => {
        this._handleSubmit(e);
      },
      { signal },
    );
  }

  _handleDaySelection(selectedElement) {
    this.calendarDays.forEach((btn) =>
      btn.classList.remove("n-calendar__day--selected"),
    );
    selectedElement.classList.add("n-calendar__day--selected");
    this.state.selectedDate = selectedElement.textContent;
  }

  _renderCalendar() {
    const monthLabel = this.querySelector("#calendar-month-label");
    const grid = this.querySelector("#calendar-grid");
    const btnPrevMonth = this.querySelector("#btn-prev-month");
    const signal = this.abortController.signal;
    const today = new Date();

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    monthLabel.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

    if (
      this.currentYear === today.getFullYear() &&
      this.currentMonth === today.getMonth()
    ) {
      btnPrevMonth.disabled = true;
      btnPrevMonth.style.opacity = "0.3";
      btnPrevMonth.style.cursor = "not-allowed";
    } else {
      btnPrevMonth.disabled = false;
      btnPrevMonth.style.opacity = "1";
      btnPrevMonth.style.cursor = "pointer";
    }

    const daysToRemove = grid.querySelectorAll(".n-calendar__day");
    daysToRemove.forEach((day) => day.remove());

    const firstDayOfMonth = new Date(
      this.currentYear,
      this.currentMonth,
      1,
    ).getDay();
    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0,
    ).getDate();
    const daysInPrevMonth = new Date(
      this.currentYear,
      this.currentMonth,
      0,
    ).getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayBtn = document.createElement("button");
      dayBtn.type = "button";
      dayBtn.className = "n-calendar__day n-calendar__day--muted";
      dayBtn.textContent = daysInPrevMonth - i;
      dayBtn.disabled = true;
      grid.appendChild(dayBtn);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayBtn = document.createElement("button");
      dayBtn.type = "button";
      dayBtn.className = "n-calendar__day";
      dayBtn.textContent = i;

      const currentDateObj = new Date(this.currentYear, this.currentMonth, i);
      const dayOfWeek = currentDateObj.getDay();
      const isPastDate =
        this.currentYear === today.getFullYear() &&
        this.currentMonth === today.getMonth() &&
        i < today.getDate();
      const isDayActive = this._isDayActive(dayOfWeek);

      if (isPastDate || !isDayActive) {
        dayBtn.classList.add("n-calendar__day--muted");
        dayBtn.disabled = true;
      } else {
        dayBtn.addEventListener(
          "click",
          (e) => {
            const allCurrentDays = grid.querySelectorAll(
              ".n-calendar__day:not(.n-calendar__day--muted)",
            );
            allCurrentDays.forEach((btn) =>
              btn.classList.remove("n-calendar__day--selected"),
            );
            e.target.classList.add("n-calendar__day--selected");
            this.state.selectedDate = `${i} de ${monthNames[this.currentMonth]} de ${this.currentYear}`;
            this.state.selectedTime = null; // Reset selected time when date changes
            this._renderTimeSlots(dayOfWeek);
            this._validateAvailableTimes(
              i,
              this.currentMonth,
              this.currentYear,
            );
          },
          { signal },
        );
      }
      grid.appendChild(dayBtn);
    }
  }

  _validateAvailableTimes(selectedDay, selectedMonth, selectedYear) {
    const today = new Date();
    const isToday =
      selectedDay === today.getDate() &&
      selectedMonth === today.getMonth() &&
      selectedYear === today.getFullYear();
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();

    this.timeButtons = this.querySelectorAll(".n-time-btn");
    this.timeButtons.forEach((btn) => {
      if (!isToday) {
        btn.disabled = false;
        return;
      }
      const timeText = btn.textContent.trim();
      const [time, modifier] = timeText.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);

      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const isPastTime =
        hours < currentHour ||
        (hours === currentHour && minutes <= currentMinutes);

      if (isPastTime) {
        btn.disabled = true;
        btn.classList.remove("n-time-btn--selected");
        if (this.state.selectedTime === timeText) {
          this.state.selectedTime = null;
        }
      } else {
        btn.disabled = false;
      }
    });
  }

  _handleTimeSelection(selectedElement) {
    this.timeButtons.forEach((btn) =>
      btn.classList.remove("n-time-btn--selected"),
    );
    selectedElement.classList.add("n-time-btn--selected");
    this.state.selectedTime = selectedElement.textContent;
  }

  _attemptNextPhase() {
    if (!this.state.selectedDate || !this.state.selectedTime) {
      alert(
        "Por favor, selecciona una fecha y un horario disponible antes de continuar.",
      );
      return;
    }
    this._goToPhase(2);
  }

  _goToPhase(phaseNumber) {
    this.state.currentPhase = phaseNumber;
    if (phaseNumber === 1) {
      this.phaseSchedule.style.display = "block";
      this.phaseSurvey.style.display = "none";
      this.step2Indicator.classList.remove("n-stepper__step--active");
      this.stepperLines[0].classList.remove("n-stepper__line--active");
    } else if (phaseNumber === 2) {
      this.phaseSchedule.style.display = "none";
      this.phaseSurvey.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.step2Indicator.classList.add("n-stepper__step--active");
      this.stepperLines[0].classList.add("n-stepper__line--active");
    }
  }

  async _handleSubmit(e) {
    e.preventDefault();

    const idPaciente = localStorage.getItem("userId");
    if (!idPaciente) {
      alert("Error: No se encontró tu sesión. Por favor, inicia sesión nuevamente.");
      window.location.hash = "/auth";
      return;
    }

    if (!this.surveyForm.checkValidity()) {
      this.surveyForm.reportValidity();
      return;
    }

    const formData = new FormData(this.surveyForm);
    const surveyData = {};
    for (let [key, value] of formData.entries()) {
      surveyData[key] = value;
    }

    // Convertir formato de fecha de "13 de Julio de 2026" a "YYYY-MM-DD"
    const formatDateToMySQL = (dateStr) => {
      if (!dateStr) return null;
      const months = {
        enero: "01",
        febrero: "02",
        marzo: "03",
        abril: "04",
        mayo: "05",
        junio: "06",
        julio: "07",
        agosto: "08",
        septiembre: "09",
        octubre: "10",
        noviembre: "11",
        diciembre: "12",
      };
      const parts = dateStr.toLowerCase().split(" de ");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = months[parts[1]] || "01";
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
      return dateStr;
    };

    const citaPayload = {
      idPaciente: parseInt(idPaciente, 10),
      fecha: formatDateToMySQL(this.state.selectedDate), // Ej. "2026-10-15"
      hora: this.state.selectedTime, // Ej. "10:00 AM" (el backend lo parseará a TIME si está en buen formato o podrías necesitar convertirlo)
      motivoConsulta: surveyData.motivoConsulta || "Consulta general",
      estado: "Pendiente"
    };

    console.log("Cita payload:", citaPayload);

    const submitBtn = this.surveyForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Procesando...";
    submitBtn.disabled = true;

    try {
      // 1. Guardar la cita
      const responseCita = await fetch(`${API_BASE_URL}/api/cita`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(citaPayload),
      });

      const resultCita = await responseCita.json();

      if (!responseCita.ok || !resultCita.success) {
        throw new Error(resultCita.message || resultCita.error || "Error al guardar la cita en la base de datos");
      }

      // 2. Guardar la encuesta asociada a esa cita
      const encuestaPayload = {
        idCita: resultCita.id,
        idPaciente: parseInt(idPaciente, 10),
        datosEncuesta: JSON.stringify(surveyData)
      };

      const responseEncuesta = await fetch(`${API_BASE_URL}/api/encuesta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encuestaPayload),
      });

      const resultEncuesta = await responseEncuesta.json();

      if (!responseEncuesta.ok || !resultEncuesta.success) {
        throw new Error(resultEncuesta.message || resultEncuesta.error || "Error al guardar la encuesta de la cita");
      }

      alert("¡Cita agendada y encuesta guardada con éxito!");
      window.location.hash = "/paciente/agenda";
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al conectar con el servidor Java. " + error.message);
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}

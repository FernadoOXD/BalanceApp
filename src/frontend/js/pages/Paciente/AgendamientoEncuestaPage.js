export class AgendamientoEncuestaPage extends HTMLElement {
  connectedCallback() {
    //  AbortController lo estamos usando para limpiar eventos cuando el componente se desmonta
    this.abortController = new AbortController();

    this.render();
    this.initElements();
    this.initState();
    this.initLogic();
  }

  disconnectedCallback() {
    // Limpieza de memoria (elimina todos los event listeners atados a esta señal)
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
        <span class="n-stepper__label">Schedule</span>
      </div>
      <div class="n-stepper__line n-stepper__line--active"></div>
      <div class="n-stepper__step" id="step-2-indicator">
        <div class="n-stepper__circle">2</div>
        <span class="n-stepper__label">Details</span>
      </div>
    </div>

    <!-- ==========================================
         FASE 1: AGENDAMIENTO (SCHEDULE)
         ========================================== -->
    <section id="phase-schedule" class="n-phase n-phase--active">
      <div class="n-card">
        <div class="n-card__header">
          <h2>Select a Date & Time</h2>
          <p>Choose your preferred appointment slot.</p>
        </div>
        
        <div class="n-schedule-container">
          <!-- Calendario -->
<!-- Calendario Dinámico -->
          <div class="n-calendar">
            <div class="n-calendar__header">
              <button class="n-calendar__nav-btn" id="btn-prev-month" aria-label="Mes anterior">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <h3 class="n-calendar__month" id="calendar-month-label"></h3>
              <button class="n-calendar__nav-btn" id="btn-next-month" aria-label="Mes siguiente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
            
            <div class="n-calendar__grid" id="calendar-grid">
              <span class="n-calendar__day-name">Do</span><span class="n-calendar__day-name">Lu</span><span class="n-calendar__day-name">Ma</span><span class="n-calendar__day-name">Mi</span><span class="n-calendar__day-name">Ju</span><span class="n-calendar__day-name">Vi</span><span class="n-calendar__day-name">Sa</span>
              <!-- Los días se generarán dinámicamente desde JS -->
            </div>
          </div>

          <!-- Horarios Disponibles -->
          <div class="n-times">
            <h4 class="n-times__title">Available Times</h4>
            <div class="n-times__grid">
              <button class="n-time-btn">09:00 AM</button>
              <button class="n-time-btn">09:30 AM</button>
              <button class="n-time-btn n-time-btn--selected">10:00 AM</button>
              <button class="n-time-btn">11:00 AM</button>
              <button class="n-time-btn">01:00 PM</button>
              <button class="n-time-btn">02:30 PM</button>
            </div>
          </div>
        </div>

        <div class="n-card__footer">
          <button id="btn-next-phase" class="n-btn n-btn--primary">
            Next 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ==========================================
         FASE 2: ENCUESTA (SURVEY)
         ========================================== -->
    <section id="phase-survey" class="n-phase" style="display: none;">
      <div class="n-card n-card--large">
        <div class="n-card__header">
          <h2>Encuesta de Evaluación</h2>
          <p>Pediatría Atención Primaria - Servicio Murciano de Salud</p>
        </div>

        <form id="survey-form" class="n-survey-form">
          
<!-- ==========================================
     SECCIÓN 1: DATOS FAMILIARES
     ========================================== -->
<fieldset class="n-form-section">
  <legend class="n-form-section__title">1) DATOS FAMILIARES</legend>
  
  <!-- ── Peso y Altura ── -->
  <div class="n-form-grid n-form-grid--3cols">
    <div class="n-form-group">
      <label class="n-form-label">Familiar</label>
      <div class="n-form-label-static">Padre</div>
      <div class="n-form-label-static">Madre</div>
      <div class="n-form-label-static">Hermanos</div>
    </div>
    <div class="n-form-group">
      <label class="n-form-label">Peso (Kg)</label>
      <input type="number" class="n-input" name="peso_padre" step="0.1" placeholder="Ej. 80.5" required>
      <input type="number" class="n-input" name="peso_madre" step="0.1" placeholder="Ej. 65.2" required>
      <input type="number" class="n-input" name="peso_hermanos" step="0.1" placeholder="Ej. 45.0">
    </div>
    <div class="n-form-group">
      <label class="n-form-label">Altura (cm)</label>
      <input type="number" class="n-input" name="altura_padre" placeholder="Ej. 175" required>
      <input type="number" class="n-input" name="altura_madre" placeholder="Ej. 160" required>
      <input type="number" class="n-input" name="altura_hermanos" placeholder="Ej. 140">
    </div>
  </div>

  <!-- ── Nivel de Estudios y Situación Familiar ── -->
  <div class="n-form-group">
    <label class="n-form-label">Nivel de estudios del Padre:</label>
    <select class="n-select" name="estudios_padre" required>
      <option value="">Seleccione una opción...</option>
      <option value="ninguno">Ninguno</option>
      <option value="primarios">Primarios</option>
      <option value="secundarios">Secundarios</option>
      <option value="universitarios">Universitarios</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">Nivel de estudios de la Madre:</label>
    <select class="n-select" name="estudios_madre" required>
      <option value="">Seleccione una opción...</option>
      <option value="ninguno">Ninguno</option>
      <option value="primarios">Primarios</option>
      <option value="secundarios">Secundarios</option>
      <option value="universitarios">Universitarios</option>
    </select>
  </div>
  
  <div class="n-form-group">
    <label class="n-form-label">Situación familiar:</label>
    <select class="n-select" name="situacion_familiar" required>
      <option value="">Seleccione una opción...</option>
      <option value="matrimonio">Matrimonio o pareja de hecho</option>
      <option value="separados_compartida">Padres separados con custodia compartida</option>
      <option value="separados_exclusiva">Padres separados con custodia exclusiva madre o padre</option>
      <option value="monoparental">Familia monoparental</option>
    </select>
  </div>

  <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 32px 0;">

  <!-- ── Organización de las comidas ── -->
  <h4 style="margin-bottom: 16px; color: var(--nc-primary);">➤ Organización de las comidas</h4>
  
  <div class="n-form-group">
    <label class="n-form-label">¿Realiza de forma habitual 5 comidas al día (desayuno, almuerzo media mañana, comida, merienda, cena)?</label>
    <select class="n-select" name="habitual_5_comidas" required>
      <option value="">Seleccione...</option>
      <option value="todos_los_dias">Todos los días</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunos_dias">Algunos días</option>
      <option value="solo_fin_semana">Sólo fin de semana</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Generalmente, dónde suele realizar la comida principal los días de colegio?</label>
    <select class="n-select" name="lugar_comida_principal" required>
      <option value="">Seleccione...</option>
      <option value="en_casa">En casa</option>
      <option value="comedor_escolar">Comedor escolar</option>
      <option value="casa_abuelos">Casa abuelos</option>
      <option value="casa_familiar_amigo">Casa familiar o amigo</option>
      <option value="restaurante">Restaurante</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Con qué frecuencia realizan comidas o cenas en familia, todos juntos?</label>
    <select class="n-select" name="frecuencia_comidas_familia" required>
      <option value="">Seleccione...</option>
      <option value="todos_los_dias">Todos los días</option>
      <option value="4_6_dias">4-6 días/semana</option>
      <option value="1_3_dias">1-3 días/semana</option>
      <option value="menos_1_dia">< 1 día/semana</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Con qué frecuencia suele ver la televisión mientras come o cena en casa?</label>
    <select class="n-select" name="frecuencia_tv_comiendo" required>
      <option value="">Seleccione...</option>
      <option value="siempre">Siempre</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunas_veces">Algunas veces</option>
      <option value="rara_vez">Rara vez</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Acude a centros de comida rápida tipo hamburguesería o pizzería?</label>
    <select class="n-select" name="frecuencia_comida_rapida" required>
      <option value="">Seleccione...</option>
      <option value="nunca">Nunca</option>
      <option value="menos_1_mes">Menos de 1 vez/mes</option>
      <option value="mensual">Mensual</option>
      <option value="semanal">Semanal</option>
      <option value="mas_1_semana">Más de 1 vez/semana</option>
    </select>
  </div>

  <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 32px 0;">

  <!-- ── Relación con la comida ── -->
  <h4 style="margin-bottom: 16px; color: var(--nc-primary);">➤ Relación con la comida</h4>

  <div class="n-form-group">
    <label class="n-form-label">¿Cómo definiría la relación de su hijo/a con la comida?</label>
    <select class="n-select" name="relacion_comida_hijo" required>
      <option value="">Seleccione...</option>
      <option value="normal">Normal</option>
      <option value="impaciencia">Impaciencia</option>
      <option value="rapidez">Rapidez</option>
      <option value="voracidad">Voracidad</option>
      <option value="siempre_comiendo">Siempre comiendo</option>
      <option value="no_se_sacia">No se sacia nunca</option>
      <option value="come_aburrimiento">Come por aburrimiento</option>
      <option value="siempre_hambre">Siempre tiene hambre</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Qué bebe durante las comidas o las cenas (puede contestar varias)?</label>
    <div class="n-checkbox-group">
      <label><input type="checkbox" name="bebida_comidas" value="agua"> Agua</label>
      <label><input type="checkbox" name="bebida_comidas" value="zumos"> Zumos</label>
      <label><input type="checkbox" name="bebida_comidas" value="leche"> Leche</label>
      <label><input type="checkbox" name="bebida_comidas" value="batidos"> Batidos</label>
      <label><input type="checkbox" name="bebida_comidas" value="refrescos"> Refrescos</label>
    </div>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Cree que su hijo/a come unas raciones adecuadas en las comidas/cenas?</label>
    <select class="n-select" name="raciones_adecuadas" required>
      <option value="">Seleccione...</option>
      <option value="siempre">Siempre</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunas_veces">Algunas veces</option>
      <option value="rara_vez">Rara vez</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Qué cantidad de comida le gusta que le den en las comidas o las cenas?</label>
    <select class="n-select" name="cantidad_gustada" required>
      <option value="">Seleccione...</option>
      <option value="mucha">Mucha cantidad (igual o más que adulto)</option>
      <option value="normal">Plato "normal"</option>
      <option value="poca">Poca cantidad</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Suele repetir en las comidas/cenas?</label>
    <select class="n-select" name="suele_repetir" required>
      <option value="">Seleccione...</option>
      <option value="siempre">Siempre</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunas_veces">Algunas veces</option>
      <option value="rara_vez">Rara vez</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">Mientras está esperando a que se ponga la mesa, ¿suele estar picando algo?</label>
    <select class="n-select" name="pica_esperando_mesa" required>
      <option value="">Seleccione...</option>
      <option value="siempre">Siempre</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunas_veces">Algunas veces</option>
      <option value="rara_vez">Rara vez</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Lo han encontrado alguna vez comiendo a escondidas?</label>
    <select class="n-select" name="comiendo_escondidas" required>
      <option value="">Seleccione...</option>
      <option value="siempre">Siempre</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunas_veces">Algunas veces</option>
      <option value="rara_vez">Rara vez</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Ha tenido episodios de atracones de comida?</label>
    <select class="n-select" name="episodios_atracones" required>
      <option value="">Seleccione...</option>
      <option value="siempre">Siempre</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunas_veces">Algunas veces</option>
      <option value="rara_vez">Rara vez</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Suele utilizar alimentos, dulces o golosinas como premio o regalo?</label>
    <select class="n-select" name="alimentos_premio" required>
      <option value="">Seleccione...</option>
      <option value="siempre">Siempre</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunas_veces">Algunas veces</option>
      <option value="rara_vez">Rara vez</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Han notado problemas psicológicos, de conducta o de cómo se ve a si mismo/a?</label>
    <div class="n-radio-group">
      <label><input type="radio" name="problemas_psicologicos" value="si" required> SI</label>
      <label><input type="radio" name="problemas_psicologicos" value="no" required> NO</label>
    </div>
    <input type="text" class="n-input mt-2" name="cuales_problemas_psicologicos" placeholder="Si es afirmativo, indicar cual...">
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Qué fruta cree que debería comer un niño/a para una dieta saludable?</label>
    <select class="n-select" name="creencia_fruta_saludable" required>
      <option value="">Seleccione...</option>
      <option value="ninguna">Ninguna</option>
      <option value="alguna_vez_semana">Alguna vez por semana</option>
      <option value="1_pieza_dia">1 pieza/día</option>
      <option value="2_piezas_dia">2 piezas/día</option>
      <option value="3_mas_piezas_dia">3 o más piezas/día</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Qué verdura cree que debería comer un niño/a para una dieta saludable?</label>
    <select class="n-select" name="creencia_verdura_saludable" required>
      <option value="">Seleccione...</option>
      <option value="ninguna">Ninguna</option>
      <option value="1_2_veces_semana">1-2 veces/semana</option>
      <option value="casi_todos_dias">Casi todos los días</option>
      <option value="1_vez_dia">1 vez/día</option>
      <option value="2_mas_veces_dia">2 o más veces/día</option>
    </select>
  </div>

  <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 32px 0;">

  <!-- ── Relación con el ejercicio físico ── -->
  <h4 style="margin-bottom: 16px; color: var(--nc-primary);">➤ Relación con el ejercicio físico</h4>

  <div class="n-form-group">
    <label class="n-form-label">¿Cómo media, cuánto tiempo cree que debería practicar actividad física un niño/a en edad escolar fuera del colegio, bien jugando o haciendo deporte?</label>
    <select class="n-select" name="creencia_tiempo_ejercicio" required>
      <option value="">Seleccione...</option>
      <option value="ninguna">Ninguna</option>
      <option value="1_hora_semana">1 hora/semana</option>
      <option value="2_3_horas_semana">2-3 h/semana</option>
      <option value="4_5_horas_semana">4-5 h/semana</option>
      <option value="1_hora_mas_dia">1 hora o más al día</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Cuánto tiempo cree que le gustaría hacer a su hijo/a ejercicio físico o deporte a la semana?</label>
    <select class="n-select" name="gusto_tiempo_ejercicio_hijo" required>
      <option value="">Seleccione...</option>
      <option value="todos_los_dias">Todos los días</option>
      <option value="casi_todos_dias">Casi todos los días</option>
      <option value="algunos_dias">Algunos días</option>
      <option value="1_dia_semana">1 día/semana</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">¿Tienen posibilidades de inscribir a su hijo/a en actividades de deporte organizado fuera del horario escolar (tenis, natación, baloncesto, aeróbic...)?</label>
    <select class="n-select" name="posibilidad_inscribir_deporte" required>
      <option value="">Seleccione...</option>
      <option value="si">Sí</option>
      <option value="no_horario_trabajo">No, problemas de horario o trabajo de los padres</option>
      <option value="no_economicos">No, problemas económicos</option>
      <option value="no_apoyo">No, falta de apoyo familiar o social</option>
      <option value="no_horario_nino">No, problemas de horario o actividades del niño/a</option>
    </select>
  </div>

</fieldset>

<!-- ==========================================
     SECCIÓN 2: ALIMENTACIÓN DEL NIÑO/A
     ========================================== -->
<fieldset class="n-form-section">
  <legend class="n-form-section__title">II) DATOS ALIMENTACIÓN DEL NIÑO/A</legend>

  <div class="n-form-group">
    <label class="n-form-label">A1.- Desayuno (al levantarse, antes de ir al colegio, guardería o instituto):</label>
    <select class="n-select mb-2" name="a1_frecuencia_desayuno" required>
      <option value="">Frecuencia...</option>
      <option value="todos">Todos los días</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunos_dias">Algunos días</option>
      <option value="fin_semana">Sólo fin de semana</option>
      <option value="nunca">Nunca</option>
    </select>
    <p class="n-form-sublabel">¿Qué suele desayunar habitualmente su hijo/a?</p>
    <div class="n-checkbox-group">
      <label><input type="checkbox" name="a1_desayuno_items" value="lacteos"> Lácteos (leche o yogur o queso fresco)</label>
      <label><input type="checkbox" name="a1_desayuno_items" value="cereales"> Cereales (galletas, pan, tostadas, cereales para la leche...)</label>
      <label><input type="checkbox" name="a1_desayuno_items" value="fruta"> Fruta (pieza de fruta, zumo natural)</label>
      <label><input type="checkbox" name="a1_desayuno_items" value="bolleria"> Bollería, dulces o batidos</label>
    </div>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">A2.- ¿Suele llevar algún alimento para consumir en el cole o instituto (recreo)?</label>
    <select class="n-select mb-2" name="a2_frecuencia_recreo" required>
      <option value="">Frecuencia...</option>
      <option value="todos">Todos los días</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunos_dias">Algunos días</option>
      <option value="nunca">Nunca</option>
    </select>
    <input type="text" class="n-input" name="a2_que_lleva" placeholder="¿Qué suele llevar? (indicar contenido y tamaño bocadillo si lo toma)">
  </div>

  <div class="n-form-grid n-form-grid--3cols">
    <div class="n-form-group">
      <label class="n-form-label">A3.- ¿Cuántas piezas o raciones de fruta toma al día?</label>
      <select class="n-select" name="a3_piezas_fruta" required>
        <option value="">Seleccione...</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="mas_de_3">Más de 3 piezas</option>
      </select>
    </div>
    
    <div class="n-form-group">
      <label class="n-form-label">A4.- Variedad de fruta que le gusta:</label>
      <select class="n-select" name="a4_variedad_fruta" required>
        <option value="">Seleccione...</option>
        <option value="muchos">Muchos tipos</option>
        <option value="pocos">Unos pocos tipos</option>
        <option value="ninguna">Ninguna</option>
        <option value="se_niega">Se niega a probarla</option>
      </select>
    </div>

    <div class="n-form-group">
      <label class="n-form-label">A6.- Frecuencia ensalada/verduras crudas:</label>
      <select class="n-select" name="a6_verduras_crudas" required>
        <option value="">Seleccione...</option>
        <option value="nunca">Nunca</option>
        <option value="algun_dia">Algún día a la semana</option>
        <option value="varios_dias">Varios días a la semana</option>
        <option value="todos_dias">Todos los días</option>
      </select>
    </div>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">A5.- ¿Toma algún postre que no sea fruta después de las comidas/cenas?</label>
    <div class="n-radio-group mb-2">
      <label><input type="radio" name="a5_postre_no_fruta" value="si" required> SI</label>
      <label><input type="radio" name="a5_postre_no_fruta" value="no" required> NO</label>
    </div>
    <input type="text" class="n-input" name="a5_que_postre" placeholder="¿Qué suele tomar?">
  </div>

  <div class="n-form-grid n-form-grid--3cols">
    <div class="n-form-group">
      <label class="n-form-label">A7.- Frecuencia verduras cocidas:</label>
      <select class="n-select" name="a7_verduras_cocidas" required>
        <option value="">Seleccione...</option>
        <option value="nunca">Nunca</option>
        <option value="algun_dia">Algún día a la semana</option>
        <option value="varios_dias">Varios días a la semana</option>
        <option value="todos_dias">Todos los días</option>
      </select>
    </div>

    <div class="n-form-group">
      <label class="n-form-label">A8.- Variedad de verdura que le gusta:</label>
      <select class="n-select" name="a8_variedad_verdura" required>
        <option value="">Seleccione...</option>
        <option value="muchos">Muchos tipos</option>
        <option value="pocos">Unos pocos tipos</option>
        <option value="ninguna">Ninguna</option>
        <option value="se_niega">Se niega a probarla</option>
      </select>
    </div>

    <div class="n-form-group">
      <label class="n-form-label">A9.- Fruta/verdura entre horas:</label>
      <select class="n-select" name="a9_entre_horas" required>
        <option value="">Seleccione...</option>
        <option value="nunca">Nunca</option>
        <option value="pocas_veces">Pocas veces</option>
        <option value="con_frecuencia">Con frecuencia</option>
        <option value="todos_dias">Todos los días</option>
      </select>
    </div>
  </div>

  <div class="n-form-grid n-form-grid--3cols">
    <div class="n-form-group">
      <label class="n-form-label">A10.- Legumbres (lentejas, garbanzos):</label>
      <select class="n-select" name="a10_legumbres" required>
        <option value="">Seleccione...</option>
        <option value="nunca">Nunca</option>
        <option value="alguna_vez_mes">Alguna vez al mes</option>
        <option value="1_dia_semana">1 día/semana</option>
        <option value="2_mas_dias">2 o más días a la semana</option>
      </select>
    </div>

    <div class="n-form-group">
      <label class="n-form-label">A11.- Arroz:</label>
      <select class="n-select" name="a11_arroz" required>
        <option value="">Seleccione...</option>
        <option value="nunca">Nunca</option>
        <option value="alguna_vez_mes">Alguna vez al mes</option>
        <option value="1_dia_semana">1 día/semana</option>
        <option value="2_mas_dias">2 o más días a la semana</option>
      </select>
    </div>

    <div class="n-form-group">
      <label class="n-form-label">A12.- Pasta (macarrones, espagueti):</label>
      <select class="n-select" name="a12_pasta" required>
        <option value="">Seleccione...</option>
        <option value="nunca">Nunca</option>
        <option value="alguna_vez_mes">Alguna vez al mes</option>
        <option value="1_dia_semana">1 día/semana</option>
        <option value="2_mas_dias">2 o más días a la semana</option>
      </select>
    </div>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">A13.- ¿Con qué frecuencia suele comer su hijo/a carne como plato principal?</label>
    <select class="n-select mb-2" name="a13_frecuencia_carne" required>
      <option value="">Seleccione...</option>
      <option value="nunca">Nunca</option>
      <option value="1_2_dias">1 o 2 días/semana</option>
      <option value="3_4_dias">3-4 días/semana</option>
      <option value="todos_dias">Todos o casi todos los días</option>
    </select>
    <input type="text" class="n-input" name="a13_tipo_carne" placeholder="¿Qué tipo de carne es la que más frecuente toma?">
  </div>

  <div class="n-form-group">
    <label class="n-form-label">A14.- ¿Con qué frecuencia suele comer embutidos?</label>
    <select class="n-select mb-2" name="a14_frecuencia_embutidos" required>
      <option value="">Seleccione...</option>
      <option value="nunca">Nunca</option>
      <option value="1_2_dias">1 o 2 días/semana</option>
      <option value="3_4_dias">3-4 días/semana</option>
      <option value="todos_dias">Todos o casi todos los días</option>
    </select>
    <input type="text" class="n-input" name="a14_tipo_embutidos" placeholder="¿Qué tipos de embutido suele tomar?">
  </div>

  <div class="n-form-grid n-form-grid--3cols">
    <div class="n-form-group">
      <label class="n-form-label">A15.- Pescado como plato principal:</label>
      <select class="n-select" name="a15_pescado" required>
        <option value="">Seleccione...</option>
        <option value="nunca">Nunca</option>
        <option value="alguna_vez_mes">Alguna vez al mes</option>
        <option value="1_2_dias">1-2 días/semana</option>
        <option value="3_mas_dias">3 o más días a la semana</option>
      </select>
    </div>

    <div class="n-form-group">
      <label class="n-form-label">A16.- Huevos (fritos, cocidos, tortilla):</label>
      <select class="n-select" name="a16_huevos" required>
        <option value="">Seleccione...</option>
        <option value="nunca">Nunca</option>
        <option value="1_2_huevos">1-2 huevos/semana</option>
        <option value="3_4_huevos">3-4 huevos/semana</option>
        <option value="5_mas_huevos">5 o más huevos/semana</option>
      </select>
    </div>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">A17.- ¿Toma medio litro de leche o derivados (2 yogures = 250 ml leche) al día?</label>
    <div class="n-radio-group mb-2">
      <label><input type="radio" name="a17_medio_litro_leche" value="si" required> SI</label>
      <label><input type="radio" name="a17_medio_litro_leche" value="no" required> NO</label>
    </div>
    <input type="text" class="n-input" name="a17_desnatados" placeholder="¿Son desnatados o semidesnatados?">
  </div>

  <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 32px 0;">

  <!-- Matriz de Frecuencia de Consumo (AP) -->
  <div class="n-form-group">
    <label class="n-form-label" style="color: var(--nc-primary); font-size: 1.05rem;">AP.- ¿Con qué frecuencia suele comer su hijo/a?:</label>
    <div class="n-table-responsive">
      <table class="n-survey-table">
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Diario</th>
            <th>> 1 vez/sem</th>
            <th>1 vez/sem</th>
            <th>Alguna vez/mes</th>
            <th>Nunca/Casi nunca</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Productos fritos, rebozados o empanados</td>
            <td><input type="radio" name="ap_fritos" value="diario" required></td>
            <td><input type="radio" name="ap_fritos" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_fritos" value="1_sem"></td>
            <td><input type="radio" name="ap_fritos" value="mensual"></td>
            <td><input type="radio" name="ap_fritos" value="nunca"></td>
          </tr>
          <tr>
            <td>Patatas fritas (sartén, freidora o bolsa)</td>
            <td><input type="radio" name="ap_patatas" value="diario" required></td>
            <td><input type="radio" name="ap_patatas" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_patatas" value="1_sem"></td>
            <td><input type="radio" name="ap_patatas" value="mensual"></td>
            <td><input type="radio" name="ap_patatas" value="nunca"></td>
          </tr>
          <tr>
            <td>Aperitivos salados/Gusanitos/Snacks</td>
            <td><input type="radio" name="ap_snacks" value="diario" required></td>
            <td><input type="radio" name="ap_snacks" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_snacks" value="1_sem"></td>
            <td><input type="radio" name="ap_snacks" value="mensual"></td>
            <td><input type="radio" name="ap_snacks" value="nunca"></td>
          </tr>
          <tr>
            <td>Zumos envasados</td>
            <td><input type="radio" name="ap_zumos" value="diario" required></td>
            <td><input type="radio" name="ap_zumos" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_zumos" value="1_sem"></td>
            <td><input type="radio" name="ap_zumos" value="mensual"></td>
            <td><input type="radio" name="ap_zumos" value="nunca"></td>
          </tr>
          <tr>
            <td>Refrescos (de cola, naranja o limón...)</td>
            <td><input type="radio" name="ap_refrescos" value="diario" required></td>
            <td><input type="radio" name="ap_refrescos" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_refrescos" value="1_sem"></td>
            <td><input type="radio" name="ap_refrescos" value="mensual"></td>
            <td><input type="radio" name="ap_refrescos" value="nunca"></td>
          </tr>
          <tr>
            <td>Salsas, kétchup o mayonesa</td>
            <td><input type="radio" name="ap_salsas" value="diario" required></td>
            <td><input type="radio" name="ap_salsas" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_salsas" value="1_sem"></td>
            <td><input type="radio" name="ap_salsas" value="mensual"></td>
            <td><input type="radio" name="ap_salsas" value="nunca"></td>
          </tr>
          <tr>
            <td>Bollería "industrial" (pastelitos, bollos...)</td>
            <td><input type="radio" name="ap_bolleria_ind" value="diario" required></td>
            <td><input type="radio" name="ap_bolleria_ind" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_bolleria_ind" value="1_sem"></td>
            <td><input type="radio" name="ap_bolleria_ind" value="mensual"></td>
            <td><input type="radio" name="ap_bolleria_ind" value="nunca"></td>
          </tr>
          <tr>
            <td>Bollería "casera" (madalenas, sobaos, monas...)</td>
            <td><input type="radio" name="ap_bolleria_casera" value="diario" required></td>
            <td><input type="radio" name="ap_bolleria_casera" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_bolleria_casera" value="1_sem"></td>
            <td><input type="radio" name="ap_bolleria_casera" value="mensual"></td>
            <td><input type="radio" name="ap_bolleria_casera" value="nunca"></td>
          </tr>
          <tr>
            <td>Batidos lácteos (de chocolate, vainilla...)</td>
            <td><input type="radio" name="ap_batidos" value="diario" required></td>
            <td><input type="radio" name="ap_batidos" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_batidos" value="1_sem"></td>
            <td><input type="radio" name="ap_batidos" value="mensual"></td>
            <td><input type="radio" name="ap_batidos" value="nunca"></td>
          </tr>
          <tr>
            <td>Chocolate, bombones, chocolatinas...</td>
            <td><input type="radio" name="ap_chocolate" value="diario" required></td>
            <td><input type="radio" name="ap_chocolate" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_chocolate" value="1_sem"></td>
            <td><input type="radio" name="ap_chocolate" value="mensual"></td>
            <td><input type="radio" name="ap_chocolate" value="nunca"></td>
          </tr>
          <tr>
            <td>Golosinas o "chuches"</td>
            <td><input type="radio" name="ap_golosinas" value="diario" required></td>
            <td><input type="radio" name="ap_golosinas" value="mas_1_sem"></td>
            <td><input type="radio" name="ap_golosinas" value="1_sem"></td>
            <td><input type="radio" name="ap_golosinas" value="mensual"></td>
            <td><input type="radio" name="ap_golosinas" value="nunca"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</fieldset>

<!-- ==========================================
     SECCIÓN 3: ACTIVIDAD FÍSICA DEL NIÑO/A
     ========================================== -->
<fieldset class="n-form-section">
  <legend class="n-form-section__title">III) DATOS ACTIVIDAD FÍSICA DEL NIÑO/A</legend>

  <!-- ── Actividad sedentaria ── -->
  <h4 style="margin-bottom: 16px; color: var(--nc-primary);">➤ Actividad sedentaria</h4>

  <div class="n-form-group">
    <label class="n-form-label">B1.- ¿Cuántas horas al día suele ver la televisión, videojuegos, ordenador en su tiempo libre?</label>
    <div class="n-form-inline">
      <input type="number" class="n-input n-input--short" name="b1_horas_pantalla_laborables" placeholder="Ej. 2" required> horas/día (Laborables)
      <input type="number" class="n-input n-input--short" name="b1_horas_pantalla_festivos" placeholder="Ej. 4" required> horas/día (Festivos)
    </div>
  </div>

  <div class="n-form-grid n-form-grid--3cols">
    <div class="n-form-group">
      <label class="n-form-label">B2.- ¿Cuántas horas suele dormir entre semana?</label>
      <div class="n-form-inline">
        <input type="number" class="n-input n-input--short" name="b2_horas_sueno" placeholder="Ej. 8" required> horas/día
      </div>
    </div>

    <div class="n-form-group">
      <label class="n-form-label">B3.- ¿Cuántas horas al día (de media) está haciendo deberes?</label>
      <div class="n-form-inline">
        <input type="number" class="n-input n-input--short" name="b3_horas_deberes" placeholder="Ej. 1.5" step="0.5" required> horas/día
      </div>
    </div>

    <div class="n-form-group">
      <label class="n-form-label">B4.- ¿Horas a la semana en extraescolares sedentarias (Informática, idiomas...)?</label>
      <div class="n-form-inline">
        <input type="number" class="n-input n-input--short" name="b4_horas_extraescolares_sedentarias" placeholder="Ej. 3" required> horas/sem
      </div>
    </div>
  </div>

  <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 32px 0;">

  <!-- ── Actividad física en las tareas cotidianas ── -->
  <h4 style="margin-bottom: 16px; color: var(--nc-primary);">➤ Actividad física en las tareas cotidianas</h4>

  <div class="n-form-group">
    <label class="n-form-label">B5.- ¿Cómo va al colegio o se desplaza por la ciudad habitualmente?</label>
    <select class="n-select" name="b5_transporte" required>
      <option value="">Seleccione...</option>
      <option value="andando">Andando</option>
      <option value="bici">En bici</option>
      <option value="transporte_publico">Transporte público</option>
      <option value="coche">Coche</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">B6.- ¿Participa en las tareas domésticas de limpieza, ordenar su habitación...?</label>
    <select class="n-select" name="b6_tareas_domesticas" required>
      <option value="">Seleccione...</option>
      <option value="siempre">Siempre</option>
      <option value="casi_siempre">Casi siempre</option>
      <option value="algunas_veces">Algunas veces</option>
      <option value="rara_vez">Rara vez</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">B7.- Actividad física en el colegio (educación física):</label>
    <select class="n-select mb-2" name="b7_horas_educacion_fisica" required>
      <option value="">¿Cuántas horas tiene a la semana?</option>
      <option value="ninguna">Ninguna</option>
      <option value="1_hora">1 hora/semana</option>
      <option value="2_horas">2 h/semana</option>
      <option value="3_horas">3 h/semana</option>
      <option value="mas_de_3">>3 horas/semana</option>
    </select>
    <p class="n-form-sublabel">¿Asiste siempre a las clases de educación física del colegio?</p>
    <div class="n-radio-group">
      <label><input type="radio" name="b7_asiste_siempre" value="si" required> SI</label>
      <label><input type="radio" name="b7_asiste_siempre" value="no" required> NO</label>
    </div>
  </div>

  <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 32px 0;">

  <!-- ── Actividad física en el tiempo libre ── -->
  <h4 style="margin-bottom: 16px; color: var(--nc-primary);">➤ Actividad física en el tiempo libre</h4>

  <div class="n-form-group">
    <label class="n-form-label">B8.- ¿Suele jugar de forma activa (corriendo, saltando, andando) en la calle, parque...?</label>
    <div class="n-radio-group mb-2">
      <label><input type="radio" name="b8_juega_activo" value="si" required> SI</label>
      <label><input type="radio" name="b8_juega_activo" value="no" required> NO</label>
    </div>
    <select class="n-select" name="b8_tiempo_juego_activo" required>
      <option value="">¿Cuánto tiempo?</option>
      <option value="nunca">Nunca</option>
      <option value="1_2_horas">1-2 h/semana</option>
      <option value="3_4_horas">3-4 h/semana</option>
      <option value="mas_de_4">>4 h/semana</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">B9.- Durante vacaciones/fines de semana, ¿organizan actividad al aire libre o deporte?</label>
    <div class="n-radio-group">
      <label><input type="radio" name="b9_actividad_vacaciones" value="si" required> SI</label>
      <label><input type="radio" name="b9_actividad_vacaciones" value="no" required> NO</label>
    </div>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">B10.- ¿Participa en actividades físicas extraescolares (municipales, gimnasio...)?</label>
    <div class="n-radio-group">
      <label><input type="radio" name="b10_extraescolares_fisicas" value="si" required> SI</label>
      <label><input type="radio" name="b10_extraescolares_fisicas" value="no" required> NO</label>
    </div>
  </div>

  <div class="n-form-group" style="background-color: var(--nc-primary-light); padding: 16px; border-radius: var(--nc-radius-md);">
    <label class="n-form-label">B11.- Si practica actividades de deporte organizado (respuesta afirmativa en B10):</label>
    <input type="text" class="n-input mb-2" name="b11_deporte_practicado" placeholder="Indicar qué deporte o actividad practica">
    <div class="n-form-inline">
      <input type="number" class="n-input n-input--short" name="b11_horas_semana" placeholder="Ej. 4"> Horas/semana
      <span style="margin: 0 8px;">|</span>
      <input type="number" class="n-input n-input--short" name="b11_dias_semana" placeholder="Ej. 2"> Días/semana
    </div>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">B12.- ¿Cuántos días a la semana hace ejercicio o actividad física en total de al menos 60 minutos al día?</label>
    <select class="n-select" name="b12_dias_60_min" required>
      <option value="">Seleccione los días...</option>
      <option value="0">0 días</option>
      <option value="1">1 día</option>
      <option value="2">2 días</option>
      <option value="3">3 días</option>
      <option value="4">4 días</option>
      <option value="5">5 días</option>
      <option value="6">6 días</option>
      <option value="7">7 días (Todos los días)</option>
    </select>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">B13.- ¿Disponen en casa de infraestructura para ejercicio (bici estática, ping-pong...)?</label>
    <div class="n-radio-group">
      <label><input type="radio" name="b13_infraestructura_casa" value="si" required> SI</label>
      <label><input type="radio" name="b13_infraestructura_casa" value="no" required> NO</label>
    </div>
  </div>

  <div class="n-form-group">
    <label class="n-form-label">B14.- ¿Suele dar paseos, andando o con bici, o hace algún deporte con su hijo/a?</label>
    <select class="n-select" name="b14_deporte_con_hijo" required>
      <option value="">Seleccione...</option>
      <option value="siempre">Siempre</option>
      <option value="con_frecuencia">Con frecuencia</option>
      <option value="algunas_veces">Algunas veces</option>
      <option value="rara_vez">Rara vez</option>
      <option value="nunca">Nunca</option>
    </select>
  </div>
</fieldset>

<!-- ==========================================
     SECCIÓN 4: DATOS ALIMENTACIÓN Y ACTIVIDAD FÍSICA DE LOS PADRES
     ========================================== -->
<fieldset class="n-form-section" style="margin-bottom: 24px;">
  <legend class="n-form-section__title">IV) DATOS ALIMENTACIÓN Y ACTIVIDAD FÍSICA DE LOS PADRES (o CUIDADORES)</legend>
  
  <p class="n-form-sublabel mb-2">Por favor, complete la información correspondiente para la madre y el padre (o cuidadores principales).</p>

  <!-- Contenedor dual responsivo -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px;">
    
    <!-- =======================
         COLUMNA MADRE
         ======================= -->
    <div class="n-parent-column" style="background-color: var(--nc-bg); padding: 20px; border-radius: var(--nc-radius-md); border: 1px solid var(--nc-border);">
      <h3 style="color: var(--nc-primary); margin-bottom: 20px; text-align: center;">Datos de la Madre</h3>

      <div class="n-form-group">
        <label class="n-form-label">Desayuno (Frecuencia):</label>
        <select class="n-select" name="madre_frec_desayuno" required>
          <option value="">Seleccione...</option>
          <option value="si">SI</option>
          <option value="no_algunos_dias">NO algunos días</option>
          <option value="no_todos_dias">NO todos o casi todos los días</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Contenido del desayuno:</label>
        <div class="n-checkbox-group">
          <label><input type="checkbox" name="madre_cont_desayuno" value="cafe"> Café</label>
          <label><input type="checkbox" name="madre_cont_desayuno" value="lacteos"> Lácteos (leche o yogur)</label>
          <label><input type="checkbox" name="madre_cont_desayuno" value="galletas"> Galletas o tostadas</label>
          <label><input type="checkbox" name="madre_cont_desayuno" value="fruta"> Fruta</label>
        </div>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Comidas al día:</label>
        <div class="n-checkbox-group">
          <label><input type="checkbox" name="madre_comidas_dia" value="desayuno"> Desayuno</label>
          <label><input type="checkbox" name="madre_comidas_dia" value="almuerzo"> Almuerzo</label>
          <label><input type="checkbox" name="madre_comidas_dia" value="comida"> Comida</label>
          <label><input type="checkbox" name="madre_comidas_dia" value="merienda"> Merienda</label>
          <label><input type="checkbox" name="madre_comidas_dia" value="cena"> Cena</label>
        </div>
      </div>

      <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 24px 0;">
      <h4 style="margin-bottom: 16px; font-size: 0.95rem;">➤ Variedad alimentaria</h4>

      <div class="n-form-group">
        <label class="n-form-label">Consumo diario piezas fruta:</label>
        <select class="n-select" name="madre_var_fruta" required>
          <option value="">Seleccione...</option>
          <option value="0-1">0-1</option>
          <option value="1">1</option>
          <option value="1-2">1-2</option>
          <option value="2">2</option>
          <option value="2-3">2-3</option>
          <option value="mas_3">>=3</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Consumo diario raciones verdura:</label>
        <select class="n-select" name="madre_var_verdura" required>
          <option value="">Seleccione...</option>
          <option value="0-1">0-1</option>
          <option value="1">1</option>
          <option value="1-2">1-2</option>
          <option value="2">2</option>
          <option value="2-3">2-3</option>
          <option value="mas_3">>=3</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Consumo semanal pescado:</label>
        <select class="n-select" name="madre_var_pescado" required>
          <option value="">Seleccione...</option>
          <option value="0">0</option>
          <option value="0-1">0-1</option>
          <option value="1">1</option>
          <option value="1-2">1-2</option>
          <option value="mas_2">>=2</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Consumo semanal legumbres:</label>
        <select class="n-select" name="madre_var_legumbres" required>
          <option value="">Seleccione...</option>
          <option value="0">0</option>
          <option value="0-1">0-1</option>
          <option value="1">1</option>
          <option value="1-2">1-2</option>
          <option value="mas_2">>=2</option>
        </select>
      </div>

      <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 24px 0;">
      <h4 style="margin-bottom: 16px; font-size: 0.95rem;">➤ Alimentos hipercalóricos o poco saludables</h4>

      <div class="n-form-group">
        <label class="n-form-label">Zumos/Refrescos/Batidos:</label>
        <select class="n-select" name="madre_hip_bebidas" required>
          <option value="">Seleccione...</option>
          <option value="mas_1_semana">>1 vez/semana</option>
          <option value="1_semana">1 vez/semana</option>
          <option value="mensual">Mensual</option>
          <option value="no">No</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Aperitivos salados/Snacks:</label>
        <select class="n-select" name="madre_hip_snacks" required>
          <option value="">Seleccione...</option>
          <option value="mas_1_semana">>1 vez/semana</option>
          <option value="1_semana">1 vez/semana</option>
          <option value="mensual">Mensual</option>
          <option value="no">No</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Golosinas:</label>
        <select class="n-select" name="madre_hip_golosinas" required>
          <option value="">Seleccione...</option>
          <option value="mas_1_semana">>1 vez/semana</option>
          <option value="1_semana">1 vez/semana</option>
          <option value="mensual">Mensual</option>
          <option value="no">No</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Bollería:</label>
        <select class="n-select" name="madre_hip_bolleria" required>
          <option value="">Seleccione...</option>
          <option value="mas_1_semana">>1 vez/semana</option>
          <option value="1_semana">1 vez/semana</option>
          <option value="mensual">Mensual</option>
          <option value="no">No</option>
        </select>
      </div>

      <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 24px 0;">
      <h4 style="margin-bottom: 16px; font-size: 0.95rem;">➤ Actividad Física y Ocio</h4>

      <div class="n-form-group">
        <label class="n-form-label">Días a la semana de actividad física (min. 60 min):</label>
        <input type="number" class="n-input" name="madre_dias_ejercicio" placeholder="Ej. 3" min="0" max="7" required>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Horas diarias de ocio sedentario (TV, ordenador...):</label>
        <input type="number" class="n-input" name="madre_horas_sedentario" placeholder="Ej. 2" min="0" required>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">¿Practica algún tipo de deporte organizado?</label>
        <div class="n-radio-group">
          <label><input type="radio" name="madre_deporte_organizado" value="si" required> SI</label>
          <label><input type="radio" name="madre_deporte_organizado" value="no" required> NO</label>
        </div>
      </div>
    </div>


    <!-- =======================
         COLUMNA PADRE
         ======================= -->
    <div class="n-parent-column" style="background-color: var(--nc-bg); padding: 20px; border-radius: var(--nc-radius-md); border: 1px solid var(--nc-border);">
      <h3 style="color: var(--nc-primary); margin-bottom: 20px; text-align: center;">Datos del Padre</h3>

      <div class="n-form-group">
        <label class="n-form-label">Desayuno (Frecuencia):</label>
        <select class="n-select" name="padre_frec_desayuno" required>
          <option value="">Seleccione...</option>
          <option value="si">SI</option>
          <option value="no_algunos_dias">NO algunos días</option>
          <option value="no_todos_dias">NO todos o casi todos los días</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Contenido del desayuno:</label>
        <div class="n-checkbox-group">
          <label><input type="checkbox" name="padre_cont_desayuno" value="cafe"> Café</label>
          <label><input type="checkbox" name="padre_cont_desayuno" value="lacteos"> Lácteos (leche o yogur)</label>
          <label><input type="checkbox" name="padre_cont_desayuno" value="galletas"> Galletas o tostadas</label>
          <label><input type="checkbox" name="padre_cont_desayuno" value="fruta"> Fruta</label>
        </div>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Comidas al día:</label>
        <div class="n-checkbox-group">
          <label><input type="checkbox" name="padre_comidas_dia" value="desayuno"> Desayuno</label>
          <label><input type="checkbox" name="padre_comidas_dia" value="almuerzo"> Almuerzo</label>
          <label><input type="checkbox" name="padre_comidas_dia" value="comida"> Comida</label>
          <label><input type="checkbox" name="padre_comidas_dia" value="merienda"> Merienda</label>
          <label><input type="checkbox" name="padre_comidas_dia" value="cena"> Cena</label>
        </div>
      </div>

      <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 24px 0;">
      <h4 style="margin-bottom: 16px; font-size: 0.95rem;">➤ Variedad alimentaria</h4>

      <div class="n-form-group">
        <label class="n-form-label">Consumo diario piezas fruta:</label>
        <select class="n-select" name="padre_var_fruta" required>
          <option value="">Seleccione...</option>
          <option value="0-1">0-1</option>
          <option value="1">1</option>
          <option value="1-2">1-2</option>
          <option value="2">2</option>
          <option value="2-3">2-3</option>
          <option value="mas_3">>=3</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Consumo diario raciones verdura:</label>
        <select class="n-select" name="padre_var_verdura" required>
          <option value="">Seleccione...</option>
          <option value="0-1">0-1</option>
          <option value="1">1</option>
          <option value="1-2">1-2</option>
          <option value="2">2</option>
          <option value="2-3">2-3</option>
          <option value="mas_3">>=3</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Consumo semanal pescado:</label>
        <select class="n-select" name="padre_var_pescado" required>
          <option value="">Seleccione...</option>
          <option value="0">0</option>
          <option value="0-1">0-1</option>
          <option value="1">1</option>
          <option value="1-2">1-2</option>
          <option value="mas_2">>=2</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Consumo semanal legumbres:</label>
        <select class="n-select" name="padre_var_legumbres" required>
          <option value="">Seleccione...</option>
          <option value="0">0</option>
          <option value="0-1">0-1</option>
          <option value="1">1</option>
          <option value="1-2">1-2</option>
          <option value="mas_2">>=2</option>
        </select>
      </div>

      <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 24px 0;">
      <h4 style="margin-bottom: 16px; font-size: 0.95rem;">➤ Alimentos hipercalóricos o poco saludables</h4>

      <div class="n-form-group">
        <label class="n-form-label">Zumos/Refrescos/Batidos:</label>
        <select class="n-select" name="padre_hip_bebidas" required>
          <option value="">Seleccione...</option>
          <option value="mas_1_semana">>1 vez/semana</option>
          <option value="1_semana">1 vez/semana</option>
          <option value="mensual">Mensual</option>
          <option value="no">No</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Aperitivos salados/Snacks:</label>
        <select class="n-select" name="padre_hip_snacks" required>
          <option value="">Seleccione...</option>
          <option value="mas_1_semana">>1 vez/semana</option>
          <option value="1_semana">1 vez/semana</option>
          <option value="mensual">Mensual</option>
          <option value="no">No</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Golosinas:</label>
        <select class="n-select" name="padre_hip_golosinas" required>
          <option value="">Seleccione...</option>
          <option value="mas_1_semana">>1 vez/semana</option>
          <option value="1_semana">1 vez/semana</option>
          <option value="mensual">Mensual</option>
          <option value="no">No</option>
        </select>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Bollería:</label>
        <select class="n-select" name="padre_hip_bolleria" required>
          <option value="">Seleccione...</option>
          <option value="mas_1_semana">>1 vez/semana</option>
          <option value="1_semana">1 vez/semana</option>
          <option value="mensual">Mensual</option>
          <option value="no">No</option>
        </select>
      </div>

      <hr style="border: 0; border-top: 1px solid var(--nc-border); margin: 24px 0;">
      <h4 style="margin-bottom: 16px; font-size: 0.95rem;">➤ Actividad Física y Ocio</h4>

      <div class="n-form-group">
        <label class="n-form-label">Días a la semana de actividad física (min. 60 min):</label>
        <input type="number" class="n-input" name="padre_dias_ejercicio" placeholder="Ej. 3" min="0" max="7" required>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">Horas diarias de ocio sedentario (TV, ordenador...):</label>
        <input type="number" class="n-input" name="padre_horas_sedentario" placeholder="Ej. 2" min="0" required>
      </div>

      <div class="n-form-group">
        <label class="n-form-label">¿Practica algún tipo de deporte organizado?</label>
        <div class="n-radio-group">
          <label><input type="radio" name="padre_deporte_organizado" value="si" required> SI</label>
          <label><input type="radio" name="padre_deporte_organizado" value="no" required> NO</label>
        </div>
      </div>
    </div>

  </div>
</fieldset>
 

          <!-- Submit de la Encuesta -->
          <div class="n-card__footer">
            <button type="button" id="btn-prev-phase" class="n-btn n-btn--outline">Volver</button>
            <button type="submit" class="n-btn n-btn--primary">Finalizar Registro y Guardar</button>
          </div>
        </form>
      </div>
    </section>
  </main>

  <!-- ── Footer ── -->
  <app-footer></app-footer>
</div>
    `;
  }

  initElements() {
    // Fases
    this.phaseSchedule = this.querySelector("#phase-schedule");
    this.phaseSurvey = this.querySelector("#phase-survey");

    this.btnNextPhase = this.querySelector("#btn-next-phase");
    this.btnPrevPhase = this.querySelector("#btn-prev-phase");

    this.calendarDays = this.querySelectorAll(
      ".n-calendar__day:not(.n-calendar__day--muted)",
    );
    this.timeButtons = this.querySelectorAll(".n-time-btn");

    this.surveyForm = this.querySelector("#survey-form");

    //  (Indicadores)
    this.step2Indicator = this.querySelector("#step-2-indicator");
    this.step3Indicator = this.querySelector("#step-3-indicator");
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
    this.timeButtons.forEach((timeBtn) => {
      timeBtn.addEventListener(
        "click",
        (e) => {
          this._handleTimeSelection(e.target);
        },
        { signal },
      );
    });

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

    // Envío del Formulario
    this.surveyForm.addEventListener(
      "submit",
      (e) => {
        this._handleSubmit(e);
      },
      { signal },
    );
  }

  // --- MÉTODOS PRIVADOS DE LÓGICA ---

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
      dayBtn.className = "n-calendar__day n-calendar__day--muted";
      dayBtn.textContent = daysInPrevMonth - i;
      dayBtn.disabled = true;
      grid.appendChild(dayBtn);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayBtn = document.createElement("button");
      dayBtn.className = "n-calendar__day";
      dayBtn.textContent = i;

      if (
        this.currentYear === today.getFullYear() &&
        this.currentMonth === today.getMonth() &&
        i < today.getDate()
      ) {
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
        o;
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
    o;
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

    if (!this.surveyForm.checkValidity()) {
      this.surveyForm.reportValidity();
      return;
    }

    const formData = new FormData(this.surveyForm);

    const surveyData = {};
    for (let [key, value] of formData.entries()) {
      if (surveyData[key]) {
        if (!Array.isArray(surveyData[key])) {
          surveyData[key] = [surveyData[key]];
        }
        surveyData[key].push(value);
      } else {
        surveyData[key] = value;
      }
    }

    const finalPayload = {
      appointment: {
        month: "October 2026", // hacerlo dinamico con el DOM
        day: this.state.selectedDate,
        time: this.state.selectedTime,
      },
      survey: surveyData,
    };

    console.log("Payload listo para el backend:", finalPayload);

    const submitBtn = this.surveyForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Procesando...";
    submitBtn.disabled = true;

    try {
      // Simular llamada a API (Backend)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      this.step3Indicator.classList.add("n-stepper__step--active");
      this.stepperLines[1].classList.add("n-stepper__line--active");

      alert("¡Cita agendada y encuesta guardada con éxito!");

      window.location.hash = "/paciente/agenda";
    } catch (error) {
      alert("Hubo un error al guardar la información. Intenta nuevamente.");
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}

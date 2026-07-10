export class AgendaPacientePage extends HTMLElement {
  connectedCallback() {
    this.render();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.initLogic();
      });
    });
  }

  render() {
    this.innerHTML = `
      <div class="agenda-layout">
        <app-sidebar-paciente></app-sidebar-paciente>
        
        <main class="agenda-paciente">
          <header class="agenda-header">
            <h1>Solicitud de Cita</h1>
            <p>Elija uno de los días disponibles para solicitar una cita</p>
            <span>El/la Especialista debe confirmar la cita, recibirá un aviso cuando eso suceda</span>
          </header>

          <div class="booking-container">
            <section class="calendar-section">
              <div class="calendar-header-nav">
                <button id="prev-month-btn" class="calendar-nav-btn">&lt;</button>
                <div id="calendar-month-year" class="calendar-current-date"></div>
                <button id="next-month-btn" class="calendar-nav-btn">&gt;</button>
              </div>
              
              <div class="weekdays-grid">
                <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sá</div>
              </div>
              
              <div id="days-container" class="days-container"></div>

              <div class="calendar-legend">
                <div class="legend-item">
                  <div class="legend-color" style="background: #ffc9c9; border: 1px solid #ff8787;"></div>
                  <span>Horario no disponible</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background: #e9ecef;"></div>
                  <span>Fecha no disponible</span>
                </div>
              </div>
            </section>

            <section class="slots-section">
              <h2 class="section-title">Elija un horario disponible</h2>
              <div id="slots-container" class="slots-scroll-container"></div>
            </section>
          </div>

          <div id="toast" class="toast hidden">
            Se ha enviado la solicitud de cita, recibirá un aviso cuando haya aceptado.
          </div>
        </main>
      </div>
    `;
  }

  initLogic() {
    const hoy = new Date();
    
    const estadoCitas = {
      año: hoy.getFullYear(),
      mes: hoy.getMonth(), 
      diaSeleccionado: hoy.getDate(), // Inicia con el día de hoy
      horaSeleccionada: null,
      diasBloqueadosNutriologa: [], 
      horariosOcupadosPorDia: {}, 
      todosLosHorarios: [
        "7:00 - 7:30AM", "7:30 - 8:00AM", "8:00 - 8:30AM", "8:30 - 9:00AM", "9:00 - 9:30AM", "9:30 - 10:00AM",
        "10:00 - 10:30AM", "10:30 - 11:00AM", "11:00 - 11:30AM", "11:30 - 12:00PM", "12:00 - 12:30PM", "12:30 - 1:00PM",
        "1:00 - 1:30PM", "1:30 - 2:00PM", "2:00 - 2:30PM", "2:30 - 3:00PM", "3:00 - 3:30PM", "3:30 - 4:00PM",
        "4:00 - 4:30PM", "4:30 - 5:00PM", "5:00 - 5:30PM", "5:30 - 6:00PM"
      ]
    };

    const NOMBRES_MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const daysContainer = this.querySelector('#days-container');
    const slotsContainer = this.querySelector('#slots-container');
    const monthYearLabel = this.querySelector('#calendar-month-year');
    const toast = this.querySelector('#toast');
    const prevBtn = this.querySelector('#prev-month-btn');
    const nextBtn = this.querySelector('#next-month-btn');

    if (!daysContainer || !slotsContainer) return;

    // --- RECALCULAR SELECCIÓN AL CAMBIAR DE MES ---
    const actualizarSeleccionPorMes = () => {
      // Si el mes y el año coinciden con el tiempo real de HOY, restablece la selección al día actual
      if (estadoCitas.mes === hoy.getMonth() && estadoCitas.año === hoy.getFullYear()) {
        estadoCitas.diaSeleccionado = hoy.getDate();
      } else {
        // Si es cualquier otro mes futuro o pasado, no pre-selecciona nada molesto
        estadoCitas.diaSeleccionado = null;
      }
      estadoCitas.horaSeleccionada = null; // Resetea el slot horario de todas formas
    };

    const renderCalendario = () => {
      daysContainer.innerHTML = "";
      monthYearLabel.innerText = `${NOMBRES_MESES[estadoCitas.mes]} ${estadoCitas.año}`;

      const primerDiaIndex = new Date(estadoCitas.año, estadoCitas.mes, 1).getDay();
      const totalDiasMes = new Date(estadoCitas.año, estadoCitas.mes + 1, 0).getDate();
      const totalDiasMesAnterior = new Date(estadoCitas.año, estadoCitas.mes, 0).getDate();

      for (let i = primerDiaIndex - 1; i >= 0; i--) {
        const dummyDay = document.createElement('div');
        dummyDay.classList.add('day-number', 'disabled');
        dummyDay.innerText = totalDiasMesAnterior - i;
        daysContainer.appendChild(dummyDay);
      }

      for (let i = 1; i <= totalDiasMes; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day-number');
        dayElement.innerText = i;

        const fechaEvaluar = new Date(estadoCitas.año, estadoCitas.mes, i);
        const esFechaPasada = fechaEvaluar.setHours(23, 59, 59, 999) < hoy.getTime();
        const esBloqueadoPorNutriologa = estadoCitas.diasBloqueadosNutriologa.includes(i);

        if (esFechaPasada || esBloqueadoPorNutriologa) {
          dayElement.classList.add('disabled');
        } else {
          dayElement.addEventListener('click', () => {
            estadoCitas.diaSeleccionado = i;
            estadoCitas.horaSeleccionada = null;
            renderCalendario();
            renderHorarios();
          });
        }

        if (i === estadoCitas.diaSeleccionado && !esFechaPasada && !esBloqueadoPorNutriologa) {
          dayElement.classList.add('selected');
        }

        daysContainer.appendChild(dayElement);
      }
    };

    const renderHorarios = () => {
      slotsContainer.innerHTML = "";
      
      // Si no hay un día seleccionado, mostramos un mensaje sutil en lugar de la lista vacía o rota
      if (estadoCitas.diaSeleccionado === null) {
        slotsContainer.innerHTML = `<p style="text-align:center; color:#868e96; padding-top:20px; font-size:14px;">Seleccione un día del calendario para ver los horarios disponibles.</p>`;
        return;
      }

      const horasOcupadas = estadoCitas.horariosOcupadosPorDia[estadoCitas.diaSeleccionado] || [];

      estadoCitas.todosLosHorarios.forEach((hora) => {
        const slotWrapper = document.createElement('div');
        slotWrapper.classList.add('slot-wrapper');

        const slotBtn = document.createElement('button');
        slotBtn.classList.add('slot-btn');
        slotBtn.innerText = hora;

        const esOcupado = horasOcupadas.includes(hora);

        if (!esOcupado) {
          slotBtn.classList.add('available');
          slotBtn.addEventListener('click', () => {
            estadoCitas.horaSeleccionada = hora;
            renderHorarios();
          });
        }

        slotWrapper.appendChild(slotBtn);

        if (estadoCitas.horaSeleccionada === hora && !esOcupado) {
          slotBtn.classList.add('active');

          const confirmBtn = document.createElement('button');
          confirmBtn.classList.add('confirm-btn');
          confirmBtn.innerText = "Confirmar";

          confirmBtn.addEventListener('click', () => {
            if (toast) toast.classList.remove('hidden');

            if (!estadoCitas.horariosOcupadosPorDia[estadoCitas.diaSeleccionado]) {
              estadoCitas.horariosOcupadosPorDia[estadoCitas.diaSeleccionado] = [];
            }
            
            estadoCitas.horariosOcupadosPorDia[estadoCitas.diaSeleccionado].push(hora);

            setTimeout(() => {
              if (toast) toast.classList.add('hidden');
              estadoCitas.horaSeleccionada = null;
              renderHorarios();
              renderCalendario();
            }, 3500);
          });

          slotWrapper.appendChild(confirmBtn);
        }

        slotsContainer.appendChild(slotWrapper);
      });
    };

    prevBtn.addEventListener('click', () => {
      estadoCitas.mes--;
      if (estadoCitas.mes < 0) {
        estadoCitas.mes = 11;
        estadoCitas.año--;
      }
      actualizarSeleccionPorMes();
      renderCalendario();
      renderHorarios();
    });

    nextBtn.addEventListener('click', () => {
      estadoCitas.mes++;
      if (estadoCitas.mes > 11) {
        estadoCitas.mes = 0;
        estadoCitas.año++;
      }
      actualizarSeleccionPorMes();
      renderCalendario();
      renderHorarios();
    });

    renderCalendario();
    renderHorarios();
  }
}
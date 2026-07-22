import { API_BASE_URL } from "../../../config.js";

function getPacienteSession() {
  try {
    // 1. Buscar primero la clave directa que guarda el login
    const idPacienteDirecto = localStorage.getItem("idPaciente");
    if (idPacienteDirecto) {
      return { idPaciente: parseInt(idPacienteDirecto, 10) };
    }

    // 2. Si no está directa, buscar el objeto JSON guardado como usuarioActivo
    const raw =
      localStorage.getItem("usuarioActivo") ||
      sessionStorage.getItem("usuarioActivo");
    if (raw) {
      const parsed = JSON.parse(raw);
      // Asegurar compatibilidad si el backend devuelve 'id' o 'idPaciente'
      const id = parsed.idPaciente || parsed.id;
      if (id) {
        return { idPaciente: parseInt(id, 10) };
      }
    }

    return null;
  } catch (e) {
    console.error("Error al obtener la sesión del paciente:", e);
    return null;
  }
}

function formatFecha(isoStr) {
  console.log("formatFecha received:", isoStr, "type:", typeof isoStr);

  if (typeof isoStr !== "string" || !isoStr) return "—";

  // Parsear fecha en formato YYYY-MM-DD del backend
  const [year, month, day] = isoStr.split("-").map(Number);
  console.log("Parsed date parts:", year, month, day);

  const date = new Date(year, month - 1, day); // month - 1 porque los meses en JS son 0-indexed
  console.log("Date object:", date, "isValid:", !isNaN(date.getTime()));

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  if (date.getTime() === hoy.getTime()) return "Hoy";
  if (date.getTime() === manana.getTime()) return "Mañana";

  return date.toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatHora(horaStr) {
  if (!horaStr) return "—";
  if (/AM|PM/i.test(horaStr)) return horaStr;
  const [hh, mm] = horaStr.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 || 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

function getTipoCita(motivo) {
  if (!motivo) return "CONSULTA";
  const m = motivo.toLowerCase();
  if (m.includes("seguimiento")) return "SEGUIMIENTO";
  if (m.includes("inicial") || m.includes("primera"))
    return "NUTRICIÓN CLÍNICA";
  if (m.includes("ajuste")) return "CONSULTA DE AJUSTE";
  return motivo.toUpperCase();
}

// ─── Web Component ────────────────────────────────────────────────────────────
export class AgendaPacientePage extends HTMLElement {
  constructor() {
    super();
    this.citas = [];
    this.historial = [];
    this.paciente = null;
    this.loading = true;
    this.error = null;
    this.citaToCancel = null; // NUEVO: Guarda el ID de la cita a cancelar
  }

  connectedCallback() {
    this.renderLoading();
    this.fetchCitasFromDB();
  }

  // ─── Petición principal a la API ──────────────────────────────────────────
  async fetchCitasFromDB() {
    this.loading = true;
    this.error = null;
    this.paciente = getPacienteSession();

    if (
      !this.paciente ||
      (!this.paciente.idPaciente &&
        !this.paciente.id &&
        !this.paciente.paciente_id)
    ) {
      this.error =
        "No se encontró tu sesión. Por favor inicia sesión nuevamente.";
      this.loading = false;
      this.render();
      this.initLogic();
      return;
    }

    try {
      const idPaciente =
        this.paciente.idPaciente ||
        this.paciente.id ||
        this.paciente.paciente_id;

      // Aquí inyectamos el API_BASE_URL dinámico
      const response = await fetch(
        `${API_BASE_URL}/api/cita?paciente_id=${idPaciente}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener las citas.");
      }

      // Procesamos la data real del backend
      this.citas = (data.proximas || []).map((c) => ({
        id: c.id ?? c.idCita,
        tipo: getTipoCita(c.motivoConsulta),
        fechaRaw: c.fecha,
        fecha: formatFecha(String(c.fecha)),
        horaRaw: c.hora,
        hora: formatHora(c.hora),
        motivo: c.motivoConsulta || "—",
        estado: c.estado || "Pendiente",
        doctor: "Dra. Margarita",
        doctorImg: "assets/images/default_user.png",
      }));

      this.historial = (data.historial || []).map((c) => ({
        id: c.id ?? c.idCita,
        fechaRaw: c.fecha,
        fecha: formatFecha(String(c.fecha)),
        horaRaw: c.hora,
        hora: formatHora(c.hora),
        motivo: c.motivoConsulta || "—",
        estado: c.estado || "—",
      }));
    } catch (err) {
      console.error("[AgendaPacientePage] fetchCitasFromDB:", err);
      this.error = err.message || "Ocurrió un error inesperado.";
    } finally {
      this.loading = false;
      this.render();
      this.initLogic();
    }
  }

  // ─── Cancelar cita (PATCH a la API) ──────────────────────────────────────
  async cancelarCita(idCita) {
    const btnConfirm = this.querySelector("#btn-confirm-cancel-cita");

    try {
      if (btnConfirm) {
        btnConfirm.textContent = "Cancelando...";
        btnConfirm.disabled = true;
      }

      const idPaciente =
        this.paciente?.idPaciente ||
        this.paciente?.id ||
        this.paciente?.paciente_id;

      // Inyectamos el API_BASE_URL dinámico
      // Nota: El backend actualmente no tiene un endpoint PATCH /api/cita/{id}/cancelar.
      // Se ajusta la ruta a /api/cita para consistencia, pero necesitarás implementar este método en Java.
      const response = await fetch(
        `${API_BASE_URL}/api/cita/${idCita}/cancelar?paciente_id=${idPaciente}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "No se pudo cancelar la cita.");
        return;
      }

      // Volvemos a pedir las citas a la base de datos para que la vista se actualice
      await this.fetchCitasFromDB();

      this.citaToCancel = null;
      // Cerrar modal
      const modalCancel = this.querySelector("#modal-cancel-cita");
      if (modalCancel) modalCancel.classList.add("hidden");
    } catch (err) {
      console.error("[AgendaPacientePage] cancelarCita:", err);
      alert("Error de conexión. Intenta de nuevo.");

      if (btnConfirm) {
        btnConfirm.textContent = "Sí, cancelar cita";
        btnConfirm.disabled = false;
      }
    }
  }

  // ─── Renderizadores ───────────────────────────────────────────────────────
  renderLoading() {
    this.innerHTML = `
      <div class="agenda-layout">
        <app-sidebar-paciente></app-sidebar-paciente>
        <main class="agenda-main">
          <div class="header-title" style="margin-bottom:2rem">
            <h1>Mis Citas</h1>
            <p>Cargando tus citas…</p>
          </div>
          <div class="empty-state" style="opacity:.6">
            <div class="empty-icon">
              <img src="/assets/icons/calendario-mas.png" alt="Cargando">
            </div>
            <p>Por favor espera…</p>
          </div>
        </main>
      </div>
    `;
  }

  render() {
    const hasCitas = this.citas.length > 0 || this.historial.length > 0;

    this.innerHTML = `
      <div class="agenda-layout">
        <app-sidebar-paciente></app-sidebar-paciente>

        <main class="agenda-main">
          <!-- HEADER -->
          <div class="header-container">
            <div class="header-title">
              <h1>Mis Citas</h1>
              <p>Gestiona y revisa tus citas.</p>
            </div>
            ${
              hasCitas
                ? `<button class="btn-agendar" id="btn-agendar-nueva">
                     <span>+</span> Agendar Nueva Cita
                   </button>`
                : ""
            }
          </div>

          <!-- BANNER DE ERROR -->
          ${
            this.error
              ? `<div class="agenda-error-banner" role="alert">
                   ⚠️ ${this.error}
                 </div>`
              : ""
          }

          <!-- ──────────── VISTA: SIN CITAS ──────────── -->
          ${
            !hasCitas && !this.error
              ? `<div class="empty-state">
                   <div class="empty-icon">
                     <img src="/assets/icons/calendario-mas.png" alt="Calendario">
                   </div>
                   <h2>Aún no tienes citas agendadas</h2>
                   <p>Comienza tu camino hacia una mejor nutrición programando
                   tu primera consulta con nuestra especialista.</p>
                   <button class="btn-agendar" id="btn-agendar-primera">
                     <span>+</span> Agendar mi primera cita
                   </button>
                 </div>`
              : ""
          }

          <!-- ──────────── VISTA: CON CITAS ──────────── -->
          ${
            hasCitas
              ? `
            <div>
              <!-- PRÓXIMAS CITAS -->
              <h3 class="section-title">
                <img src="/assets/icons/calendario-mas.png" alt="Calendario">
                Próximas Citas
              </h3>

              <div class="cards-container">
                ${
                  this.citas.length === 0
                    ? `<p class="no-proximas">No tienes citas próximas. ¡Agenda una nueva!</p>`
                    : this.citas
                        .map(
                          (cita) => `
                  <div class="cita-card">
                    <div class="cita-badge"
                      style="${
                        cita.tipo === "SEGUIMIENTO"
                          ? "background:#eaeaea;color:#555;"
                          : ""
                      }">
                      ${cita.tipo}
                    </div>
                    <div class="cita-date">${cita.fecha}</div>
                    <div class="cita-time">
                      <img src="/assets/icons/relog-tiempo.png" alt="Reloj" style="width:14px;height:14px;">
                      ${cita.hora}
                    </div>
                    <div class="cita-doctor">
                      <img src="/${cita.doctorImg}" alt="${cita.doctor}">
                      <div>
                        <h4>${cita.doctor}</h4>
                        <p>Nutricionista</p>
                      </div>
                    </div>
                    <div class="cita-actions">
                      <button class="btn-cancelar" data-id="${cita.id}">Cancelar</button>
                    </div>
                  </div>
                `,
                        )
                        .join("")
                }
              </div>

              <!-- HISTORIAL -->
              <h3 class="section-title">
                <img src="/assets/icons/relog-tiempo.png" alt="Historial">
                Historial de Citas
              </h3>

              <div class="historial-container">
                ${
                  this.historial.length === 0
                    ? `<p style="padding:1.5rem;color:#666;">Aún no tienes citas en el historial.</p>`
                    : `<table class="historial-table">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Motivo</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${this.historial
                            .map(
                              (item) => `
                            <tr>
                              <td data-label="Fecha">
                                <div class="historial-fecha">${item.fecha}</div>
                                <div class="historial-hora">${item.hora}</div>
                              </td>
                              <td data-label="Motivo">${item.motivo}</td>
                              <td data-label="Estado">
                                <span class="status-badge ${
                                  item.estado === "Completada"
                                    ? "completada"
                                    : item.estado === "Cancelada"
                                      ? "cancelada"
                                      : "no-asistio"
                                }">
                                  ${item.estado}
                                </span>
                              </td>
                            </tr>
                          `,
                            )
                            .join("")}
                        </tbody>
                      </table>`
                }
              </div>
            </div>
          `
              : ""
          }
        </main>

        <!-- ==========================================
             VENTANA MODAL: CONFIRMAR CANCELACIÓN
             ========================================== -->
        <div id="modal-cancel-cita" class="modal-overlay hidden">
          <div class="modal-content modal-small">
            <div class="modal-header-danger" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--border-color); padding-bottom:16px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <img src="/assets/icons/peligro.png" alt="Alerta" class="custom-icon icon-danger" style="width:24px;">
                <h3 style="font-size: 20px; font-weight: 700; color: #DC2626; margin:0;">Cancelar Cita</h3>
              </div>
              <button class="btn-close-modal close-modal-cancel" style="background:transparent; border:none; font-size:16px; cursor:pointer;">✖</button>
            </div>
            <div class="modal-body text-left" style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
              <p>¿Estás seguro de que deseas cancelar esta cita? Esta acción notificará a tu especialista y el horario quedará libre para otros pacientes.</p>
            </div>
            <div class="modal-footer centered-footer" style="display:flex; justify-content:flex-end; gap:12px; border-top:1px solid var(--border-color); padding-top:16px;">
              <button class="btn-cancel close-modal-cancel">No, mantener cita</button>
              <button id="btn-confirm-cancel-cita" class="btn-danger-solid">Sí, cancelar cita</button>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // ─── Lógica de eventos ────────────────────────────────────────────────────
  initLogic() {
    // Botones de agendar
    const btnPrimera = this.querySelector("#btn-agendar-primera");
    const btnNueva = this.querySelector("#btn-agendar-nueva");
    const modalCancel = this.querySelector("#modal-cancel-cita");

    const irAAgendamiento = () => {
      window.location.hash = "#/paciente/agenda/agendamiento-encuesta";
    };

    btnPrimera?.addEventListener("click", irAAgendamiento);
    btnNueva?.addEventListener("click", irAAgendamiento);

    // 1. Abrir modal al dar clic en cancelar
    this.querySelectorAll(".btn-cancelar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idCita = Number(e.currentTarget.dataset.id);
        if (idCita) {
          this.citaToCancel = idCita;
          modalCancel.classList.remove("hidden");
        }
      });
    });

    // 2. Cerrar modal (con los botones de cancelar o la X)
    this.querySelectorAll(".close-modal-cancel").forEach((btn) => {
      btn.addEventListener("click", () => {
        modalCancel.classList.add("hidden");
        this.citaToCancel = null;
      });
    });

    // 3. Cerrar modal si se da clic fuera de la caja blanca
    if (modalCancel) {
      modalCancel.addEventListener("click", (e) => {
        if (e.target === modalCancel) {
          modalCancel.classList.add("hidden");
          this.citaToCancel = null;
        }
      });
    }

    // 4. Confirmar cancelación y ejecutar acción
    const btnConfirmCancel = this.querySelector("#btn-confirm-cancel-cita");
    if (btnConfirmCancel) {
      btnConfirmCancel.addEventListener("click", () => {
        if (this.citaToCancel) {
          this.cancelarCita(this.citaToCancel);
        }
      });
    }
  }
}

// ─── Configuración base de la API ────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Obtiene la sesión del paciente autenticado desde localStorage / sessionStorage.
 * El login guarda los datos bajo la clave 'user'.
 */
function getPacienteSession() {
  try {
    // Clave usada por PacienteLoginPage.js
    const raw =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user") ||
      localStorage.getItem("paciente_session") ||
      sessionStorage.getItem("paciente_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Formatea una fecha ISO "YYYY-MM-DD" a algo legible como "Lun, 14 Oct".
 */
function formatFecha(isoStr) {
  if (!isoStr) return "—";
  const date = new Date(isoStr + "T00:00:00"); // evitar desfase de zona horaria
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

/**
 * Formatea "HH:MM" a "10:30 AM / PM".
 */
function formatHora(horaStr) {
  if (!horaStr) return "—";
  const [hh, mm] = horaStr.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 || 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

/**
 * Decide el "tipo/badge" de la cita según el motivo guardado en BD.
 */
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
  }

  connectedCallback() {
    // Mostrar esqueleto de carga inmediatamente
    this.renderLoading();
    this.fetchCitasFromDB();
  }

  // ─── Petición principal a la API ──────────────────────────────────────────
  async fetchCitasFromDB() {
    this.loading = true;
    this.error = null;

    // 1. Obtener sesión del paciente
    this.paciente = getPacienteSession();

    if (!this.paciente || !this.paciente.idPaciente) {
      this.error =
        "No se encontró tu sesión. Por favor inicia sesión nuevamente.";
      this.loading = false;
      this.render();
      this.initLogic();
      return;
    }

    // El campo puede llamarse idPaciente o id según el backend
    const idPaciente =
      this.paciente.idPaciente ||
      this.paciente.id ||
      this.paciente.paciente_id;

    try {
      const response = await fetch(
        `${API_BASE}/citas?paciente_id=${idPaciente}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // envía cookies de sesión si las hay
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener las citas.");
      }

      // Separar proximas vs historial según lo que devuelve la API
      this.citas = (data.proximas || []).map((c) => ({
        id: c.idCita,
        tipo: getTipoCita(c.motivoConsulta),
        fechaRaw: c.fecha,
        fecha: formatFecha(c.fecha),
        horaRaw: c.hora,
        hora: formatHora(c.hora),
        motivo: c.motivoConsulta || "—",
        estado: c.estado || "Pendiente",
        doctor: "Dra. Margarita",
        doctorImg: "assets/images/default_user.png",
      }));

      this.historial = (data.historial || []).map((c) => ({
        id: c.idCita,
        fechaRaw: c.fecha,
        fecha: formatFecha(c.fecha),
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
    const idPaciente =
      this.paciente?.idPaciente ||
      this.paciente?.id ||
      this.paciente?.paciente_id;
    if (!idPaciente) return;

    const confirmar = confirm(
      "¿Estás seguro de que deseas cancelar esta cita?",
    );
    if (!confirmar) return;

    try {
      const response = await fetch(
        `${API_BASE}/citas/${idCita}/cancelar?paciente_id=${idPaciente}`,
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

      alert("Cita cancelada exitosamente.");
      // Recargar datos desde la API
      this.fetchCitasFromDB();
    } catch (err) {
      console.error("[AgendaPacientePage] cancelarCita:", err);
      alert("Error de conexión. Intenta de nuevo.");
    }
  }

  // ─── Renderizadores ───────────────────────────────────────────────────────

  /** Pantalla de carga inicial */
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
              <img src="assets/icons/calendario-mas.png" alt="Cargando">
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
                     <img src="assets/icons/calendario-mas.png" alt="Calendario">
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
                <img src="assets/icons/calendario-mas.png" alt="Calendario">
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
                      <img src="assets/icons/relog-tiempo.png" alt="Reloj" style="width:14px;height:14px;">
                      ${cita.hora}
                    </div>
                    <div class="cita-doctor">
                      <img src="${cita.doctorImg}" alt="${cita.doctor}">
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
                <img src="assets/icons/relog-tiempo.png" alt="Historial">
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
      </div>
    `;
  }

  // ─── Lógica de eventos ────────────────────────────────────────────────────
  initLogic() {
    // Botones de agendar
    const btnPrimera = this.querySelector("#btn-agendar-primera");
    const btnNueva = this.querySelector("#btn-agendar-nueva");

    const irAAgendamiento = () => {
      window.location.hash = "#/paciente/agenda/agendamiento-encuesta";
    };

    btnPrimera?.addEventListener("click", irAAgendamiento);
    btnNueva?.addEventListener("click", irAAgendamiento);

    // Botones cancelar (delegación de eventos en el contenedor)
    this.querySelectorAll(".btn-cancelar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idCita = Number(e.currentTarget.dataset.id);
        if (idCita) this.cancelarCita(idCita);
      });
    });
  }
}

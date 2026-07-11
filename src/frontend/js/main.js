//Components
import { HomePage } from "./pages/HomePage.js";
import { AuthPage } from "./pages/AuthPage.js";
import { AppFooter } from "./components/Footer.js";

//Pages de Especialista
import { EspecialistaLoginPage } from "./pages/Nutri/EspecialistaLoginPage.js";
import { DashboardEspecialistaPage } from "./pages/Nutri/DashboardEspecialistaPage.js";
import { SidebarEspecialista } from "./pages/Nutri/SidebarEspecialista.js";
import { AgendaEspecialistaPage } from "./pages/Nutri/AgendaEspecialistaPage.js";
import { RendimientoEspecialistaPage } from "./pages/Nutri/RendimientoEspecialistaPage.js";
import { ListPacientesEspecialistaPage } from "./pages/Nutri/ListPacientesEspecialistaPage.js";
import { TratamientoEspecialistaPage } from "./pages/Nutri/TratamientoEspecialistaPage.js";
import { SettingEspecialista } from "./pages/Nutri/SettingEspecialista.js";

//Pages de Paciente
import { PacienteLoginPage } from "./pages/Paciente/PacienteLoginPage.js";
import { RegistroPacientePage } from "./pages/Paciente/PacienteRegistroPage.js";
import { SidebarPaciente } from "./pages/Paciente/SidebarPaciente.js";
import { AgendamientoEncuestaPage } from "./pages/Paciente/AgendamientoEncuestaPage.js";
import { DashboardPaciente } from "./pages/Paciente/DashboardPaciente.js";
import { AgendaPacientePage } from "./pages/Paciente/AgendaPacientePage.js";
import { RendimientoPacientePage } from "./pages/Paciente/RendimientoPacientePage.js";
import { TratamientoPacientePage } from "./pages/Paciente/TratamientoPacientePage.js";
import { SettingPaciente } from "./pages/Paciente/SettingPaciente.js";

//Rutas
import { Router } from "./router/Router.js";
import { routes } from "./router/routes.js";

/*
/////////////////////////////////////////////////////////////
Definición de componentes
/////////////////////////////////////////////////////////////
*/
customElements.define("app-footer", AppFooter);
customElements.define("page-home", HomePage);
customElements.define("page-auth", AuthPage);
customElements.define("app-sidebar-especialista", SidebarEspecialista);

//Especialista defined components
customElements.define("page-especialista-login", EspecialistaLoginPage);
customElements.define("agenda-especialista-page", AgendaEspecialistaPage);
customElements.define("dashboard-especialista-page", DashboardEspecialistaPage);
customElements.define(
  "rendimiento-especialista-page",
  RendimientoEspecialistaPage,
);
customElements.define(
  "list-pacientes-especialista-page",
  ListPacientesEspecialistaPage,
);
customElements.define(
  "tratamiento-especialista-page",
  TratamientoEspecialistaPage,
);
customElements.define("setting-especialista", SettingEspecialista);

//Paciente defined components
customElements.define("page-paciente-login", PacienteLoginPage);
customElements.define("registro-paciente-page", RegistroPacientePage);
customElements.define("app-sidebar-paciente", SidebarPaciente);
customElements.define("agendamiento-encuesta-page", AgendamientoEncuestaPage);
customElements.define("dashboard-paciente", DashboardPaciente);
customElements.define("agenda-paciente-page", AgendaPacientePage);
customElements.define("rendimiento-paciente-page", RendimientoPacientePage);
customElements.define("tratamiento-paciente-page", TratamientoPacientePage);
customElements.define("setting-paciente", SettingPaciente);

const router = new Router(routes, "#app");
router.init();

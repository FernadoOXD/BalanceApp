import { AppFooter } from "./components/Footer.js";

import { AuthPage } from "./pages/AuthPage.js";
import { HomePage } from "./pages/HomePage.js";
import { EspecialistaLoginPage } from "./pages/Nutri/EspecialistaLoginPage.js";
import { PacienteLoginPage } from "./pages/Paciente/PacienteLoginPage.js";
import { RegistroPacientePage } from "./pages/Paciente/PacienteRegistroPage.js";
import { Sidebar } from "./components/Sidebar.js";
import { AgendaEspecialistaPage } from "./pages/Nutri/AgendaEspecialistaPage.js";

import { Router } from "./router/Router.js";
import { routes } from "./router/routes.js";

customElements.define("app-footer", AppFooter);
customElements.define("page-home", HomePage);
customElements.define("page-auth", AuthPage);
customElements.define("page-especialista-login", EspecialistaLoginPage);
customElements.define("page-paciente-login", PacienteLoginPage);
customElements.define("registro-paciente-page", RegistroPacientePage);
customElements.define("app-sidebar", Sidebar);
customElements.define("agenda-especialista-page", AgendaEspecialistaPage);

const router = new Router(routes, "#app");
router.init();

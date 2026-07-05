/**
 * routes.js — Registro de rutas de la SPA
 *
 * Cada ruta mapea un path (hash) a una función `render(container)` que
 * inyecta el custom element correspondiente en el contenedor #app.
 *
 * Para agregar una nueva página:
 *   1. Crea el Web Component en js/pages/
 *   2. Regístralo en main.js con customElements.define()
 *   3. Agrega la ruta aquí
 */
export const routes = {
  "/": (container) => {
    container.innerHTML = `<page-home></page-home>`;
  },
  "/auth": (container) => {
    container.innerHTML = `<page-auth></page-auth>`;
  },
  //Especialista routes
  "/auth/especialista-login": (container) => {
    container.innerHTML = `<page-especialista-login></page-especialista-login>`;
  },
  "/especialista/agenda": (container) => {
    container.innerHTML = `<agenda-especialista-page><app-sidebar></app-sidebar></agenda-especialista-page>`;
  },
  "/especialista/dashboard": (container) => {
    container.innerHTML = `<dashboard-especialista-page></dashboard-especialista-page>`;
  },
  "/especialista/rendimiento": (container) => {
    container.innerHTML = `<rendimiento-especialista-page></rendimiento-especialista-page>`;
  },
  "/especialista/lista-pacientes": (container) => {
    container.innerHTML = `<list-pacientes-especialista-page></list-pacientes-especialista-page>`;
  },
  "/especialista/tratamiento": (container) => {
    container.innerHTML = `<tratamiento-especialista-page></tratamiento-especialista-page>`;
  },
  "/especialista/settings": (container) => {
    container.innerHTML = `<setting-especialista></setting-especialista>`;
  },
  //Paciente routes
  "/auth/paciente-login": (container) => {
    container.innerHTML = `<page-paciente-login></page-paciente-login>`;
  },
  "/auth/paciente-register": (container) => {
    container.innerHTML = `<registro-paciente-page></registro-paciente-page>`;
  },
  "/paciente/dashboard": (container) => {
    container.innerHTML = `<dashboard-paciente></dashboard-paciente>`;
  },
  "/paciente/rendimiento": (container) => {
    container.innerHTML = `<rendimiento-paciente-page></rendimiento-paciente-page>`;
  },
  "/paciente/tratamiento": (container) => {
    container.innerHTML = `<tratamiento-paciente-page></tratamiento-paciente-page>`;
  },
  "/paciente/agenda": (container) => {
    container.innerHTML = `<agenda-paciente-page></agenda-paciente-page>`;
  },
  //copiar y oegar para ver proceso de agendamiento(encuesta)
  "/paciente/agenda/agendamiento-encuesta": (container) => {
    container.innerHTML = `<agendamiento-encuesta-page></agendamiento-encuesta-page>`;
  },
  "/paciente/settings": (container) => {
    container.innerHTML = `<setting-paciente></setting-paciente>`;
  },
  "/paciente/dashboard": (container) => {
    container.innerHTML = `<dashboard-paciente></dashboard-paciente>`;
  },

};

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

  "/auth/especialista-login": (container) => {
    container.innerHTML = `<page-especialista-login></page-especialista-login>`;
  },
  "/auth/paciente-login": (container) => {
    container.innerHTML = `<page-paciente-login></page-paciente-login>`;
  },
  "/auth/paciente-register": (container) => {
    container.innerHTML = `<registro-paciente-page></registro-paciente-page>`;
  },
  "/nutri/agenda": (container) => {
    container.innerHTML = `<agenda-especialista-page><app-sidebar></app-sidebar></agenda-especialista-page>`;
  },
  "/paciente/dashboard": (container) => {
    container.innerHTML = `<dashboard-paciente></dashboard-paciente>`;
  },

};

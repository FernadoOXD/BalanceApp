/**
 * Router — SPA Hash-based router
 *
 * Escucha los eventos `hashchange` y el carga inicial (`DOMContentLoaded`)
 * para determinar la ruta activa y renderizar la vista correspondiente
 * dentro del elemento contenedor `#app`.
 *
 * Uso:
 *   const router = new Router(routes, '#app');
 *   router.init();
 */
export class Router {
  /**
   * @param {Object} routes  - Mapa de ruta → función renderizadora
   *                           Ej: { '/': HomePage, '/auth': AuthPage }
   * @param {string} rootSelector - Selector CSS del contenedor principal
   */
  constructor(routes, rootSelector = "#app") {
    this.routes = routes;
    this.root = document.querySelector(rootSelector);

    if (!this.root) {
      console.error(`[Router] No se encontró el elemento "${rootSelector}"`);
    }
  }

  /** Inicializa el router: escucha cambios de hash y resuelve la ruta actual */
  init() {
    // Navegación por cambio de hash (back/forward + links)
    window.addEventListener("hashchange", () => this._resolve());

    // Cargar la ruta actual al abrir la página
    this._resolve();
  }

  /**
   * Navega programáticamente a una ruta.
   * @param {string} path - Ruta sin el símbolo '#' (ej: '/auth')
   */
  navigate(path) {
    window.location.hash = path;
  }

  /** Obtiene la ruta activa desde el hash de la URL */
  _getPath() {
    const hash = window.location.hash;
    // '#/auth' → '/auth' | '' → '/'
    return hash ? hash.replace(/^#/, "") : "/";
  }

  /** Resuelve la ruta actual y renderiza la vista correspondiente */
  _resolve() {
    const path = this._getPath();
    const renderFn = this.routes[path] ?? this.routes["/"];

    if (!this.root) return;

    // Limpiar el contenido anterior
    this.root.innerHTML = "";

    // Ejecutar la función que inyecta la vista
    renderFn(this.root);
  }
}

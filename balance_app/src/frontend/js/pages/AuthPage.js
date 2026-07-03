export class AuthPage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initLogic();
  }

  render() {
    this.innerHTML = `
      <div class="auth-page">

        <!-- ── Panel izquierdo: imagen decorativa ── -->
        <div class="auth-image-panel">
          <img
            src="assets/images/select_type_user_image.png"
            alt="Tazón de granola con frutas frescas"
            class="auth-image-panel__img"
          />
          <div class="auth-image-panel__logo">
            <img
              src="assets/images/logo_horizontal.png"
              alt="BalanceApp — Nutrición y Bienestar"
            />
          </div>
        </div>

        <!-- ── Panel derecho: opciones de acceso ── -->
        <div class="auth-form-panel">
          <div class="auth-form-panel__inner">

            <!-- Marca pequeña -->
            <div class="auth-form-panel__brand">
              <img
                src="assets/images/logo_horizontal.png"
                alt="BalanceApp logo"
              />
            </div>

            <!-- Encabezado -->
            <h1 class="auth-form-panel__title">Bienvenido a BalanceApp</h1>
            <p class="auth-form-panel__subtitle">
              Tu camino hacia un bienestar integral comienza aquí.
            </p>

            <!-- Botones de acción -->
            <button
              id="btn-create-account"
              class="auth-btn auth-btn--primary"
              aria-label="Crear una cuenta nueva"
            >
              <a href="#/auth/paciente-register">Crear Cuenta</a>
            </button>

            <button
              id="btn-login"
              class="auth-btn auth-btn--outline"
              aria-label="Iniciar sesión con cuenta existente"
            >
              <a href="#/auth/paciente-login">Iniciar Sesión</a>
            </button>

            <!-- Separador -->
            <div class="auth-divider" role="separator" aria-hidden="true">
              <span class="auth-divider__line"></span>
              <span class="auth-divider__text">o</span>
              <span class="auth-divider__line"></span>
            </div>

            <!-- Enlace especialista -->
            <p class="auth-specialist">
              ¿Eres especialista?&nbsp;
              <a
                href="#/auth/especialista-login"
                class="auth-specialist__link"
                id="link-specialist"
              >
                Inicia sesión aquí
              </a>
            </p>
            
            <a
              href="#"
              class="specialist-back-link"
              id="specialist-back-link"
              aria-label="Volver a la pantalla de bienvenida"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Volver
            </a>


          </div>
        </div>

      </div>
    `;
  }

  initLogic() {
    const btnCreateAccount = this.querySelector("#btn-create-account");
    const btnLogin = this.querySelector("#btn-login");

    btnCreateAccount?.addEventListener("click", () => {
      window.location.hash = "/auth/paciente-register";
    });

    btnLogin?.addEventListener("click", () => {
      window.location.hash = "/auth/paciente-login";
    });
  }
}

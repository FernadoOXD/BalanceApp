export class PacienteLoginPage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initLogic();
  }

  render() {
    this.innerHTML = `
      <div class="auth-container">
    

        <div class="auth-image-panel">
          <img
            src="assets/images/login_paciente_image.png"
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


    <main class="panel-content">
      <div class="auth-card">
        
        <nav class="auth-tabs">
          <button class="auth-tabs__btn auth-tabs__btn--active">Iniciar Sesión</button>
          <button class="auth-tabs__btn" id="btnGoToRegister">Crear Cuenta</button>
        </nav>

        <div class="auth-form">
          <h2 class="auth-form__title">Bienvenido de nuevo</h2>
          <p class="auth-form__subtitle">Ingresa tus datos para continuar con tu plan.</p>
          
          <form id="loginForm" novalidate autocomplete="off">
            <div class="form-group">
              <label class="form-group__label" for="loginEmail">Correo Electrónico</label>
              <input class="form-group__input" type="email" id="loginEmail" placeholder="ejemplo@correo.com" required>
            </div>
            
            <div class="form-group">
              <label class="form-group__label" for="loginPassword">Contraseña</label>
              <input class="form-group__input" type="password" id="loginPassword" placeholder="••••••••" required>
            </div>

            <div class="form-options">
              <label class="custom-checkbox">
                <input type="checkbox" id="rememberMe">
                <span class="custom-checkbox__box"></span>
                Recordarme
              </label>
              <a href="#" class="form-options__link">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" class="btn-submit">Entrar</button>
          </form>
        </div>
        <a
          href="#/auth"
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
    </main>
  </div>
    `;
  }

  initLogic() {
    const loginForm = this.querySelector("#loginForm");
    const btnGoToRegister = this.querySelector("#btnGoToRegister");
    const emailInput = this.querySelector("#loginEmail");
    const passwordInput = this.querySelector("#loginPassword");
    const rememberMeInput = this.querySelector("#rememberMe");

    btnGoToRegister.addEventListener("click", () => {
      window.location.hash = "/auth/paciente-register";
    });

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const rememberMe = rememberMeInput.checked;

      if (!email || !password) {
        alert("Por favor, rellene todos los campos requeridos.");
        return;
      }

      console.log("Datos listos para enviar al backend:", {
        email,
        rememberMe,
      });
    });
  }
}

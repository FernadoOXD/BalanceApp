export class EspecialistaLoginPage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initLogic();
  }

  render() {
    this.innerHTML = `
      <div class="specialist-page">

        <!-- ── Panel izquierdo: imagen decorativa ── -->
        <div class="specialist-image-panel">
          <img
            src="assets/images/login_nutri_image.png"
            alt="Consultorio de nutrición moderno"
            class="specialist-image-panel__img"
          />

          <!-- Logo flotante -->
          <div class="specialist-image-panel__logo">
            <img
              src="assets/images/logo_horizontal.png"
              alt="BalanceApp — Nutrición y Bienestar"
            />
          </div>

          <!-- Texto en la base del panel -->
          <div class="specialist-image-panel__caption">
            <p class="specialist-image-panel__caption-title">
              Eleva tu práctica<br>clínica.
            </p>
            <p class="specialist-image-panel__caption-subtitle">
              Herramientas avanzadas para<br>
              nutricionistas y especialistas médicos.
            </p>
          </div>
        </div>

        <!-- ── Panel derecho: formulario ── -->
        <div class="specialist-form-panel">
          <div class="specialist-form-panel__inner">

            <!-- Título principal -->
            <h1 class="specialist-form-panel__title">
              Ingresa a tu espacio<br>de trabajo clínico
            </h1>

            <!-- Tarjeta del formulario -->
            <div class="login-card">

              <!-- Tab decorativo -->
              <div class="login-card__tab" role="tablist">
                <span
                  class="login-card__tab-item login-card__tab-item--active"
                  role="tab"
                  aria-selected="true"
                >
                  Iniciar Sesión
                </span>
              </div>

              <!-- Encabezado de la card -->
              <h2 class="login-card__heading">Bienvenido de nuevo</h2>
              <p class="login-card__subheading">
                Ingresa tus datos para continuar con tu plan.
              </p>

              <!-- Alerta de error general (credenciales incorrectas) -->
              <div
                class="login-alert login-alert--error"
                id="login-alert"
                role="alert"
                aria-live="assertive"
              >
                <span class="login-alert__icon">⚠</span>
                <span id="login-alert-msg">Correo o contraseña incorrectos.</span>
              </div>

              <!-- Formulario -->
              <form id="specialist-login-form" novalidate>

                <!-- Campo Email -->
                <div class="form-group">
                  <label class="form-label" for="specialist-email">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="specialist-email"
                    name="email"
                    class="form-input"
                    placeholder="ejemplo@correo.com"
                    autocomplete="email"
                    aria-describedby="email-error"
                    required
                  />
                  <span
                    class="form-error"
                    id="email-error"
                    role="alert"
                  ></span>
                </div>

                <!-- Campo Contraseña -->
                <div class="form-group">
                  <label class="form-label" for="specialist-password">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="specialist-password"
                    name="password"
                    class="form-input"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    aria-describedby="password-error"
                    required
                  />
                  <span
                    class="form-error"
                    id="password-error"
                    role="alert"
                  ></span>
                </div>

                <!-- Recordarme + ¿Olvidaste tu contraseña? -->
                <div class="login-card__options">
                  <label class="remember-me">
                    <input
                      type="checkbox"
                      id="remember-me"
                      class="remember-me__checkbox"
                    />
                    <span class="remember-me__label">Recordarme</span>
                  </label>
                  <a href="#" class="forgot-password" id="forgot-password-link">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <!-- Botón de envío -->
                <button
                  type="submit"
                  class="login-submit-btn"
                  id="login-submit-btn"
                >
                  Entrar
                </button>

              </form>
            </div>

            <!-- Volver a la pantalla anterior -->
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
        </div>

      </div>
    `;
  }

  initLogic() {
    const form = this.querySelector("#specialist-login-form");
    const emailInput = this.querySelector("#specialist-email");
    const passInput = this.querySelector("#specialist-password");
    const submitBtn = this.querySelector("#login-submit-btn");
    const alert = this.querySelector("#login-alert");
    const alertMsg = this.querySelector("#login-alert-msg");
    const forgotLink = this.querySelector("#forgot-password-link");

    emailInput.addEventListener("blur", () => {
      this._validateEmail(emailInput);
    });

    emailInput.addEventListener("input", () => {
      if (emailInput.classList.contains("form-input--error")) {
        this._validateEmail(emailInput);
      }
    });

    passInput.addEventListener("blur", () => {
      this._validatePassword(passInput);
    });

    passInput.addEventListener("input", () => {
      if (passInput.classList.contains("form-input--error")) {
        this._validatePassword(passInput);
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      this._hideAlert(alert);

      const emailOk = this._validateEmail(emailInput);
      const passOk = this._validatePassword(passInput);

      if (!emailOk || !passOk) return;

      submitBtn.disabled = true;
      submitBtn.textContent = "Entrando…";

      try {
        await this._mockLogin(emailInput.value, passInput.value);

        window.location.hash = "/especialista/agenda";
      } catch (err) {
        this._showAlert(alert, alertMsg, err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = "Entrar";
      }
    });

    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.hash = "/auth/forgot-password";
    });
  }

  /**
   * Valida el campo de email.
   * @param {HTMLInputElement} input
   * @returns {boolean} true si el valor es válido
   */
  _validateEmail(input) {
    const value = input.value.trim();
    const errorEl = this.querySelector("#email-error");

    if (!value) {
      return this._setError(
        input,
        errorEl,
        "El correo electrónico es requerido.",
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return this._setError(
        input,
        errorEl,
        "Ingresa un correo electrónico válido.",
      );
    }

    this._clearError(input, errorEl);
    return true;
  }

  /**
   * Valida el campo de contraseña.
   * @param {HTMLInputElement} input
   * @returns {boolean} true si el valor es válido
   */
  _validatePassword(input) {
    const value = input.value;
    const errorEl = this.querySelector("#password-error");

    if (!value) {
      return this._setError(input, errorEl, "La contraseña es requerida.");
    }

    if (value.length < 6) {
      return this._setError(
        input,
        errorEl,
        "La contraseña debe tener al menos 6 caracteres.",
      );
    }

    this._clearError(input, errorEl);
    return true;
  }

  /**
   * Muestra el estado de error en un campo.
   * @returns {false} siempre retorna false (campo inválido)
   */
  _setError(input, errorEl, message) {
    input.classList.add("form-input--error");
    input.setAttribute("aria-invalid", "true");
    errorEl.textContent = message;
    errorEl.classList.add("form-error--visible");
    return false;
  }

  _clearError(input, errorEl) {
    input.classList.remove("form-input--error");
    input.removeAttribute("aria-invalid");
    errorEl.textContent = "";
    errorEl.classList.remove("form-error--visible");
  }

  _showAlert(alertEl, msgEl, message) {
    msgEl.textContent = message;
    alertEl.classList.add("login-alert--visible");
  }

  _hideAlert(alertEl) {
    alertEl.classList.remove("login-alert--visible");
  }

  /**
   * Simula una llamada al backend (mock).
   * @returns {Promise<void>}
   */
  _mockLogin(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "especialista@balance.com" && password === "balance123") {
          resolve();
        } else {
          reject(
            new Error(
              "Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.",
            ),
          );
        }
      }, 900);
    });
  }
}

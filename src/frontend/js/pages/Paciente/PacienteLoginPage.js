import { API_BASE_URL } from '../../../config.js';
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
              
              <div class="login-alert login-alert--error" id="login-alert" role="alert" style="display: none; margin-bottom: 1.5rem;">
                <span class="login-alert__icon">⚠</span>
                <span id="login-alert-msg">Por favor, completa todos los campos para continuar.</span>
              </div>

              <form id="loginForm" novalidate autocomplete="off">
                <div class="form-group">
                  <label class="form-group__label" for="loginEmail">Correo Electrónico</label>
                  <input class="form-group__input" type="email" id="loginEmail" placeholder="ejemplo@correo.com" required>
                  <span class="form-error" id="loginEmail-error" role="alert"></span>
                </div>
                
                <div class="form-group">
                  <label class="form-group__label" for="loginPassword">Contraseña</label>
                  <input class="form-group__input" type="password" id="loginPassword" placeholder="••••••••" required>
                  <span class="form-error" id="loginPassword-error" role="alert"></span>
                </div>

                <div class="form-options">
                  <label class="custom-checkbox">
                    <input type="checkbox" id="rememberMe">
                    <span class="custom-checkbox__box"></span>
                    Recordarme
                  </label>                
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

    const generalAlert = this.querySelector("#login-alert");
    const generalAlertMsg = this.querySelector("#login-alert-msg");
    const emailError = this.querySelector("#loginEmail-error");
    const passwordError = this.querySelector("#loginPassword-error");

    btnGoToRegister.addEventListener("click", () => {
      window.location.hash = "/auth/paciente-register";
    });

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      this._clearAllErrors();
      generalAlert.style.display = "none";

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const rememberMe = rememberMeInput.checked;

      let hasErrors = false;

      if (!email || !password) {
        generalAlertMsg.textContent =
          "Por favor, completa todos los campos para continuar.";
        generalAlert.style.display = "flex";
        hasErrors = true;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        this._setError(emailInput, emailError, "Ingresa tu correo electrónico");
        hasErrors = true;
      } else if (!emailRegex.test(email)) {
        this._setError(
          emailInput,
          emailError,
          "Ingresa un correo electrónico válido",
        );
        hasErrors = true;
      }

      if (!password) {
        this._setError(passwordInput, passwordError, "Ingresa tu contraseña");
        hasErrors = true;
      } else if (password.length < 8) {
        this._setError(
          passwordInput,
          passwordError,
          "La contraseña debe tener al menos 8 caracteres",
        );
        hasErrors = true;
      }

      if (hasErrors) return;

      const btnSubmit = this.querySelector(".btn-submit");
      const originalText = btnSubmit.textContent;
      
      try {
        btnSubmit.textContent = "Conectando...";
        btnSubmit.disabled = true;

        const response = await fetch(`${API_BASE_URL}/api/paciente/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,      
            contrasena: password 
          })
        });

        if (!response.ok) {
          throw new Error("Credenciales incorrectas o error en el servidor");
        }

        const data = await response.json();

        // Se usa data.id o data.idPaciente de manera segura según lo devuelto por el servidor
        const pacienteId = data.id || data.idPaciente;
        if (pacienteId) {
          localStorage.setItem("idPaciente", pacienteId);
        }
        localStorage.setItem("usuarioActivo", JSON.stringify(data));

        console.log("Login validado por el backend:", data);

        if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
        }

        window.location.hash = "/paciente/agenda";

      } catch (error) {
        console.error("Error en login:", error);
        generalAlertMsg.textContent = "Correo o contraseña incorrectos.";
        generalAlert.style.display = "flex";
      } finally {
        btnSubmit.textContent = originalText;
        btnSubmit.disabled = false;
      }
    });
  }

  _setError(input, errorEl, message) {
    if (input && errorEl) {
      input.classList.add("form-group__input--error");
      const groupContainer = input.closest(".form-group");
      if (groupContainer) {
        groupContainer.classList.add("form-group--error");
      }
      errorEl.textContent = message;
      errorEl.classList.add("form-error--visible");
    }
  }

  _clearAllErrors() {
    const inputs = this.querySelectorAll(".form-group__input");
    const groups = this.querySelectorAll(".form-group");
    const errors = this.querySelectorAll(".form-error");

    inputs.forEach((input) =>
      input.classList.remove("form-group__input--error"),
    );
    groups.forEach((group) => group.classList.remove("form-group--error"));
    errors.forEach((error) => {
      error.textContent = "";
      error.classList.remove("form-error--visible");
    });
  }
}
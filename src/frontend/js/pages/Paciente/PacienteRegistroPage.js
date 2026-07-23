import { API_BASE_URL } from "../../../config.js";

export class RegistroPacientePage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initLogic();
  }

  render() {
    this.innerHTML = `
      <div class="register-layout">
        <div class="register-image-panel">
          <img 
            src="/assets/images/registro_paciente_image.png" 
            alt="Platillo saludable" 
            class="register-image-panel__bg"
          />
          <div class="register-image-panel__logo">
            <img src="/assets/images/logo_horizontal.png" alt="BalanceApp" />
          </div>
          <div class="register-image-panel__caption">
            <p>Tu camino hacia un bienestar integral, guiado por la ciencia y diseñado para ti.</p>
          </div>
        </div>

        <div class="register-form-panel">
          <div class="register-card">
            
            <div class="register-card__tabs" role="tablist">
              <button class="register-tab-btn" role="tab" aria-selected="false" id="tab-login">
                Iniciar Sesión
              </button>
              <button class="register-tab-btn register-tab-btn--active" role="tab" aria-selected="true" id="tab-register">
                Crear Cuenta
              </button>
            </div>

            <div class="register-card__header">
              <h2>Comienza tu viaje</h2>
              <p>Únete a Balance App y da el primer paso hacia tu mejor versión.</p>
            </div>

            <div class="login-alert login-alert--error" id="register-alert" role="alert" style="display: none; margin-bottom: 1.5rem;">
              <span class="login-alert__icon">⚠</span>
              <span id="register-alert-msg">Por favor, completa todos los campos para continuar.</span>
            </div>
              
            <form id="patient-register-form" novalidate>
              
              <div class="register-form-group">
                <label class="register-form-label" for="fullname">Nombre Completo</label>
                <div class="register-input-wrapper">
                  <svg class="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input type="text" id="fullname" class="register-form-input" placeholder="Ej. Ana García Hernández" required />
                </div>
                <span class="form-error" id="fullname-error" role="alert"></span>
              </div>

              <div class="register-form-group">
                <label class="register-form-label" for="email">Correo Electrónico</label>
                <div class="register-input-wrapper">
                  <svg class="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input type="email" id="email" class="register-form-input" placeholder="tu@correo.com" required />
                </div>
                <span class="form-error" id="email-error" role="alert"></span>
              </div>

              <div class="register-form-group">
                <label class="register-form-label" for="password">Contraseña</label>
                <div class="register-input-wrapper">
                  <svg class="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input type="password" id="password" class="register-form-input" placeholder="••••••••" required />
                </div>
                <span class="form-error" id="password-error" role="alert"></span>
              </div>

              <div class="register-form-group">
                <label class="register-form-label" for="confirm-password">Confirmar Contraseña</label>
                <div class="register-input-wrapper">
                  <svg class="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input type="password" id="confirm-password" class="register-form-input" placeholder="••••••••" required />
                </div>
                <span class="form-error" id="confirm-password-error" role="alert"></span>
              </div>

              <button type="submit" class="register-submit-btn">
                Crear cuenta 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>

            </form>

            <a
              href="/#/auth"
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
    const form = this.querySelector("#patient-register-form");
    const tabLogin = this.querySelector("#tab-login");
    const generalAlert = this.querySelector("#register-alert");
    const generalAlertMsg = this.querySelector("#register-alert-msg");

    tabLogin.addEventListener("click", () => {
      window.location.hash = "/auth/paciente-login";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      this._clearAllErrors();
      generalAlert.style.display = "none";

      const fullnameInput = this.querySelector("#fullname");
      const emailInput = this.querySelector("#email");
      const passwordInput = this.querySelector("#password");
      const confirmPasswordInput = this.querySelector("#confirm-password");

      const fullnameError = this.querySelector("#fullname-error");
      const emailError = this.querySelector("#email-error");
      const passwordError = this.querySelector("#password-error");
      const confirmPasswordError = this.querySelector("#confirm-password-error");

      const fullname = fullnameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      let hasErrors = false;

      if (!fullname || !email || !password || !confirmPassword) {
        generalAlertMsg.textContent =
          "Por favor, completa todos los campos para continuar.";
        generalAlert.style.display = "flex";
      }

      if (!fullname) {
        this._setError(fullnameInput, fullnameError, "Ingresa tu nombre completo");
        hasErrors = true;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        this._setError(emailInput, emailError, "Ingresa tu correo electrónico");
        hasErrors = true;
      } else if (!emailRegex.test(email)) {
        this._setError(emailInput, emailError, "Ingresa un correo electrónico válido");
        hasErrors = true;
      }

      if (!password) {
        this._setError(passwordInput, passwordError, "Ingresa una contraseña");
        hasErrors = true;
      } else if (password.length < 8) {
        this._setError(passwordInput, passwordError, "La contraseña debe tener al menos 8 caracteres");
        hasErrors = true;
      }

      if (!confirmPassword) {
        this._setError(confirmPasswordInput, confirmPasswordError, "Confirma tu contraseña");
        hasErrors = true;
      } else if (password !== confirmPassword) {
        this._setError(confirmPasswordInput, confirmPasswordError, "Las contraseñas no coinciden");
        hasErrors = true;
      }

      if (hasErrors) return;

      const submitBtn = this.querySelector(".register-submit-btn");
      const originalHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = "Registrando... ";
      submitBtn.disabled = true;

      // =========================================================================
      // LÓGICA DE PROCESAMIENTO DE NOMBRES EN EL FRONTEND
      // =========================================================================
      const palabras = fullname.split(/\s+/);
      const total = palabras.length;

      let nombres = "";
      let apellidoPaterno = "";
      let apellidoMaterno = ""; // Cadena vacía por defecto (NUNCA null ni undefined)

      if (total >= 4) {
        // Ej: "Luis Armando Arguello Zanchez"
        // nombres: "Luis Armando", apellidoPaterno: "Arguello", apellidoMaterno: "Zanchez"
        apellidoMaterno = palabras[total - 1];
        apellidoPaterno = palabras[total - 2];
        nombres = palabras.slice(0, total - 2).join(" ");
      } else if (total === 3) {
        // Ej: "Ana García Hernández"
        // nombres: "Ana", apellidoPaterno: "García", apellidoMaterno: "Hernández"
        nombres = palabras[0];
        apellidoPaterno = palabras[1];
        apellidoMaterno = palabras[2];
      } else if (total === 2) {
        // Ej: "Ana García"
        // nombres: "Ana", apellidoPaterno: "García", apellidoMaterno: ""
        nombres = palabras[0];
        apellidoPaterno = palabras[1];
        apellidoMaterno = "";
      } else {
        // 1 sola palabra
        nombres = palabras[0];
        apellidoPaterno = "-";
        apellidoMaterno = "";
      }

      // =========================================================================
      // ENVÍO DE DATOS RESUELTOS AL BACKEND
      // =========================================================================
      fetch(`${API_BASE_URL}/api/paciente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres,
          apellidoPaterno,
          apellidoMaterno,
          email,
          contrasena: password,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message || "Error al registrar.");
            });
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            window.location.hash = "/auth/paciente-login";
          } else {
            generalAlertMsg.textContent = data.message || "Error al registrar.";
            generalAlert.style.display = "flex";
          }
        })
        .catch((error) => {
          generalAlertMsg.textContent =
            error.message || "Error de conexión con el servidor.";
          generalAlert.style.display = "flex";
          console.error("Register error:", error);
        })
        .finally(() => {
          submitBtn.innerHTML = originalHtml;
          submitBtn.disabled = false;
        });
    });
  }

  _setError(input, errorEl, message) {
    if (input && errorEl) {
      input.classList.add("register-form-input--error", "form-input--error");
      errorEl.textContent = message;
      errorEl.classList.add("form-error--visible");
    }
  }

  _clearAllErrors() {
    const inputs = this.querySelectorAll(".register-form-input");
    const errors = this.querySelectorAll(".form-error");

    inputs.forEach((input) =>
      input.classList.remove("register-form-input--error", "form-input--error"),
    );
    errors.forEach((error) => {
      error.textContent = "";
      error.classList.remove("form-error--visible");
    });
  }
}
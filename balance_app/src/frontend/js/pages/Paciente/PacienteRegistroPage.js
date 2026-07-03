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
      src="assets/images/registro_paciente_image.png" 
      alt="Platillo saludable" 
      class="register-image-panel__bg"
    />
    <div class="register-image-panel__logo">
      <img src="assets/images/logo_horizontal.png" alt="BalanceApp" />
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

      <form id="patient-register-form" novalidate>
        
        <div class="register-form-group">
          <label class="register-form-label" for="fullname">Nombre Completo</label>
          <div class="register-input-wrapper">
            <svg class="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <input type="text" id="fullname" class="register-form-input" placeholder="Ej. Ana García" required />
          </div>
        </div>

        <div class="register-form-group">
          <label class="register-form-label" for="email">Correo Electrónico</label>
          <div class="register-input-wrapper">
            <svg class="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <input type="email" id="email" class="register-form-input" placeholder="tu@correo.com" required />
          </div>
        </div>

        <div class="register-form-group">
          <label class="register-form-label" for="password">Contraseña</label>
          <div class="register-input-wrapper">
            <svg class="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input type="password" id="password" class="register-form-input" placeholder="••••••••" required />
          </div>
        </div>

        <div class="register-form-group">
          <label class="register-form-label" for="confirm-password">Confirmar Contraseña</label>
          <div class="register-input-wrapper">
            <svg class="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input type="password" id="confirm-password" class="register-form-input" placeholder="••••••••" required />
          </div>
        </div>

        <button type="submit" class="register-submit-btn">
          Crear cuenta 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>

      </form>

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
    const form = this.querySelector("#patient-register-form");
    const tabLogin = this.querySelector("#tab-login");

    tabLogin.addEventListener("click", () => {
      window.location.hash = "/auth/paciente-login";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Formulario enviado");
    });
  }
}

export class AppFooter extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <footer class="footer" id="contacto">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <a href="./#" class="logo footer-logo" aria-label="Balance App Inicio">
                <img src="./assets/images/logo_horizontal.png" alt="Balance App Logo" class="logo-img">
              </a>
              <p class="footer-desc">
                Transformando vidas a través de la nutrición consciente y profesional.
              </p>
            </div>
            
            <div class="footer-col">
              <h4 class="footer-title">Contacto</h4>
              <ul class="footer-list">
                <li class="footer-link">Dirección: Calle Salud 123</li>
                <li class="footer-link">Email: contacto@balance.com</li>
                <li class="footer-link">Tel: +52 555-0123</li>
              </ul>
            </div>
            
            <div class="footer-col">
              <h4 class="footer-title">Redes Sociales</h4>
              <ul class="footer-list">
                <li><a href="./#" class="footer-link">Instagram</a></li>
                <li><a href="./#" class="footer-link">Facebook</a></li>
                <li><a href="./#" class="footer-link">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <hr class="footer-divider">
          
          <div class="footer-bottom">
            <p class="copyright">&copy; 2026 Balance App. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

import './style.css';
const raiz = document.getElementById('root');

function mostrarVistaInicio() {
    raiz.innerHTML = `
        <div class="contenedor-presentacion">
            
            <header class="encabezado-principal">
                <div class="logo">
                    <img src="/iconos/BAlogo.png" alt="Logo Balance App" class="imagen-logo">
                </div>
                <nav class="menu-navegacion">
                    <a href="#">Servicios</a>
                    <a href="#">Sobre mí</a>
                    <a href="#">Contacto</a>
                </nav>
                <div class="acciones-navegacion">
                    <a href="#" id="enlace-login" class="enlace-login">Iniciar sesión</a>
                    <button id="btn-agendar-encabezado" class="btn btn-verde-oscuro">Agendar cita</button>
                </div>
            </header>

            <section class="seccion-hero">
                <div class="columna-hero-izquierda">
                    <h1>Alcanza tu peso ideal con un plan diseñado para ti</h1>
                    <p>Descubre una forma saludable y sostenible de nutrir tu cuerpo. La Dra. Margarita te guiará paso a paso hacia tus objetivos de bienestar con planes de alimentación personalizados y seguimiento profesional.</p>
                    <button id="btn-hero-cita" class="btn btn-verde-oscuro">
                        Agendar mi primera cita <span class="flecha">→</span>
                    </button>
                </div>
                <div class="columna-hero-derecha">
                    <img src="/iconos/PBC.jpg" alt="PBC" class="foto-plato">
                </div>
            </section>

            <section class="seccion-caracteristicas">
                <div class="encabezado-caracteristicas">
                    <h2>Un enfoque integral para tu salud</h2>
                    <p>Nuestra metodología combina ciencia nutricional con herramientas prácticas para asegurar tu éxito a largo plazo.</p>
                </div>
                
                <div class="rejilla-caracteristicas">
                    <div class="tarjeta-caracteristica">
                        <img src="/iconos/menuVerde.png" alt="Icono Menús" class="icono-caracteristicas-img">
                        <h3>Menús Personalizados</h3>
                        <p>Planes de alimentación adaptados a tus gustos, estilo de vida y requerimientos nutricionales específicos, asegurando que disfrutes el proceso sin pasar hambre.</p>
                    </div>
                    <div class="tarjeta-caracteristica">
                        <img src="/iconos/rendimientoVerde.png" alt="Icono Progreso" class="icono-caracteristicas-img">
                        <h3>Seguimiento de Progreso</h3>
                        <p>Monitoreo constante de tu evolución con herramientas precisas. Ajustamos tu plan según tus resultados para mantener una mejora continua y motivación alta.</p>
                    </div>
                    <div class="tarjeta-caracteristica">
                        <img src="/iconos/calendarioVerde.png" alt="Icono Agenda" class="icono-caracteristicas-img"   >
                        <h3>Agenda en Línea</h3>
                        <p>Gestiona tus consultas de forma fácil y rápida desde cualquier dispositivo. Recibe recordatorios automáticos para que nunca pierdas una sesión importante.</p>
                    </div>
                </div>
            </section>

            <footer class="pie-pagina-principal">
                <div class="rejilla-footer">
                    <div class="columna-footer">
                        <h4>Balance App</h4>
                        <p>Transformando vidas a través de la nutrición consciente y profesional.</p>
                    </div>
                    <div class="columna-footer">
                        <h4>Contacto</h4>
                        <p>📍 Calle Salud 123</p>
                        <p>✉️ contacto@balance.com</p>
                        <p>📞 +52 555-0123</p>
                    </div>
                    <div class="columna-footer">
                        <h4>Redes Sociales</h4>
                        <a href="#">Instagram</a>
                        <a href="#">Facebook</a>
                        <a href="#">LinkedIn</a>
                    </div>
                </div>
                <div class="inferior-footer">
                    <hr>
                    <p>© 2026 Balance App. Todos los derechos reservados.</p>
                </div>
            </footer>

        </div>
    `;
    document.getElementById('enlace-login').addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Navegando a Iniciar Sesión...");
    });
}

mostrarVistaInicio();
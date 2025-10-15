(function() {
    'use strict';

    // Determinar la ruta base según la ubicación del archivo
    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/ayuntamiento/') || path.includes('/tramites/') || path.includes('/servicios/') || path.includes('/cultura/')) {
            return '../';
        }
        return '';
    }

    // Generar el HTML del footer
    function generateFooter() {
        const basePath = getBasePath();
        
        return `
            <footer class="footer">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-col">
                            <h4>Ayuntamiento de Pioz</h4>
                            <address>
                                <p>Plaza Mayor, s/n</p>
                                <p>19162 Pioz, Guadalajara</p>
                                <p><strong>Tel:</strong> 949 272 076</p>
                                <p><strong>Horario:</strong> L-V 9:00-14:00</p>
                            </address>
                        </div>
                        <div class="footer-col">
                            <h4>Enlaces Útiles</h4>
                            <ul>
                                <li><a href="${basePath}tramites/sede_electronica.html">Sede Electrónica</a></li>
                                <li><a href="${basePath}tramites/ordenanzas.html">Ordenanzas</a></li>
                                <li><a href="${basePath}ayuntamiento/perfil_contratante.html">Perfil del Contratante</a></li>
                                <li><a href="${basePath}tablon.html">Tablón de Anuncios</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>Síguenos</h4>
                            <div class="social-links">
                                <a href="#" aria-label="Facebook" class="social-icon">
                                    <span class="icon-facebook"></span>
                                </a>
                                <a href="#" aria-label="Youtube" class="social-icon">
                                    <span class="icon-youtube"></span>
                                </a>
                            </div>
                        </div>
                        <div class="footer-col">
                            <h4>Legal</h4>
                            <ul>
                                <li><a href="${basePath}legal.html#aviso">Aviso Legal</a></li>
                                <li><a href="${basePath}legal.html#privacidad">Política de Privacidad</a></li>
                                <li><a href="${basePath}legal.html#cookies">Política de Cookies</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2025 Ayuntamiento de Pioz. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        `;
    }

    // Insertar el footer en el DOM
    function insertFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = generateFooter();
        }
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertFooter);
    } else {
        insertFooter();
    }

})();

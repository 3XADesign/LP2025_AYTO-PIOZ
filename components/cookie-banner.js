(function() {
    'use strict';

    // Nombre de la cookie de aceptación
    const COOKIE_CONSENT_NAME = 'pioz-cookie-consent';
    const COOKIE_CONSENT_VERSION = 'v1'; // Incrementar si cambia la política

    /**
     * Determina el prefijo de ruta según la profundidad del directorio
     */
    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/ayuntamiento/') || 
            path.includes('/servicios/') || 
            path.includes('/turismo/') || 
            path.includes('/tramites/')) {
            return '../';
        }
        return '';
    }

    /**
     * Genera el HTML del banner de cookies
     */
    function createBannerHTML() {
        const basePath = getBasePath();
        
        return `
            <div class="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-banner-title">
                <div class="cookie-banner-content">
                    <h2 id="cookie-banner-title" class="cookie-banner-title">
                        <svg class="cookie-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
                            <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
                            <circle cx="12" cy="15" r="1" fill="currentColor"></circle>
                        </svg>
                        Uso de cookies
                    </h2>
                    <p class="cookie-banner-text">
                        Utilizamos cookies propias para mejorar la experiencia de navegación y recordar sus preferencias 
                        (como el tema de color seleccionado). No utilizamos cookies de terceros ni de publicidad.
                    </p>
                    <div class="cookie-banner-actions">
                        <a href="${basePath}politica-cookies.html" class="cookie-banner-link">
                            Más información
                        </a>
                        <button id="cookie-banner-accept" class="cookie-banner-button" aria-label="Aceptar uso de cookies">
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Muestra el banner de cookies
     */
    function showBanner() {
        // Verificar si ya existe el banner
        if (document.querySelector('.cookie-banner')) {
            return;
        }

        // Inyectar HTML del banner
        const bannerContainer = document.createElement('div');
        bannerContainer.innerHTML = createBannerHTML();
        document.body.appendChild(bannerContainer.firstElementChild);

        // Configurar eventos después de inyectar
        setupBannerEvents();

        // Hacer que el banner sea navegable con teclado
        const banner = document.querySelector('.cookie-banner');
        const acceptButton = document.getElementById('cookie-banner-accept');
        
        // Foco inicial en el botón de aceptar
        setTimeout(() => {
            acceptButton.focus();
        }, 100);
    }

    /**
     * Oculta y elimina el banner de cookies
     */
    function hideBanner() {
        const banner = document.querySelector('.cookie-banner');
        if (banner) {
            banner.classList.add('cookie-banner-hidden');
            setTimeout(() => {
                banner.remove();
            }, 300); // Esperar a que termine la animación
        }
    }

    /**
     * Acepta las cookies y guarda la preferencia
     */
    function acceptCookies() {
        if (window.CookieManager) {
            window.CookieManager.set(COOKIE_CONSENT_NAME, COOKIE_CONSENT_VERSION, 365);
        }
        hideBanner();
    }

    /**
     * Configura los eventos del banner
     */
    function setupBannerEvents() {
        const acceptButton = document.getElementById('cookie-banner-accept');
        
        if (!acceptButton) return;

        // Evento de clic en el botón de aceptar
        acceptButton.addEventListener('click', acceptCookies);

        // Permitir cerrar con tecla Escape (accesibilidad)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const banner = document.querySelector('.cookie-banner');
                if (banner) {
                    acceptCookies(); // Al cerrar con Escape, aceptamos las cookies
                }
            }
        });

        // Trampa de foco para accesibilidad (mantener foco dentro del banner)
        const banner = document.querySelector('.cookie-banner');
        const focusableElements = banner.querySelectorAll('a, button');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        banner.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    /**
     * Inicializa el sistema de cookies
     */
    function initCookieBanner() {
        // Esperar a que CookieManager esté disponible
        if (!window.CookieManager) {
            console.error('CookieManager no está disponible. Asegúrate de cargar cookie-manager.js antes.');
            return;
        }

        // Verificar si el usuario ya aceptó las cookies
        const hasConsent = window.CookieManager.get(COOKIE_CONSENT_NAME) === COOKIE_CONSENT_VERSION;

        if (!hasConsent) {
            showBanner();
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }

    // Exportar API pública para uso externo si es necesario
    window.CookieBanner = {
        show: showBanner,
        hide: hideBanner,
        accept: acceptCookies
    };
})();

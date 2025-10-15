(function() {
    'use strict';

    const THEME_KEY = 'pioz-theme-preference';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';

    // Detectar preferencia del sistema
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEME_DARK;
        }
        return THEME_LIGHT;
    }

    // Obtener tema guardado o del sistema
    function getSavedTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
            return savedTheme;
        }
        return getSystemTheme();
    }

    // Cambiar logo según el tema
    function updateLogo(theme) {
        const logoImages = document.querySelectorAll('.logo img, .logo-link img');
        
        logoImages.forEach(img => {
            if (theme === THEME_DARK) {
                // Cambiar a versión oscura
                img.src = img.src.replace('escudo_ayuntamiento.png', 'escudo_ayuntamientoOscuro.png');
            } else {
                // Cambiar a versión clara
                img.src = img.src.replace('escudo_ayuntamientoOscuro.png', 'escudo_ayuntamiento.png');
            }
        });
    }

    // Aplicar tema
    function applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === THEME_DARK) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        
        // Actualizar logo
        updateLogo(theme);
        
        // Actualizar el estado del toggle
        updateToggleButton(theme);
        
        // Forzar repaint para evitar FOUC
        void root.offsetHeight;
    }

    // Guardar preferencia
    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            console.warn('No se pudo guardar la preferencia de tema', e);
        }
    }

    // Cambiar tema
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
        
        applyTheme(newTheme);
        saveTheme(newTheme);
    }

    // Actualizar botón
    function updateToggleButton(theme) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('.theme-icon');
            if (theme === THEME_DARK) {
                icon.textContent = '☀️';
                toggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
                toggleBtn.title = 'Modo claro';
            } else {
                icon.textContent = '🌙';
                toggleBtn.setAttribute('aria-label', 'Cambiar a modo oscuro');
                toggleBtn.title = 'Modo oscuro';
            }
        }
    }

    // Crear botón de toggle
    function createToggleButton() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('aria-label', 'Cambiar tema');
        toggleBtn.setAttribute('title', 'Cambiar tema');
        toggleBtn.innerHTML = '<span class="theme-icon">🌙</span>';
        
        // Insertar antes del botón de búsqueda
        const searchToggle = headerActions.querySelector('.search-toggle');
        if (searchToggle) {
            headerActions.insertBefore(toggleBtn, searchToggle);
        } else {
            headerActions.insertBefore(toggleBtn, headerActions.firstChild);
        }

        toggleBtn.addEventListener('click', toggleTheme);
    }

    // Escuchar cambios en las preferencias del sistema
    function watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Función de callback
            const handleChange = (e) => {
                // Solo aplicar si no hay preferencia guardada
                if (!localStorage.getItem(THEME_KEY)) {
                    applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
                }
            };
            
            // addEventListener para navegadores modernos
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
            } else if (mediaQuery.addListener) {
                // Compatibilidad con navegadores antiguos
                mediaQuery.addListener(handleChange);
            }
        }
    }

    // Inicializar antes de que se renderice la página (evitar FOUC)
    function initializeThemeEarly() {
        const savedTheme = getSavedTheme();
        if (savedTheme === THEME_DARK) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    // Inicializar
    function init() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
        createToggleButton();
        watchSystemTheme();
    }

    // Aplicar tema lo antes posible
    initializeThemeEarly();

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

(function() {
    'use strict';

    // Variable para evitar inicialización múltiple
    let navigationInitialized = false;
    let clickListenerAdded = false;

    // Esperar a que el DOM esté completamente cargado
    function initNavigation() {
        // Evitar inicialización múltiple
        if (navigationInitialized) {
            return;
        }

        const navToggle = document.querySelector('.nav-toggle');
        const mainNav = document.querySelector('.main-nav');
        const navList = document.querySelector('.nav-list');
        const body = document.body;

        // Verificar que los elementos existen antes de continuar
        if (!navToggle || !mainNav || !navList) {
            return;
        }

        // Marcar como inicializado
        navigationInitialized = true;

        // Toggle del menú móvil
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
            body.classList.toggle('nav-open');
        });

        // Manejar submenús en móvil
        const hasSubmenu = document.querySelectorAll('.has-submenu > a');
        
        hasSubmenu.forEach(function(link) {
            if (window.innerWidth <= 991) {
                link.addEventListener('click', function(e) {
                    const parent = this.parentElement;
                    const submenu = parent ? parent.querySelector('.submenu') : null;
                    
                    if (submenu) {
                        e.preventDefault();
                        parent.classList.toggle('submenu-open');
                    }
                });
            }
        });

        // Cerrar menú al hacer clic fuera - Solo añadir una vez
        if (!clickListenerAdded) {
            clickListenerAdded = true;
            document.addEventListener('click', function(e) {
                const currentNavList = document.querySelector('.nav-list');
                const currentMainNav = document.querySelector('.main-nav');
                const currentNavToggle = document.querySelector('.nav-toggle');
                
                if (currentNavList && currentMainNav && currentNavToggle && 
                    !currentMainNav.contains(e.target) && 
                    currentNavList.classList.contains('active')) {
                    currentNavList.classList.remove('active');
                    currentNavToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-open');
                }
            });
        }

        // Cerrar menú al cambiar de tamaño de ventana
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const currentNavList = document.querySelector('.nav-list');
                const currentNavToggle = document.querySelector('.nav-toggle');
                
                if (currentNavList && currentNavToggle && 
                    window.innerWidth > 991 && 
                    currentNavList.classList.contains('active')) {
                    currentNavList.classList.remove('active');
                    currentNavToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-open');
                    
                    document.querySelectorAll('.has-submenu').forEach(function(item) {
                        item.classList.remove('submenu-open');
                    });
                }
            }, 250);
        });

        // Manejar enlaces activos
        markActiveLinks();
    }

    // Marcar enlaces activos según la página actual
    function markActiveLinks() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-list a');
        
        if (links.length === 0) {
            return;
        }
        
        links.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href && currentPath.endsWith(href)) {
                link.classList.add('active');
                
                const parentLi = link.closest('.has-submenu');
                if (parentLi) {
                    const parentLink = parentLi.querySelector(':scope > a');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            }
        });
    }

    // Función para intentar inicializar de forma segura
    function safeInitNavigation() {
        const header = document.querySelector('.header');
        if (!header) {
            return;
        }
        
        initNavigation();
    }

    // Escuchar cuando el header esté cargado
    window.addEventListener('headerLoaded', function() {
        safeInitNavigation();
    });

    // Fallback: intentar inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(safeInitNavigation, 200);
        });
    } else {
        setTimeout(safeInitNavigation, 200);
    }

})();

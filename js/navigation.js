(function() {
    'use strict';

    // Toggle menú móvil
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
        });
    }

    // Submenús en móvil
    const menuItemsWithSubmenu = document.querySelectorAll('.has-submenu > a');
    
    menuItemsWithSubmenu.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth < 768) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });

    // Cerrar menú móvil al cambiar tamaño de ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

})();

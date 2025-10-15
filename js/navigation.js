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

    // Submenús en móvil (incluyendo submenús de segundo nivel)
    const menuItemsWithSubmenu = document.querySelectorAll('.has-submenu > a');
    
    menuItemsWithSubmenu.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth < 768) {
                e.preventDefault();
                const parent = this.parentElement;
                
                // Cerrar otros submenús al mismo nivel
                const siblings = Array.from(parent.parentElement.children);
                siblings.forEach(sibling => {
                    if (sibling !== parent && sibling.classList.contains('has-submenu')) {
                        sibling.classList.remove('active');
                    }
                });
                
                parent.classList.toggle('active');
            }
        });
    });

    // Cerrar menú móvil al cambiar tamaño de ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            
            // Cerrar todos los submenús activos
            document.querySelectorAll('.has-submenu.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    });

})();

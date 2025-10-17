(function() {
    'use strict';

    /**
     * Sistema de gestión de cookies del navegador
     * Expone API pública para crear, leer y eliminar cookies de forma segura
     */
    const CookieManager = {
        /**
         * Crea o actualiza una cookie
         * @param {string} name - Nombre de la cookie
         * @param {string} value - Valor a almacenar
         * @param {number} days - Días hasta expiración (por defecto 365)
         * @param {string} path - Ruta de la cookie (por defecto '/')
         */
        set: function(name, value, days = 365, path = '/') {
            let expires = '';
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toUTCString();
            }
            
            // SameSite=Lax para protección contra CSRF
            document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=' + path + '; SameSite=Lax';
        },

        /**
         * Lee el valor de una cookie
         * @param {string} name - Nombre de la cookie
         * @returns {string|null} - Valor de la cookie o null si no existe
         */
        get: function(name) {
            const nameEQ = name + '=';
            const cookies = document.cookie.split(';');
            
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(cookie.substring(nameEQ.length));
                }
            }
            return null;
        },

        /**
         * Elimina una cookie
         * @param {string} name - Nombre de la cookie a eliminar
         * @param {string} path - Ruta de la cookie (por defecto '/')
         */
        delete: function(name, path = '/') {
            this.set(name, '', -1, path);
        },

        /**
         * Verifica si una cookie existe
         * @param {string} name - Nombre de la cookie
         * @returns {boolean} - true si existe, false si no
         */
        exists: function(name) {
            return this.get(name) !== null;
        }
    };

    // Exportar API pública
    window.CookieManager = CookieManager;
})();

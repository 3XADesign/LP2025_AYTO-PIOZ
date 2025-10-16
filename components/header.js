(function() {
    'use strict';

    // Determinar la ruta base según la ubicación del archivo
    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/ayuntamiento/') || path.includes('/tramites/') || path.includes('/servicios/') || path.includes('/cultura/') || path.includes('/villa/')) {
            return '../';
        }
        return '';
    }

    // Generar el HTML del header
    function generateHeader() {
        const basePath = getBasePath();
        
        return `
            <header class="header">
                <div class="container">
                    <div class="header-top">
                        <div class="logo">
                            <a href="${basePath}index.html" class="logo-link">
                                <img src="${basePath}images/escudo_ayuntamiento.png" alt="Escudo del Ayuntamiento de Pioz">
                            </a>
                        </div>
                        <div class="header-actions">
                            <button class="search-toggle" aria-label="Abrir búsqueda">
                                <span class="icon-search"></span>
                            </button>
                            <div class="contact-quick">
                                <span class="icon-phone"></span>
                                <span>949 272 076</span>
                            </div>
                        </div>
                    </div>
                    
                    <nav class="main-nav" role="navigation" aria-label="Navegación principal">
                        <button class="nav-toggle" aria-label="Menú" aria-expanded="false">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <ul class="nav-list">
                            <li><a href="${basePath}index.html">Inicio</a></li>
                            <li class="has-submenu">
                                <a href="${basePath}ayuntamiento.html">Ayuntamiento</a>
                                <ul class="submenu">
                                    <li><a href="${basePath}ayuntamiento/saluda.html">Saluda</a></li>
                                    <li><a href="${basePath}ayuntamiento/equipo_gobierno.html">Equipo de Gobierno</a></li>
                                    <li><a href="${basePath}ayuntamiento/perfil_contratante.html">Perfil del Contratante</a></li>
                                    <li><a href="${basePath}ayuntamiento/bandos.html">Bandos Municipales</a></li>
                                    <li><a href="${basePath}ayuntamiento/plenos_ayuntamiento.html">Plenos</a></li>
                                </ul>
                            </li>
                            <li class="has-submenu">
                                <a href="${basePath}tramites.html">Trámites</a>
                                <ul class="submenu">
                                    <li><a href="${basePath}tramites/sede_electronica.html">Sede Electrónica</a></li>
                                    <li><a href="${basePath}tramites/ordenanzas.html">Ordenanzas</a></li>
                                </ul>
                            </li>
                            <li class="has-submenu">
                                <a href="${basePath}servicios.html">Servicios</a>
                                <ul class="submenu">
                                    <li><a href="${basePath}servicios/sanidad.html">Sanidad</a></li>
                                    <li><a href="${basePath}servicios/proteccion_civil.html">Protección Civil</a></li>
                                    <li><a href="${basePath}servicios/urbanismo.html">Urbanismo</a></li>
                                    <li><a href="${basePath}servicios/bienestar_social.html">Bienestar Social</a></li>
                                    <li><a href="${basePath}servicios/empleo.html">Empleo</a></li>
                                    <li><a href="${basePath}servicios/atencion_ciudadano.html">Atención al Ciudadano</a></li>
                                    <li><a href="${basePath}servicios/transporte.html">Transporte</a></li>
                                    <li><a href="${basePath}servicios/piscina_municipal.html">Piscina Municipal</a></li>
                                    <li class="has-submenu">
                                        <a href="${basePath}servicios/medio_ambiente.html">Medio Ambiente</a>
                                        <ul class="submenu">
                                            <li><a href="${basePath}servicios/recogida_aceite.html">Recogida de Aceite</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li class="has-submenu">
                                <a href="${basePath}cultura.html">Cultura</a>
                                <ul class="submenu">
                                    <li><a href="${basePath}cultura/calendario.html">Calendario Cultural</a></li>
                                    <li><a href="${basePath}cultura/asociaciones.html">Asociaciones</a></li>
                                    <li><a href="${basePath}cultura/colegios.html">Colegios</a></li>
                                    <li><a href="${basePath}cultura/ies.html">IES de Pioz</a></li>
                                    <li><a href="${basePath}cultura/espa.html">Escuela Secundaria para Adultos</a></li>
                                    <li><a href="${basePath}cultura/biblioteca.html">Biblioteca</a></li>
                                </ul>
                            </li>
                            <li class="has-submenu">
                                <a href="${basePath}villa.html">Villa de Pioz</a>
                                <ul class="submenu">
                                    <li><a href="${basePath}villa/poblacion.html">Población</a></li>
                                    <li><a href="${basePath}villa/casco_urbano.html">Casco Urbano</a></li>
                                    <li><a href="${basePath}villa/urbanizaciones.html">Urbanizaciones</a></li>
                                    <li><a href="${basePath}villa/situacion.html">Situación</a></li>
                                    <li><a href="${basePath}villa/historia.html">Historia</a></li>
                                    <li class="has-submenu">
                                        <a href="${basePath}villa/castillo.html">Castillo de Pioz</a>
                                        <ul class="submenu">
                                            <li><a href="${basePath}villa/guardianes_castillo.html">Guardianes del Castillo</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="${basePath}villa/iglesia.html">Iglesia de San Sebastián</a></li>
                                    <li><a href="${basePath}villa/visita_fotografica.html">Visita Fotográfica</a></li>
                                    <li class="has-submenu">
                                        <a href="${basePath}villa/tradiciones.html">Tradiciones</a>
                                        <ul class="submenu">
                                            <li><a href="${basePath}villa/fiesta_castillo.html">Fiesta del Castillo</a></li>
                                            <li><a href="${basePath}villa/fiestas_donato.html">Fiestas de San Donato</a></li>
                                            <li><a href="${basePath}villa/fiestas_candelaria.html">Fiestas de la Candelaria</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="${basePath}villa/empresas.html">Empresas de Pioz</a></li>
                                    <li><a href="${basePath}villa/prensa.html">Prensa</a></li>
                                </ul>
                            </li>
                            <li><a href="${basePath}tablon.html">Tablón / Contacto</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div class="search-overlay" id="searchOverlay">
                <div class="search-overlay-content">
                    <button class="search-close" aria-label="Cerrar búsqueda">✕</button>
                    <form class="search-form">
                        <input 
                            type="search" 
                            name="q" 
                            placeholder="¿Qué estás buscando?" 
                            aria-label="Buscar en el sitio"
                            autocomplete="off"
                            required
                        >
                        <button type="submit" class="btn-search-submit">
                            🔍 Buscar
                        </button>
                    </form>
                    <div class="search-suggestions">
                        <p>Búsquedas sugeridas:</p>
                        <ul>
                            <li><a href="#" onclick="quickSearch('bandos'); return false;">Bandos municipales</a></li>
                            <li><a href="#" onclick="quickSearch('trámites'); return false;">Trámites</a></li>
                            <li><a href="#" onclick="quickSearch('empadronamiento'); return false;">Empadronamiento</a></li>
                            <li><a href="#" onclick="quickSearch('impuestos'); return false;">Impuestos</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    // Marcar el enlace activo
    function markActiveLinks() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-list a');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.endsWith(href)) {
                link.classList.add('active');
                
                // Si está en un submenú, marcar también el padre
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

    // Insertar el header en el DOM
    function insertHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.outerHTML = generateHeader();
            markActiveLinks();
            
            // Disparar evento personalizado para notificar que el header está listo
            window.dispatchEvent(new Event('headerLoaded'));
        }
    }

    // Si no existe el overlay de búsqueda en el HTML, añadirlo al final del body
    document.addEventListener('DOMContentLoaded', function() {
        if (!document.getElementById('searchOverlay')) {
            const searchOverlay = document.createElement('div');
            searchOverlay.id = 'searchOverlay';
            searchOverlay.className = 'search-overlay';
            searchOverlay.innerHTML = `
                <div class="search-overlay-content">
                    <button class="search-close" aria-label="Cerrar búsqueda">✕</button>
                    <form class="search-form">
                        <input 
                            type="search" 
                            name="q" 
                            placeholder="¿Qué estás buscando?" 
                            aria-label="Buscar en el sitio"
                            autocomplete="off"
                            required
                        >
                        <button type="submit" class="btn-search-submit">
                            🔍 Buscar
                        </button>
                    </form>
                    <div class="search-suggestions">
                        <p>Búsquedas sugeridas:</p>
                        <ul>
                            <li><a href="#" onclick="quickSearch('bandos'); return false;">Bandos municipales</a></li>
                            <li><a href="#" onclick="quickSearch('trámites'); return false;">Trámites</a></li>
                            <li><a href="#" onclick="quickSearch('empadronamiento'); return false;">Empadronamiento</a></li>
                            <li><a href="#" onclick="quickSearch('impuestos'); return false;">Impuestos</a></li>
                        </ul>
                    </div>
                </div>
            `;
            document.body.appendChild(searchOverlay);

            // Función para búsquedas rápidas
            window.quickSearch = function(term) {
                sessionStorage.setItem('searchQuery', term);
                const basePath = getBasePath();
                window.location.href = basePath + 'busqueda.html';
            };
        }
    });

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertHeader);
    } else {
        insertHeader();
    }

})();

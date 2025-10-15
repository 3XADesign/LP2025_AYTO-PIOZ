(function() {
    'use strict';

    // Base de datos de plenos (en producción vendría de API/CMS)
    const plenosData = [
        {
            id: 1,
            title: 'Pleno Ordinario - Enero 2025',
            date: '2025-01-28',
            type: 'ordinario',
            youtubeId: 'dQw4w9WgXcQ',
            actaUrl: '#',
            ordenDia: [
                'Aprobación del acta de la sesión anterior',
                'Aprobación del presupuesto municipal 2025',
                'Modificación de la Ordenanza Fiscal nº 3',
                'Moción sobre mejora de infraestructuras',
                'Ruegos y preguntas'
            ]
        },
        {
            id: 2,
            title: 'Pleno Extraordinario - Presupuestos 2025',
            date: '2024-12-15',
            type: 'extraordinario',
            youtubeId: 'dQw4w9WgXcQ',
            actaUrl: '#',
            ordenDia: [
                'Debate y aprobación inicial del Presupuesto General 2025',
                'Aprobación de las Bases de Ejecución del Presupuesto',
                'Plantilla de personal para el ejercicio 2025'
            ]
        },
        {
            id: 3,
            title: 'Pleno Ordinario - Noviembre 2024',
            date: '2024-11-30',
            type: 'ordinario',
            youtubeId: 'dQw4w9WgXcQ',
            actaUrl: '#',
            ordenDia: [
                'Aprobación del acta de la sesión anterior',
                'Ratificación de decretos de Alcaldía',
                'Aprobación de convenio de colaboración con la Diputación',
                'Moción sobre actividades culturales de Navidad',
                'Ruegos y preguntas'
            ]
        }
    ];

    let currentPage = 1;
    const itemsPerPage = 3;
    let filteredPlenos = [...plenosData];

    // Formatear fecha
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return { day, month, year };
    }

    // Renderizar un pleno
    function renderPleno(pleno) {
        const { day, month, year } = formatDate(pleno.date);
        const typeClass = pleno.type === 'ordinario' ? 'type-ordinario' : 'type-extraordinario';
        const typeLabel = pleno.type.charAt(0).toUpperCase() + pleno.type.slice(1);

        const ordenDiaHTML = pleno.ordenDia.map(item => `<li>${item}</li>`).join('');

        return `
            <article class="pleno-card">
                <div class="pleno-header">
                    <div class="pleno-date-badge">
                        <span class="badge-day">${day}</span>
                        <span class="badge-month">${month} ${year}</span>
                    </div>
                    <div class="pleno-info">
                        <h3>${pleno.title}</h3>
                        <span class="pleno-type ${typeClass}">${typeLabel}</span>
                    </div>
                </div>
                <div class="pleno-body">
                    <div class="orden-dia">
                        <h4>Orden del Día</h4>
                        <ol>${ordenDiaHTML}</ol>
                    </div>
                    
                    <div class="video-container">
                        <iframe 
                            src="https://www.youtube.com/embed/${pleno.youtubeId}" 
                            title="${pleno.title}"
                            allowfullscreen
                            loading="lazy">
                        </iframe>
                    </div>
                    
                    <div class="pleno-actions">
                        <a href="${pleno.actaUrl}" class="btn btn-acta btn-icon" download>
                            📄 Descargar Acta (PDF)
                        </a>
                        <a href="https://www.youtube.com/watch?v=${pleno.youtubeId}" target="_blank" class="btn btn-youtube btn-icon">
                            ▶ Ver en YouTube
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    // Renderizar lista de plenos
    function renderPlenos() {
        const plenosList = document.getElementById('plenosList');
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const plenosToShow = filteredPlenos.slice(start, end);

        if (plenosToShow.length === 0) {
            plenosList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>No se encontraron plenos</h3>
                    <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
            `;
        } else {
            plenosList.innerHTML = plenosToShow.map(pleno => renderPleno(pleno)).join('');
        }

        updateResultsCount();
        updatePagination();
    }

    // Actualizar contador de resultados
    function updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(start + itemsPerPage - 1, filteredPlenos.length);
        resultsCount.textContent = `Mostrando ${start}-${end} de ${filteredPlenos.length} plenos`;
    }

    // Actualizar paginación
    function updatePagination() {
        const totalPages = Math.ceil(filteredPlenos.length / itemsPerPage);
        const pagination = document.getElementById('pagination');
        
        let paginationHTML = `<button id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>« Anterior</button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                paginationHTML += `<a href="#" class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                paginationHTML += `<span>...</span>`;
            }
        }
        
        paginationHTML += `<button id="nextPage" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente »</button>`;
        
        pagination.innerHTML = paginationHTML;

        // Event listeners
        document.getElementById('prevPage')?.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPlenos();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        document.getElementById('nextPage')?.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPlenos();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        pagination.querySelectorAll('a[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = parseInt(e.target.dataset.page);
                renderPlenos();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // Filtrar plenos
    function filterPlenos() {
        const searchText = document.getElementById('searchText').value.toLowerCase();
        const filterYear = document.getElementById('filterYear').value;
        const filterType = document.getElementById('filterType').value;

        filteredPlenos = plenosData.filter(pleno => {
            const matchesSearch = !searchText || 
                pleno.title.toLowerCase().includes(searchText) ||
                pleno.ordenDia.some(item => item.toLowerCase().includes(searchText));
            
            const matchesYear = !filterYear || 
                pleno.date.startsWith(filterYear);
            
            const matchesType = !filterType || 
                pleno.type === filterType;

            return matchesSearch && matchesYear && matchesType;
        });

        currentPage = 1;
        renderPlenos();
    }

    // Ordenar plenos
    function sortPlenos(sortBy) {
        if (sortBy === 'date-desc') {
            filteredPlenos.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'date-asc') {
            filteredPlenos.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        renderPlenos();
    }

    // Event listeners
    document.getElementById('filterForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        filterPlenos();
    });

    document.getElementById('sortBy')?.addEventListener('change', (e) => {
        sortPlenos(e.target.value);
    });

    // Inicializar
    renderPlenos();

})();

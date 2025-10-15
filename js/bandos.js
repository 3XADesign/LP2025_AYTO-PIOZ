(function() {
    'use strict';

    // Base de datos de bandos (en producción vendría de API/CMS)
    const bandosData = [
        {
            id: 1,
            title: 'BANDO CORTE SAN DONATO 2025',
            date: '2025-09-18',
            category: 'festejos',
            department: 'Alcaldía',
            excerpt: 'Se comunica a todos los vecinos el corte de tráfico en varias calles del municipio con motivo de la celebración de las fiestas patronales de San Donato 2025.',
            pdfUrl: '#'
        },
        {
            id: 2,
            title: 'PROGRAMA SAN DONATO 2025',
            date: '2025-09-15',
            category: 'festejos',
            department: 'Concejalía de Cultura',
            excerpt: 'Ya está disponible el programa completo de actividades para las fiestas patronales de San Donato 2025. Consulta todos los actos programados.',
            pdfUrl: '#'
        },
        {
            id: 3,
            title: 'BANDO TRATAMIENTO MOSCAS Y MOSQUITOS',
            date: '2025-09-10',
            category: 'sanidad',
            department: 'Concejalía de Sanidad',
            excerpt: 'Información sobre el tratamiento preventivo contra moscas y mosquitos que se llevará a cabo en el municipio. Recomendaciones para los vecinos.',
            pdfUrl: '#'
        },
        {
            id: 4,
            title: 'SCHOOL OF ROCK - ESCUELA DE MÚSICA',
            date: '2025-09-05',
            category: 'festejos',
            department: 'Concejalía de Cultura',
            excerpt: 'Abierto el plazo de inscripción para la Escuela Municipal de Música. Plazas limitadas. Consulta las condiciones y horarios.',
            pdfUrl: '#'
        },
        {
            id: 5,
            title: 'CORTE DE CALLES POR OBRAS DE MEJORA',
            date: '2025-09-01',
            category: 'obras',
            department: 'Concejalía de Obras',
            excerpt: 'Se informa del corte temporal de la Calle Mayor para la realización de obras de mejora del pavimento. Itinerarios alternativos disponibles.',
            pdfUrl: '#'
        },
        {
            id: 6,
            title: 'DESBROCE DE PARCELAS URBANAS',
            date: '2025-08-25',
            category: 'servicios',
            department: 'Concejalía de Medio Ambiente',
            excerpt: 'Recordatorio a los propietarios sobre la obligación de mantener limpias y desbrozadas las parcelas urbanas. Plazo y sanciones aplicables.',
            pdfUrl: '#'
        }
    ];

    let currentPage = 1;
    const itemsPerPage = 6;
    let filteredBandos = [...bandosData];

    // Formatear fecha
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return { day, month, year };
    }

    // Renderizar un bando
    function renderBando(bando) {
        const { day, month, year } = formatDate(bando.date);
        const categoryIcons = {
            festejos: '📁',
            obras: '🏗️',
            sanidad: '🏥',
            servicios: '⚙️',
            general: '📋'
        };

        return `
            <article class="bando-card">
                <div class="bando-date-badge">
                    <span class="badge-day">${day}</span>
                    <span class="badge-month">${month}</span>
                    <span class="badge-year">${year}</span>
                </div>
                <div class="bando-content">
                    <h3>${bando.title}</h3>
                    <div class="bando-meta">
                        <span>${categoryIcons[bando.category] || '📁'} ${bando.category.charAt(0).toUpperCase() + bando.category.slice(1)}</span>
                        <span>👤 ${bando.department}</span>
                    </div>
                    <p class="bando-excerpt">${bando.excerpt}</p>
                </div>
                <div class="bando-actions">
                    <a href="bando-detalle.html?id=${bando.id}" class="btn btn-primary">Leer más</a>
                    <a href="${bando.pdfUrl}" class="btn-pdf" download>
                        📄 Descargar PDF
                    </a>
                </div>
            </article>
        `;
    }

    // Renderizar lista de bandos
    function renderBandos() {
        const bandosList = document.getElementById('bandosList');
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const bandosToShow = filteredBandos.slice(start, end);

        if (bandosToShow.length === 0) {
            bandosList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>No se encontraron bandos</h3>
                    <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
            `;
        } else {
            bandosList.innerHTML = bandosToShow.map(bando => renderBando(bando)).join('');
        }

        updateResultsCount();
        updatePagination();
    }

    // Actualizar contador de resultados
    function updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(start + itemsPerPage - 1, filteredBandos.length);
        resultsCount.textContent = `Mostrando ${start}-${end} de ${filteredBandos.length} bandos`;
    }

    // Actualizar paginación
    function updatePagination() {
        const totalPages = Math.ceil(filteredBandos.length / itemsPerPage);
        const pagination = document.getElementById('pagination');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // Generar botones de página
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

        // Event listeners para paginación
        document.getElementById('prevPage').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderBandos();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderBandos();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        pagination.querySelectorAll('a[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = parseInt(e.target.dataset.page);
                renderBandos();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // Filtrar bandos
    function filterBandos() {
        const searchText = document.getElementById('searchText').value.toLowerCase();
        const filterYear = document.getElementById('filterYear').value;
        const filterCategory = document.getElementById('filterCategory').value;

        filteredBandos = bandosData.filter(bando => {
            const matchesSearch = !searchText || 
                bando.title.toLowerCase().includes(searchText) || 
                bando.excerpt.toLowerCase().includes(searchText);
            
            const matchesYear = !filterYear || 
                bando.date.startsWith(filterYear);
            
            const matchesCategory = !filterCategory || 
                bando.category === filterCategory;

            return matchesSearch && matchesYear && matchesCategory;
        });

        currentPage = 1;
        renderBandos();
    }

    // Ordenar bandos
    function sortBandos(sortBy) {
        switch(sortBy) {
            case 'date-desc':
                filteredBandos.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                filteredBandos.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title-asc':
                filteredBandos.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
        renderBandos();
    }

    // Event listeners
    document.getElementById('filterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        filterBandos();
    });

    document.getElementById('sortBy').addEventListener('change', (e) => {
        sortBandos(e.target.value);
    });

    // Inicializar
    renderBandos();

})();

(function() {
    'use strict';

    let currentQuery = '';
    let currentSearchResult = { results: [], suggestion: null };

    // Renderizar resultados
    function renderResults(searchResult) {
        const container = document.getElementById('searchResults');
        const searchInfo = document.getElementById('searchInfo');
        const { results, suggestion } = searchResult;

        // Mostrar sugerencia ortográfica
        if (suggestion && results.length === 0) {
            container.innerHTML = `
                <div class="suggestion-box">
                    <strong>¿Quiso decir:</strong> <a href="#" onclick="performSearch('${suggestion}'); return false;">${suggestion}</a>
                </div>
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h2>No se encontraron resultados</h2>
                    <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
                </div>
            `;
            searchInfo.textContent = 'No se encontraron resultados';
            return;
        }

        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h2>No se encontraron resultados</h2>
                    <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
                </div>
            `;
            searchInfo.textContent = 'No se encontraron resultados';
            return;
        }

        searchInfo.textContent = `Se encontraron ${results.length} resultado${results.length !== 1 ? 's' : ''} para "${currentQuery}"`;

        const resultsHTML = results.map(result => {
            const date = new Date(result.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const snippet = window.SearchEngine.highlightText(result.snippet, currentQuery);

            return `
                <article class="result-card">
                    <div class="result-meta">
                        <span>📁 ${result.category}</span>
                        <span>📅 ${date}</span>
                        <span>📄 ${result.type}</span>
                        <span style="color: var(--color-accent);">★ Relevancia: ${result.relevance}</span>
                    </div>
                    <a href="${result.url}" class="result-title">
                        ${window.SearchEngine.highlightText(result.title, currentQuery)}
                    </a>
                    <p class="result-snippet">${snippet}</p>
                    <div class="result-url">${result.url}</div>
                    ${result.pdfUrl ? `<a href="${result.pdfUrl}" class="btn btn-secondary btn-icon" style="margin-top: var(--spacing-sm);">📄 Ver PDF</a>` : ''}
                </article>
            `;
        }).join('');

        container.innerHTML = resultsHTML;
    }

    // Aplicar filtros
    function applyFilters() {
        const filters = {
            categories: [],
            types: [],
            year: null
        };

        // Obtener categorías seleccionadas
        document.querySelectorAll('[id^="cat-"]:checked:not(#cat-all)').forEach(cb => {
            if (cb.value) filters.categories.push(cb.value);
        });

        // Obtener tipos seleccionados
        document.querySelectorAll('[id^="type-"]:checked:not(#type-all)').forEach(cb => {
            if (cb.value) filters.types.push(cb.value);
        });

        // Obtener año seleccionado
        const yearRadio = document.querySelector('input[name="year"]:checked');
        if (yearRadio && yearRadio.value) {
            filters.year = yearRadio.value;
        }

        // Filtrar resultados
        let filteredResults = currentResults;

        if (filters.categories.length > 0) {
            filteredResults = filteredResults.filter(r => 
                filters.categories.includes(r.category)
            );
        }

        if (filters.types.length > 0) {
            filteredResults = filteredResults.filter(r => 
                filters.types.includes(r.type)
            );
        }

        if (filters.year) {
            filteredResults = filteredResults.filter(r => {
                const resultYear = new Date(r.date).getFullYear().toString();
                return resultYear === filters.year;
            });
        }

        renderResults(filteredResults);
    }

    // Limpiar filtros
    window.clearFilters = function() {
        document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
            cb.checked = cb.id.includes('-all');
        });
        document.querySelector('#year-all').checked = true;
        applyFilters();
    };

    // Realizar búsqueda
    window.performSearch = function(query) {
        if (!query) return;

        currentQuery = query;
        document.getElementById('mainSearchInput').value = query;

        currentSearchResult = window.SearchEngine.search(query);
        renderResults(currentSearchResult);
    };

    // Inicializar
    function init() {
        // Obtener query de sessionStorage
        const savedQuery = sessionStorage.getItem('searchQuery');
        if (savedQuery) {
            performSearch(savedQuery);
            sessionStorage.removeItem('searchQuery');
        }

        // Formulario de búsqueda
        document.getElementById('searchBoxMain').addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('mainSearchInput').value;
            performSearch(query);
        });

        // Event listeners para filtros
        document.querySelectorAll('.filter-option input').forEach(input => {
            input.addEventListener('change', applyFilters);
        });

        // Manejar "Todas" en categorías
        document.getElementById('cat-all').addEventListener('change', function() {
            if (this.checked) {
                document.querySelectorAll('[id^="cat-"]:not(#cat-all)').forEach(cb => {
                    cb.checked = false;
                });
            }
        });

        document.querySelectorAll('[id^="cat-"]:not(#cat-all)').forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    document.getElementById('cat-all').checked = false;
                }
            });
        });

        // Manejar "Todos" en tipos
        document.getElementById('type-all').addEventListener('change', function() {
            if (this.checked) {
                document.querySelectorAll('[id^="type-"]:not(#type-all)').forEach(cb => {
                    cb.checked = false;
                });
            }
        });

        document.querySelectorAll('[id^="type-"]:not(#type-all)').forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    document.getElementById('type-all').checked = false;
                }
            });
        });
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

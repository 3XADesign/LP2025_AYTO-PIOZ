(function() {
    'use strict';

    // Base de datos de noticias (simulación - en producción vendría de API)
    const newsData = [
        {
            id: 1,
            title: 'BANDO CORTE SAN DONATO 2025',
            date: '2025-01-18',
            excerpt: 'Se comunica el corte de tráfico en la Avenida Principal con motivo de las fiestas de San Donato.',
            category: 'Bandos'
        },
        {
            id: 2,
            title: 'PROGRAMA SAN DONATO 2025',
            date: '2025-01-15',
            excerpt: 'Ya disponible el programa completo de las fiestas patronales de San Donato 2025.',
            category: 'Cultura'
        },
        {
            id: 3,
            title: 'BANDO TRATAMIENTO MOSCAS Y MOSQUITOS',
            date: '2025-01-10',
            excerpt: 'Información sobre el tratamiento preventivo contra moscas y mosquitos en el municipio.',
            category: 'Sanidad'
        },
        {
            id: 4,
            title: 'SCHOOL OF ROCK - ESCUELA DE MÚSICA',
            date: '2025-01-05',
            excerpt: 'Abierto el plazo de inscripción para la Escuela Municipal de Música.',
            category: 'Cultura'
        },
        {
            id: 5,
            title: 'JORNADAS MEDIEVALES EN EL CASTILLO',
            date: '2025-01-03',
            excerpt: 'Prepárate para vivir la historia en las próximas Jornadas Medievales del Castillo de Pioz.',
            category: 'Eventos'
        },
        {
            id: 6,
            title: 'NUEVA ORDENANZA DE LIMPIEZA URBANA',
            date: '2025-01-01',
            excerpt: 'Aprobada la nueva ordenanza municipal de limpieza y recogida de residuos.',
            category: 'Bandos'
        }
    ];

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    function createNewsCard(news) {
        return `
            <article class="news-card">
                <div class="news-card-header">
                    <span class="news-date">${formatDate(news.date)}</span>
                    <h3>${news.title}</h3>
                </div>
                <div class="news-card-body">
                    <p>${news.excerpt}</p>
                </div>
                <div class="news-card-footer">
                    <a href="noticia.html?id=${news.id}">Leer más</a>
                </div>
            </article>
        `;
    }

    function loadNews(limit = 6) {
        const newsContainer = document.getElementById('newsContainer');
        
        if (!newsContainer) return;

        // Ordenar por fecha descendente
        const sortedNews = newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Limitar número de noticias
        const newsToShow = sortedNews.slice(0, limit);
        
        // Generar HTML
        const newsHTML = newsToShow.map(news => createNewsCard(news)).join('');
        
        newsContainer.innerHTML = newsHTML;
    }

    // Cargar noticias al cargar la página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => loadNews());
    } else {
        loadNews();
    }

    // Exportar funciones para uso externo
    window.NewsManager = {
        loadNews,
        newsData
    };

})();

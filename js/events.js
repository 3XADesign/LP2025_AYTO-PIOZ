(function() {
    'use strict';

    // Base de datos de eventos
    const eventsData = [
        {
            id: 1,
            title: 'Fiestas de San Donato',
            date: '2025-08-24',
            time: 'Todo el día',
            location: 'Centro del municipio',
            description: 'Fiestas patronales en honor a San Donato con programa completo de actividades.',
            category: 'Festivo'
        },
        {
            id: 2,
            title: 'Jornadas Medievales del Castillo',
            date: '2025-06-13',
            time: '10:00 - 20:00',
            location: 'Castillo de Pioz',
            description: 'Revive la época medieval con mercado, espectáculos y visitas guiadas.',
            category: 'Cultural'
        },
        {
            id: 3,
            title: 'Fiestas de la Candelaria',
            date: '2025-02-02',
            time: '12:00',
            location: 'Iglesia de San Sebastián',
            description: 'Celebración tradicional de la Candelaria con misa y procesión.',
            category: 'Religioso'
        },
        {
            id: 4,
            title: 'Pleno Ordinario del Ayuntamiento',
            date: '2025-02-15',
            time: '18:00',
            location: 'Salón de Plenos',
            description: 'Sesión ordinaria del Pleno Municipal. Abierto al público.',
            category: 'Institucional'
        },
        {
            id: 5,
            title: 'Taller de Lectura Infantil',
            date: '2025-02-10',
            time: '17:00',
            location: 'Biblioteca Miguel de Cervantes',
            description: 'Actividad de fomento de la lectura para niños de 6 a 12 años.',
            category: 'Cultural'
        }
    ];

    function formatEventDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
        return { day, month };
    }

    function createEventCard(event) {
        const { day, month } = formatEventDate(event.date);
        
        return `
            <article class="event-card">
                <div class="event-date-box">
                    <div class="event-day">${day}</div>
                    <div class="event-month">${month}</div>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <div class="event-meta">
                        <span class="event-time">🕐 ${event.time}</span>
                        <span class="event-location">📍 ${event.location}</span>
                    </div>
                    <p>${event.description}</p>
                </div>
            </article>
        `;
    }

    function loadUpcomingEvents(limit = 5) {
        const eventsContainer = document.getElementById('eventsContainer');
        
        if (!eventsContainer) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filtrar eventos futuros y ordenar
        const upcomingEvents = eventsData
            .filter(event => new Date(event.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, limit);

        if (upcomingEvents.length === 0) {
            eventsContainer.innerHTML = '<p class="text-center">No hay eventos programados próximamente.</p>';
            return;
        }

        const eventsHTML = upcomingEvents.map(event => createEventCard(event)).join('');
        eventsContainer.innerHTML = eventsHTML;
    }

    function createCalendar(year, month) {
        // Implementación básica de calendario
        // Para producción, considerar librería como FullCalendar
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let calendarHTML = '<div class="calendar-grid">';
        
        // Encabezados de días
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        dayNames.forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });

        // Días vacíos al inicio
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasEvent = eventsData.some(event => event.date === dateString);
            const classes = hasEvent ? 'calendar-day has-event' : 'calendar-day';
            
            calendarHTML += `<div class="${classes}" data-date="${dateString}">${day}</div>`;
        }

        calendarHTML += '</div>';
        return calendarHTML;
    }

    // Cargar eventos al cargar la página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => loadUpcomingEvents());
    } else {
        loadUpcomingEvents();
    }

    // Exportar funciones
    window.EventsManager = {
        loadUpcomingEvents,
        createCalendar,
        eventsData
    };

})();

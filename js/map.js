(function() {
    'use strict';

    const mapElement = document.getElementById('map');
    
    if (!mapElement) return;

    // Coordenadas de Pioz
    const piozCoords = [40.46361, -3.29083];
    const castilloCoords = [40.46361, -3.29083]; // 40°27′49″N 3°17′27″W

    // Inicializar mapa
    const map = L.map('map').setView(piozCoords, 14);

    // Capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Marcador Ayuntamiento
    const ayuntamientoMarker = L.marker(piozCoords).addTo(map);
    ayuntamientoMarker.bindPopup(`
        <strong>Ayuntamiento de Pioz</strong><br>
        Plaza Mayor, s/n<br>
        19162 Pioz, Guadalajara<br>
        Tel: 949 272 076
    `);

    // Marcador Castillo
    const castilloMarker = L.marker(castilloCoords).addTo(map);
    castilloMarker.bindPopup(`
        <strong>Castillo de Pioz</strong><br>
        Monumento histórico del siglo XV
    `);

    // Centrar vista para mostrar ambos puntos
    const bounds = L.latLngBounds([piozCoords, castilloCoords]);
    map.fitBounds(bounds, { padding: [50, 50] });

})();

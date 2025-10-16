(function() {
    'use strict';

    // Diccionario de sinónimos para términos municipales
    const synonyms = {
        'alcalde': ['regidor', 'burgomaestre', 'edil'],
        'ayuntamiento': ['consistorio', 'municipio', 'concejo', 'corporación'],
        'impuesto': ['tasa', 'tributo', 'gravamen'],
        'certificado': ['documento', 'justificante', 'acreditación'],
        'empadronamiento': ['padrón', 'censo', 'alta padronal'],
        'basura': ['residuos', 'desperdicios', 'desechos'],
        'limpieza': ['higiene', 'saneamiento', 'aseo'],
        'multa': ['sanción', 'penalización'],
        'licencia': ['permiso', 'autorización'],
        'obras': ['construcción', 'edificación', 'reforma'],
        'urbanismo': ['planeamiento', 'ordenación urbana'],
        'biblioteca': ['mediateca', 'centro cultural'],
        'cita': ['turno', 'hora', 'cita previa'],
        'médico': ['doctor', 'sanitario', 'facultativo'],
        'escuela': ['colegio', 'centro educativo'],
        'deporte': ['deportivo', 'instalaciones deportivas'],
        'piscina': ['complejo acuático', 'zona de baño'],
        'parque': ['zona verde', 'jardín'],
        'fiesta': ['celebración', 'evento', 'festividad'],
        'bando': ['edicto', 'anuncio', 'comunicado'],
        'ordenanza': ['normativa', 'reglamento', 'regulación']
    };

    // Base de datos de contenido indexado (expandida y completa)
    const searchIndex = {
        noticias: [
            {
                id: 'n1',
                type: 'bando',
                category: 'Bandos',
                title: 'BANDO CORTE SAN DONATO 2025',
                content: 'Se comunica a todos los vecinos el corte de tráfico en varias calles del municipio con motivo de la celebración de las fiestas patronales de San Donato. Calles afectadas: Avenida Principal, Calle Mayor. Horario: sábado 24 de agosto desde las 10:00 hasta las 02:00',
                date: '2025-09-18',
                url: 'ayuntamiento/bandos.html?id=1',
                keywords: ['corte', 'tráfico', 'san donato', 'fiestas', 'calles', 'avenida', 'circulación', 'vial']
            },
            {
                id: 'n2',
                type: 'bando',
                category: 'Bandos',
                title: 'PROGRAMA SAN DONATO 2025',
                content: 'Ya disponible el programa completo de las fiestas patronales de San Donato 2025. Conciertos, verbenas, actividades infantiles, eventos deportivos',
                date: '2025-09-15',
                url: 'ayuntamiento/bandos.html?id=2',
                keywords: ['programa', 'fiestas', 'san donato', 'conciertos', 'actividades', 'ocio', 'cultura']
            },
            {
                id: 'n3',
                type: 'bando',
                category: 'Bandos',
                title: 'BANDO TRATAMIENTO MOSCAS Y MOSQUITOS',
                content: 'Información sobre el tratamiento preventivo contra moscas y mosquitos en el municipio. Tratamiento fumigación insecticida sanidad pública prevención plagas',
                date: '2025-09-10',
                url: 'ayuntamiento/bandos.html?id=3',
                keywords: ['tratamiento', 'moscas', 'mosquitos', 'fumigación', 'sanidad', 'plagas', 'insectos', 'salud pública']
            },
            {
                id: 'n4',
                type: 'noticia',
                category: 'Bandos',
                title: 'SCHOOL OF ROCK - ESCUELA DE MÚSICA',
                content: 'Abierto el plazo de inscripción para la Escuela Municipal de Música. Clases de guitarra piano batería canto',
                date: '2025-09-05',
                url: 'ayuntamiento/bandos.html?id=4',
                keywords: ['música', 'escuela', 'inscripción', 'cultura', 'clases', 'formación', 'enseñanza']
            },
            {
                id: 'n5',
                type: 'bando',
                category: 'Bandos',
                title: 'DESBROCE DE PARCELAS URBANAS',
                content: 'Recordatorio obligación mantener limpias desbrozadas parcelas urbanas terrenos solares limpieza vallado',
                date: '2024-08-25',
                url: 'ayuntamiento/bandos.html?id=6',
                keywords: ['desbroce', 'parcelas', 'limpieza', 'terrenos', 'solares', 'vallado', 'mantenimiento', 'urbanización']
            }
        ],
        ordenanzas: [
            {
                id: 'o1',
                type: 'ordenanza',
                category: 'Trámites',
                title: 'Ordenanza de Limpieza Urbana',
                content: 'Ordenanza reguladora de la limpieza urbana y recogida de residuos sólidos urbanos. Contenido del PDF: obligaciones ciudadanos horarios recogida basuras separación residuos reciclaje contenedores multas sanciones',
                date: '2024-01-01',
                url: 'tramites.html#ordenanzas',
                pdfUrl: '#',
                pdfContent: 'Artículo 1 Objeto alcance limpieza viaria recogida residuos sólidos urbanos Artículo 2 Definiciones residuos domésticos comerciales industriales Artículo 3 Obligaciones ciudadanos depositar basuras contenedores apropiados horarios establecidos Artículo 4 Recogida selectiva papel cartón vidrio envases orgánico Artículo 5 Prohibiciones ensuciar vía pública abandonar residuos Artículo 6 Régimen sancionador infracciones leves graves muy graves',
                keywords: ['limpieza', 'residuos', 'basuras', 'contenedores', 'reciclaje', 'recogida', 'higiene', 'saneamiento']
            },
            {
                id: 'o2',
                type: 'ordenanza',
                category: 'Trámites',
                title: 'Ordenanza Fiscal de Impuesto de Vehículos',
                content: 'Regulación del impuesto sobre vehículos de tracción mecánica IVTM. Contenido PDF: tipos gravamen coches motos furgonetas camiones exenciones bonificaciones pago fraccionado',
                date: '2024-01-01',
                url: 'tramites.html#ordenanzas',
                pdfUrl: '#',
                pdfContent: 'Artículo 1 Naturaleza hecho imponible titularidad vehículos motor Artículo 2 Cuotas tarifas según potencia fiscal cilindrada Artículo 3 Bonificaciones vehículos históricos eléctricos híbridos Artículo 4 Período impositivo devengo Artículo 5 Gestión liquidación pago fraccionamiento domiciliación Artículo 6 Infracciones sanciones tributarias',
                keywords: ['impuesto', 'vehículos', 'IVTM', 'coches', 'motos', 'tasas', 'pago', 'tributo', 'automóviles']
            },
            {
                id: 'o3',
                type: 'ordenanza',
                category: 'Trámites',
                title: 'Normas Urbanísticas de Pioz',
                content: 'Plan general de ordenación urbana y normas subsidiarias. Contenido PDF: planeamiento urbano clasificación suelo edificabilidad alturas licencias obras construcción vallado limpieza solares protección patrimonio',
                date: '2023-06-15',
                url: 'servicios.html#urbanismo',
                pdfUrl: '#',
                pdfContent: 'Título I Disposiciones generales ámbito aplicación Título II Clasificación calificación suelo urbano urbanizable rústico Título III Régimen edificación condiciones construcción alturas máximas retranqueos Título IV Licencias urbanísticas obras mayores menores Título V Protección legalidad urbanística inspección sanciones Título VI Catálogo edificios protegidos patrimonio histórico',
                keywords: ['urbanismo', 'planeamiento', 'licencias', 'obras', 'construcción', 'edificación', 'solares', 'suelo']
            },
            {
                id: 'o4',
                type: 'ordenanza',
                category: 'Trámites',
                title: 'Ordenanza de Vallado y Limpieza de Solares',
                content: 'Regulación obligaciones propietarios terrenos solares urbanos. Contenido PDF: vallado cerramiento limpieza desbroce maleza basuras escombros plazos sanciones',
                date: '2023-03-10',
                url: 'tramites.html#ordenanzas',
                pdfUrl: '#',
                pdfContent: 'Artículo 1 Obligación vallado cerramientos solares urbanos edificar Artículo 2 Características técnicas vallas alturas materiales Artículo 3 Limpieza desbroce periódico vegetación maleza Artículo 4 Prohibición acumulación escombros residuos Artículo 5 Inspección municipal requerimientos Artículo 6 Régimen sancionador multas ejecución subsidiaria',
                keywords: ['vallado', 'limpieza', 'solares', 'desbroce', 'cerramiento', 'terrenos', 'parcelas', 'mantenimiento']
            },
            {
                id: 'o5',
                type: 'ordenanza',
                category: 'Trámites',
                title: 'Ordenanza Reguladora de Terrazas',
                content: 'Normativa ocupación vía pública con terrazas veladores mesas sillas establecimientos hostelería. Licencias temporales requisitos dimensiones horarios',
                date: '2024-03-01',
                url: 'tramites.html#ordenanzas',
                pdfUrl: '#',
                pdfContent: 'Artículo 1 Objeto ámbito aplicación terrazas veladores Artículo 2 Licencias ocupación vía pública temporales anuales Artículo 3 Condiciones instalación dimensiones mobiliario Artículo 4 Horarios apertura cierre Artículo 5 Tasas ocupación vía pública Artículo 6 Régimen sancionador',
                keywords: ['terrazas', 'veladores', 'hostelería', 'vía pública', 'licencias', 'bares', 'restaurantes']
            }
        ],
        institucional: [
            {
                id: 'i1',
                type: 'pagina',
                category: 'Ayuntamiento',
                title: 'Saludo del Alcalde Manuel López Carvajal',
                content: 'El alcalde da la bienvenida ciudadanos vecinos Pioz presenta gestión municipal transparencia participación ciudadana servicios electrónicos sede electrónica formación tecnología',
                date: '2024-07-01',
                url: 'ayuntamiento/saluda.html',
                keywords: ['alcalde', 'manuel lópez', 'saludo', 'bienvenida', 'transparencia', 'regidor']
            },
            {
                id: 'i2',
                type: 'pagina',
                category: 'Ayuntamiento',
                title: 'Equipo de Gobierno Municipal',
                content: 'Alcalde Manuel López Carvajal concejales Alejandro Porcar medio ambiente Susana Cisneros sanidad economía Hilario Fernández cultura Antonino Delgado tecnología Carlos Torre hacienda',
                date: '2024-07-01',
                url: 'ayuntamiento/equipo_gobierno.html',
                keywords: ['equipo', 'gobierno', 'concejales', 'alcalde', 'delegaciones', 'corporación', 'ediles']
            },
            {
                id: 'i3',
                type: 'pagina',
                category: 'Cultura',
                title: 'Biblioteca Municipal Miguel de Cervantes',
                content: 'Horarios lunes martes miércoles jueves viernes servicios préstamo consulta sala internet ordenadores wifi reprografía apoyo gestiones',
                date: '2024-01-01',
                url: 'cultura.html#biblioteca',
                keywords: ['biblioteca', 'horarios', 'préstamo', 'libros', 'internet', 'wifi', 'mediateca', 'lectura']
            },
            {
                id: 'i4',
                type: 'pagina',
                category: 'Villa',
                title: 'Castillo de Pioz Historia Patrimonio',
                content: 'Historia Castillo Pioz monumento medieval siglo XV arquitectura militar guardianes castillo visitas turismo patrimonio cultural',
                date: '2024-01-01',
                url: 'villa.html#castillo',
                keywords: ['castillo', 'historia', 'medieval', 'patrimonio', 'turismo', 'visitas', 'monumento', 'cultural']
            },
            {
                id: 'i5',
                type: 'pagina',
                category: 'Ayuntamiento',
                title: 'Perfil del Contratante Licitaciones',
                content: 'Transparencia contratos públicos licitaciones adjudicaciones procedimientos abiertos concursos perfil contratante LCSP',
                date: '2024-01-01',
                url: 'ayuntamiento/perfil_contratante.html',
                keywords: ['contratante', 'licitaciones', 'contratos', 'adjudicaciones', 'transparencia', 'concursos']
            },
            {
                id: 'i6',
                type: 'pagina',
                category: 'Ayuntamiento',
                title: 'Portal de Transparencia Municipal',
                content: 'Acceso información pública datos abiertos presupuestos cuentas anuales retribuciones personal contratos subvenciones',
                date: '2024-01-01',
                url: 'ayuntamiento/transparencia.html',
                keywords: ['transparencia', 'datos', 'presupuestos', 'información', 'pública', 'cuentas']
            }
        ],
        plenos: [
            {
                id: 'p1',
                type: 'pleno',
                category: 'Plenos',
                title: 'Pleno Ordinario Enero 2025',
                content: 'Sesión ordinaria plenaria aprobación presupuesto municipal 2025 ordenanzas fiscales modificación urbanismo mociones',
                date: '2025-01-28',
                url: 'ayuntamiento/plenos_ayuntamiento.html?id=1',
                keywords: ['pleno', 'sesión', 'presupuesto', 'ordenanzas', 'acta', 'corporación']
            },
            {
                id: 'p2',
                type: 'pleno',
                category: 'Plenos',
                title: 'Pleno Extraordinario Presupuestos 2025',
                content: 'Sesión extraordinaria debate aprobación inicial presupuesto general ejercicio 2025 bases ejecución plantilla personal',
                date: '2024-12-15',
                url: 'ayuntamiento/plenos_ayuntamiento.html?id=2',
                keywords: ['pleno', 'extraordinario', 'presupuestos', 'debate', 'aprobación', 'cuentas']
            },
            {
                id: 'p3',
                type: 'pleno',
                category: 'Plenos',
                title: 'Pleno Ordinario Noviembre 2024',
                content: 'Sesión ordinaria aprobación modificaciones ordenanzas municipales proyecto obras mejora infraestructuras mociones grupos políticos',
                date: '2024-11-25',
                url: 'ayuntamiento/plenos_ayuntamiento.html?id=3',
                keywords: ['pleno', 'sesión', 'ordenanzas', 'obras', 'infraestructuras', 'mociones']
            }
        ],
        servicios: [
            {
                id: 's1',
                type: 'servicio',
                category: 'Servicios',
                title: 'Servicio de Sanidad Centro Salud',
                content: 'Centro salud atención primaria médicos familia pediatras enfermería citas previas urgencias horarios',
                date: '2024-01-01',
                url: 'servicios.html#sanidad',
                keywords: ['sanidad', 'salud', 'médicos', 'centro salud', 'citas', 'urgencias', 'doctor', 'enfermería']
            },
            {
                id: 's2',
                type: 'servicio',
                category: 'Servicios',
                title: 'Servicio de Urbanismo Licencias Obras',
                content: 'Licencias urbanísticas obras mayores menores consultas urbanísticas planeamiento construcción edificación',
                date: '2024-01-01',
                url: 'servicios.html#urbanismo',
                keywords: ['urbanismo', 'licencias', 'obras', 'construcción', 'planeamiento', 'permisos', 'edificación']
            },
            {
                id: 's3',
                type: 'servicio',
                category: 'Servicios',
                title: 'Protección Civil Emergencias',
                content: 'Servicio protección civil emergencias 112 seguridad ciudadana plan emergencias municipal',
                date: '2024-01-01',
                url: 'servicios.html#proteccion-civil',
                keywords: ['protección civil', 'emergencias', '112', 'seguridad', 'urgencias', 'emergencia']
            },
            {
                id: 's4',
                type: 'servicio',
                category: 'Servicios',
                title: 'Instalaciones Deportivas Pabellón Piscina',
                content: 'Pabellón polideportivo piscina municipal instalaciones deportivas horarios actividades reservas abonos',
                date: '2024-01-01',
                url: 'servicios.html#deportes',
                keywords: ['deportes', 'pabellón', 'piscina', 'instalaciones', 'polideportivo', 'actividades']
            },
            {
                id: 's5',
                type: 'servicio',
                category: 'Servicios',
                title: 'Recogida de Residuos y Limpieza',
                content: 'Servicio recogida selectiva residuos basuras contenedores puntos limpios limpieza viaria horarios',
                date: '2024-01-01',
                url: 'servicios.html#limpieza',
                keywords: ['limpieza', 'residuos', 'basuras', 'contenedores', 'reciclaje', 'recogida', 'punto limpio']
            }
        ],
        tramites: [
            {
                id: 't1',
                type: 'tramite',
                category: 'Trámites',
                title: 'Sede Electrónica Trámites Online',
                content: 'Sede electrónica gestiones telemáticas certificado digital clave formularios online registro electrónico 24 horas',
                date: '2024-01-01',
                url: 'tramites/sede_electronica.html',
                keywords: ['sede electrónica', 'trámites', 'online', 'certificado', 'registro', 'digital', 'telemático']
            },
            {
                id: 't2',
                type: 'tramite',
                category: 'Trámites',
                title: 'Certificado de Empadronamiento',
                content: 'Solicitud certificado empadronamiento padrón municipal habitantes alta padronal cambio domicilio',
                date: '2024-01-01',
                url: 'tramites.html#impresos',
                keywords: ['empadronamiento', 'padrón', 'certificado', 'domicilio', 'censo', 'alta padronal']
            },
            {
                id: 't3',
                type: 'tramite',
                category: 'Trámites',
                title: 'Licencia de Obras Mayor y Menor',
                content: 'Solicitud licencia obras mayores menores construcción reforma ampliación documentación requisitos tasas',
                date: '2024-01-01',
                url: 'tramites.html#impresos',
                keywords: ['licencia', 'obras', 'construcción', 'reforma', 'permiso', 'autorización', 'edificación']
            },
            {
                id: 't4',
                type: 'tramite',
                category: 'Trámites',
                title: 'Solicitud de Ayudas y Subvenciones',
                content: 'Información convocatorias ayudas subvenciones municipales requisitos plazos documentación',
                date: '2024-01-01',
                url: 'tramites.html#impresos',
                keywords: ['ayudas', 'subvenciones', 'becas', 'convocatoria', 'solicitud']
            }
        ]
    };

    // Expandir consultas con sinónimos
    function expandQueryWithSynonyms(queryWords) {
        const expandedWords = new Set(queryWords);
        
        queryWords.forEach(word => {
            Object.keys(synonyms).forEach(key => {
                if (normalizeText(key) === word) {
                    synonyms[key].forEach(syn => expandedWords.add(normalizeText(syn)));
                } else if (synonyms[key].some(syn => normalizeText(syn) === word)) {
                    expandedWords.add(normalizeText(key));
                    synonyms[key].forEach(syn => expandedWords.add(normalizeText(syn)));
                }
            });
        });
        
        return Array.from(expandedWords);
    }

    // Calcular distancia de Levenshtein para fuzzy search
    function levenshteinDistance(a, b) {
        const matrix = [];
        
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[b.length][a.length];
    }

    // Sugerencia ortográfica mejorada
    function getSuggestion(query) {
        const allWords = [];
        Object.values(searchIndex).forEach(category => {
            category.forEach(item => {
                const words = [...item.title.split(' '), ...item.content.split(' '), ...(item.keywords || [])];
                allWords.push(...words.filter(w => w.length > 3));
            });
        });
        
        // Añadir palabras del diccionario de sinónimos
        Object.keys(synonyms).forEach(key => {
            allWords.push(key);
            allWords.push(...synonyms[key]);
        });
        
        const uniqueWords = [...new Set(allWords.map(w => normalizeText(w)))];
        const normalizedQuery = normalizeText(query);
        
        let bestMatch = null;
        let bestDistance = Infinity;
        
        uniqueWords.forEach(word => {
            const distance = levenshteinDistance(normalizedQuery, word);
            if (distance < bestDistance && distance <= 2 && distance > 0) {
                bestDistance = distance;
                bestMatch = word;
            }
        });
        
        return bestMatch;
    }

    // Función para normalizar texto
    function normalizeText(text) {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, ' ')
            .trim();
    }

    // Función para resaltar términos
    function highlightText(text, query) {
        const words = query.split(' ').filter(w => w.length > 2);
        let result = text;
        words.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        });
        return result;
    }

    // Crear snippet contextual mejorado
    function createSnippet(content, pdfContent, query, maxLength = 180) {
        const fullText = content + ' ' + (pdfContent || '');
        const normalizedContent = fullText.toLowerCase();
        const normalizedQuery = query.toLowerCase();
        const queryWords = normalizedQuery.split(' ').filter(w => w.length > 2);
        
        // Buscar la primera coincidencia de cualquier palabra
        let bestIndex = -1;
        let bestWord = '';
        
        queryWords.forEach(word => {
            const index = normalizedContent.indexOf(word);
            if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
                bestIndex = index;
                bestWord = word;
            }
        });
        
        if (bestIndex === -1) {
            return fullText.substring(0, maxLength) + '...';
        }
        
        const start = Math.max(0, bestIndex - 60);
        const end = Math.min(fullText.length, bestIndex + maxLength);
        const snippet = fullText.substring(start, end);
        
        return (start > 0 ? '...' : '') + snippet + (end < fullText.length ? '...' : '');
    }

    // Calcular relevancia con ponderación mejorada
    function calculateRelevance(item, normalizedQuery, queryWords) {
        let relevance = 0;
        const currentDate = new Date();
        const itemDate = new Date(item.date);
        const ageInDays = (currentDate - itemDate) / (1000 * 60 * 60 * 24);
        
        const normalizedTitle = normalizeText(item.title);
        const normalizedContent = normalizeText(item.content);
        const normalizedPdfContent = normalizeText(item.pdfContent || '');
        const normalizedKeywords = (item.keywords || []).map(k => normalizeText(k)).join(' ');
        
        // Coincidencia exacta en título (peso máximo)
        if (normalizedTitle === normalizedQuery) {
            relevance += 100;
        }
        
        // Coincidencia exacta de frase en título
        if (normalizedTitle.includes(normalizedQuery)) {
            relevance += 80;
        }
        
        // Palabras individuales en título (peso alto)
        queryWords.forEach(word => {
            if (normalizedTitle.includes(word)) {
                relevance += 25;
                // Bonus si la palabra está al inicio del título
                if (normalizedTitle.startsWith(word)) {
                    relevance += 10;
                }
            }
        });
        
        // Palabras en keywords (peso alto)
        queryWords.forEach(word => {
            if (normalizedKeywords.includes(word)) {
                relevance += 20;
            }
        });
        
        // Palabras en contenido principal con frecuencia
        queryWords.forEach(word => {
            const count = (normalizedContent.match(new RegExp(word, 'g')) || []).length;
            relevance += Math.min(count * 10, 40); // Máximo 40 puntos por palabra
        });
        
        // Palabras en PDF (peso medio)
        queryWords.forEach(word => {
            const count = (normalizedPdfContent.match(new RegExp(word, 'g')) || []).length;
            relevance += Math.min(count * 8, 32); // Máximo 32 puntos por palabra
        });
        
        // Bonus por tipo de contenido prioritario
        if (item.category === 'Trámites') relevance += 15;
        if (item.category === 'Bandos') relevance += 12;
        if (item.type === 'bando') relevance += 10;
        if (item.type === 'tramite') relevance += 10;
        
        // Bonus por frescura (contenido reciente)
        if (ageInDays < 30) {
            relevance += 20;
        } else if (ageInDays < 90) {
            relevance += 15;
        } else if (ageInDays < 365) {
            relevance += 10;
        }
        
        // Penalización por contenido muy antiguo (más de 2 años)
        if (ageInDays > 730) {
            relevance -= 5;
        }
        
        return Math.max(relevance, 0);
    }

    // Función de búsqueda mejorada
    function search(query, filters = {}) {
        if (!query || query.trim().length < 2) {
            return { results: [], suggestion: null };
        }

        const normalizedQuery = normalizeText(query);
        const queryWords = normalizedQuery.split(' ').filter(w => w.length > 2);
        
        // Expandir búsqueda con sinónimos
        const expandedWords = expandQueryWithSynonyms(queryWords);
        
        const results = [];
        let suggestion = null;

        // Buscar en todas las categorías
        Object.keys(searchIndex).forEach(category => {
            searchIndex[category].forEach(item => {
                const normalizedTitle = normalizeText(item.title);
                const normalizedContent = normalizeText(item.content);
                const normalizedPdfContent = normalizeText(item.pdfContent || '');
                const normalizedKeywords = (item.keywords || []).map(k => normalizeText(k)).join(' ');
                
                const searchableText = `${normalizedTitle} ${normalizedContent} ${normalizedPdfContent} ${normalizedKeywords}`;
                
                let hasMatch = false;
                expandedWords.forEach(word => {
                    if (searchableText.includes(word)) {
                        hasMatch = true;
                    }
                });
                
                if (!hasMatch) return;
                
                // Aplicar filtros
                if (filters.category && item.category !== filters.category) return;
                if (filters.type && item.type !== filters.type) return;
                if (filters.year) {
                    const itemYear = new Date(item.date).getFullYear();
                    if (itemYear !== parseInt(filters.year)) return;
                }
                
                const relevance = calculateRelevance(item, normalizedQuery, expandedWords);
                
                if (relevance > 0) {
                    results.push({
                        ...item,
                        relevance,
                        snippet: createSnippet(item.content, item.pdfContent, normalizedQuery)
                    });
                }
            });
        });

        // Ordenar resultados por relevancia (descendente) y fecha (descendente)
        results.sort((a, b) => {
            if (b.relevance !== a.relevance) {
                return b.relevance - a.relevance;
            } else {
                return new Date(b.date) - new Date(a.date);
            }
        });

        // Limitar resultados a 15
        results.splice(15);

        // Sugerencia de corrección ortográfica
        if (results.length === 0) {
            suggestion = getSuggestion(query);
        }

        return { results, suggestion };
    }

    // Gestión del historial de búsquedas
    function saveSearchHistory(query) {
        if (!query || query.trim().length < 2) return;
        
        try {
            let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            
            // Evitar duplicados
            history = history.filter(item => item.query !== query);
            
            // Añadir nueva búsqueda
            history.unshift({
                query: query,
                timestamp: new Date().toISOString()
            });
            
            // Limitar a 10 búsquedas
            history = history.slice(0, 10);
            
            localStorage.setItem('searchHistory', JSON.stringify(history));
        } catch (e) {
            console.error('Error guardando historial:', e);
        }
    }

    function getSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('searchHistory') || '[]');
        } catch (e) {
            return [];
        }
    }

    function clearSearchHistory() {
        try {
            localStorage.removeItem('searchHistory');
        } catch (e) {
            console.error('Error limpiando historial:', e);
        }
    }

    // Overlay de búsqueda
    function openSearch() {
        const overlay = document.getElementById('searchOverlay');
        if (!overlay) return;
        
        const input = overlay.querySelector('input[type="search"]');
        overlay.classList.add('active');
        
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }

    function closeSearch() {
        const overlay = document.getElementById('searchOverlay');
        if (!overlay) return;
        
        overlay.classList.remove('active');
    }

    // Manejar envío del formulario de búsqueda
    function handleSearchSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const input = form.querySelector('input[type="search"]');
        
        if (!input) return;
        
        const query = input.value.trim();
        
        if (query.length >= 2) {
            // Guardar en historial
            saveSearchHistory(query);
            
            // Guardar búsqueda en sessionStorage
            sessionStorage.setItem('searchQuery', query);
            
            // Determinar la ruta correcta a busqueda.html según ubicación actual
            const currentPath = window.location.pathname;
            let searchPageUrl = 'busqueda.html';
            
            // Si estamos en una subcarpeta, usar ruta relativa
            if (currentPath.includes('/ayuntamiento/') || 
                currentPath.includes('/tramites/') || 
                currentPath.includes('/servicios/') ||
                currentPath.includes('/cultura/') ||
                currentPath.includes('/villa/')) {
                searchPageUrl = '../busqueda.html';
            }
            
            // Redirigir a página de resultados
            window.location.href = searchPageUrl;
        }
    }

    // Inicializar eventos
    function init() {
        // Botón de búsqueda en header
        const searchToggle = document.querySelector('.search-toggle');
        if (searchToggle) {
            searchToggle.addEventListener('click', function(e) {
                e.preventDefault();
                openSearch();
            });
        }

        // Botón cerrar búsqueda
        const searchClose = document.querySelector('.search-close');
        if (searchClose) {
            searchClose.addEventListener('click', function(e) {
                e.preventDefault();
                closeSearch();
            });
        }

        // Cerrar con overlay
        const searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay) {
            searchOverlay.addEventListener('click', function(e) {
                if (e.target === searchOverlay) {
                    closeSearch();
                }
            });
        }

        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });

        // Formulario de búsqueda
        const searchForms = document.querySelectorAll('.search-form');
        searchForms.forEach(form => {
            form.addEventListener('submit', handleSearchSubmit);
        });
    }

    // Exportar funciones
    window.SearchEngine = {
        search,
        normalizeText,
        highlightText,
        openSearch,
        closeSearch,
        getSearchHistory,
        clearSearchHistory,
        getSuggestion
    };

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

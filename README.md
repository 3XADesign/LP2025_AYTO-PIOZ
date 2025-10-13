Ayuntamiento de Pioz - Sitio estático

Estructura:
- index.html - Página principal con secciones y plantilla base
- css/styles.css - Estilos con variables para paleta inspirada en teja/mampostería
- js/app.js - Lógica para cargar noticias, eventos y mapa
- data/news.json - Datos simulados (noticias, eventos, equipo, puntos de mapa)

Para probar localmente:
1. Abrir `index.html` en un navegador (algunas APIs fetch requieren servidor local). Recomendado levantar un servidor local: 

PowerShell:

```powershell
# desde la carpeta del proyecto
python -m http.server 8000; Start-Process http://localhost:8000
```

O con Node.js (http-server):

```powershell
npx http-server -p 8000; Start-Process http://localhost:8000
```

Notas:
- El mapa usa Leaflet y OpenStreetMap.
- Los datos son simulados en `data/news.json`. Reemplaza por tu API cuando esté disponible.
- Coordenadas y horarios se han inferido a partir del contenido proporcionado.

Mejoras sugeridas:
- Páginas internas separadas por cada sección (trámites, servicios) y un CMS ligero.
- Formularios de contacto con validación y eID/NIF integración para la Sede Electrónica.
- Sistema de roles y administrador para gestionar las noticias desde una interfaz.

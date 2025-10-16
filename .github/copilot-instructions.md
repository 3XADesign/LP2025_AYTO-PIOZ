# Copilot Instructions - Ayuntamiento de Pioz Website

## Project Overview
Static municipal website for Ayuntamiento de Pioz (Guadalajara, Spain) built with vanilla HTML, CSS, and JavaScript. No build process, no frameworks - pure web fundamentals for maximum accessibility and simplicity.

## Architecture & Components

### Component System (Header/Footer)
- **Dynamic injection pattern**: `header.js` and `footer.js` generate HTML via IIFEs and inject into `<div id="header-placeholder">` and `<div id="footer-placeholder">`
- **Path resolution**: `getBasePath()` detects subfolder depth (`/ayuntamiento/`, `/servicios/`, etc.) to correctly resolve relative paths (`../` prefix)
- **Event dispatch**: `header.js` fires `headerLoaded` event when ready, consumed by `navigation.js` to avoid race conditions
- Files: `components/header.js`, `components/footer.js`

### Navigation System
- Mobile: Hamburger menu with `<button class="nav-toggle">` toggling `.nav-list.active`
- Nested submenus: `.has-submenu` class with `.submenu` children - click to expand on mobile
- Active state: `markActiveLinks()` compares `window.location.pathname` with href attributes
- Guard pattern: `navigationInitialized` flag prevents double-initialization
- Files: `js/navigation.js`

### Search Engine (Client-Side)
- **In-memory index**: `searchIndex` object categorizes content (noticias, ordenanzas, institucional, plenos, servicios, tramites)
- **Synonym expansion**: `synonyms` dictionary maps municipal terms (e.g., 'alcalde' → 'regidor', 'burgomaestre')
- **Fuzzy matching**: Levenshtein distance for typo suggestions (max distance: 2)
- **Relevance scoring**: Weighted by title match (100pts), keywords (20pts), content frequency (10pts/match), recency (20pts < 30 days), and content type priority
- **Search flow**: User submits → `sessionStorage.setItem('searchQuery')` → redirect to `busqueda.html` → retrieve query → execute search → render results
- Files: `js/search-engine.js`, `busqueda.html`

### Theme System (Light/Dark Mode)
- **CSS variables**: All colors defined in `:root` and `[data-theme="dark"]` in `theme.css`
- **Persistence**: `localStorage.getItem('pioz-theme-preference')` stores user choice, falls back to `prefers-color-scheme`
- **FOUC prevention**: `initializeThemeEarly()` runs before DOM ready to set `data-theme` attribute immediately
- **Logo switching**: `updateLogo()` swaps `escudo_ayuntamiento.png` ↔ `escudo_ayuntamientoOscuro.png` based on theme
- **Toggle button**: Dynamically injected into `.header-actions` by `theme-toggle.js`
- Files: `js/theme-toggle.js`, `css/theme.css`

### Data Loading Pattern
- **Mock data arrays**: `newsData`, `eventsData` defined in respective JS files (simulate API responses)
- **Auto-loading**: IIFE executes on DOMContentLoaded, finds container by ID, generates HTML via `map()`, injects with `innerHTML`
- Example: `news.js` → `newsContainer` → `createNewsCard()` → sort by date descending → render top 6
- Files: `js/news.js`, `js/events.js`, `js/bandos.js`, `js/plenos.js`

## File Structure Conventions

### HTML Structure
```
Root level: Main section pages (index.html, ayuntamiento.html, servicios.html, etc.)
Subfolders: Detailed pages by category (ayuntamiento/bandos.html, servicios/sanidad.html)
```

### Required HTML boilerplate for new pages
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="[path]/css/theme.css">
    <link rel="stylesheet" href="[path]/css/styles.css">
    <link rel="stylesheet" href="[path]/css/components.css">
</head>
<body>
    <div id="header-placeholder"></div>
    <main id="main-content">
        <!-- Content here -->
    </main>
    <div id="footer-placeholder"></div>
    <script src="[path]/components/header.js"></script>
    <script src="[path]/components/footer.js"></script>
    <script src="[path]/js/theme-toggle.js"></script>
    <script src="[path]/js/search-engine.js"></script>
    <script src="[path]/js/navigation.js"></script>
</body>
</html>
```

### CSS Organization
- `theme.css`: Color variables, light/dark mode definitions
- `styles.css`: Global typography, layout utilities, section styles
- `components.css`: Reusable component styles (cards, buttons, forms)
- **Inline styles**: Acceptable for page-specific layouts (see `busqueda.html`, `bandos.html`)

## Key Patterns & Conventions

### Path Resolution
Always use `getBasePath()` pattern when referencing assets from components:
```javascript
const path = window.location.pathname;
if (path.includes('/ayuntamiento/') || path.includes('/servicios/') /* ... */) {
    return '../';
}
return '';
```

### IIFE Module Pattern
All JS files wrap code in `(function() { 'use strict'; /* ... */ })();` to avoid global scope pollution. Export public APIs via `window.ModuleName = { ... }`

### Initialization Safety
Check for element existence before attaching listeners:
```javascript
const element = document.querySelector('.target');
if (!element) return; // Guard clause
element.addEventListener('click', handler);
```

### Spanish Localization
- Language: `lang="es"` attribute on `<html>`
- Date formatting: `toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })`
- Content: All text in Spanish, municipal terminology (bandos, plenos, empadronamiento, etc.)

## Development Workflow

### Testing Changes
1. No build step - open HTML files directly in browser
2. Test navigation across folder depths (root vs. subfolder pages)
3. Verify theme toggle persists across page navigation
4. Test search functionality: type query → check sessionStorage → verify redirect → confirm results render

### Adding New Content
- **New page**: Copy existing page structure, adjust `[path]` prefixes for CSS/JS includes
- **New navigation item**: Update `header.js` nav list (add to parent `.submenu` or root `.nav-list`)
- **New search content**: Add entry to appropriate category in `searchIndex` (js/search-engine.js) with `title`, `content`, `keywords`, `url`, `date`

### Common Pitfalls
- **Relative paths**: Always test pages from subfolders - missing `../` prefix breaks assets
- **Race conditions**: Navigation/search depend on header loading - use `headerLoaded` event or `setTimeout` fallback
- **Theme flicker**: Apply theme in `initializeThemeEarly()` *before* DOMContentLoaded to prevent FOUC

## Color Palette (Terracotta/Adobe Theme)
```css
--color-primary: #b85c4e (terracotta red)
--color-teja-ocre: #c07854 (ochre tile)
--bg-primary: #faf8f5 (warm beige)
--bg-tertiary: #e8dcc8 (sand)
```
Use these variables in new components - never hardcode colors.

## Accessibility Features
- Skip links: `<a href="#main-content" class="skip-link">` on every page
- ARIA labels: Navigation buttons, search forms, theme toggle
- Semantic HTML: `<main>`, `<nav>`, `<section>`, `<article>`
- Focus states: All interactive elements have visible `:focus` outlines

## Key Files Reference
- **Entry point**: `index.html`
- **Global components**: `components/header.js`, `components/footer.js`
- **Core utilities**: `js/search-engine.js`, `js/theme-toggle.js`, `js/navigation.js`
- **Theme definitions**: `css/theme.css`

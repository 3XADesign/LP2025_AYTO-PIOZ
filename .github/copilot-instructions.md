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

### Responsive Design System (Mobile-First)
- **Mobile-first approach**: Base styles for 320px+, enhanced progressively
- **Breakpoints**: 768px (tablet), 1024px (desktop-sm), 1280px (desktop-lg), 1920px (desktop-xl)
- **CSS Variables**: Spacing system with `--spacing-xs` through `--spacing-2xl`
- **Touch-friendly**: Minimum 44x44px tap targets for all interactive elements
- **Fluid typography**: Using `clamp()` for responsive font sizing
- **Grid layouts**: Cards adapt from 1 → 2 → 3 columns based on viewport
- **Table responsive**: Tables convert to cards on mobile using `data-label` attributes
- **Navigation**: Hamburger menu on mobile, horizontal nav on desktop (1024px+)
- File: `css/responsive.css`

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
- `responsive.css`: **NEW** Mobile-first responsive styles, breakpoints, page-specific adaptations
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

### Responsive Design Patterns

**Breakpoint Usage:**
```css
/* Mobile-first base (no media query needed) */
.element { /* styles for 320px+ */ }

/* Tablet (768px+) */
@media (min-width: 768px) { }

/* Desktop Small (1024px+) */
@media (min-width: 1024px) { }

/* Desktop Large (1280px+) */
@media (min-width: 1280px) { }
```

**Grid Patterns:**
```css
/* Standard responsive grid */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile */
  gap: var(--spacing-md);
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet */
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop */
  }
}
```

**Touch-Friendly Elements:**
- All buttons/links: `min-height: 44px`, `min-width: 44px`
- Form inputs: `font-size: 16px` (prevents iOS zoom)
- Navigation items: `min-height: 48px` on mobile
- Adequate spacing between tappable elements (min 8px)

**Table Responsive Pattern:**
```html
<div class="table-responsive">
  <table>
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="Column 1">Value 1</td>
        <td data-label="Column 2">Value 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Utility Classes:**
- `.hide-mobile` - Hidden on mobile, visible 768px+
- `.hide-tablet` - Hidden on tablet (768-1023px)
- `.hide-desktop` - Hidden on desktop 1024px+
- `.text-center`, `.text-left`, `.text-right`
- `.mt-{0-3}`, `.mb-{0-3}`, `.p-{0-3}` - Margin/padding utilities

## Development Workflow

### Testing Changes
1. No build step - open HTML files directly in browser
2. Test navigation across folder depths (root vs. subfolder pages)
3. Verify theme toggle persists across page navigation
4. Test search functionality: type query → check sessionStorage → verify redirect → confirm results render
5. **NEW: Test responsive design**:
   - Use Chrome DevTools Device Toolbar (Ctrl+Shift+M)
   - Test breakpoints: 375px (iPhone), 768px (iPad), 1024px (Desktop), 1920px (Large Desktop)
   - Verify hamburger menu works correctly on mobile
   - Check tables convert to cards on mobile
   - Ensure all interactive elements are touch-friendly (44x44px minimum)

### Adding New Content
- **New page**: Copy existing page structure, adjust `[path]` prefixes for CSS/JS includes
- **New navigation item**: Update `header.js` nav list (add to parent `.submenu` or root `.nav-list`)
- **New search content**: Add entry to appropriate category in `searchIndex` (js/search-engine.js) with `title`, `content`, `keywords`, `url`, `date`

### Adding Responsive Styles
- **For new components**: Start with mobile styles (no media query)
- **Progressive enhancement**: Add tablet/desktop styles in respective media queries
- **Use spacing variables**: `var(--spacing-sm)` instead of hardcoded pixels
- **Test at all breakpoints**: Ensure smooth transitions between layouts

### Common Pitfalls
- **Relative paths**: Always test pages from subfolders - missing `../` prefix breaks assets
- **Race conditions**: Navigation/search depend on header loading - use `headerLoaded` event or `setTimeout` fallback
- **Theme flicker**: Apply theme in `initializeThemeEarly()` *before* DOMContentLoaded to prevent FOUC
- **NEW: Mobile viewport**: Always include `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`
- **NEW: iOS zoom prevention**: Use `font-size: 16px` minimum on form inputs
- **NEW: Table data-labels**: Don't forget `data-label` attributes when adding table cells

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
- **NEW: Responsive styles**: `css/responsive.css`

## Responsive Design Guidelines

### Mobile-First Principles
1. **Start mobile**: Design and code for mobile devices first (320px base)
2. **Progressive enhancement**: Add features/styles for larger screens
3. **Content priority**: Most important content visible without scrolling on mobile
4. **Touch targets**: 44x44px minimum for all tappable elements
5. **Performance**: Optimize images, minimize reflows, use CSS transforms

### Layout Strategies
- **Single column on mobile**: Stack content vertically
- **Multi-column on tablet**: 2-column grids (768px+)
- **Full layout on desktop**: 3-4 column grids (1024px+)
- **Max-width containers**: `1200px` default, `1400px` on XL screens

### Typography Scale
- **Mobile base**: 16px (1rem)
- **Tablet**: 17px (increases line-height to 1.6)
- **Desktop**: 18px
- **Fluid headings**: Use `clamp()` for automatic scaling

### Component Adaptations
- **Header**: Logo 40px → 50px → 60px
- **Footer**: 1 column → 2 columns → 4 columns
- **Cards**: 1 column → 2 columns → 3 columns
- **Forms**: Vertical → 2-column grid on tablet
- **Navigation**: Hamburger menu → horizontal nav at 1024px

### Testing Checklist
- [ ] All pages load correctly on mobile (320px-767px)
- [ ] Tablet layout works (768px-1023px)
- [ ] Desktop layout displays properly (1024px+)
- [ ] Navigation menu functions correctly at all breakpoints
- [ ] Tables are readable on mobile (card layout)
- [ ] Forms are usable on mobile (no iOS zoom)
- [ ] Images scale properly without breaking layout
- [ ] Touch targets are adequate (min 44x44px)
- [ ] No horizontal scrolling at any breakpoint
- [ ] Theme toggle works across all sizes
- [ ] Search functionality works on mobile
- [ ] Print styles render correctly

### Browser Support
- **Primary**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Android 90+, Samsung Internet 14+
- **Graceful degradation**: Older browsers get functional but simplified layout

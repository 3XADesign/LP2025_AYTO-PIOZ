# Guía de Diseño Responsive - Ayuntamiento de Pioz

## 📱 Visión General

Este documento describe la implementación del diseño responsive mobile-first del sitio web del Ayuntamiento de Pioz.

## 🎯 Objetivos

- **Accesibilidad universal**: Experiencia óptima en todos los dispositivos
- **Performance**: Carga rápida incluso en conexiones móviles lentas
- **Usabilidad táctil**: Elementos interactivos diseñados para touch
- **Progresive Enhancement**: Desde móvil hacia desktop

## 📐 Breakpoints

| Nombre | Min Width | Dispositivos Típicos | Layout Principal |
|--------|-----------|---------------------|------------------|
| **Mobile** | - | 320px - 767px | iPhone SE, Samsung Galaxy | 1 columna |
| **Tablet** | 768px | 768px - 1023px | iPad, Android tablets | 2 columnas |
| **Desktop Small** | 1024px | 1024px - 1279px | Laptops, iPad Pro | 3 columnas |
| **Desktop Large** | 1280px | 1280px - 1919px | Desktop monitors | Full layout |
| **Desktop XL** | 1920px | 1920px+ | Large monitors | Expanded layout |

## 🎨 Sistema de Espaciado

Variables CSS definidas en `responsive.css`:

```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 1rem;     /* 16px */
--spacing-md: 1.5rem;   /* 24px */
--spacing-lg: 2rem;     /* 32px */
--spacing-xl: 3rem;     /* 48px */
--spacing-2xl: 4rem;    /* 64px */
```

### Uso Recomendado

- **xs**: Padding interno de componentes pequeños
- **sm**: Gap entre elementos relacionados
- **md**: Margin entre secciones
- **lg**: Padding de contenedores
- **xl**: Separación de secciones mayores
- **2xl**: Padding vertical de páginas

## 🔤 Tipografía Responsive

### Escala Base

| Elemento | Móvil | Tablet | Desktop |
|----------|-------|--------|---------|
| `html` | 16px | 17px | 18px |
| `h1` | 28px | 40px | 56px (clamp) |
| `h2` | 24px | 32px | 40px (clamp) |
| `h3` | 20px | 24px | 28px (clamp) |
| `body` | 16px | 17px | 18px |

### Line-Height

- **Móvil**: 1.5 (legibilidad en pantallas pequeñas)
- **Tablet**: 1.6
- **Desktop**: 1.6

## 🧩 Componentes Principales

### Header / Navegación

#### Móvil (< 1024px)
- Logo: 40px altura
- Hamburger menu visible
- Menú desplegable vertical
- Search toggle en header-actions

#### Desktop (≥ 1024px)
- Logo: 60px altura
- Navegación horizontal inline
- Hamburger menu oculto
- Submenús dropdown en hover

**Código JS para cierre automático:**
```javascript
window.addEventListener('resize', function() {
  if (window.innerWidth >= 1024 && siteNav.classList.contains('active')) {
    siteNav.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});
```

### Footer

#### Layouts
- **Móvil**: 1 columna vertical
- **Tablet**: 2x2 grid
- **Desktop**: 4 columnas horizontales

### Cards Grid

Adaptación automática:

```css
.cards-grid {
  display: grid;
  grid-template-columns: 1fr; /* Móvil */
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

### Tablas Responsive

Las tablas se convierten automáticamente a "card layout" en móvil:

#### HTML Requerido
```html
<div class="table-responsive">
  <table>
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Concepto</th>
        <th>Importe</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="Fecha">15/01/2025</td>
        <td data-label="Concepto">Pleno Ordinario</td>
        <td data-label="Importe">2.450.000 €</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Resultado en Móvil

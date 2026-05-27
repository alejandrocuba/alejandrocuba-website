# Design System

This document outlines the visual, styling, and layout standards for this project. It defines design tokens, responsive breakpoints, typography, and component-specific styling specifications.

All contributors and AI agents must adhere to this design system when creating or modifying user interfaces.

---

## 1. Responsive Layout & Breakpoints

This project uses a mobile-first design strategy. Layouts are styled for mobile devices by default, and media queries are used to enhance and adapt the layout for larger viewports.

### CSS Breakpoints
- **Mobile (Default)**: `max-width: 640px` (Default stacked layout)
- **Tablet**: `min-width: 641px` and `max-width: 1199px`
- **Desktop**: `min-width: 1200px`

### Responsive Design Checklist
- [ ] **Mobile-First**: Design and write styles for the smallest viewport first, adding media query overrides for tablet and desktop viewports.
- [ ] **Target Testing Range**: All components must remain clean, functional, and aesthetically pleasing across viewports from `320px` to `1920px`.
- [ ] **Layout Grids**: Grid layouts and column configurations must follow the breakpoint guidelines.

---

## 2. Design Tokens

Design tokens are declared as CSS custom variables in [setup.css](file:///Users/zorphdark/dev/alejandrocuba-website/sources/css/setup.css) and applied across core base styles and components.

### Colors
| Name | Token / Value | Usage |
| :--- | :--- | :--- |
| **Dark Gray (Background)** | `--gray-dark` / `#222` | Core background color for the body element |
| **Orange (Accent)** | `--orange` / `#e49e4c` | Accent colors, borders, links, focus outlines, and active states |
| **White/Gray (Text)** | `#ddd` | Default text color on dark background |
| **Console Gray** | `#292929` | Background color for console elements & preformatted code blocks |
| **Console Hover Gray** | `#2d2d2d` | Hover background color for console elements |

### Typography
- **Base Font Size**: `13px` / `1rem` on `html`
- **Body Font Family**: `"Roboto", sans-serif`
- **Console / Code Font Family**: `"Roboto Mono", sans-serif`

### Transitions & Page States
- **Loading Transition Time**: `--loading-transition-time` / `.75s` (used for smooth entry of UI components when page load finishes)
- **Flicker Prevention**: `body.is-loading` state disables all transitions and animations to prevent visual flickering on page load:
  ```css
  body.is-loading {
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }
  }
  ```

---

## 3. Core Component Layout Guidelines

### 3.1 Console Component
Defined in [console.css](file:///Users/zorphdark/dev/alejandrocuba-website/sources/css/components/console.css).
- **Font**: Uses monospace font `"Roboto Mono", sans-serif`.
- **Accent border**: A top border of `3px solid var(--orange)` is applied to all console pre-formatted code blocks (`pre[class*=language-]`).
- **Margins**: Max width is capped at `640px` and centered on the page: `margin: 0 auto 60px;`.
- **Transitions**: Scale and opacity transition smoothly from `scale(1.05)` and `opacity: 0` in `.is-loading` state.

### 3.2 Portfolio Grid Component
Defined in [portfolio.css](file:///Users/zorphdark/dev/alejandrocuba-website/sources/css/components/portfolio.css).
- **Layout Grid**:
  - **Desktop (`width >= 1200px`)**: 3-column layout (`width: 33.33%` per card).
  - **Tablet (`640px < width < 1200px`)**: 2-column layout (`width: 50%` per card).
  - **Mobile (`width <= 640px`)**: 1-column stacked layout (`width: 100%`).
- **Card Micro-Animations**:
  - **Hover Accent Border**: An orange accent top-border is drawn dynamically on hover via a absolute pseudo-element (`&::before`).
  - **Thumbnail Opacity**: Thumbnails (`.thumb`) default to opacity `0.8` and transition smoothly to `1` on hover over `0.33s`.
  - **Loading Entry**: Portfolio grid starts with `opacity: 0` and is translated down by `40px` inside `.is-loading`, then transitions smoothly up into place.

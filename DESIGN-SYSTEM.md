# Project Design System

> [!IMPORTANT]
> Inherits [DESIGN-SYSTEM.core.md](DESIGN-SYSTEM.core.md). This defines project-specific visual tokens and component specs.

## 1. Tokens ([setup.css](file:///Users/zorphdark/dev/alejandrocuba-website/sources/css/setup.css))
- `--gray-dark: #222` (Body background)
- `--orange: #e49e4c` (Accents, borders, links)
- `--loading-transition-time: .75s` (Entry transition)
- `--large-viewport: 1200px` (Desktop breakpoint)
- `--medium-viewport: 640px` (Tablet breakpoint)

## 2. Hardcoded Constants
- **Text**: `#ddd`
- **Console BG**: `#292929` (Hover: `#2d2d2d`)
- **Typography**: 
  - Base: `13px` (`1rem`), `"Roboto", sans-serif`
  - Code: `"Roboto Mono", sans-serif`

## 3. Breakpoints & Layout
Mobile-first layout strategy.
- **Mobile**: `<= 640px` (Default)
- **Tablet**: `> 640px` and `< 1200px`
- **Desktop**: `>= 1200px`

## 4. Components & States
- **Flicker Prevention**: `body.is-loading` disables all animations (`none !important`) during page load.
- **Console ([console.css](file:///Users/zorphdark/dev/alejandrocuba-website/sources/css/components/console.css))**: 
  - Max width `640px`, centered.
  - `pre` blocks: `3px solid var(--orange)` top border, `#292929` bg.
  - Entry Transition: Opacity 0 -> 1, scale `1.05` -> `1`.
- **Portfolio ([portfolio.css](file:///Users/zorphdark/dev/alejandrocuba-website/sources/css/components/portfolio.css))**:
  - Grid: 3-column (desktop), 2-column (tablet), 1-column (mobile).
  - Hover: Top border becomes `var(--orange)`, `.thumb` opacity `0.8` -> `1`.
  - Entry Transition: Opacity 0 -> 1, translate-y `40px` -> `0`.

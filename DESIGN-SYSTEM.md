# Project Design System

> [!IMPORTANT]
> Inherits [DESIGN-SYSTEM.core.md](DESIGN-SYSTEM.core.md). This defines project-specific visual tokens and component specs.

## 1. Tokens ([setup.css](file:///Users/zorphdark/dev/alejandrocuba-website/sources/css/setup.css))

- `--bg-base: #0d0f12` (Body background)
- `--bg-surface: #13161c` (Card & container surface background)
- `--bg-surface-elevated: #181c24` (Hover / elevated surface background)
- `--border-subtle: rgba(148, 163, 184, 0.1)` (Card & section boundary borders)
- `--border-medium: rgba(148, 163, 184, 0.18)` (Button & interactive borders)
- `--border-highlight: rgba(148, 163, 184, 0.32)` (Hover border highlight)
- `--accent-cyan: #38bdf8` (Primary brand accent, tags, links, indicators)
- `--accent-indigo: #818cf8` (Secondary accent & gradients)
- `--loading-transition-time: .75s` (Entry transition)
- `--large-viewport: 1200px` (Desktop breakpoint)
- `--medium-viewport: 640px` (Tablet breakpoint)

## 2. Hardcoded Constants

- **Text**: `var(--text-primary)` (`#e2e8f0`), `var(--text-secondary)` (`#94a3b8`), `var(--text-muted)` (`#64748b`)
- **Typography**:
  - Base: `"Roboto", sans-serif`
  - Code: `"Roboto Mono", monospace`

## 3. Breakpoints & Layout

Mobile-first layout strategy.

- **Mobile**: `<= 640px` (Default)
- **Tablet**: `> 640px` and `< 1200px`
- **Desktop**: `>= 1200px`

## 4. Components & States

- **Cursor Semantics**: Explicitly declare `cursor: default` on non-clickable cards, chips, badges, and status pills (even when styled with ambient/hover effects) to ensure `cursor: pointer` is reserved exclusively for truly actionable interactive controls (links, buttons).
- **Hover Interactions**: Zero hover translations (no `translateY`, `translateX`, or `translate` displacement on hover across cards, buttons, badges, or indicators). Rely exclusively on color, background, and border transitions.
- **Flicker Prevention**: `body.is-loading` disables all animations (`none !important`) during page load.

## 5. Unified Card Component ([card.css](file:///Users/zorphdark/dev/alejandrocuba-website/sources/css/core/card.css))

All content cards across Technical Publications (Articles) and Speaking & Meetup Sessions (Timeline) adhere strictly to the canonical `.card` vocabulary:

- **Zero-Wrapper Direct Grid Architecture**:
  - Cards MUST be direct children of their parent grid layout (e.g. `.articles-grid > article.card` or `.speaking-grid > li.card`).
  - NEVER introduce intermediate wrapper elements (e.g., no `.timeline-card-item`) or prefix-divergent class variations (e.g., no `.article-card`, `.timeline-card`).
- **Root Container (`.card`)**:
  - Background: `var(--bg-surface)`, with smooth transition to `var(--bg-surface-elevated)` on hover.
  - Border: `1px solid var(--border-subtle)` transitioning to `var(--border-highlight)` on hover.
  - Border Radius: `var(--radius-md)` (`12px`).
  - Padding: `1.75rem` (desktop/tablet), `1.25rem` (mobile `<= 640px`).
  - Cursor: `cursor: default`.
  - Zero-Blur Radial Gradient Halo (`::before`): Mask-composite radial gradient halo that smoothly fades in on card hover (`opacity: 0` -> `1`). Zero hover displacement.
- **Typography & Content Slots**:
  - Title (`.card-title`): `1.1875rem` (`1.0625rem` mobile), weight `700`, line height `1.35`.
  - Title Link (`.card-title-link`): Primary text color with transition to `#fff` on card hover.
  - Description / Location (`.card-description`, `.card-location`): `0.9375rem`, line height `1.55`, color `var(--text-secondary)`.
  - Tag / Category (`.card-tag`): `var(--accent-cyan)`, weight `500`, `cursor: default`.
- **Delimiter & Meta Footer**:
  - Container (`.card-meta`): Top delimiter border `1px solid var(--border-subtle)`, `padding-top: 0.75rem`, flex row layout.
  - Left Group (`.card-meta-left`): Time, category, or read-time separated with `.meta-dot`.
  - Right Action Link (`.card-link-arrow`): `var(--accent-cyan)`, weight `600`, font size `0.8125rem`. Hidden by default (`opacity: 0`) and smoothly reveals on card hover/focus (`opacity: 1`). Touch fallback preserves `opacity: 1` (`@media (hover: none)`).

### Standard Card Skeleton Pattern (Pug)

```pug
//- Standalone card item or direct list element:
article.card (or li.card)
  h3.card-title
    a.card-title-link(href=item.url target="_blank" rel="noopener noreferrer")= item.title

  //- Optional body description or location
  p.card-description= item.description
  //- or:
  .card-location
    svg.meta-icon(...)
    span= item.location

  //- Delimiter row with metadata & hover action
  .card-meta
    .card-meta-left
      time(datetime=item.date)= item.formattedDate
      span.meta-dot(aria-hidden="true") •
      span.card-tag= item.type
    .card-meta-right
      a.card-link-arrow(href=item.url target="_blank" rel="noopener noreferrer")
        span View Link ↗
```

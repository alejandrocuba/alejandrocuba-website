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
- `--accent-highlight: #3d9e97` (Primary mineral teal accent, tags, links, navbar indicators)
- `--accent-indigo: #8480ff` (Secondary accent & gradients)
- `--accent-emerald: #44f5a0` (Mentorship accent)
- `--accent-amber: #fadf68` (Warm highlight)
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
  - Cards MUST be direct children of their parent grid layout (e.g. `.articles-grid > article.card` or `.speaking-grid > li.card.card--compact`).
  - NEVER introduce intermediate wrapper elements (e.g., no `.timeline-card-item`) or prefix-divergent class variations (e.g., no `.article-card`, `.timeline-card`).
- **Root Container (`.card`, `.card.card--compact`)**:
  - Background: `var(--bg-surface)`, with smooth transition to `var(--bg-surface-elevated)` on hover.
  - Border: `1px solid var(--border-subtle)` transitioning to `rgba(132, 128, 255, 0.22)` on hover.
  - Border Radius: `var(--radius-sm)` (`8px`).
  - Padding: `1.5rem` (standard), `1.25rem 1.35rem` (`.card--compact`).
  - Cursor: `cursor: default`.
  - Zero-Blur Radial Gradient Halo (`::before`): Mask-composite radial gradient halo that smoothly fades in on card hover (`opacity: 0` -> `1`). Zero hover displacement.
- **Typography & Content Slots**:
  - Header Row (`.card-header`): Flex container (`justify-content: space-between`, `align-items: baseline`) for side-by-side title and date in compact cards.
  - Title (`.card-title`): `1.25rem` (`1.0625rem` for `.card--compact`), weight `700` (`600` for `.card--compact`), line height `1.35`.
  - Title Link (`.card-title-link`): Inherits text color with transition to `#fff` on card hover.
  - Date (`.card-date`): Mono font (`var(--font-mono)`), `0.8125rem`, color `var(--text-muted)`.
  - Description / Location (`.card-description`, `.card-location`): `0.9375rem`, line height `1.55` / `1.4`, color `var(--text-secondary)`.
  - Location Icon (`.card-location-icon`, `.card-location-icon--online`): Compact SVG markers.
  - Format Badge (`.card-format-badge`): Mono font pill badge (`.format-in-person`, `.format-online`).
- **Meta Footer (Borderless)**:
  - Container (`.card-meta`): Borderless flex row layout with `margin-top: auto` and `gap: 0.75rem`.
  - Left Group (`.card-meta-left`): Metadata items (time, read-time, location, format badge).
  - Right Action Link (`.card-link-arrow`): `var(--accent-pink)`, weight `500`, font size `0.8125rem`. Hidden by default (`opacity: 0`) and smoothly reveals on card hover/focus (`opacity: 1`). Touch fallback preserves `opacity: 1` (`@media (hover: none)`).

### Standard Card Skeleton Patterns (Pug)

#### Vertical Article Card
```pug
article.card(itemscope itemtype="http://schema.org/TechArticle")
  h3.card-title(itemprop="headline")
    a.card-title-link(href=article.url target="_blank" rel="noopener noreferrer")= article.title

  p.card-description(itemprop="description")= article.description

  .card-meta
    .card-meta-left
      time.card-date(datetime=article.date itemprop="datePublished")= article.formattedDate
    .card-meta-right
      a.card-link-arrow(href=article.url target="_blank" rel="noopener noreferrer")
        span Read on Medium
        span.arrow-indicator(aria-hidden="true") ↗
```

#### Compact Timeline/Event Card
```pug
li.card.card--compact(id=event.id itemscope itemtype="https://schema.org/Event")
  .card-header
    h3.card-title(itemprop="name")
      a.card-title-link(href=event.url target="_blank" rel="noopener noreferrer")= event.title
    time.card-date(datetime=event.dateIso itemprop="startDate")= event.dateFormatted

  .card-meta
    .card-meta-left
      .card-location
        svg.card-location-icon(...)
        span= event.location
      span.card-format-badge(class=`format-${event.format}`)
        span= event.formatLabel
    .card-meta-right
      a.card-link-arrow(href=event.url target="_blank" rel="noopener noreferrer")
        | View event ↗
```

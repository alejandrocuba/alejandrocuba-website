# Project Protocols

> [!IMPORTANT]
> Inherits [AGENTS.core.md](AGENTS.core.md). This defines project-specific rules and workflows.

## 0. Architecture
- **Pug Templates (`sources/html/`)**: `_layout/` (base, resources), `_components/` (reusable UI), `_data/` (dynamic content).
- **CSS (`sources/css/`)**: `core/` (base/typography), `components/` (specific to Pug).
- **Static Assets (`public/`)**: Copied to `dist/` root during build.
- **Design System**: See [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

## 1. Web Quality Checklist
- **SEO**: Update `public/sitemap.xml` `<lastmod>`. Point `public/robots.txt` to sitemap. Update `sources/html/_layout/resources/metadata.pug` (OG/Twitter, unique `<title>`). Enforce exactly one `<h1>` per page.
- **A11y**: Maintain skip-link in `base.pug`. Enforce `alt`/`aria-label` on all images (including background divs). Use correct `lang` attributes (e.g., `lang="es"`).
- **Performance**: Use `preconnect` hints in `styles.pug`. Append `&display=swap` to Google Fonts. Use optimized WebP images.
- **Security**: Maintain headers in `firebase.json` (CSP, X-Frame-Options). Update CSP for new external scripts.
- **Maintenance**: Verify automated copyright year in `sources/html/_components/footer.pug` renders correctly.

## 2. Development Workflow
- **Paths**: ALWAYS use the `path` object from `sources/html/_layout/setup/path.pug` (e.g., `path.images`). NO hardcoded relative paths.
- **Build**: Do NOT modify `vite.config.js` if it breaks the "flat" `dist/` structure required for Firebase.
- **Analytics**: Do NOT alter the GTM ID in `scripts.pug` without explicit authorization.

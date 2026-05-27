# Agentic Engineering Protocols

> [!IMPORTANT]
> This repository inherits and extends the global engineering protocols defined in the central [Core Agentic Protocols (AGENTS.core.md)](file:///Users/zorphdark/dev/alejandrocuba-website/AGENTS.core.md).
> All contributors and AI agents must adhere to the core guidelines plus the project-specific extensions documented below.

# Web Quality Standards Checklist

This project follows strict web quality standards for SEO, Accessibility, Performance, and Security. All future changes should adhere to these rules.

## 0. Project Architecture & Design System

### File Structure
- `sources/html/`: Contains all Pug templates.
  - `_layout/`: Global layout (`base.pug`) and shared resources (meta, styles, scripts).
  - `_components/`: Reusable interface fragments (footer, console).
  - `_data/`: Data files (e.g., `creativeworks.pug`) for dynamic content.
- `sources/css/`: Modular CSS files.
  - `core/`: Base styles and typography.
  - `components/`: Styles specific to Pug components.
- `public/`: Static assets that are copied to the root of `dist/` during build.

### Design System
- Refer to [DESIGN-SYSTEM.md](file:///Users/zorphdark/dev/alejandrocuba-website/DESIGN-SYSTEM.md) for CSS breakpoints, design tokens, typography, and component-specific styling guidelines.

## 1. SEO (Search Engine Optimization)
- [ ] **Sitemap**: Keep `public/sitemap.xml` updated. Update `<lastmod>` on significant content changes.
- [ ] **Robots**: Ensure `public/robots.txt` points to the sitemap.
- [ ] **Metadata**: Update `sources/html/_layout/resources/metadata.pug` with social tags (OG/Twitter) and unique titles.
- [ ] **Headings**: Ensure every page has exactly one `<h1>`.

## 2. Accessibility (A11y)
- [ ] **Skip Link**: Maintain the skip-to-content link in `base.pug`.
- [ ] **Images**: All images (including background images on divs) must have `alt` or `aria-label`.
- [ ] **Language**: Use `lang` attributes for content in languages other than English (e.g., `lang="es"` for Spanish).

## 3. Performance
- [ ] **Preconnect**: Use `preconnect` hints in `styles.pug` for external CDNs and fonts.
- [ ] **Font Display**: Always use `&display=swap` for Google Fonts.
- [ ] **Images**: Use WebP format where possible and ensure images are optimized (compressed).

## 4. Security
- [ ] **Headers**: Maintain security headers in `firebase.json` (CSP, X-Frame-Options, X-Content-Type-Options).
- [ ] **CSP**: If adding new external scripts, update the `Content-Security-Policy` header.
- [ ] **HTTPS**: Ensure the site is served over HTTPS (handled by Firebase).

## 5. Maintenance
- [ ] **Copyright**: The year in `sources/html/_components/footer.pug` is automated. Ensure the build process correctly renders the current year.

## 6. Development Workflow
- [ ] **Asset Paths**: Always use the `path` object from `sources/html/_layout/setup/path.pug` for all assets (e.g., `path.images`, `path.css`). Never hardcode relative paths.
- [ ] **Vite Config**: Do not modify `vite.config.js` without ensuring the build remains "flat" in the `dist/` directory for Firebase compatibility.
- [ ] **Analytics**: Do not remove or change the Google Tag Manager ID in `scripts.pug` without explicit instructions.

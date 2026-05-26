# Agentic Engineering Protocols

> [!IMPORTANT]
> This repository inherits and extends the global engineering protocols defined in the central [Core Agentic Protocols (AGENTS.core.md)](AGENTS.core.md).
> All contributors and AI agents must adhere to the core guidelines plus the project-specific extensions documented below.

# Web Quality Standards Checklist

This project follows strict web quality standards for SEO, Accessibility, Performance, and Security. All future changes should adhere to these rules.

## 0. Project Architecture
### File Structure
- `sources/html/`: Contains all Pug templates.
  - `_layout/`: Global layout (`base.pug`) and shared resources (meta, styles, scripts).
  - `_components/`: Reusable interface fragments (footer, console).
  - `_data/`: Data files (e.g., `creativeworks.pug`) for dynamic content.
- `sources/css/`: Modular CSS files.
  - `core/`: Base styles and typography.
  - `components/`: Styles specific to Pug components.
- `public/`: Static assets that are copied to the root of `dist/` during build.

### CSS Breakpoints
- **Mobile**: `max-width: 640px` (Default stack)
- **Tablet**: `min-width: 641px` and `max-width: 1199px`
- **Desktop**: `min-width: 1200px`

## 1. SEO (Search Engine Optimization)
- [ ] **Sitemap**: Keep `public/sitemap.xml` updated. Update `<lastmod>` on significant content changes.
- [ ] **Robots**: Ensure `public/robots.txt` points to the sitemap.
- [ ] **Metadata**: Update `sources/html/_layout/resources/metadata.pug` with social tags (OG/Twitter) and unique titles.
- [ ] **Headings**: Ensure every page has exactly one `<h1>`.

## 2. Accessibility (A11y)
- [ ] **Semantic HTML**: Use proper tags (`main`, `footer`, `nav`).
- [ ] **Skip Link**: Maintain the skip-to-content link in `base.pug`.
- [ ] **Images**: All images (including background images on divs) must have `alt` or `aria-label`.
- [ ] **Language**: Use `lang` attributes for content in languages other than English (e.g., `lang="es"` for Spanish).
- [ ] **Contrast**: Maintain a minimum 4.5:1 contrast ratio for all text.

## 3. Performance
- [ ] **Preconnect**: Use `preconnect` hints in `styles.pug` for external CDNs and fonts.
- [ ] **HTTPS**: Always use absolute `https://` URLs for external assets.
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
- [ ] **Responsive Design**: All new components must be mobile-first and tested for responsiveness (viewports 320px to 1920px).
- [ ] **Vite Config**: Do not modify `vite.config.js` without ensuring the build remains "flat" in the `dist/` directory for Firebase compatibility.
- [ ] **Analytics**: Do not remove or change the Google Tag Manager ID in `scripts.pug` without explicit instructions.

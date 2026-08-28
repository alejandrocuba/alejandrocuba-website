# Changelog

## [5.1.2](https://github.com/alejandrocuba/alejandrocuba-website/compare/v5.1.1...v5.1.2) (2026-08-28)


### Bug Fixes

* **security:** allow youtube embeds in CSP ([#84](https://github.com/alejandrocuba/alejandrocuba-website/issues/84)) ([14ecf29](https://github.com/alejandrocuba/alejandrocuba-website/commit/14ecf291188f1af2da111d1c3ec5058a7ff1f3ea))

## [5.1.1](https://github.com/alejandrocuba/alejandrocuba-website/compare/v5.1.0...v5.1.1) (2026-08-28)


### Bug Fixes

* **miner:** extract strictly author subtitles for articles ([#81](https://github.com/alejandrocuba/alejandrocuba-website/issues/81)) ([602d286](https://github.com/alejandrocuba/alejandrocuba-website/commit/602d2869f96bcc81fca7416c6378eac5bc29dfb8))

## [5.1.0](https://github.com/alejandrocuba/alejandrocuba-website/compare/v5.0.1...v5.1.0) (2026-08-28)


### Features

* automate podcast and medium articles mining with GitHub Actions… ([#79](https://github.com/alejandrocuba/alejandrocuba-website/issues/79)) ([60de23e](https://github.com/alejandrocuba/alejandrocuba-website/commit/60de23e265ee4cfdfd919847a7d56dd2654f5b17))

## [5.0.1](https://github.com/alejandrocuba/alejandrocuba-website/compare/v5.0.0...v5.0.1) (2026-08-28)


### Bug Fixes

* remove invalid event schema from speaking timeline ([#76](https://github.com/alejandrocuba/alejandrocuba-website/issues/76)) ([65579c3](https://github.com/alejandrocuba/alejandrocuba-website/commit/65579c3bb17d319519b2af09ba8404a5ba14e61e))

## [5.0.0](https://github.com/alejandrocuba/alejandrocuba-website/compare/v4.0.0...v5.0.0) (2026-08-27)

This major release introduces a complete redesign of the personal website, transitioning to a new narrative with dedicated sections for podcasts, speaking engagements, and mentorship, alongside high-performance navigation, Core Web Vitals optimization, and extensive SEO and accessibility improvements.

### Features & Highlights

* **Complete UI Redesign & Design System:** Rebuilt visual identity with DM Sans and DM Mono typography, harmonic dark theme, responsive hero layout, and ambient glowing accents.
* **Podcast Hub:** Featured most recent episode with high-performance video facade, platform quick-links, and metrics.
* **Speaking Engagements Timeline:** Interactive timeline showcasing international conference talks, keynote dates, locations, and presentation resources.
* **Mentorship & Publications:** Featured technical articles and ADPList mentorship booking integration.
* **Navigation & ScrollSpy:** Implemented performant `IntersectionObserver`-based section tracking and responsive scroll-driven header effects.
* **Technical Footer Panel:** Built expandable technical inspection panel with real-time Core Web Vitals monitoring and architecture stack overview.
* **Performance & Core Web Vitals:** Minimized client-side JavaScript execution payload to ~3 kB, migrated raster assets to inline SVGs/WebP, and updated Vite build pipeline to v8.2.2 with Vituum.
* **SEO & Social Graph:** High-resolution Open Graph/Twitter Cards preview metadata (`og-image.jpg`), multi-resolution favicons/manifest, and Schema.org structured data (`Person`, `WebSite`, `PodcastSeries`, `Event`).
* **Website Archive:** Archived the entire v4.0.0 codebase and static assets at `/archive/4/` with sitemap indexing.

## [4.0.0](https://github.com/alejandrocuba/alejandrocuba-website/compare/v3.0.0...v4.0.0) (2026-05-30)

This major release represents a complete modernization of the website architecture, migrating from legacy build tools to a modern Vite pipeline, introducing Server-Side Rendering (SSR) for syntax highlighting to optimize Core Web Vitals, and implementing standard protocols for AI Agent Discovery and Authentication.

### Features & Highlights

* **Infrastructure Modernization:** Migrated build pipeline from Grunt to Vite and Vituum, upgraded CI/CD to GitHub Actions with Node 24 support, and pruned obsolete legacy dependencies.
* **SSR Syntax Highlighting:** Migrated code syntax highlighting to build time using server-side PrismJS compilation, removing client-side `prism.min.js` to eliminate runtime parsing blocks.
* **Critical CSS & Asset Optimization:** Implemented `inline-css-plugin` for critical CSS inlining, converted all portfolio and static assets to WebP format, and added asynchronous font loading.
* **Accessibility (a11y) & SEO:** Normalized console structure, simplified footer with automated copyright year generation, and standardized heading hierarchy and social metadata.
* **AI Agent Discovery & WebMCP:** Implemented standard `.well-known` endpoints (`oauth-authorization-server`, `oauth-protected-resource`, `openid-configuration`, `jwks.json`, `api-catalog`), WebMCP server card integration (`/.well-known/mcp/server-card.json`), and agent skill catalog.

## [3.0.0](https://github.com/alejandrocuba/alejandrocuba-website/compare/v2.0.0...v3.0.0) (2016-10-09)

### Features & Highlights

* **Portfolio Showcase:** Added modal component and portfolio gallery showcase with updated artwork entries.
* **Console Component:** Introduced interactive/styled console UI component.
* **Responsive Layout:** Added media queries and layout styles for mobile and desktop screens.
* **Build System:** Integrated Autoprefixer for cross-browser CSS prefixing.
* **Copywriting:** Updated biography, descriptions, and portfolio copy.

## [2.0.0](https://github.com/alejandrocuba/alejandrocuba-website/compare/alpha...v2.0.0) (2016-02-29)

### Features & Highlights

* **Visual Redesign:** Updated website theme layout and card structure (inspired by Identity template).
* **Typography & Icons:** Integrated Font Awesome icon set and standardized social link icons.
* **Metadata & Styling:** Streamlined CSS styles and asset organization.

## [0.1.0-alpha](https://github.com/alejandrocuba/alejandrocuba-website/releases/tag/alpha) (2015-04-12)

### Initial Release

* **Initial Release:** Initial personal portfolio website deployment with base HTML/CSS structure, social links, and repository initialization.

# Alejandro Cuba Ruiz's Website

Personal website for Alejandro Cuba Ruiz with links to his social media and projects.

<p align="center">
  <a href="https://github.com/alejandrocuba/alejandrocuba-website/actions/workflows/firebase-hosting-merge.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/alejandrocuba/alejandrocuba-website/firebase-hosting-merge.yml?branch=main&style=for-the-badge&logo=firebase&label=Firebase%20Hosting" alt="Firebase Hosting Status" />
  </a>
  <a href="https://github.com/alejandrocuba/alejandrocuba-website/actions/workflows/firebase-hosting-pull-request.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/alejandrocuba/alejandrocuba-website/firebase-hosting-pull-request.yml?style=for-the-badge&logo=github&label=PR%20Build" alt="PR Build Status" />
  </a>
  <a href="https://github.com/alejandrocuba/alejandrocuba-website/commits/main">
    <img src="https://img.shields.io/github/last-commit/alejandrocuba/alejandrocuba-website?style=for-the-badge" alt="Last Commit" />
  </a>
</p>

<p align="center">
  <a href="https://vite.dev/">
    <img src="https://img.shields.io/badge/Vite-v8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </a>
  <a href="https://pugjs.org/">
    <img src="https://img.shields.io/badge/Pug-v3-A65F4A?style=for-the-badge&logo=pug&logoColor=white" alt="Pug" />
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  </a>
</p>

## 📁 Project Structure

```bash
.
├── dist/               # Production build output
├── public/             # Static assets (images, favicon, etc.)
├── sources/            # Project source files
│   ├── css/            # CSS styles and components
│   ├── html/           # Pug components, layouts, and data
│   │   ├── _components/
│   │   ├── _data/      # JSON data for Pug templates
│   │   ├── _layout/    # HTML templates
│   │   └── index.pug   # Main entry point template
│   └── js/             # JavaScript files
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── firebase.json       # Firebase Hosting configuration
```

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [pnpm](https://pnpm.io/installation)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd alejandrocuba
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
pnpm run dev
```

The site will be available at [http://localhost:5173/](http://localhost:5173/).

### Production Build

Generate the production-ready build in the `dist/` directory:

```bash
pnpm run build
```

The build includes a `postbuild` script to ensure the correct entry point name (`index.html`).

### Previewing the Build

Preview the production build locally:

```bash
pnpm run preview
```

## 🚀 Deployment

The project is configured for **Firebase Hosting**.

To deploy to production:

```bash
firebase login
firebase deploy
```

## 📄 License

This project is licensed under the GNU GENERAL PUBLIC LICENSE. See the [LICENSE](LICENSE) file for details.

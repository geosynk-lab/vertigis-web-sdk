<p align="center">
  <a href="https://geosynk.com.au/" target="_blank" rel="noopener noreferrer">
    <img src="https://geosynk.com.au/images/logo/LOGO_MAIN1.svg" alt="Geosynk" width="380" />
  </a>
</p>

# VertiGIS Studio Web SDK (Enterprise Edition)

[![Maintained by Geosynk](https://img.shields.io/badge/maintained%20by-Geosynk-f47c22.svg)](https://geosynk.com.au/)
[![NPM Version](https://img.shields.io/npm/v/@geosynk/vertigis-web-sdk.svg?color=cb3837)](https://www.npmjs.com/package/@geosynk/vertigis-web-sdk)
[![Upstream Sync](https://img.shields.io/badge/upstream-vertigis%2Fvertigis--web--sdk-blue.svg)](https://github.com/vertigis/vertigis-web-sdk)
[![Enterprise Ready](https://img.shields.io/badge/architecture-enterprise--overlay-green.svg)](#enterprise-architectural-features)
[![WCAG AA](https://img.shields.io/badge/accessibility-WCAG%20AA-success.svg)](#1-centralized-design-token-subsystem)

An enterprise-enhanced fork of the official [VertiGIS Studio Web SDK](https://vertigisstudio.com/products/vertigis-studio-web/), maintained and engineered by [Geosynk](https://geosynk.com.au/) (Davood Kazemi). This repository bootstraps production-grade extension libraries pre-configured with centralized design tokens, dynamic light/dark theming, strict anti-god-component architecture, automated OpenSSL certificates, and AI assistant directives (`AGENTS.md`), while preserving 100% compatibility with official VertiGIS upstream updates.

---

## Enterprise Architectural Features

Every project scaffolded from this repository includes:

1. **Centralized Design Token Subsystem (`src/tokens/`)**:
   - `tokens/ui.ts`: 35+ semantic tokens with **100% safe fallbacks** (`var(--primaryBackground, #ffffff)`), guaranteeing visual resilience in unit tests and Storybook sandboxes.
   - `tokens/typography.ts`: Standardized font stack (`var(--defaultFont)`), font scale, and line heights.
   - `tokens/index.ts`: Native CSS `color-mix(in srgb, ...)` utilities (`alphaMix` and `surfaceMix`) for dynamic, cross-theme tints, hover states, and muted borders without manual media queries.

2. **Dynamic Dual-Theme System (`src/hooks/useIsDarkTheme.ts`)**:
   - Reactive React hook tracking active theme mode via MUI theme, OS `prefers-color-scheme`, and `MutationObserver` on `.vsw-app`/DOM.
   - `src/utils/themeDetection.ts`: Standalone `isDarkTheme()` utility with ITU-R BT.709 perceived luminance calculation for non-CSS engines (HTML5 canvas, Plotly charts, and PDF exports).

3. **Anti-God-Component Architecture (150–250 Line Ceilings)**:
   - Sample widget (`src/components/CustomWidget/`) cleanly decomposed into MobX Model (`CustomWidgetModel.ts`), React View (`CustomWidget.tsx`), and error boundary (`components/CustomWidgetErrorBoundary.tsx`).
   - Strict separation of concerns between VertiGIS service state, presentation, and pure utilities.

4. **Automated Development SSL Certificates (`certs/`)**:
   - Zero-configuration HTTPS: automated OpenSSL certificate generation via `certs/generate-cert.sh` / `certs/generate-cert.bat`.
   - Automatically executed on project creation or during first startup.

5. **Cross-Platform Startup & Build Scripts**:
   - `start.sh` / `start.bat`: Checks and kills stale port 3000 processes, verifies SSL certificates, and launches the development server.
   - `build.sh` / `build.bat`: Compiles and validates production bundles into `dist/`.

6. **Coding Assistant Governance (`AGENTS.md`)**:
   - Pre-injected VertiGIS Web SDK directives ensuring AI coding assistants (such as Antigravity, Claude Code, Cursor, Copilot) strictly follow typography rules, token usage, and file size limits.

---

## Creating a New Project

### Option A: From NPM Registry (Recommended)
```bash
npx @geosynk/vertigis-web-sdk create my-web-library
```

### Option B: Direct from GitHub (Zero Registry / No NPM Publish Required)
```bash
npx github:davekazemi/vertigis-web-sdk create my-web-library
```

### Option C: Local Linked SDK (Instant Local Development)
Inside this repository:
```bash
npm link
```
Then anywhere on your machine:
```bash
vertigis-web-sdk create my-web-library
```

---

## Scaffolded Project Structure

```text
my-web-library/
├── .vscode/                  ← VS Code recommended extensions
├── certs/                    ← Self-signed SSL certs for HTTPS devServer
│   ├── cert.pem
│   ├── key.pem
│   └── generate-cert.sh / .bat
├── app/
│   ├── app.json              ← VertiGIS Studio Web app configuration
│   └── layout.xml            ← Layout XML defining slots and panels
├── src/
│   ├── index.ts              ← Library entry point registering extensions
│   ├── tokens/               ← Centralized design tokens subsystem
│   │   ├── ui.ts             ← Semantic color tokens with safe fallbacks
│   │   ├── typography.ts     ← Font families, scales, and line heights
│   │   └── index.ts          ← Barrel export + color-mix utilities
│   ├── hooks/
│   │   ├── useIsDarkTheme.ts ← Reactive light/dark theme tracking
│   │   └── index.ts
│   ├── components/
│   │   └── CustomWidget/     ← Decomposed component template
│   │       ├── CustomWidget.tsx
│   │       ├── CustomWidgetModel.ts
│   │       ├── index.ts
│   │       └── components/   ← Presentational subcomponents & ErrorBoundary
│   └── utils/
│       ├── themeDetection.ts ← Standalone luminance-based theme detector
│       └── index.ts
├── AGENTS.md                 ← AI assistant development directives
├── start.sh / start.bat      ← Port killer + SSL check + dev server runner
├── build.sh / build.bat      ← Production compilation script
├── package.json              ← Includes @mui/material, @emotion/react, and @emotion/styled
└── webpack.config.js
```

---

## Available Scripts (in Scaffolded Project)

- **`./start.sh` (or `start.bat`)**: Kills stale port 3000 processes, generates SSL certificates if missing, and runs `npm start`.
- **`npm start`**: Runs the project in development mode with hot reloading.
- **`npm run build`** (or `./build.sh`): Generates an optimized production bundle in `dist/`.
- **`npm run cert:gen`**: Regenerates development SSL certificates in `certs/`.

---

## Upstream Synchronization

This fork tracks official updates from `https://github.com/vertigis/vertigis-web-sdk.git`. Because enterprise templates are maintained in the isolated `template-custom/` overlay directory, upstream merges execute cleanly without merge conflicts:

```bash
git fetch upstream
git merge upstream/master --no-edit
git push origin master
```
Or run the parent batch synchronizer:
```bash
./sync.sh
```

---

## Documentation

- [VertiGIS Studio Developer Center](https://developers.vertigisstudio.com/docs/web/overview/)
- [VertiGIS Web SDK Skill Reference Guide](https://github.com/davekazemi/vertigis-sdk-skills)

---

## About Geosynk

This project is curated and maintained by [Geosynk](https://geosynk.com.au/), an Australian geospatial software consultancy founded by Davood Kazemi. Geosynk specializes in enterprise GIS solutions, custom VertiGIS Studio integrations, Esri ArcGIS architecture, and automated cloud deployments.

- **Website**: [https://geosynk.com.au](https://geosynk.com.au/)
- **Contact**: [davood@geosynk.com.au](mailto:davood@geosynk.com.au)


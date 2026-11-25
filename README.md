<p align="center">
  <a href="https://geosynk.com.au" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://geosynk.com.au/images/logo/LOGO_MAIN1_DARK.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://geosynk.com.au/images/logo/LOGO_MAIN1.svg">
      <img src="https://geosynk.com.au/images/logo/LOGO_MAIN1.svg" alt="Geosynk" width="380" />
    </picture>
  </a>
</p>
<p align="center">
  <strong><em>Unifying Spatial Data with Enterprise Intelligence</em></strong>
</p>

# VertiGIS Studio Web SDK (Enterprise Edition)

[![Maintained by Geosynk](https://img.shields.io/badge/maintained%20by-Geosynk-f47c22.svg)](https://geosynk.com.au/)
[![NPM Version](https://img.shields.io/npm/v/@geosynk/vertigis-web-sdk.svg?color=cb3837)](https://www.npmjs.com/package/@geosynk/vertigis-web-sdk)
[![CI](https://github.com/geosynk-lab/vertigis-web-sdk/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/geosynk-lab/vertigis-web-sdk/actions/workflows/ci-cd.yml)
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
   - `start.sh` / `start.bat`: Checks and kills stale processes on ports 3001 and 3000, verifies SSL certificates, and launches the development server. `remote` mode keeps the checkout in sync with `origin/<branch>` while the server runs.
   - `build.sh` / `build.bat`: Compiles and validates production bundles into `build/`. `upload-gc [public-url]` also uploads the bundle to Google Cloud Storage.
   - `project.config`: One commented file for all script values (build name, upload URL, remote sync, portal authentication). See [Project Configuration](#project-configuration-projectconfig).

6. **Coding Assistant Governance (`AGENTS.md`)**:
   - Pre-injected VertiGIS Web SDK directives ensuring AI coding assistants (such as Antigravity, Claude Code, Cursor, Copilot) strictly follow typography rules, token usage, and file size limits.

7. **Monorepo & Dual Package Manager Resilience (`npm` & `pnpm`)**:
   - **SheetJS (`xlsx`) Registry Mirror**: Replaces upstream external HTTP CDN tarball URLs with `npm:@e965/xlsx@^0.20.3` registry overrides. 100% immune to corporate firewall/proxy blocks, checksum mismatches, and `pnpm` `ERR_PNPM_EXOTIC_SUBDEP` errors.
   - **Monorepo `--skip-install` Support**: Scaffolds full enterprise project architecture without generating duplicate nested `node_modules`.
   - **Native `pnpm` v11+ Compatibility**: Bundled with pre-configured `pnpm-workspace.yaml` for instant pnpm installations.

---

## Creating a New Project

### Option A: From NPM Registry (Recommended)
```bash
npx @geosynk/vertigis-web-sdk create my-web-library
```

### Option B: Direct from GitHub (Zero Registry / No NPM Publish Required)
```bash
npx github:geosynk-lab/vertigis-web-sdk create my-web-library
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

### Option D: Inside a Monorepo / Workspaces (Single Shared `node_modules`)
To manage all libraries under a single `node_modules` at your workspace root:
```bash
# 1. Scaffold into your packages/ or projects/ folder without installing duplicate dependencies
npx @geosynk/vertigis-web-sdk create my-web-library --skip-install

# 2. Run install once at your monorepo root
npm install
# or
pnpm install
```

### Option E: Direct with `pnpm`
```bash
npx @geosynk/vertigis-web-sdk create my-web-library --pnpm
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
├── scripts/
│   ├── load-config.sh / .bat ← Reads project.config for the .sh and .bat scripts
│   ├── remote-sync.sh / .bat ← Fast-forward sync with origin (start.sh remote)
│   ├── configure-portal.js   ← Portal OAuth configurator (npm run auth:portal)
│   └── verify_zero_cosmetic_sx.py ← Style audit (npm run verify:styles)
├── AGENTS.md                 ← AI assistant development directives
├── project.config            ← Values for the scripts (build, upload, remote sync, portal auth)
├── start.sh / start.bat      ← Port killer + SSL check + dev server runner (+ remote mode)
├── build.sh / build.bat      ← Production compilation script (+ upload-gc)
├── package.json              ← Includes @mui/material, @emotion/react, and @emotion/styled
└── webpack.config.js
```

---

## Available Scripts (in Scaffolded Project)

- **`./start.sh` (or `start.bat`)**: Kills stale processes on ports 3001 and 3000, generates SSL certificates if missing, and runs `npm start`.
- **`./start.sh remote [branch] [seconds]`** (or `start.bat remote [branch]`, or `npm run start:remote`): Pulls `origin/<branch>` first, then fetches it again each 5 seconds (default, `REMOTE_INTERVAL`) while the dev server runs. Fast-forward only: local commits and uncommitted changes are never overwritten. When `package.json` or a lockfile changes, it tells you to run `npm install`.
- **`npm start`**: Runs the project in development mode with hot reloading.
- **`npm run auth:portal`**: Interactive wizard to configure ArcGIS Enterprise Portal / AGOL OAuth authentication and secured web maps. If `PORTAL_URL` and `PORTAL_CLIENT_ID` are set in `project.config`, it runs without questions.
- **`npm run build`** (or `./build.sh [name]`): Generates an optimized production bundle in `build/`.
- **`./build.sh upload-gc [public-url] [name]`** (or `build.bat upload-gc [public-url] [name]`): Builds, then uploads `build/<name>.js` to Google Cloud Storage with `gcloud`. If you do not give the URL, the script uses `GC_UPLOAD_URL` from `project.config`. The URL is `https://storage.googleapis.com/<bucket>/<path>` or `gs://<bucket>/<path>`. If it ends with `.js`, it is the file name. Otherwise it is a folder. The bucket must already allow public read.
- **`npm run cert:gen`**: Regenerates development SSL certificates in `certs/`.

---

## Project Configuration (`project.config`)

Each scaffolded project has a `project.config` file in its root. It contains all the values that the scripts use, with a comment for each value. Change the values in this file, so that you do not have to type them on the command line each time.

| Key | Used by | Description | Default |
| :--- | :--- | :--- | :--- |
| `BUILD_NAME` | `build.sh` / `build.bat` | Name of the built library: `build/<BUILD_NAME>.js` and `.js.txt` | Project folder name |
| `GC_UPLOAD_URL` | `build.sh upload-gc` | Upload target: `https://storage.googleapis.com/<bucket>/<path>` or `gs://<bucket>/<path>`. A value that ends with `.js` is the file name. Other values are a folder. | Not set |
| `GC_CACHE_CONTROL` | `build.sh upload-gc` | `Cache-Control` header of the uploaded file | `no-cache` |
| `REMOTE_SYNC` | `start.sh` / `start.bat` | `true` = use remote mode also without the `remote` argument | `false` |
| `REMOTE_BRANCH` | `start.sh remote` | Branch to sync with | Current branch |
| `REMOTE_INTERVAL` | `start.sh remote` | Seconds between two fetches | `5` |
| `PORTAL_URL` | `npm run auth:portal` | ArcGIS Enterprise portal or ArcGIS Online URL | Not set |
| `PORTAL_CLIENT_ID` | `npm run auth:portal` | OAuth application Client ID | Not set |
| `PORTAL_ACCOUNT_ID` | `npm run auth:portal` | Account ID (organization identifier) | `enterprise` |
| `PORTAL_WEBMAP` | `npm run auth:portal` | Web map item ID or URL to set in `app/app.json` | Not set (no change) |
| `PORTAL_PREVIEW_ORIGINS` | `npm run auth:portal` | More preview origins to register in the portal, separated by commas | `https://preview.kw11.org` |

Rules:
- One `KEY=VALUE` on each line. Do not put spaces around `=`, quotes around a value, or a comment after a value. Do not use `!` in a value (Windows `.bat` scripts remove it).
- Lines that start with `#` are comments. An empty value (`KEY=`) means "not set", so the script uses its default.
- Priority: a command-line argument, then `project.config`, then the default in the script.
- The scripts only read `KEY=VALUE` lines. They do not run the file as code.
- The file is committed to git and shared with your team. Do not put passwords or tokens in it.

Example:
```ini
BUILD_NAME=my-library
GC_UPLOAD_URL=https://storage.googleapis.com/my-bucket/libs/
REMOTE_SYNC=true
REMOTE_BRANCH=main
PORTAL_URL=https://gis.example.com/portal
PORTAL_CLIENT_ID=myClientId123
```
With these values, `./build.sh upload-gc` builds and uploads `my-library.js`, `./start.sh` starts in remote mode on `main`, and `npm run auth:portal` configures the portal without questions.

---

## Developer Guide: Building & Deploying Web Extensions

> Official Reference: [VertiGIS Studio Web SDK Overview](https://developers.vertigisstudio.com/docs/web/overview/) & [Workflow TypeScript SDK Overview](https://developers.vertigisstudio.com/docs/workflow/sdk-web-overview)

### 1. Extension Architecture & Decomposition
The Web SDK compiles custom UI widgets, services, and commands into a loadable VertiGIS Studio Web library:
- **MobX Component Models (`*Model.ts`)**: Encapsulate application state, services injection, and event management.
- **React Views (`*.tsx`)**: Presentational UI wrapping controls with accessibility attributes, design tokens (`src/tokens/`), and dynamic theme adaptation (`useIsDarkTheme`).
- **Error Boundaries**: Isolate widget failures to avoid crashing the surrounding VertiGIS Studio Web shell.
- **Custom Services & Commands**: Register app-wide singleton services and commands via `@vertigis/web/messaging`.

### 2. Simultaneous Dual-Port Development Server
Start the development server with automatic SAN SSL certificate validation:
```bash
./start.sh      # Linux / macOS
start.bat       # Windows
# or: npm start
```
- **Dual-Port Accessibility**:
  - Primary endpoint: `https://localtest.me:3001/main.js` (avoids ArcGIS Portal private network & CORS restrictions).
  - Auxiliary bridge: `https://localhost:3000/main.js` (guarantees legacy app configuration compatibility).
- Pre-configured with CORS and Private Network Access (`Access-Control-Allow-Private-Network: true`) headers.

### 3. Registering Custom Web Extensions in VertiGIS Studio Web
To consume your custom extensions inside VertiGIS Studio Web applications:
1. Open your target application in **VertiGIS Studio Web Designer**.
2. Navigate to **App Settings** > **Custom Libraries**.
3. Add your development URL:
   - `https://localtest.me:3001/main.js` (or `https://localhost:3000/main.js`)
4. Add the component to your application layout XML (`layout.xml`) or configuration (`app.json`).
5. Reload the Designer app to view live hot-reloaded changes.

### 4. Production Build & Hosting
Compile production artifacts:
```bash
./build.sh      # Linux / macOS
build.bat       # Windows
# or: npm run build
```
Outputs optimized bundles to `build/`:
- `build/main.js` (standard AMD bundle)
- `build/<project-name>.js` (named bundle for ArcGIS portal hosting)
- `build/<project-name>.js.txt` (raw text bundle for script upload workflows)

`build.sh`, `build.bat`, and `Dockerfile.build` stop with an error if `build/main.js` contains `localtest.me` or `oauth_callback`. These strings show that the dev OAuth code (`src/auth`) is in the production bundle.

Build and upload to a public Google Cloud Storage bucket (needs the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) and `gcloud auth login`):
```bash
./build.sh upload-gc https://storage.googleapis.com/my-bucket/libs/
# Uploads build/<project-name>.js to gs://my-bucket/libs/<project-name>.js with Cache-Control: no-cache,
# then prints the public URL to add in Designer > App Settings > Custom Libraries.

# Or set GC_UPLOAD_URL=https://storage.googleapis.com/my-bucket/libs/ in project.config, then:
./build.sh upload-gc
```

---

### 5. ArcGIS Enterprise & Secured Portal Authentication

When referencing secured Web Maps or layers from an ArcGIS Enterprise Portal or private ArcGIS Online organization, applications fail to authenticate or incorrectly fall back to the built-in basic username/password modal if OAuth is unconfigured.

This SDK includes an automated configuration wizard that sets up seamless OAuth 2.0 authentication, trusted servers, and callback endpoints.

#### Step 1: Portal Prerequisites (Application Registration & CORS Allowed Origins)

To allow the browser to authenticate and fetch secured resources (Web Maps, layers, feature services, REST metadata) from ArcGIS Enterprise, configure the following in your Portal:

##### A. Register Application (OAuth 2.0 Client ID & Redirect URIs)
1. Log in to your ArcGIS Enterprise Portal or ArcGIS Online organization.
2. Navigate to **Content** > **Add Item** > **An Application** > **Application Configuration**.
3. Under **Redirect URIs**, add the development callback endpoints:
   - `https://localtest.me:3001`
   - `https://localtest.me:3001/oauth_callback.html`
4. Copy the generated **Client ID** (App ID) (e.g., `myClientId123`).

##### B. Allow Origins for CORS (Cross-Origin Resource Sharing)
If your ArcGIS Enterprise Portal restricts cross-domain requests, you must whitelist your development origin to permit direct browser REST queries and resource fetching:
1. Log in to Portal as an **Administrator**.
2. Navigate to **Organization** > **Settings** > **Security**.
3. Scroll down to the **Allow Origins** section.
4. Add the development origin URL:
   - `https://localtest.me:3001`
5. Click **Add Domain** and **Save**.

> **Note**: ArcGIS Enterprise requires a fully qualified domain name (FQDN) containing a domain suffix (e.g., `localtest.me:3001`). Bare hostnames like `localhost` and wildcard `*` machine names are rejected by Portal security. In production, VertiGIS Studio Web is deployed directly within your GIS environment, so only the development origin needs whitelisting.

#### Step 2: Run the Automated Portal Configurator
Option 1: set `PORTAL_URL`, `PORTAL_CLIENT_ID`, and optionally `PORTAL_ACCOUNT_ID` and `PORTAL_WEBMAP` in `project.config` (see [Project Configuration](#project-configuration-projectconfig)). Then `npm run auth:portal` runs without questions.

Option 2: run the interactive configurator in your project:
```bash
npm run auth:portal
```
You will be prompted for:
- **Portal URL** `[Required]`: Your Enterprise Portal instance (e.g., `https://gis.{org}.com/portal`).
- **Client ID** `[Required]`: The OAuth Application Client ID obtained from Step 1.
- **Account ID** `[Optional]`: Organization identifier (e.g., `{org}` or `enterprise`).
- **Web Map Item ID or URL** `[Optional]`: If provided, automatically updates `webMap` in `app/app.json`. If omitted, your current `app.json` remains untouched.

Or execute directly via non-interactive CLI flags:
```bash
# Minimal (configures Portal OAuth, leaves current app.json untouched):
npm run auth:portal -- \
  --portal https://gis.{org}.com/portal \
  --client-id myClientId123

# Full (configures Portal OAuth AND updates app.json web map):
npm run auth:portal -- \
  --portal https://gis.{org}.com/portal \
  --client-id myClientId123 \
  --webmap 4f970e5d0a684b0f9f30cf00fa0119e6
```
*(Note: `--app-id` and `--clientId` are also supported as aliases).*

#### Step 3: Start Development Server
```bash
npm start
```
When accessing `https://localtest.me:3001/`, VertiGIS Web automatically triggers the official ArcGIS Enterprise Portal OAuth popup/redirect flow instead of prompting for basic username/password credentials.

#### How It Works Under the Hood
1. **`app/auth/portal.json`**: Generated with `{ portal, appId, clientId, accountId }` conforming strictly to VertiGIS Web's native schema parser.
2. **`webpack.config.js` Middleware**: The dev server's `portal-auth-interceptor` automatically intercepts `/viewer/auth/portal.json` and serves `app/auth/portal.json` and `app/oauth_callback.html`.
3. **`src/auth/index.ts`**: The extension entry point initializes `esriConfig.portalUrl`, registers `esriConfig.request.trustedServers`, and registers `OAuthInfo` in `IdentityManager`.
4. **Reverting to Defaults**: Run `npm run auth:portal -- --reset` to revert back to public sample ArcGIS Online maps at any time.

**Hosting Requirements**:
- Host over **HTTPS** with a valid SSL certificate.
- Configure web server headers for Cross-Origin Resource Sharing (`Access-Control-Allow-Origin: *`).
- Update your VertiGIS Web Designer custom library URL to point to your production URL `https://your-server.com/path/<project-name>.js`.

---

### 6. AI Coding Assistant Skills (Antigravity, Cursor, Claude Code)

This SDK integrates directly with the [VertiGIS SDK Skills repository](https://github.com/geosynk-lab/vertigis-sdk-skills).

During project creation, you will be prompted:
```text
? Would you like to install AI coding assistant skills from https://github.com/geosynk-lab/vertigis-sdk-skills into this project? [Y/n]
```
If accepted, the `vertigis-web-sdk-skill` is automatically installed into `./.agents/skills/` using the standard `skills` tool (`npx skills add`).

You can install or update the skill at any time in your project:
```bash
npm run skill:add
```
Or via non-interactive flag during scaffolding:
```bash
npx @geosynk/vertigis-web-sdk create my-app --skills
```

---

## Upstream Synchronization

This fork tracks official updates from `https://github.com/vertigis/vertigis-web-sdk.git`. Because enterprise templates are maintained in the isolated `template-custom/` overlay directory, upstream merges execute cleanly without merge conflicts:

```bash
git fetch upstream
git checkout main
git merge upstream/master --no-edit
git push origin main
```
Or run the parent batch synchronizer:
```bash
./sync.sh
```

---

## Documentation

- [VertiGIS Studio Web Developer Center](https://developers.vertigisstudio.com/docs/web/overview/)
- [VertiGIS Studio Workflow TypeScript SDK Overview](https://developers.vertigisstudio.com/docs/workflow/sdk-web-overview)
- [VertiGIS Web SDK Skill Reference Guide](https://github.com/geosynk-lab/vertigis-sdk-skills)

---

## About Geosynk

[Geosynk](https://geosynk.com.au/) is a certified GIS technical integration consultancy founded by Davood Kazemi, engineering high-performance spatial automation pipelines, bespoke VertiGIS applications, and resilient enterprise GIS architecture.

> *"We don't just implement technology; we engineer business value. Digital transformation in infrastructure is a safeguard against project waste and operational risk."*

### Core Philosophy

| Principle | Impact | How We Deliver It |
| :--- | :--- | :--- |
| **Radically Simple** | *Reduces Overhead* | Complexity is the enemy of adoption. Clear interfaces reduce training costs and eliminate decision fatigue. |
| **Frictionless Efficiency** | *Accelerates Velocity* | Automating repetitive data flows recovers thousands of engineering hours annually. |
| **Deeply Integrated** | *Prevents Rework* | Connected systems establish a single source of truth across CAD, BIM, GIS, and ERP. |

### Core Capabilities & Offerings

- **VertiGIS Studio Engineering**: Turnkey Web SDK components, custom Workflow activities, accessible form elements, report templates, and automated printing services.
- **FME Advanced Automation**: End-to-end spatial ETL pipelines, Python SDK custom transformers, FME Form & Flow (Server), and CAD/BIM/GIS synchronization.
- **Esri ArcGIS Enterprise**: End-to-end cloud and on-premises architecture, Enterprise Geodatabase design, Utility Network migrations, and ArcGIS Experience Builder extensions.
- **Custom Spatial Development**: High-performance React, TypeScript, and Python GIS tooling engineered for unique operational requirements.
- **Enterprise Orchestration**: Unifying Trimble, Bentley, Autodesk, and GIS into a cohesive enterprise framework.

### Connect with Geosynk

- 🌐 **Website**: [geosynk.com.au](https://geosynk.com.au/)
- 💼 **LinkedIn**: [Geosynk Company](https://www.linkedin.com/company/ggeosynk)
- ✉️ **Email**: [info@geosynk.com.au](mailto:info@geosynk.com.au) / [Davood Kazemi](mailto:dave.kazemi@gmail.com)
- 📅 **Consultation**: [Book a 1-on-1 Session](https://geosynk.com.au#contact)




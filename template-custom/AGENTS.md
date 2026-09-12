# Repository Agent Directives

<!-- vertigis-web-sdk:start -->
# VertiGIS Studio Web SDK Development Directives

> **Mandatory Agent Directive**: Whenever you make any change to or create any web component in this repository, ALWAYS check and verify it against VertiGIS Web SDK standards (LayoutElement wrapper, MobX observer, MUI components with sx tokens, zero hardcoded colors, design token architecture, dual-theme adaptation, strict 150–250 line component modularity, and ErrorBoundary wrapper).

## 1. Typography System
- **Strict ban on raw HTML text elements**: Never use raw `<span>`, `<p>`, or `<h1>`-`<h6>` tags.
- **MUI Typography Component**: Always use `@mui/material` `<Typography variant="...">`:
  - `h5`, `h6`: Widget titles and primary container headers.
  - `subtitle1`, `subtitle2`: Section headers, grouping titles, and card subheadings.
  - `body1`, `body2`: Primary and secondary descriptive body text.
  - `caption`, `overline`: Microcopy, timestamps, metadata labels, and status badges.
- **Semantic Text Color Tokens**: Always pair Typography variants with semantic foreground tokens via `sx`:
  - Primary text: `color: "var(--primaryForeground, #1e1e1e)"`
  - Secondary/muted text: `color: "var(--secondaryForeground, #666666)"`
  - Inactive/disabled text: `color: "var(--disabledForeground, #9e9e9e)"`
- **Font Family**: Use `fontFamily: "var(--defaultFont)"` (inherited automatically through MUI components).

## 2. Color & Design Tokens Subsystem
- **Zero Hardcoded Colors**: Strict ban on hardcoded hex (`#ffffff`), RGB (`rgb(...)`), or HSL color values for UI chrome, backgrounds, text, and borders.
- **Safe Fallback Requirement**: ALWAYS provide safe fallbacks for CSS variable tokens (e.g., `var(--primaryBackground, #ffffff)`) to ensure resilient rendering in headless, disconnected, or preview environments.
- **Standardized Token Architecture**: Group all tokens under a `tokens/` directory:
  - `tokens/ui.ts`: Surface, border, foreground, accent, interactive, and alert tokens.
  - `tokens/typography.ts`: Typography hierarchy, font families, and weights.
  - `tokens/index.ts`: Central barrel export and `color-mix()` dynamic tinting utilities.
- **Dynamic Dual-Theme Adaptation**:
  - Use `color-mix(in srgb, ...)` for derived tints, hover states, muted borders, and transparent overlays to adapt automatically to light and dark themes without manual CSS overrides.
  - Use the canonical reactive `useIsDarkTheme()` hook for DOM/shell theme detection.
  - Use `isDarkTheme()` standalone utility for non-CSS contexts (Plotly, canvas renderers, third-party iframe bridges, PDF exports).
- **MUI Theme Integration**: Apply `createTheme` overrides and `ThemeProvider` to align composite controls (sliders, toggle buttons, pickers) with VertiGIS shell branding.
- **GIS Visual Hierarchy**: Keep UI chrome neutral and subdued so the GIS map canvas remains the focal point. Ensure WCAG AA contrast compliance (minimum 4.5:1 for normal text, 3:1 for large text).

## 3. Strict Component Modularity & Anti-God-Component Architecture
- **Strict File Size Thresholds**: Max 150–250 lines per file. Any file exceeding 250 lines MUST be refactored and decomposed.
- **Standard Directory Blueprint**: Decompose complex components into:
  - `components/`: Presentational, stateless sub-components.
  - `hooks/`: Custom React hooks for state, lifecycle subscriptions, and business logic.
  - `tokens/`: Centralized design token definitions and theme utilities.
  - `services/`: Component-level services and integrations.
  - `utils/`: Pure helper functions, defaults, formatters, and algorithms.
  - `types/`: Shared domain models and TypeScript interfaces.
- **Model vs View Separation**:
  - Component Model (`*Model.ts`): Inherits `ComponentModelBase`, decorates with `@serializable` / `@importModel`, and manages VertiGIS lifecycle hooks (`_onInitialize`, `_load`, `_unload`, `_onDestroy`).
  - Component View (`*.tsx`): Pure React component wrapped in `observer()`, wrapped in `<LayoutElement {...props}>`, and encapsulated inside `<ErrorBoundary>`.
<!-- vertigis-web-sdk:end -->

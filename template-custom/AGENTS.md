# Repository Agent Directives

<!-- vertigis-web-sdk:start -->
# VertiGIS Studio Web SDK Development Directives

> **Mandatory Agent Directive**: Whenever you make any change to or create any web component in this repository, ALWAYS check and verify it against VertiGIS Web SDK standards (LayoutElement wrapper, MobX observer, semantic HTML with co-located namespaced CSS, two-tier theming architecture via VertiGisThemeProvider for MUI, zero @vertigis/web/ui UI controls, strict 150–250 line component modularity, and ErrorBoundary wrapper).

## 1. Typography System & Shell Inheritance
- **Typography Components vs Raw CSS Bloat**: Prefer `@mui/material` `<Typography variant="...">` (`h5`/`h6` for titles, `subtitle1`/`subtitle2` for section headers, `body1`/`body2` for reading text, `caption`/`overline` for metadata/badges) paired with semantic text color tokens (`var(--primaryForeground, #212121)`, `var(--secondaryForeground, #666666)`). Using `<Typography>` completely eliminates the need to invent repetitive CSS text classes (`.Component-title`, `.Component-type`, etc.) and deletes boilerplate font-size, line-height, and font-family declarations.
- **Strict Ban on `@vertigis/web/ui` UI Controls**: NEVER import UI controls (`Button`, `Typography`, `DynamicIcon`, `Box`, `TitleBar`, etc.) from `@vertigis/web/ui`. These internal components depend on `useUIContext()`, which is undefined in unit tests (`vitest run`), detached React portals, or custom modals, causing fatal `TypeError: Cannot read properties of undefined (reading 'translate')` crashes. Reserve `@vertigis/web/ui` strictly for non-UI SDK hooks when needed (e.g. `useWatchAndRerender`).
- **Zero `font-family` (No Exceptions)**: The host application shell (`.vsw-app`) strictly owns and injects the global font stack. **NEVER declare `font-family`, the `font:` shorthand, or `fontFamily` anywhere**: CSS, `sx`, `style`, token files (no font-stack tokens, including `var(--codeFont)`/monospace stacks). The single allowed line is `typography: { fontFamily: "inherit" }` in the `createTheme` theme provider (or a chart library theme such as Nivo).
- **Semantic Typography Palette Props**: Primary text has no `color` prop: it inherits the host foreground (`color="text.primary"` is redundant). Use `color="text.secondary"` (captions, subtitles, helper microcopy), `color="inherit"` (inside a coloured surface that sets its own foreground), and `color="error"` (validation). NEVER write bespoke CSS classes or inline `sx={{ color: ... }}` solely to set secondary/helper text colors.
- **Top-Level Package Exports Only**: Always import directly from package roots (`import { Box, Typography, Dialog } from "@mui/material"`; `import { createTheme, ThemeProvider } from "@mui/material/styles"`). Deep imports (e.g. `@mui/material/styles/createTheme`) are deprecated in MUI v7 and break under modern bundlers.

## 2. Host-Governed Styling (Zero Cosmetic `sx`)
- **Six Principles**:
  1. **Host governs cosmetics**: VertiGIS Studio Web supplies MUI ThemeProvider + portal branding CSS variables. Components inherit surface, elevation, borders and typography.
  2. **Zero cosmetic properties in component `sx`, `style`, `styles` dictionaries and `styled()`**: Banned: `border*`, `outline*`, `borderRadius*`, `background*`, `bgcolor`, `backdropFilter`, `boxShadow`, `textShadow`, `filter`, `color`, `textColor`, `textDecoration`, `textTransform`, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`. These live ONLY in `src/tokens/muiTheme.ts` (`createTheme` `components.*.styleOverrides`) or are inherited. Text uses `<Typography variant>` and `color="text.secondary"`.
  3. **Canonical layout, gap over margin**: 1D rows/columns -> `<Stack direction spacing alignItems justifyContent>`. 2D -> `<Box sx={{ display: "flex", flexDirection, gap, alignItems }}>` or `<Grid container spacing>`. Space siblings using parent `gap` or `Stack spacing`, never child `margin`. Allowed `sx` keys: display, flex*, align*, justify*, grid*, spacing keys, sizing (width/height/min/max), positioning (position/top/bottom/left/right/zIndex), and overflow*.
  4. **8px grid spacing**: All spacing (`p*`, `m*`, `gap`, `spacing`) must use canonical 8px grid steps: `0, 0.5, 1, 1.5, 2, 2.5, 3, 4` (negatives, `"auto"`, and responsive objects allowed). Raw pixel strings (`"13px"`) and arbitrary decimals (`0.35`) are banned. Do NOT set `spacing: 5` in createTheme.
  5. **Declarative state via data attributes**: Express dynamic status via `<Card data-status={status}>`. Style `&[data-status="..."]` centrally in `src/tokens/muiTheme.ts`.
  6. **Containment**: `<canvas>`, `<img>`, `<iframe>` must be contained inside `<Paper variant="outlined">` or `<Card>` (or CardContent/CardMedia/CardActionArea); child keeps only functional dimensions (`style={{ width: "100%" }}`).
- **Zero Hardcoded Colors & Shapes**: Strict ban on hardcoded hex (`#ffffff`), RGB (`rgb(...)`), or HSL color values, and hardcoded corner radii (e.g. `border-radius: 4px;`). Always use unified shape tokens: `var(--borderRadius, 4px)` (standard), `var(--borderRadiusSm, 2px)` (micro), `var(--borderRadiusLarge, 8px)` / `var(--borderRadiusLg, 8px)` (cards/dialogs), and `50%` / `9999px` (pills/rounds).
- **Crash Prevention**: NEVER pass raw `var(...)` strings (including any `UI_TOKENS.*` value) into `palette.primary.main` or `palette.error.main` (causes MUI `augmentColor()` to crash). Attach CSS variables via component `styleOverrides` (e.g. `MuiRadio: { styleOverrides: { root: { "&.Mui-checked": { color: "var(--primaryAccent, #007ac2)" } } } }`). Use `color-mix(in srgb, ...)` instead of `alpha()`, and configure `MuiLink` `styleOverrides` in `src/tokens/muiTheme.ts`.
- **Minimal CSS Injection**: CSS files are optional and carry no component chrome (cosmetics belong in `muiTheme.ts`). When used, strictly namespace classes (e.g. `.CustomWidget-body`) and never declare `:root`.
- **MUI Portal Containment**: Configure `MuiPopover.defaultProps.container` to return `.vsw-app` so popovers mount inside the host shell.
- **Strict Ban on `<CssBaseline />`**: NEVER mount `<CssBaseline />` under `VertiGisThemeProvider` or anywhere in extensions.
- **MUI v7 `slotProps` Standardization**: Use `slotProps` for composite controls (`<Dialog slotProps={{ paper: { ... } }}>`, `<TextField slotProps={{ input: { readOnly } }}>`).

## 3. Strict Component Modularity & Anti-God-Component Architecture
- **Strict File Size Thresholds**: Max 150–250 lines per file. Any file exceeding 250 lines MUST be refactored and decomposed.
- **JSX Only in `.tsx`**: Any file containing JSX MUST use the `.tsx` extension; never put JSX in a `.ts` file.
- **Standard Directory Blueprint**: Decompose complex components into:
  - `components/`: Presentational, stateless sub-components.
  - `hooks/`: Custom React hooks for state, lifecycle subscriptions, and business logic.
  - `services/`: Component-level services and integrations.
  - `utils/` / `helpers/`: Pure functions, calculations, and zero-dependency helpers.
  - `tokens/`: Design tokens and theme mappings.
  - `types/`: Type contracts, interfaces, and serialization models.
- **Model vs View Separation**:
  - MobX Component Models (`*Model.ts`): State, observables, service injection, and lifecycle hooks (`_onInitialize()`, `_onDestroy()`).
  - React Views (`*.tsx`): Visual rendering, layout slotting wrapped in `<LayoutElement {...props}>`, `observer()`, and `<ErrorBoundary>`.
- **Extraction Heuristics**:
  - Extract sub-views when JSX nesting exceeds 3 levels or individual visual sections emerge.
  - Extract event listeners, timers, and data operations into custom hooks.
  - Extract data formatting and business logic into pure, testable utility functions.

## 4. Component Architecture & Container Shell Contracts
- **`<LayoutElement {...props}>` Root**: Every React component view MUST wrap all JSX within `<LayoutElement {...props}>` from `@vertigis/web/components` for layout slotting and Designer support.
- **MobX `observer()`**: Wrap all React views that read model observables with `observer()` from `mobx-react-lite`.
- **`<ErrorBoundary>` Wrapping**: Wrap custom widget contents in an `<ErrorBoundary>` component to isolate runtime faults and protect host application stability.
- **Symmetric Lifecycle Sequencing**: In `_onInitialize()`, ALWAYS call `await super._onInitialize()` FIRST before setting up component resources. In `_onDestroy()`, ALWAYS clean up child subscriptions, intervals, and map layers FIRST, and invoke `await super._onDestroy()` LAST.
- **Strict Ban on Custom `_handles` Property**: NEVER declare a property named `_handles` (e.g., `private _handles = []`). Base `InitializableBase` / `HandlesMixin` initializes `this._handles` as an `@arcgis/core/core/Handles` instance. Declaring `_handles` in derived classes clobbers the base instance under ES2022 class field semantics, causing `TypeError: this._handles.destroy is not a function` during Designer unmount or deployment packaging. Use domain-specific names (e.g., `_eventHandles`, `_sketchHandles`, `_disposables`) or use inherited `this._handles.add(...)`.
- **Host Container Shell Contracts**:
  - **Tabs (`<tab-container>` / `<tabs>`)**: NEVER return `<LayoutElement style={{ display: "none" }} />` or an empty placeholder when `props.active === false`. Inactive tabs receive `active="false"`; the host tab container handles hiding and tab switching. Hiding the component internally leaves the tab blank white on click!
  - **Panels vs Bare Split Components**: In a `<panel>`, manage visibility via `ui.activate`/`ui.deactivate` on the **panel layout ID**. Bare in a `<split>`, manage visibility internally and invoke `ui.activate`/`ui.deactivate` on the **component ID**.
  - **Dialogs & Full-Height Stretches**: Custom dialog views MUST use `<LayoutElement {...props} stretch style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>`. STRICT BAN on injecting `<GlobalStyles !important>` targeting host dialog chrome.

## 5. Web Designer Settings Schema Protocol & XML Attribute Lifecycle
When exposing customizable component properties to the VertiGIS Studio Web Designer inspector panel:
- **Schema Declaration (`getLayoutDesignerSettingsSchema`)**: Return a `SettingsSchema` declaring setting fields (`id`, `type` such as `text`, `number`, `checkbox`, `select`, `displayName`, `description`).
- **Current Value Extraction (`getLayoutDesignerSettings`)**: Read XML attributes from layout node (`args.node.attributes.get(...)`) and map them to the Designer settings form state. Support both kebab-case (`telemetry-layout-id`) and camelCase (`telemetryLayoutId`).
- **Persisting Changes (`applyLayoutDesignerSettings`)**:
  - **Safe Trimming & Explicit Attribute Deletion**: NEVER write empty strings (`node.attributes.set(key, "")`). Writing empty strings creates sticky XML attributes that resurrect default values on reload. Always trim string inputs (`safeTrim`); if a value is present, call `node.attributes.set(kebabKey, val)`; if empty or cleared, call `node.attributes.delete(kebabKey)`.
  - **Live Model Synchronization**: Propagate configuration changes into the active model instance via `model.updateConfig(...)`.
- **Lifecycle Initialization from XML Node**: In `_onInitialize()`, component models must read `(this as any).node?.attributes` to guarantee that attributes declared in `layout.xml` are loaded immediately on startup even before the designer inspector is opened.

## 6. Feature Actions, Commands, & Arcade Scripting Protocol
- **Layer Filtering via `arcade.run`**: When configuring feature actions in Web Designer to trigger custom commands, always wrap the execution filter in `arcade.run` with a robust `canExecuteScript` using `HasKey($feature, 'Field')`:
  ```json
  [
    {
      "name": "arcade.run",
      "arguments": {
        "canExecuteScript": "(HasKey($feature, 'GFID') || HasKey($feature, 'gfid'))"
      }
    },
    "your-command.display"
  ]
  ```
- **Command Execution Contract**: Custom commands registered via `registerCommandHandler` must gracefully accept either an ArcGIS Graphic/Feature object (`target.attributes`) or a plain parameter map (`target.id`).

## 7. Gradual Verification Protocol & Mandatory Micro-Gates
Never treat verification as a single end-of-task formality. Enforce the **6-Tier Gradual Verification Gate** after every code edit. Run every tier, including the Rule Validator; a passing build and lint is NOT a passing gate. Report the exit code of each tier. Skip a tier only when its script does not exist in `package.json`, and say so:
1. **Fast Typecheck**: `tsc --noEmit` (clean types).
2. **Lint**: `npm run lint` (zero errors).
3. **Zero-Cosmetic-SX Check**: `npm run verify:styles` (= `python3 scripts/verify_zero_cosmetic_sx.py`) MUST exit 0.
4. **Unit & Contract Tests**: Test component logic AND Designer attribute persistence (asserting that empty strings delete XML attributes and kebab-case attributes map to camelCase).
5. **Production Build**: `npm run build` or `pnpm run build` (clean compilation).
6. **Rule Validator**: `python3 <skill-dir>/scripts/validate_web_sdk.py --path .` MUST exit 0, where `<skill-dir>` is the installed `vertigis-web-sdk-skill` folder (e.g. `~/.agents/skills/vertigis-web-sdk-skill`). Suppress a rule only with a written reason: `// vertigis-rule-disable RULE_ID -- <reason>`.
- **2-Strike Halt Gate**: If a fix fails verification twice on the same step, STOP. Report what was tried, what failed, and ask for guidance.

## 8. Ponytail Code Minimization & Zero-Garbage Invariant
- **Native Platform & MUI First**: Use native MUI controls (`IconButton`, `Typography`, `Box`, `Alert`) with VertiGIS theme tokens. NEVER write 30+ lines of custom CSS with `!important` to replicate native MUI buttons or toggles.
- **Deletion-First Refactoring**: When replacing an implementation or abandoning an API, delete the old implementation and all unused helper files FIRST. Verify with `knip` before authoring new code.
- **Zero Untracked Garbage**: Never leave experimental scrapers, orphan test fixtures, or dead wrappers in the codebase.
<!-- vertigis-web-sdk:end -->

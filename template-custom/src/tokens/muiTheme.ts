import { createTheme, type Theme } from "@mui/material/styles";

import { UI_TOKENS } from "./ui";

/**
 * The only home for cosmetic styling. Components keep sx to layout, geometry and 8px-grid spacing,
 * inherit everything else from the host shell's CSS custom properties, and express state as
 * data attributes (e.g. <Card data-status={status}>) that are styled here.
 */
export function createVertiGisTheme(isDark: boolean): Theme {
    return createTheme({
        palette: { mode: isDark ? "dark" : "light" },
        typography: { fontFamily: "inherit" },
        components: {
            MuiCard: {
                defaultProps: { variant: "outlined" },
                styleOverrides: {
                    root: {
                        position: "relative",
                        borderRadius: UI_TOKENS.shape.borderRadiusLarge,
                        backgroundColor: UI_TOKENS.surface.primary,
                        border: `1px solid ${UI_TOKENS.border.primary}`,
                        boxShadow: "none",
                        '&.StatusCard-root[data-status="Open"], &.StatusCard-root[data-status="Opened"]': {
                            borderLeftWidth: 4,
                            borderLeftColor: UI_TOKENS.status.warningFg,
                        },
                        '&.StatusCard-root[data-status="In Progress"]': {
                            borderLeftWidth: 4,
                            borderLeftColor: UI_TOKENS.accent.primary,
                        },
                        '&.StatusCard-root[data-status="Completed"]': {
                            borderLeftWidth: 4,
                            borderLeftColor: UI_TOKENS.status.successFg,
                        },
                        '&.StatusCard-root[data-status="Closed"], &.StatusCard-root[data-status="Archived"]': {
                            borderLeftWidth: 4,
                            borderLeftColor: UI_TOKENS.text.secondary,
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: "none" },
                    outlined: { borderColor: UI_TOKENS.border.primary, borderRadius: UI_TOKENS.shape.borderRadius },
                },
            },
            MuiFormControlLabel: {
                styleOverrides: {
                    root: {
                        marginLeft: 0,
                        marginRight: 0,
                    },
                },
            },
        },
    });
}

export default createVertiGisTheme;

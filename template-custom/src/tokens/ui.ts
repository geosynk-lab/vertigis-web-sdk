/**
 * UI Design Tokens for VertiGIS Studio Web SDK
 * Direct 1:1 mapping of official VertiGIS host CSS variables with guaranteed WCAG AA fallbacks.
 */

export const UI_TOKENS = {
    // 1. Direct 1:1 Host CSS Custom Property Mapping (Exact Names & Guaranteed Fallbacks)
    primaryBackground: "var(--primaryBackground, #ffffff)",
    secondaryBackground: "var(--secondaryBackground, #f5f5f5)",
    overlayBackground: "var(--overlayBackground, rgba(0, 0, 0, 0.5))",

    primaryForeground: "var(--primaryForeground, #212121)",
    secondaryForeground: "var(--secondaryForeground, #666666)",
    disabledForeground: "var(--disabledForeground, #9e9e9e)",

    primaryBorder: "var(--primaryBorder, #e0e0e0)",
    secondaryBorder: "var(--secondaryBorder, #eeeeee)",
    focusBorder: "var(--focusBorder, #007ac2)",

    primaryAccent: "var(--primaryAccent, #007ac2)",
    primaryAccentHover: "var(--primaryAccentHover, #005a91)",
    primaryAccentLight: "var(--primaryAccentLight, #e1f5fe)",
    buttonForeground: "var(--buttonForeground, #ffffff)",
    emphasizedButtonBackground: "var(--emphasizedButtonBackground, var(--primaryAccent, #007ac2))",

    itemHoverBackground: "var(--itemHoverBackground, rgba(0, 0, 0, 0.04))",
    itemSelectedBackground: "var(--itemSelectedBackground, rgba(0, 122, 194, 0.12))",

    alertRedBackground: "var(--alertRedBackground, #fdecea)",
    alertRedForeground: "var(--alertRedForeground, #d32f2f)",
    alertRedBorder: "var(--alertRedBorder, #f5c2c7)",

    alertGreenBackground: "var(--alertGreenBackground, #edf7ed)",
    alertGreenForeground: "var(--alertGreenForeground, #2e7d32)",
    alertGreenBorder: "var(--alertGreenBorder, #c3e6cb)",

    alertAmberBackground: "var(--alertAmberBackground, #fff4e5)",
    alertAmberForeground: "var(--alertAmberForeground, #ed6c02)",
    alertAmberBorder: "var(--alertAmberBorder, #ffeeba)",

    alertGrayBackground: "var(--alertGrayBackground, #e8f4fd)",
    alertGrayForeground: "var(--alertGrayForeground, #0288d1)",
    alertGrayBorder: "var(--alertGrayBorder, #bee5eb)",

    borderRadius: "var(--borderRadius, 4px)",
    borderRadiusSm: "var(--borderRadiusSm, 2px)",
    borderRadiusLarge: "var(--borderRadiusLarge, 8px)",
    shadowPrimary: "var(--shadowPrimary, 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24))",
    shadowElevated: "var(--shadowElevated, 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23))",

    // 2. Semantic Groupings
    surface: {
        primary: "var(--primaryBackground, #ffffff)",
        secondary: "var(--secondaryBackground, #f5f5f5)",
        overlay: "var(--overlayBackground, rgba(0, 0, 0, 0.5))",
        inverse: "var(--primaryForeground, #212121)",
    },
    text: {
        primary: "var(--primaryForeground, #212121)",
        secondary: "var(--secondaryForeground, #666666)",
        disabled: "var(--disabledForeground, #9e9e9e)",
        inverse: "var(--primaryBackground, #ffffff)",
    },
    border: {
        primary: "var(--primaryBorder, #e0e0e0)",
        secondary: "var(--secondaryBorder, #eeeeee)",
        focus: "var(--focusBorder, #007ac2)",
    },
    accent: {
        primary: "var(--primaryAccent, #007ac2)",
        hover: "var(--primaryAccentHover, #005a91)",
        light: "var(--primaryAccentLight, #e1f5fe)",
        contrastText: "var(--buttonForeground, #ffffff)",
    },
    control: {
        buttonBackground: "var(--emphasizedButtonBackground, var(--primaryAccent, #007ac2))",
        buttonForeground: "var(--buttonForeground, #ffffff)",
        itemHover: "var(--itemHoverBackground, rgba(0, 0, 0, 0.04))",
        itemSelected: "var(--itemSelectedBackground, rgba(0, 122, 194, 0.12))",
    },
    status: {
        errorBg: "var(--alertRedBackground, #fdecea)",
        errorFg: "var(--alertRedForeground, #d32f2f)",
        errorBorder: "var(--alertRedBorder, #f5c2c7)",
        successBg: "var(--alertGreenBackground, #edf7ed)",
        successFg: "var(--alertGreenForeground, #2e7d32)",
        successBorder: "var(--alertGreenBorder, #c3e6cb)",
        warningBg: "var(--alertAmberBackground, #fff4e5)",
        warningFg: "var(--alertAmberForeground, #ed6c02)",
        warningBorder: "var(--alertAmberBorder, #ffeeba)",
        infoBg: "var(--alertGrayBackground, #e8f4fd)",
        infoFg: "var(--alertGrayForeground, #0288d1)",
        infoBorder: "var(--alertGrayBorder, #bee5eb)",
    },
    shape: {
        borderRadius: "var(--borderRadius, 4px)",
        borderRadiusSm: "var(--borderRadiusSm, 2px)",
        borderRadiusLarge: "var(--borderRadiusLarge, 8px)",
        borderRadiusLg: "var(--borderRadiusLg, 8px)",
        borderRadiusRound: "50%",
        borderRadiusPill: "9999px",
        shadowPrimary: "var(--shadowPrimary, 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24))",
        shadowElevated: "var(--shadowElevated, 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23))",
    },
} as const;

export default UI_TOKENS;

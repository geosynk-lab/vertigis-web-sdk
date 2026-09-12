import * as React from "react";
import { Box, Typography } from "@mui/material";
import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { tokens } from "../../tokens";
import type { CustomWidgetModel } from "./CustomWidgetModel";
import { CustomWidgetErrorBoundary } from "./components/CustomWidgetErrorBoundary";

export interface CustomWidgetProps extends LayoutElementProperties<CustomWidgetModel> {}

function CustomWidgetView(props: CustomWidgetProps): React.ReactElement {
    const { model } = props;

    return (
        <LayoutElement {...props}>
            <Box
                sx={{
                    p: 2,
                    backgroundColor: tokens.ui.surface.primary,
                    border: `1px solid ${tokens.ui.border.primary}`,
                    borderRadius: tokens.ui.shape.borderRadius,
                    boxShadow: tokens.ui.shape.shadowPrimary,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: tokens.ui.text.primary,
                        fontFamily: tokens.typography.fontFamily.primary,
                        mb: 0.5,
                    }}
                >
                    {model.title}
                </Typography>

                <Typography
                    variant="subtitle2"
                    sx={{
                        color: tokens.ui.text.secondary,
                        fontFamily: tokens.typography.fontFamily.primary,
                        mb: 1.5,
                    }}
                >
                    Enterprise VertiGIS Component Architecture
                </Typography>

                <Box
                    sx={{
                        p: 1.5,
                        backgroundColor: tokens.ui.surface.secondary,
                        border: `1px solid ${tokens.ui.border.secondary}`,
                        borderRadius: tokens.ui.shape.borderRadius,
                    }}
                >
                    <Typography variant="body2" sx={{ color: tokens.ui.text.primary }}>
                        This widget demonstrates centralized tokens, safe fallbacks, and error boundary encapsulation.
                    </Typography>
                </Box>
            </Box>
        </LayoutElement>
    );
}

export default function CustomWidget(props: CustomWidgetProps): React.ReactElement {
    return (
        <CustomWidgetErrorBoundary>
            <CustomWidgetView {...props} />
        </CustomWidgetErrorBoundary>
    );
}

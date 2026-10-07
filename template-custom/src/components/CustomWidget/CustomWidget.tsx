import * as React from "react";
import { Card, CardContent, Paper, Stack, Typography } from "@mui/material";
import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import { VertiGisThemeProvider } from "../../tokens/VertiGisThemeProvider";
import type { CustomWidgetModel } from "./CustomWidgetModel";
import { CustomWidgetErrorBoundary } from "./components/CustomWidgetErrorBoundary";

export interface CustomWidgetProps extends LayoutElementProperties<CustomWidgetModel> {}

function CustomWidgetView(props: CustomWidgetProps): React.ReactElement {
    const { model } = props;
    useWatchAndRerender(model, "title");

    return (
        <LayoutElement {...props}>
            <Card>
                <CardContent>
                    <Stack spacing={1.5}>
                        <Stack spacing={0.5}>
                            <Typography variant="h6">{model.title}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                Enterprise VertiGIS Component Architecture
                            </Typography>
                        </Stack>
                        <Paper variant="outlined" sx={{ p: 1.5 }}>
                            <Typography variant="body2">
                                This widget demonstrates host-first theming: layout-only sx, 8px-grid spacing and
                                cosmetics centralised in src/tokens/muiTheme.ts.
                            </Typography>
                        </Paper>
                    </Stack>
                </CardContent>
            </Card>
        </LayoutElement>
    );
}

export default function CustomWidget(props: CustomWidgetProps): React.ReactElement {
    return (
        <VertiGisThemeProvider>
            <CustomWidgetErrorBoundary>
                <CustomWidgetView {...props} />
            </CustomWidgetErrorBoundary>
        </VertiGisThemeProvider>
    );
}

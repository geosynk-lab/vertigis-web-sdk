import * as React from "react";
import { Alert, AlertTitle, Button } from "@mui/material";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    errorMessage: string;
}

export class CustomWidgetErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorMessage: "" };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorMessage: error?.message || "Unknown error" };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("CustomWidget error:", error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, errorMessage: "" });
    };

    render(): React.ReactNode {
        if (this.state.hasError) {
            return (
                <Alert
                    severity="error"
                    action={
                        <Button size="small" color="inherit" onClick={this.handleRetry}>
                            Retry
                        </Button>
                    }
                >
                    <AlertTitle>Widget Display Error</AlertTitle>
                    {this.state.errorMessage}
                </Alert>
            );
        }
        return this.props.children;
    }
}

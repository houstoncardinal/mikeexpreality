import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log for debugging in Lovable console
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
        <div className="max-w-lg w-full rounded-2xl border border-border bg-card p-6 shadow-lg">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The app hit a runtime error and couldn't render this page. Reloading usually fixes it.
          </p>

          <button
            onClick={this.handleReload}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium"
          >
            Reload page
          </button>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-muted-foreground">Technical details</summary>
            <pre className="mt-2 max-h-60 overflow-auto rounded-lg bg-muted p-3 text-xs">
{this.state.error?.stack || this.state.error?.message || "Unknown error"}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}

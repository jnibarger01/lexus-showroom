import { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "./Button";

export interface AppErrorBoundaryProps {
  children: ReactNode;
  /** Optional override for tests — defaults to a full page reload. */
  onReload?: () => void;
  /** Optional home hash href (Pages-safe relative). */
  homeHref?: string;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

/**
 * Top-level boundary so a throw outside the 3D viewer does not white-screen
 * the SPA. The canvas still uses its own ModelErrorBoundary.
 */
export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App render error", error, info);
  }

  private handleReload = () => {
    if (this.props.onReload) {
      this.props.onReload();
      return;
    }
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const homeHref = this.props.homeHref ?? `${import.meta.env.BASE_URL}#home`;

    return (
      <div
        role="alert"
        className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-start justify-center gap-4 px-6 py-16 text-ink"
        data-testid="app-error-boundary"
      >
        <p className="text-xs font-semibold uppercase tracking-kicker text-muted">
          Something went wrong
        </p>
        <h1 className="font-display text-3xl tracking-tight">
          The showroom hit an unexpected error
        </h1>
        <p className="leading-7 text-muted">
          Reload the page to get back to the lineup. Your place in the showroom
          may reset.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button type="button" onClick={this.handleReload}>
            Reload page
          </Button>
          <a
            href={homeHref}
            className="inline-flex items-center justify-center rounded-full border border-line/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            onClick={() => {
              // Clear the boundary if the user navigates home without a full reload.
              this.setState({ hasError: false });
            }}
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;

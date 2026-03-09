import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <span className="text-5xl mb-4">🌱</span>
          <h1 className="text-xl font-bold mb-2">앱을 불러오는 중 오류가 발생했어요</h1>
          <p className="text-sm text-muted-foreground mb-6">
            잠시 후 다시 시도해 주세요
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
          >
            새로고침
          </button>
          {this.state.error && (
            <p className="mt-4 text-xs text-muted-foreground/60 max-w-xs break-all">
              {this.state.error.message}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

// 兜底错误边界：任何渲染期异常只影响当前页面并给出可恢复提示，避免演示中整页白屏。
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('页面渲染异常:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,#F6FBF9_0%,#E8F8F5_100%)] px-6 text-carbon">
          <div className="max-w-md rounded-[2rem] border border-white/70 bg-white p-8 text-center shadow-panel-soft">
            <h1 className="font-display text-2xl font-semibold">页面出现异常</h1>
            <p className="mt-3 text-sm leading-6 text-steel">
              演示页面遇到意外错误。请刷新页面重试；若持续出现，可清理浏览器本地数据后再试。
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-carbon px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-carbon/85"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

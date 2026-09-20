import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('HostelHub Uncaught Error Caught by Boundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = '/login';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-white">
          <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white dark:bg-[#131b2b] border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Something Went Wrong</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              HostelHub encountered an unexpected display issue. Your saved hostel data is preserved.
            </p>

            {this.state.error && (
              <div className="p-3 mb-6 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left overflow-x-auto text-xs font-mono text-rose-600 dark:text-rose-400">
                {this.state.error.message || 'Unknown error occurred'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
                onClick={this.handleReload}
                leftIcon={<Home className="w-4 h-4" />}
              >
                Reload Page
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
                onClick={this.handleReset}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Reset Session
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

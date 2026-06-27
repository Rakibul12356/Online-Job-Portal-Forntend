import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" className="p-8 text-center">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-gray-600">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

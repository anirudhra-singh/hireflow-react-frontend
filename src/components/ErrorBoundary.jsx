import { Component } from 'react';
import { primaryButton } from '../utils/ui.js';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div role="alert" className="mx-auto max-w-md p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
        <p className="mt-2 text-sm text-gray-600">
          This part of the app hit an unexpected problem. Your session is still active.
        </p>
        <button
          type="button"
          className={`${primaryButton} mt-4`}
          onClick={() => this.setState({ hasError: false })}
        >
          Try again
        </button>
      </div>
    );
  }
}
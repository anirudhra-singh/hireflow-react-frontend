import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { config } from './api/config.js';
import { AuthProvider } from './context/AuthProvider.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function ConfigError({ message }) {
  return (
    <main role="alert" className="mx-auto max-w-md p-6">
      <h1 className="text-lg font-semibold text-gray-900">Configuration problem</h1>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
    </main>
  );
}

const root = createRoot(document.getElementById('root'));

// Refuse to run (no router, no API calls) when the API URL is missing or insecure.
if (config.error) {
  root.render(<ConfigError message={config.error} />);
} else {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>,
  );
}
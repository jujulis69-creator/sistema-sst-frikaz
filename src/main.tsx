import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <ErrorBoundary fallbackTitle="Sistema de Gestión SG-SST — Frikaz S.A.S.">
      <App />
    </ErrorBoundary>
  );
}

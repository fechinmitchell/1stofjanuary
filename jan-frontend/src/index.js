import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WizardProvider } from './context/WizardContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WizardProvider>
          <App />
        </WizardProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
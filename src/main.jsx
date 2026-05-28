import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AppProviders from './app/providers/AppProviders';
import { routes } from './app/router/routes';

// Create router
const router = createBrowserRouter(routes);

// Render app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);

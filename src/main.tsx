import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { router } from './router'

// Only load the test sidebar and tests in development mode
if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_TWD_TESTS === 'true') {
  const { initTWD } = await import('twd-js/bundled');
  const tests = import.meta.glob("./**/*.twd.test.ts");
  
  // Initialize TWD with tests and optional configuration
  // Request mocking is automatically initialized
  initTWD(tests, {
    open: true,
    position: 'left',
    serviceWorker: true,
    serviceWorkerUrl: '/mock-sw.js',
    search: true,
  });

  // Connect twd-relay browser client
  const { createBrowserClient } = await import('twd-relay/browser');
  const client = createBrowserClient({ url: `${window.location.origin}/__twd/ws` });
  client.connect();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { router } from './router'

// Only load the test sidebar and tests in development mode
if (import.meta.env.DEV) {
  // Use Vite's glob import to find all test files
  const testModules = import.meta.glob("./**/*.twd.test.ts");
  const { initTests, twd, TWDSidebar } = await import('twd-js');
  // You need to pass the test modules, the sidebar component, and createRoot function
  initTests(testModules, <TWDSidebar open={true} position="left" />, createRoot);
  // Optionally initialize request mocking
  twd.initRequestMocking()
    .then(() => {
      console.log("Request mocking initialized");
    })
    .catch((err) => {
      console.error("Error initializing request mocking:", err);
    });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

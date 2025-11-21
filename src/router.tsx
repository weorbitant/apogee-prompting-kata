import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import App from "./App";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/chat",
    element: <App />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);


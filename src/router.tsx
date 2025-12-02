import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Kata from "./pages/Kata";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/chat",
    element: <Kata />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);


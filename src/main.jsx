import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // children: [
    //   {
    //     path: "/home",
    //     element: <Navbar />
    //   },
    // ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);

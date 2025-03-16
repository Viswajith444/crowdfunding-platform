import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import SignIn from "./components/SignIn.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
// import Navbar from "./components/Navbar.jsx";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/Home" replace />,
    },
    {
        path: "/Login",
        element: <Login />,
    },

    {
        path: "/Home",
        element: <App />,
        // children: [
        //   {
        //     path: "/home",
        //     element: <Navbar />
        //   },
        // ],
    },
    {
        path: "/SignIn",
        element: <SignIn />,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={routes} />
        </AuthProvider>
    </StrictMode>,
);

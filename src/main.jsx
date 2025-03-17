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
import CampaignForm from "./components/CampaignForm.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import CampaignDetail from "./components/CampaignDetail.jsx";
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
    {
        path: "/startCampaign",
        element: <CampaignForm />,
    },

    {
        path: "/campaign/:id",
        element: <CampaignDetail />,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={routes} />
        </AuthProvider>
    </StrictMode>,
);

// This file is the entry point to the application and the application routing.

import ReactDOM from "react-dom/client";

import Chapterpage from "./pages/chapterpage/Chapterpage";
import Familytreepage from "./pages/familytreepage/Familytreepage";
import Loginpage from "./pages/landingpage/Landingpage"
import Homepage from "./pages/homepage/Homepage";
import Timelinepage from "./pages/timelinepage/Timelinepage";

import {
    useLocation,
    Navigate,
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

// Authentication with aws amplify.
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

import "@aws-amplify/ui-react/styles.css";
import "./index.scss";

Amplify.configure(awsExports);

function RequireAuthentication({ children }) {
    const location = useLocation();
    const { route } = useAuthenticator((context) => [context.route]);

    if (route !== "authenticated") {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Loginpage />
    },
    {
        path: "/",
        element: <RequireAuthentication><Homepage /></RequireAuthentication>,
    },
    {
        path: "/timelinepage",
        element: <RequireAuthentication><Timelinepage /></RequireAuthentication>,
    },
    {
        path: "/familytreepage",
        element: <RequireAuthentication><Familytreepage /></RequireAuthentication>,
    },
    {
        path: "/chapterpage/:section/:year/:chapter",
        element: <RequireAuthentication><Chapterpage /></RequireAuthentication>,
    },
    {
        path: "*",
        element: <Navigate to="/" />
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Authenticator.Provider>
        <RouterProvider router={router} />
    </Authenticator.Provider>
);
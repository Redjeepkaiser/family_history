// This file defines the loginpage, which is shown when the user navigates to
// any page that requires authentication.

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";

import drawing from "./rebeccas_tekening_transparent.png";
import "./Landingpage.scss";

export default function Landingpage() {
    const { route } = useAuthenticator((context) => [context.route]);
    const location = useLocation();
    const navigate = useNavigate();
    let from = location.state?.from?.pathname || "/";

    // If any of the state values change, this function is called. If the user is 
    // authenticated it redirects them to the previous target location.
    useEffect(() => {
        if (route === "authenticated") {
            navigate(from, { replace: true });
        }
    }, [route, navigate, from]);

    return (
        <div id="landingpage">
            <div id="landingpage__content">
                <div id="hero">
                    <img
                        src={drawing}
                        height={"100%"}
                        width={"100%"}
                        alt={"A drawing by Rebecca"}
                    />
                </div>
                <div id="auth">
                    <Authenticator id="authenticator" hideSignUp={true} />
                </div>
            </div>
        </div>
    );
}
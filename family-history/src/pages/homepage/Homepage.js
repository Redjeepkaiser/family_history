// This file defines the homepage, which is a page that provides a menu to the
// user to navigate to the familytreepage and the timelinepage.

import { useAuthenticator } from "@aws-amplify/ui-react";
import { motion } from "framer-motion";

import NavButton from "./NavButton";

import "./Homepage.scss";

export default function Homepage() {
    const { signOut } = useAuthenticator((context) => [context.signOut]);

    return (
        <div id="homepage">
            <motion.button
                id="signout"
                onClick={signOut}
                whileHover={{ scale: 1.2 }}
            >
                <span>Sign out</span>
            </motion.button>
            <NavButton to={"/timelinepage"}>
                <h1>Timeline</h1>
                <span>An interactive timeline through our families history</span>
            </NavButton>
            <NavButton to={"/familytreepage"}>
                <h1>Family tree</h1>
                <span>A graph representing our entire family tree</span>
            </NavButton>
        </div>
    );
}
// This file defines the fancy navigation buttons used on the homepage.
// Animations are done in css. 

import { Link } from "react-router-dom";

import "./NavButton.scss";

export default function NavButton(props) {
    return (
        <div className="navbutton" >
            <Link to={props.to} style={{ textDecoration: "none" }}>
                <div className="svg-wrapper">
                    <svg height="100%" width="100%">
                        <line className="top" x1="0" y1="0" x2="900" y2="0" />
                        <line className="left" x1="0" y1="460" x2="0" y2="-920" />
                        <line className="bottom" x1="300" y1="460" x2="-600" y2="460" />
                        <line className="right" x1="300" y1="0" x2="300" y2="1380" />
                    </svg>
                    {props.children}
                </div>
            </Link>
        </div>
    );
}
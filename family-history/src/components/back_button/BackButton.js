// This file defines a component that can be used to navigate back to the
// previous page.

import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow_left.svg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./BackButton.scss";

export default function BackButton(props) {
    const navigate = useNavigate();

    return (
        <motion.div
            className="back-button"
            onClick={() => { navigate(props["to"], { state: props.state }) }}
            whileHover={{ scale: 1.5 }}
        >
            <ArrowLeft className="arrow-left" fill={props.color} />
        </motion.div>
    );
}
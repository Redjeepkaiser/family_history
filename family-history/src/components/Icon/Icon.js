import React from "react"

// Icons
import { ReactComponent as arrowRight } from "../../assets/icons/arrow_right.svg"
import { ReactComponent as arrowLeft } from "../../assets/icons/arrow_left.svg"
import { ReactComponent as x } from "../../assets/icons/x.svg"
import { ReactComponent as clockWise } from "../../assets/icons/arrow-clockwise.svg"
import { ReactComponent as arrowUp } from "../../assets/icons/arrow-up.svg"
import { ReactComponent as arrowDown } from "../../assets/icons/arrow-down.svg"

// Styles
import "./Icon.scss"

const icons = {
    "arrow_right": arrowRight,
    "arrow_left": arrowLeft,
    "arrow_up": arrowUp,
    "arrow_down": arrowDown,
    "x": x,
    "clockwise": clockWise
};

class Icon extends React.Component {
    render() {
        const Icon = icons[this.props.name]

        return (
            <Icon className={`icon ${this.props.className}`} />
        );
    }
}

export default Icon;
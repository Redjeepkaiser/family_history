// This file defines an infoblock component, which is shown to the user when
// they select a node either from the graph or menu.

import { motion } from "framer-motion";
import Icon from "src/components/Icon/Icon";

import "./Menu.scss";

// Function used to sort the menu in alphabetical order.
function compareItems(a, b) {
    let aFirst = a.props.children.props.children[0];
    let bFirst = b.props.children.props.children[0];

    if (aFirst > bFirst) {
        return 1;
    }

    if (bFirst > aFirst) {
        return -1;
    }

    return 0;
}

export default function Menu(props) {
    if (!props.json) {
        return null;
    }

    let items = [];

    for (let i = 0; i < props.json.nodes.length; i++) {
        items.push(
            <motion.div className="menu__scroller__item"
                key={i}
                onClick={
                    () => { props.onSelect(props.json.nodes[i].id) }
                }
                whileHover={{ scale: 1.5 }}
            >
                <div
                    className="menu__scroller__item_name">
                    {props.json.nodes[i].f} {props.json.nodes[i].l}
                </div>
            </motion.div>
        )
    }

    items.sort(compareItems);

    return (
        <div className="menu">
            <p className="hint_up">Scroll up</p>
            <motion.button
                className="menu__up"
                onClick={() => { document.getElementById("menu").scrollBy(0, -40) }}
                whileHover={{ scale: 1.5 }}
            >
                <Icon className="arrow" name="arrow_up" />
            </motion.button>
            <div className="menu__scroller" id="menu">
                {items}
            </div>
            <motion.button
                className="menu__down"
                onClick={() => { document.getElementById("menu").scrollBy(0, 40) }}
                whileHover={{ scale: 1.5 }}
            >
                <Icon className="arrow" name="arrow_down" />
            </motion.button>
            <p className="hint_down">Scroll down</p>
        </div>
    );
}
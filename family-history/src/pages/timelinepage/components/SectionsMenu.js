// The SectionsMenu component provides a menu for the different intervals in
// which the chapters are placed.

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

import Icon from "src/components/Icon/Icon";

import "./SectionsMenu.scss";

export default function SectionsMenu(props) {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    const [pWidth, setPWidth] = useState(0);
    let dragOffset = (width / 2) - (pWidth / 4);

    // Update width when sections are loaded.
    useEffect(() => {
        setWidth(ref.current.offsetWidth);
        setPWidth(ref.current.parentElement.offsetWidth);
    }, [props.sections]);

    return (
        <motion.div
            key="sections_menu"
            id="sections_menu"
            drag="x"
            initial={{ x: props.offset }}
            dragConstraints={{
                top: 0,
                left: -dragOffset,
                right: dragOffset,
                bottom: 0
            }}
            dragMomentum={true}
            dragTransition={{ bounceStiffness: 1000, bounceDamping: 100 }}
            ref={ref}
        >
            <div id="sections_menu__container">
                {
                    Object.keys(props.sections).length > 0 ?
                        props.sections.map(element =>
                            <motion.button
                                key={element}
                                onClick={() => props.onClick(element)}
                                whileHover={{ scale: 1.5 }}
                            >
                                {element}
                            </motion.button>
                        )
                        :
                        null
                }
            </div>
            <div id="sections_menu__drag_me">
                <Icon name="arrow_left" />
                DRAG ME
                <Icon name="arrow_right" />
            </div>
        </motion.div>
    );
}
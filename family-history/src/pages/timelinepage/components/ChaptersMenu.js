// The ChaptersMenu component shows the chapters within a certain time interval
// (section).

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as FancyUnderline } from "src/assets/icons/fancy_underline.svg";

import "./ChaptersMenu.scss";

export default function ChaptersMenu(props) {
    const navigate = useNavigate();

    function getOffsetSections() {
        let sections = document.getElementById("sections_menu");
        let transform = window.getComputedStyle(sections).transform;
        let vals = transform.match(/matrix.*\((.+)\)/);

        if (vals == null) {
            return 0;
        } else {
            return parseFloat(vals[1].split(", ")[4]);
        }
    }

    function getOffsetChapters() {
        return document.getElementById("chapters_menu__wrapper").scrollTop;
    }

    function scrollToOffset(offset) {
        document.getElementById("chapters_menu__wrapper").scrollTop += offset;
    }

    useEffect(() => {
        scrollToOffset(props.offset);
    }, [props.offset, props.chapters]);


    function renderChapters() {
        if (Object.keys(props.chapters).length === 0) {
            return null;
        }

        return (
            props.chapters[props.selectedSection].map(element =>
                <div
                    key={element.name}
                    onClick={() => {
                        let offsetSections = getOffsetSections();
                        let offsetChapters = getOffsetChapters();
                        navigate(
                            `/chapterpage/${props.selectedSection}/${element.year}/${element.name}`,
                            {
                                state:
                                {
                                    selectedSection: props.selectedSection,
                                    offsetSections: offsetSections,
                                    offsetChapters: offsetChapters
                                }
                            }
                        );
                    }}
                >
                    <div id="chapters_menu__chapter">
                        <div id="chapters_menu__chapter__time">
                            {element.year}
                        </div>
                        <button>
                            {element.name.replace(/^\d+\s*/, "").toUpperCase()}
                        </button>
                        <FancyUnderline width={"300px"} fill={"white"} />
                    </div>
                </div>
            )
        )
    }

    return (
        <div id="chapters_menu">
            <div id="chapters_menu__wrapper">
                <div id="chapters_menu__menu">
                    {renderChapters()}
                </div>
            </div>
        </div>
    );
}
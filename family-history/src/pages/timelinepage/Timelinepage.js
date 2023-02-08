// The component Timelinepage is a composition of the chaptersmenu and sections
// menu. This component keeps track of the current selected section.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ChaptersMenu from "./components/ChaptersMenu";
import getSections from "src/libs/getSections";
import SectionsMenu from "./components/SectionsMenu";
import BackButton from "src/components/back_button/BackButton";

import "./Timelinepage.scss";

export default function Timelinepage() {
    let location = useLocation();

    let [chapters, setChapters] = useState({});
    let [sections, setSections] = useState({});
    let [selectedSection, setSelectedSection] = useState("");

    // Call the asynchronous getSections() function.
    useEffect(() => {
        getSections().then(value => {
            let s = Object.keys(value).sort();

            setChapters(value);
            setSections(s);
            setSelectedSection(location.state ?
                location.state.selectedSection :
                s[Math.floor(s.length / 2)]
            );
        }).catch();
    }, [location.state]);

    return (
        <>
            <BackButton to="/" color="white" />
            <div className="timelinepage">
                <div className="timelinepage__chapters_menu_wrapper">
                    <ChaptersMenu
                        chapters={chapters}
                        selectedSection={selectedSection}
                        offset={location.state ? location.state.offsetChapters : 0}
                    />
                </div>
                <div className="timelinepage__sections_menu_wrapper">
                    <SectionsMenu
                        sections={sections}
                        onClick={setSelectedSection}
                        offset={location.state ? location.state.offsetSections : 0}
                    />
                </div>
            </div>
        </>
    );
}
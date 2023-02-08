// The chapter pages shows all the content of a certain chapter by using an api
// call to retrieve this data from the s3 bucket.

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import ContentBlock from "./components/ContentBlock";
import getChapter from "src/libs/getChapter";

import "./Chapterpage.scss";
import BackButton from "src/components/back_button/BackButton";

export default function Chapterpage() {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    console.log("c", location)

    const filename = `sections/${params["section"]}/${params["year"]}/${params["chapter"]}`;
    const [content, setContent] = useState();

    // Navigate to homepage if this chapter does not exist.
    useEffect(() => {
        getChapter(filename).then(value => {
            setContent(value);
        }).catch(() => {
            navigate("/homepage");
        });
    }, [filename, navigate]);

    if (!content) {
        return null;
    }

    return (
        <>
            <BackButton to="/timelinepage" state={location.state} />
            <div className="chapterpage">
                {content.map((element, i) => <ContentBlock key={i} content={element} />)}
            </div>
        </>
    );
}
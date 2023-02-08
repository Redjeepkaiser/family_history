// This file defines one block of content in a chapter.

import "./ContentBlock.scss";

export default function ContentBlock(props) {
    let content = props["content"];
    let content_block;
    let content_type;

    switch (content["Type"]) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
            content_type = "header";
            content_block = <h1>{content["Text"]}</h1>;
            break;
        case "img":
            content_type = "img";
            content_block =
                <>
                    <img
                        src={content["Src"]}
                        alt={content["Text"]}
                    />;
                    <p>
                        {content["Text"]}
                    </p>
                </>;
            break;
        case "p":
            content_type = "paragraph";
            content_block = <p>{content["Text"]}</p>;
            break;
        case "h6":
            content_type = "poem";
            content_block = <p>{content["Text"]}</p>;
            break;
        default:
            content_type = "";
            content_block = <div></div>;
    }

    return <div className={`content-block ${content_type}`}>{content_block}</div>;
}
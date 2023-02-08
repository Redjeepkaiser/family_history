// The getChapter function retrieves all the content of a certain chapter, it
// makes a seperate api call to retrieve each image.

import { Storage } from "aws-amplify";

import getImageSrc from "./getImageSrc";

export default async function getChapter(filename) {
    let result = await Storage.get(filename,
        {
            level: "public",
            download: true,
            contentType: "text/html"
        }
    );

    let content = JSON.parse(await result.Body.text());
    let elements = content["Elements"];

    elements = await Promise.all(elements.map(async (value) => {
        if (value["Type"] === "img") {
            value["Src"] = await getImageSrc(value["ImgId"]);
            return value;
        } else {
            return value;
        }
    }));

    return elements;
}
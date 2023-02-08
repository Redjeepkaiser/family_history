// This file can be used to get a list of all the sections stored in the s3
// bucket.

import { Storage } from "aws-amplify";

export default async function getSections() {
    let files = await Storage.list("sections");
    let sections = buildSections(files);

    return sections;
}

export function buildSections(files) {
    let sections = {};

    for (let file of files) {
        let split = file["key"].split("/");
        let interval = parseInt(split[1]);
        let year = parseInt(split[2]);
        let name = split.slice(3).join("/");

        if (!(interval in sections)) {
            sections[interval] = [];
        }

        sections[interval].push({ name: name, year: year });
    }

    return sections;
}
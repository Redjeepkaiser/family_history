// The getTree function can be called to retrieve the file containing the tree
// structure from the s3 bucket.

import { Storage } from "aws-amplify";

export default async function getTree() {
    let result = await Storage.get("tree.json",
        {
            level: "public",
            download: true,
            contentType: "text/plain",
        }
    );

    let content = JSON.parse(await result.Body.text());
    return content;
}
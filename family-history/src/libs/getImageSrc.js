// The getImageSrc function can be called given an image id to retrieve a
// signed url to a certain image.

import { Storage } from "aws-amplify";

export default async function getImageSrc(id) {
    let result = await Storage.get(`images/${id}`,
        {
            level: "public",
            contentType: "image/jpeg",
        }
    );

    return result;
}
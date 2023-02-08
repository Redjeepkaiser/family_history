# Family History

## Introduction
This is a project that pulls files from google drive and gives acces to them in
a more applealing way by placing the documents in an interactive timeline on a
nice looking website. An additional feature is a interactive overview of a
family tree using cytoscape.

The project allows for realtime updates to the content if any document on
google drive are modified and also shows any images that are embedded into
drive files, with subtitles when properly formatted.

## Structure
    .
    ├── aws-lambda-start-google-watch   # Lambda function to trigger google watch periodically 
    ├── aws-lambda-update-s3            # Lambda function to update content in the s3 bucket
    ├── family-history                  # React project
    └── README.md

## AWS lambda start google watch
This function is periodically called to make sure google sends a message to our
API endpoint to update content for the website when a drive document is changed.

Code is written in golang. It retrieves all the data it needs, such as the
address endpoint that google should notify when google drive documents have
changed, or necessary credentials from the AWS parameter store. To set this up,
a [google drive service account](https://cloud.google.com/iam/docs/service-accounts)
needs to be made that has acces to the google drive documents which we want to
use. Credentials from this account can then be used to athenticate requests to
the [google watch](https://developers.google.comdrive/api/v3/reference/changes/watch)
endpoint. Since the maximum duration that google allows for watching resources
is a week, this lambda function needs to be triggered periodically.

This function has a local version that can be run locally if you
have set up a google service account. Can be compiled with:

```
cd aws-lambda-start-google-watch/cmd/local &&
GOOS=linux go build -o ./main ./main.go
```

To deploy as a lambda function, first compile the lambda function.

```
cd aws-lambda-start-google-watch/cmd/lambda &&
GOOS=linux go build -o ./main ./main.go
```

Then zip the binary and upload it to AWS.

## AWS lambda update s3
This lambda function updates content stored in the s3 bucket when it recieves
a notification that google drive documents have been changed.

Code is written in golang. It retrieves all the data it needs, such as the
necessary credentials from the AWS parameter store. Once triggered with a valid
google request, it updates content stored in the s3 bucket used as a source for
pages on the website. To do this, first a list of changed documents is made.
Next, all those documents are retrieved in html format and parsed to extract the
content needed for the website. The parsed data is then stored in an s3 bucket.

This function has a local version that can be run locally if you
have set up a google service account and aws account with the necessary
parameters in the parameter store. Can be compiled with:

```
cd aws-lambda-update-s3/cmd/local &&
GOOS=linux go build -o ./main ./main.go
```

To deploy as a lambda function, first compile the lambda function.

```
cd aws-lambda-update-s3/cmd/lambda &&
GOOS=linux go build -o ./main ./main.go
```

Then zip the binary and upload it to AWS.


## Family-history
Code is written in javascript using the react framework. It is deployed using
[AWS amplify](https://aws.amazon.com/amplify/hosting/) and uses cytoscape for
displaying an interactive graph. For authentication, use is made of AWS
services that come with amplify. Content is retrieved from the associated s3
bucket using the provided libraries.

After setting up amplify, code can be deployed with the command:

```
amplify publish
```

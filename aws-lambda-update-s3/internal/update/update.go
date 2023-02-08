// Package update provides the utility that updates content of the s3 bucket.
// This is done using the google drive api for retrieving data and the aws api
// for storing data and credentials.
package update

import (
	"aws-lambda-update-s3/internal/aws"
	"aws-lambda-update-s3/internal/parser"
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strconv"

	"golang.org/x/oauth2/google"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

func Do(s aws.AwsSession) error {
	fmt.Printf("test0")

	srv, client, err := getService(s)
	if err != nil {
		return err
	}

	fmt.Printf("test1")

	token, err := s.GetParam("GoogleStartPageToken", true)
	if err != nil {
		return err
	}

	fmt.Printf("test2")

	changes, err := getAllChanges(srv, token)
	if err != nil {
		return err
	}

	fmt.Printf("test3")

	for _, change := range changes.Changes {
		if err := syncChange(srv, client, change, s); err != nil {
			fmt.Printf(
				"Error synching change %s:	 %s\n",
				change.File.Name,
				err,
			)
		}
	}

	if err := s.SetParam(
		"GoogleStartPageToken",
		changes.NewStartPageToken,
		true); err != nil {
		return err
	}

	return nil
}

func getService(s aws.AwsSession) (*drive.Service, *http.Client, error) {
	data, err := s.GetParam("GoogleCredentials", true)
	if err != nil {
		return nil, nil, err
	}

	conf, err := google.JWTConfigFromJSON(
		[]byte(data),
		drive.DriveReadonlyScope,
	)
	if err != nil {
		return nil, nil, err
	}

	client := conf.Client(context.Background())

	srv, err := drive.NewService(
		context.Background(),
		option.WithHTTPClient(client),
	)

	if err != nil {
		return nil, nil, err
	}

	return srv, client, nil
}

func getAllChanges(srv *drive.Service, token string) (*drive.ChangeList, error) {
	currPage, err := srv.Changes.List(token).Do()
	if err != nil {
		return nil, err
	}

	if currPage.NewStartPageToken != "" {
		return currPage, nil
	}

	changes := make([]*drive.Change, 0)
	changes = append(changes, currPage.Changes...)
	nextPageToken := currPage.NextPageToken

	for nextPageToken != "" {
		currPage, err = srv.Changes.List(nextPageToken).Do()

		if err != nil {
			return nil, err
		}

		changes = append(changes, currPage.Changes...)
		nextPageToken = currPage.NextPageToken
	}

	currPage.Changes = changes

	return currPage, nil
}

func syncChange(
	srv *drive.Service,
	client *http.Client,
	change *drive.Change,
	s aws.AwsSession,
) error {
	if change.Removed {
		return nil
	}

	// Check if it is a change to a file, not to a folder.
	if change.ChangeType == "file" &&
		change.File.MimeType == "application/vnd.google-apps.document" {
		filename, err := parseName(change.File.Name)
		if err != nil {
			return err
		}

		resp, err := srv.Files.Export(change.FileId, "text/html").Download()
		if err != nil {
			fmt.Printf("Failed to download")
			return err
		}
		defer resp.Body.Close()
		data, err := io.ReadAll(resp.Body)
		if err != nil {
			return err
		}

		contents := string(data)
		parsed_content, err := parser.Parse(contents, client, s)

		if err != nil {
			return err
		}

		err = s.WriteFileToS3Bucket(
			bytes.NewReader([]byte(parsed_content)),
			fmt.Sprintf("public/sections/%s", filename),
		)
		if err != nil {
			fmt.Printf("S3 problem: %s", err)
		}
	}

	return nil
}

var regex = regexp.MustCompile(
	`(.*?)\s*\(\s*(?:(\d+)|(\d+)\s*-\s*\d+)\s*\)`,
)

// Function parses google drive file names and extracts the data from the title
// using the regex above.
func parseName(filename string) (string, error) {
	res := regex.FindStringSubmatch(filename)
	if res == nil {
		return "", fmt.Errorf("could not parse filename")
	}

	year, err := strconv.Atoi(res[2] + res[3])
	if err != nil {
		return "", err
	}

	r := fmt.Sprintf("%d/%d/%s", year/10*10, year, res[1])

	return r, nil
}

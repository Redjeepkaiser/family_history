// Package parse provides the utility to parse html content from the google
// drive api. It returns a marshalled json object containing the extracted
// content. It uses a google api client to complete the necessary
// authentication for downloading images.

package parser

import (
	"aws-lambda-update-s3/internal/aws"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"

	"github.com/anaskhan96/soup"
)

// Regex that matches text elements from a google drive html format document.
var textElement = regexp.MustCompile(`\s*?p|h[1-6]\s*?`)

// Regex that matches all whitespace.
var whiteSpace = regexp.MustCompile(`\s+`)

// Struct websiteElement is the json representation of a single element for the
// website.
type websiteElement struct {
	// Type of an element. Can be h1, h2, h3, h4, h5, h6, p or img.
	Type string

	// Text in an element.
	Text string

	// A unique identifier for an image. This is left empty if the type of the
	// element is not an img.
	ImgId string
}

// Struct websiteDocument is the json representation containing all the
// extracted the content from a google drive document.
type websiteDocument struct {
	// All the elements contained in a document.
	Elements []websiteElement
}

// Function Parse parses the html that is passed to it. It returns a marshalled
// json representation of a google drive document.
func Parse(html string, client *http.Client, s aws.AwsSession) ([]byte, error) {
	htmlRoot := soup.HTMLParse(html)
	htmlBody := htmlRoot.Find("body")
	htmlElements := htmlBody.Children()

	elements := make([]websiteElement, 0)

	for _, htmlElement := range htmlElements {
		if match := textElement.MatchString(htmlElement.NodeValue); match {
			cleanedText := strings.TrimSpace(
				whiteSpace.ReplaceAllString(htmlElement.FullText(), " "),
			)
			htmlImages := htmlElement.FindAll("img")

			if len(htmlImages) != 0 {
				imageElements, err := getImages(
					htmlImages,
					cleanedText,
					client,
					s,
				)
				if err != nil {
					return []byte{}, err
				}

				elements = append(elements, imageElements...)
			} else if cleanedText != "" {
				elements = append(elements, websiteElement{
					htmlElement.NodeValue,
					cleanedText,
					"",
				})
			}
		}
	}

	return json.Marshal(websiteDocument{elements})
}

// Function getImages puts all images from a document in an s3 bucket.
func getImages(
	htmlImages []soup.Root,
	text string,
	client *http.Client,
	s aws.AwsSession,
) ([]websiteElement, error) {
	elements := make([]websiteElement, 0)
	for _, htmlImage := range htmlImages {
		src := htmlImage.Attrs()["src"]
		u, err := url.Parse(src)
		if err != nil {
			return nil, err
		}

		imgID := u.Path[1:]
		elements = append(elements, websiteElement{"img", text, imgID})

		resp, err := client.Get(src)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()

		data, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, err
		}

		s.WriteFileToS3Bucket(
			bytes.NewReader([]byte(data)),
			fmt.Sprintf("public/images/%s", imgID),
		)
		if err != nil {
			return nil, err
		}
	}

	return elements, nil
}

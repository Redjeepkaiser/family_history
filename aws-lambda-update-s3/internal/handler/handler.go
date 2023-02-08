// This package contains a lambda function handler that updates content in
// the s3 bucket if it receives a valid google watch request. The content
// consists of parsed files from google drive that are retrieved using the
// google drive api.
package handler

import (
	"aws-lambda-update-s3/internal/aws"
	"aws-lambda-update-s3/internal/update"
	"errors"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

type handler struct {
	google_channel_id    string
	google_channel_token string
	aws_session aws.AwsSession
}

func New(s aws.AwsSession) (*handler, error) {
	google_channel_id, err := s.GetParam("GoogleChannelID", true)
	if err != nil {
		fmt.Printf("Could not retrieve channel id: %s\n", err)
		return nil, err
	}

	google_channel_token, err := s.GetParam("GoogleChannelToken", true)
	if err != nil {
		fmt.Printf("Could not retrieve token: %s\n", err)
		return nil, err
	}

	return &handler{
		google_channel_id:    google_channel_id,
		google_channel_token: google_channel_token,
		aws_session: s,
	}, nil
}

// Handles a lambda trigger event. The only valid events are events triggered
// by a google watch request. If this function receives a valid google watch
// request, it updates the content in the s3 bucket by using the google drive
// api.
func (h handler) HandleEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if !h.authenticateRequest(request) {
		return events.APIGatewayProxyResponse{StatusCode: 401},
			errors.New("invalid credentials in google notification")
	}

	if err := update.Do(h.aws_session); err != nil {
		fmt.Printf("%s", err)
		return events.APIGatewayProxyResponse{StatusCode: 500}, err
	}

	return events.APIGatewayProxyResponse{StatusCode: 200}, nil
}

// AuthenticateRequest checks if the google watch request contains the correct
// channel ID and the corresponding token.
func (h handler) authenticateRequest(request events.APIGatewayProxyRequest) bool {
	channelID, ok := request.Headers["X-Goog-Channel-ID"]
	if !ok {
		return false
	}

	channelToken, ok := request.Headers["X-Goog-Channel-Token"]
	if !ok {
		return false
	}

	if channelID != h.google_channel_id || channelToken != h.google_channel_token {
		return false
	}

	return true
}

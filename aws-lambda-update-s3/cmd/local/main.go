package main

import (
	"aws-lambda-update-s3/internal/aws"
	"aws-lambda-update-s3/internal/handler"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

// During development this function an be used to trigger the lambda function
// with a test event
func main() {
	testEvent, err := makeTestEvent()

	if err != nil {
		fmt.Printf("%s", err)
		return
	}

	s := aws.New()

	h, err := handler.New(*s)
	if err != nil {
		fmt.Printf("%s", err)
		return
	}

	if _, err := h.HandleEvent(testEvent); err != nil {
		fmt.Printf("%s", err)
	}
}

// This function constructs a test event.
func makeTestEvent() (events.APIGatewayProxyRequest, error) {
	s := aws.New()
	google_channel_id, err := s.GetParam("GoogleChannelID", true)

	if err != nil {
		return events.APIGatewayProxyRequest{}, err
	}

	google_channel_token, err := s.GetParam("GoogleChannelToken", true)
	if err != nil {
		return events.APIGatewayProxyRequest{}, err
	}

	var testEvent events.APIGatewayProxyRequest = events.APIGatewayProxyRequest{
		Headers: map[string]string{
			"X-Goog-Channel-ID":    google_channel_id,
			"X-Goog-Channel-Token": google_channel_token,
		},
	}

	return testEvent, nil
}

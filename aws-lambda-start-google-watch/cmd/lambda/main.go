package main

import (
	"aws-lambda-start-google-watch/internal/handler"

	"github.com/aws/aws-lambda-go/lambda"
)

// Entry point
func main() {
	lambda.Start(handler.HandleEvent)
}

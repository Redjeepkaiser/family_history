package main

import (
	"aws-lambda-update-s3/internal/aws"
	"aws-lambda-update-s3/internal/handler"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

// Entry point
func main() {
	s := aws.New()
	h, err := handler.New(*s)
	if err != nil {
		fmt.Printf("%s", err)
		return
	}

	lambda.Start(h.HandleEvent)
}

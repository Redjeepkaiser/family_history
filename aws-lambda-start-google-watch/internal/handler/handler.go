package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/drive/v2"
	"google.golang.org/api/option"
)

// Handles a lambda trigger event.
func HandleEvent() {
	srv, _, err := getService()
	if err != nil {
		fmt.Printf("Failed to get srv: %s", err)
		return
	}

	url, err := getParam("GoogleCallbackURL")
	if err != nil {
		fmt.Printf("Failed to get callbackurl: %s\n", err)
		return
	}

	id, err := getParam("GoogleChannelID")
	if err != nil {
		fmt.Printf("Failed to get channel ID: %s\n", err)
		return
	}

	token, err := getParam("GoogleChannelToken")
	if err != nil {
		fmt.Printf("Failed to get channel token: %s\n", err)
		return
	}

	c := drive.Channel{
		Address:    url,
		Expiration: time.Now().UnixMilli() + (7 * 24 * 60 * 60 * 1000) - (5 * 60 * 1000),
		Id:         id,
		Token:      token,
		Type:       "web_hook",
	}

	resp, err := srv.Changes.Watch(
		&c,
	).Do()

	if err != nil {
		fmt.Printf("%s\n", err)
		return
	}

	u, err := json.Marshal(resp)
	if err != nil {
		fmt.Printf("Failed marshal")
	}

	fmt.Printf("Res: %s\n", u)
}

func getSSMService() (*ssm.SSM, error) {
	sess, err := session.NewSession()
	if err != nil {
		return nil, err
	}

	return ssm.New(sess, aws.NewConfig().WithRegion("eu-central-1")), nil
}

func getParam(paramName string) (string, error) {
	srv, err := getSSMService()
	if err != nil {
		return "", err
	}
	param, err := srv.GetParameter(&ssm.GetParameterInput{
		Name:           aws.String(paramName),
		WithDecryption: aws.Bool(true),
	})
	if err != nil {
		return "", err
	}

	return *param.Parameter.Value, nil
}

func getService() (*drive.Service, *http.Client, error) {
	data, err := getParam("GoogleCredentials")
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

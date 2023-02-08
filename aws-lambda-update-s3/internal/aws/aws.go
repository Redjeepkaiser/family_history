// Package aws provides functionality to interact with the aws api.

package aws

import (
	"bytes"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/aws/aws-sdk-go/service/ssm"
)

type AwsSession struct {
	sess        *session.Session
	ssm         *ssm.SSM
	uploader    *s3manager.Uploader
	bucket_name string
}

func New() *AwsSession {
	sess := session.Must(
		session.NewSession(aws.NewConfig().WithRegion("eu-central-1")),
	)
	ssm := ssm.New(sess)
	uploader := s3manager.NewUploader(sess)

	s := AwsSession{sess: sess, ssm: ssm, uploader: uploader}

	bucket, err := s.GetParam("S3BucketName", true)
	if err != nil {
		os.Exit(1)
	}
	s.bucket_name = bucket

	return &s
}

func (s AwsSession) WriteFileToS3Bucket(
	reader *bytes.Reader,
	targetName string,
) error {
	_, err := s.uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(s.bucket_name),
		Key:    aws.String(targetName),
		Body:   reader,
	})
	if err != nil {
		return err
	}

	return nil
}

func (s AwsSession) GetParam(
	paramName string,
	withDecryption bool,
) (string, error) {
	param, err := s.ssm.GetParameter(&ssm.GetParameterInput{
		Name:           aws.String(paramName),
		WithDecryption: aws.Bool(withDecryption),
	})
	if err != nil {
		return "", err
	}

	return *param.Parameter.Value, nil
}

func (s AwsSession) SetParam(
	name string,
	value string,
	withDecryption bool,
) error {
	t := "String"
	if withDecryption {
		t = "SecureString"
	}

	_, err := s.ssm.PutParameter(&ssm.PutParameterInput{
		Name:      aws.String(name),
		Value:     aws.String(value),
		Type:      aws.String(t),
		Overwrite: aws.Bool(true),
	})
	if err != nil {
		return err
	}

	return nil
}

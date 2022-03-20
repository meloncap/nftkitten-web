package main

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	// "github.com/h2non/bimg"
	"github.com/valyala/fasthttp"
	// "github.com/web3-storage/go-w3s-client"
)

const prefix = "/.netlify/functions/c/"

// func GZip(body []byte) []byte {
// 	var buf bytes.Buffer
// 	zw := gzip.NewWriter(&buf)

// 	if _, writeErr := zw.Write(body); writeErr != nil {
// 		log.Fatal(writeErr)
// 	}

// 	if err := zw.Close(); err != nil {
// 		log.Fatal(err)
// 	}

// 	return buf.Bytes()
// }

// func readResponse(resp *fasthttp.Response) ([]byte, error) {
// 	var body []byte
// 	var err error
// 	switch string(resp.Header.Peek("Content-Encoding")) {
// 	case "gzip":
// 		body, err = resp.BodyGunzip()
// 	case "inflate":
// 		body, err = resp.BodyInflate()
// 	case "br":
// 		body, err = resp.BodyUnbrotli()
// 	default:
// 		body = resp.Body()
// 	}
// 	if err != nil {
// 		return nil, err
// 	}

// 	return body, nil
// }

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	if !strings.HasPrefix(request.Path, prefix) {
		panic(fmt.Sprint("INVALID request.Path ", request.Path))
	}

	panic(`to be implement`)

	// token, ok := os.LookupEnv("WEB3_STORAGE_TOKEN")
	// if !ok {
	// 	panic("No API token - set the WEB3_STORAGE_TOKEN environment var and try again.")
	// }

	// client, err := w3s.NewClient(w3s.WithToken(token))
	// if err != nil {
	// 	panic(err)
	// }

	// log.Println(fmt.Sprint(client))

	url := request.Path[len(prefix):]
	log.Println(url)
	accept := request.Headers["accept"]
	acceptLanguage := request.Headers["accept-language"]

	req := fasthttp.AcquireRequest()
	defer fasthttp.ReleaseRequest(req)
	req.Header.SetMethod("GET")
	req.Header.Add("accept", accept)
	req.Header.Add("accept-encoding", "gzip, deflate, br")
	req.Header.Add("accept-language", acceptLanguage)
	req.SetRequestURI(url)
	resp := fasthttp.AcquireResponse()
	defer fasthttp.ReleaseResponse(resp)
	if err := fasthttp.Do(req, resp); err != nil {
		return nil, err
	}

	// if !strings.HasPrefix(string(resp.Header.Peek("Content-Type")), "image/") {
	// 	return nil, err
	// }

	// body, err := readResponse(resp)
	// if err != nil {
	// 	panic(err)
	// }

	// filename := strings.Replace(uuid.New().String(), "-", "", -1) + ".webp"
	// converted, err := bimg.NewImage(buffer).Convert(bimg.WEBP)
	// if err != nil {
	// 	return filename, err
	// }

	// processed, err := bimg.NewImage(converted).Process(bimg.Options{Quality: quality})
	// if err != nil {
	// 	return filename, err
	// }

	// os.WriteFile(fmt.Sprint("./", filename), body, 0644)

	// fi, err := os.Open("./temp")
	// if err != nil {
	// 	panic(err)
	// }
	// defer fi.Close()
	// fmt.Printf("Successfully downloaded to %s\n", fi.Name())

	// // Upload to Web3.Storage
	// cid, err := client.Put(context.Background(), nil)
	// if err != nil {
	// 	panic(err)
	// }
	// log.Println(cid)

	// content := fmt.Sprint("data:", headers["Content-Type"], ";base64,", b64.StdEncoding.EncodeToString(body))
	// headers["Content-Length"] = fmt.Sprint(len(content))
	// headers["Content-Encoding"] = "gzip"
	// headers["Content-Type"] = "text/plain"
	// content = b64.StdEncoding.EncodeToString(GZip([]byte(content)))
	// return &events.APIGatewayProxyResponse{
	// 	StatusCode:      statusCode,
	// 	Headers:         headers,
	// 	Body:            content,
	// 	IsBase64Encoded: true,
	// }, nil
	return &events.APIGatewayProxyResponse{
		StatusCode:      200,
		Headers:         map[string]string{},
		Body:            "OK",
		IsBase64Encoded: true,
	}, nil
}

func main() {
	lambda.Start(handler)
}

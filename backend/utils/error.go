package utils

import (
	"encoding/json"
	"forum/models"
	"log"
	"net/http"
	"strings"
)

func CreateResponseAndLogger(w http.ResponseWriter, statusCode int, err error, message string) {
	dashes := strings.Repeat("-", 50)
	if err != nil {
		log.Printf("%s\nError occurred: %v\nMessage: %s\n%s", dashes, err, message, dashes)
	}else{
		log.Printf("%s\nSuccess: %s\n%s", dashes, message, dashes)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	errorResponse := models.Response{
		Message: message,
	}

	encoder := json.NewEncoder(w)
	if err := encoder.Encode(errorResponse); err != nil {
		log.Printf("%s\nFailed to encode error response: %v\n%s", dashes, err, dashes)
	}
	return
}

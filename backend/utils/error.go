package utils

import (
	"encoding/json"
	"forum/models"
	"log"
	"net/http"
	"strings"
)

func CreateResponseAndLogger(w http.ResponseWriter, statusCode int, err error, message string) {
	dashes := strings.Repeat("-", 100)
	if err != nil {
		log.Printf("Error occurred: %v\nMessage: %s\n%s", err, message, dashes)
	}else{
		log.Printf("Success: %s\n%s", message, dashes)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	errorResponse := models.Response{
		Message: message,
	}

	encoder := json.NewEncoder(w)
	if err := encoder.Encode(errorResponse); err != nil {
		log.Printf("Failed to encode error response: %v\n%s", err, dashes)
	}
}

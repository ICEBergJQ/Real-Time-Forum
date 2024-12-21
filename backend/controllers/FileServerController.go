package controllers

import (
	// "encoding/json"
	// "forum/config"
	// "forum/models"
	// "html/template"
	// "log"
	"forum/config"
	"net/http"
	"path/filepath"
)

func Index(w http.ResponseWriter, r *http.Request){
	
		// Always serve index.html for non-static requests
		indexPath := filepath.Join(config.STATIC_DIR, "index.html")
		http.ServeFile(w, r, indexPath)
	
	// template, err:= template.ParseFiles(config.INDEX)
	// if err != nil {
	// 	var response models.Response
	// 	w.Header().Set("Content-Type", "application/json")
	// 	response.Message = "Internal Server Error"
	// 	response_encoding, err := json.Marshal(response)
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	w.Write(response_encoding)
	// 	log.Println("Internal Server Error:", err)
	// 	return
	// }
	// template.Execute(w, nil)
}
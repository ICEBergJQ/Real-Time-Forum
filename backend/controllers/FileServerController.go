package controllers

import (
	"net/http"
	"path/filepath"

	// "encoding/json"
	// "forum/config"
	// "forum/models"
	// "html/template"
	// "log"
	"forum/config"
)

func Index(w http.ResponseWriter, r *http.Request) {
	// Always serve index.html for non-static requests
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	indexPath := filepath.Join(config.STATIC_DIR, "index.html")
	http.ServeFile(w, r, indexPath)
}

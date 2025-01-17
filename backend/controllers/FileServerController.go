package controllers

import (
	"net/http"
	"path/filepath"

	"forum/config"
	"forum/utils"
)

func Index(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, nil, "Method not allowed")
		return
	}
	if r.URL.Path != "/" {
		indexPath := filepath.Join(config.STATIC_DIR, "error.html")
		http.ServeFile(w, r, indexPath)
		return
	}
	indexPath := filepath.Join(config.STATIC_DIR, "index.html")
	http.ServeFile(w, r, indexPath)
}

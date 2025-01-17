package controllers

import (
	"net/http"
	"os"
	"path/filepath"

	"forum/config"
	"forum/utils"
)

func ServeFile(w http.ResponseWriter, r *http.Request) {
	// Allow only GET requests
	if r.Method != http.MethodGet {
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, nil, "Method not allowed")
		return
	}

	// Build the full file path
	requestedPath := filepath.Join(config.STATIC_DIR, r.URL.Path[len("/static/"):])

	// Check if the requested file exists and is not a directory
	fileInfo, err := os.Stat(requestedPath)
	if err != nil {
		// If the file does not exist or another error occurs
		if os.IsNotExist(err) {
			http.ServeFile(w, r, filepath.Join(config.STATIC_DIR, "error.html"))
			http.ServeFile(w, r, filepath.Join(config.STATIC_DIR_STYLE, "error.css"))
		} else {
			// Log unexpected errors and serve a 500 response
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, nil, "Internal Server Error")
		}
		return
	}

	// Deny access if the requested path is a directory
	if fileInfo.IsDir() {
		http.ServeFile(w, r, filepath.Join(config.STATIC_DIR, "error.html"))
		http.ServeFile(w, r, filepath.Join(config.STATIC_DIR_STYLE, "error.css"))
		return
	}

	// Serve the requested file
	http.ServeFile(w, r, requestedPath)
}

func Index(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, nil, "Method not allowed")
		return
	}
	if r.URL.Path != "/" {
		http.ServeFile(w, r, filepath.Join(config.STATIC_DIR, "error.html"))
		return
	}
	http.ServeFile(w, r, filepath.Join(config.STATIC_DIR, "index.html"))
}

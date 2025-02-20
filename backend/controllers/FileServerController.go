package controllers

import (
	"net/http"
	"os"
	"path/filepath"

	"forum/config"
	"forum/utils"
)

func ServeFiles() {
	fs := http.FileServer(http.Dir(config.STATIC_DIR))

	http.HandleFunc("/static/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/static" || r.URL.Path == "/static/" ||
			r.URL.Path == "/static/public" || r.URL.Path == "/static/public/" ||
			r.URL.Path == "/static/public/components" || r.URL.Path == "/static/public/components/" ||
			r.URL.Path == "/static/src" || r.URL.Path == "/static/src/" ||
			r.URL.Path == "/static/src/js" || r.URL.Path == "/static/src/js/" ||
			r.URL.Path == "/static/src/css" || r.URL.Path == "/static/src/css/" {
			w.Header().Set("Content-Type", "text/html")
			w.WriteHeader(http.StatusForbidden)

			filePath := filepath.Join(config.STATIC_DIR_PUBLIC, "access_denied.html")
			content, err := os.ReadFile(filePath)
			if err != nil {
				http.Error(w, "internal server error", http.StatusInternalServerError)
				return
			}
			w.Write(content)
			return
		}
		http.StripPrefix("/static", fs).ServeHTTP(w, r)
	})
}

func Index(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, nil, "Method not allowed")
		return
	}
	if r.URL.Path != "/" {
		w.Header().Set("Content-Type", "text/html")
			w.WriteHeader(404)

			filePath := filepath.Join(config.STATIC_DIR_PUBLIC, "error.html")
			content, err := os.ReadFile(filePath)
			if err != nil {
				http.Error(w, "internal server error", http.StatusInternalServerError)
				return
			}
			w.Write(content)
			return
	}
	http.ServeFile(w, r, filepath.Join(config.STATIC_DIR_PUBLIC, "index.html"))
}

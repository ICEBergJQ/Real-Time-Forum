package controllers

import (
	"net/http"
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
			http.ServeFile(w, r, filepath.Join(config.STATIC_DIR_PUBLIC, "access_denied.html"))
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
		http.ServeFile(w, r, filepath.Join(config.STATIC_DIR_PUBLIC, "error.html"))
		return
	}
	http.ServeFile(w, r, filepath.Join(config.STATIC_DIR_PUBLIC, "index.html"))
}

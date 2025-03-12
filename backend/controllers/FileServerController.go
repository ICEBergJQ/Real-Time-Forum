package controllers

import (
	"net/http"
	"path/filepath"
	"strings"

	"forum/config"
	"forum/utils"
)

// Forbidden directories that should not be accessible
var forbiddenPaths = map[string]struct{}{
	"/static":                    {},
	"/static/":                   {},
	"/static/public":             {},
	"/static/public/":            {},
	"/static/public/components":  {},
	"/static/public/components/": {},
	"/static/src":                {},
	"/static/src/":               {},
	"/static/src/js":             {},
	"/static/src/js/":            {},
	"/static/src/css":            {},
	"/static/src/css/":           {},
}

const errorHTML = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>{{.Title}}</title>
	<style>
		body {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100vh;
			background-color: #f3f4f6;
			color: #1f2937;
			padding: 16px;
		}
		.error-box {
			background: white;
			padding: 24px;
			border-radius: 16px;
			box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
			text-align: center;
		}
		.error-title {
			font-size: 1.5rem;
			font-weight: bold;
			color: #dc2626;
		}
		.error-message {
			margin-top: 8px;
			font-size: 1.125rem;
		}
		button {
			margin-top: 16px;
			padding: 8px 16px;
			background: #2563eb;
			color: white;
			border: none;
			border-radius: 8px;
			cursor: pointer;
			transition: background 0.3s;
		}
		button:hover {
			background: #1e40af;
		}
	</style>
</head>
<body>
	<div class="error-box">
		<h1 class="error-title">{{.Title}}</h1>
		<p class="error-message">{{.Message}}</p>
		<button onclick="window.{{.ButtonAction}}">{{.ButtonText}}</button>
	</div>
</body>
</html>`

func ServeFiles() {
	fs := http.FileServer(http.Dir(config.STATIC_DIR))

	http.HandleFunc("/static/", func(w http.ResponseWriter, r *http.Request) {
		// Block access to forbidden paths
		if _, exists := forbiddenPaths[r.URL.Path]; exists {
			w.Header().Set("Content-Type", "text/html")
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(renderErrorPage("Oops! Forbidden Access", "You are not allowed to access this directory.", "history.back()", "Go Back")))
			return
		}

		// Serve static files
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
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(renderErrorPage("404 - Not Found", "The page you are looking for doesn't exist.", "location.href='/'", "Go Home")))
		return
	}

	http.ServeFile(w, r, filepath.Join(config.STATIC_DIR_PUBLIC, "index.html"))
}

func renderErrorPage(title, message, buttonAction, buttonText string) string {
	return strings.ReplaceAll(
		strings.ReplaceAll(
			strings.ReplaceAll(
				strings.ReplaceAll(errorHTML, "{{.Title}}", title),
				"{{.Message}}", message),
			"{{.ButtonAction}}", buttonAction),
		"{{.ButtonText}}", buttonText)
}

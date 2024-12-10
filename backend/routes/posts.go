package routes

import (
	"database/sql"
	"net/http"

	"forum/controllers"
)

func PostRoute(db *sql.DB) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			controllers.CreatePost(db, w, r)
		} else if r.Method == http.MethodGet {
			controllers.GetPosts(db, w, r)
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

func FilterRoute(db *sql.DB) {
	http.HandleFunc("/filter", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			query := r.URL.Query()

			allowedParams := []string{"user_id", "categories", "liked_user"}
			foundParams := []string{}
			for _, param := range allowedParams {
				if value := query.Get(param); value != "" {
					foundParams = append(foundParams, param)
				}
			}

			if len(foundParams) > 1 {
				http.Error(w, "page not found", http.StatusNotFound)
				return
			}

			if len(foundParams) == 0 {
				http.Error(w, "No valid query parameter provided", http.StatusBadRequest)
				return
			}
			switch foundParams[0] {
			case "user_id":
				controllers.GetCreatedPosts(db, w, r)
			case "categories":
				controllers.GetFilteredPostsByCategory(db, w, r)
			case "liked_user":
				controllers.GetLikedPosts(db, w, r)
			default:
				http.Error(w, "Unsupported query parameter", http.StatusNotFound)
			}
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

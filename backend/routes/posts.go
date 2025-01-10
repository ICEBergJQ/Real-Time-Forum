package routes

import (
	"database/sql"
	"net/http"

	"forum/controllers"
	"forum/utils"
)

func PostRoute(db *sql.DB) {
	http.HandleFunc("/post", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			controllers.CreatePost(db, w, r)
		} else if r.Method == http.MethodGet {
			cursor := r.URL.Query().Get("cursor")
			if !utils.IsTimestamp(cursor) {
				http.Error(w, "Invalid Cursor", http.StatusBadRequest)
				return
			}
			controllers.GetPosts(cursor, db, w, r)
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

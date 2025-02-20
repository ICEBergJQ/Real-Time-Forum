package routes

import (
	"database/sql"
	"net/http"
	"forum/controllers"
)

func CommentsRoute(db *sql.DB) {
	http.HandleFunc("/comment", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			controllers.CreateComment(db, w, r)
		} else if r.Method == http.MethodGet {
			controllers.GetComment(db, w, r)
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

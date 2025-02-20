package routes

import (
	"database/sql"
	"net/http"

	"forum/controllers"
)

func ReactionsRoute(db *sql.DB) {
	http.HandleFunc("/reaction", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			controllers.HasUserReacted(db,w, r)
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

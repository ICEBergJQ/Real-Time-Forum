package routes

import (
	"database/sql"
	"net/http"

	"forum/controllers"
)

func CategoriesRoute(db *sql.DB) {
	http.HandleFunc("/categories", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			controllers.GetCategories(db, w, r)
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

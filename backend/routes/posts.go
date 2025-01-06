package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"forum/controllers"
	"forum/models"
	"forum/utils"
)

func PostRoute(db *sql.DB) {
	http.HandleFunc("/post", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			controllers.CreatePost(db, w, r)
		} else if r.Method == http.MethodGet {
			var req models.Request
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				fmt.Println(err)
				http.Error(w, "Invalid input", http.StatusBadRequest)
				return
			}
			if !utils.IsTimestamp(req.Cursor) {
				http.Error(w, "Invalid Cursor", http.StatusBadRequest)
				return
			}
			controllers.GetPosts(req.Cursor, db, w, r)
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

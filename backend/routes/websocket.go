package routes

import (
	"database/sql"
	"net/http"

	"forum/controllers"
)

func websocket(db *sql.DB) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			controllers.ChatHandler(db, w, r)
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

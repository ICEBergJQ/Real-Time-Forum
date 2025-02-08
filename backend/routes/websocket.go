package routes

import (
	"database/sql"
	"net/http"
	"forum/controllers"
)

func WebsocketRoutes(db *sql.DB) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		controllers.ChatHandler(db, w, r)
	})
	// route for users and states
}


package routes

import (
	"database/sql"
	"net/http"
	"forum/controllers"
)

func WebsocketRoutes(db *sql.DB) {

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		handler := controllers.ChatHandler(db)
		handler(w, r)
	})

	// Get chat history between users
	http.HandleFunc("/chat-history", func(w http.ResponseWriter, r *http.Request) {
		handler := controllers.GetChatHistoryHandler(db)
		handler(w, r)
	})

	// Get all registered users for chat
	http.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		handler := controllers.GetUsersHandler(db)
		handler(w, r)
	})
}
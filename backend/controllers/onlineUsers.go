package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"sync"

	"forum/utils"
)

// track online users
var (
	onlineUsers = make(map[int]User)
	mutex       sync.RWMutex
)

// removes a user from the online users
func RemoveOnlineUser(userID int) {
	mutex.Lock()
	delete(onlineUsers, userID)
	mutex.Unlock()
}

// returns all currently online users
func GetOnlineUsers() []User {
	mutex.RLock()
	defer mutex.RUnlock()

	users := make([]User, 0, len(onlineUsers))
	for _, user := range onlineUsers {
		users = append(users, user)
	}
	return users
}

// handles requests for the list of online users
func GetOnlineUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		_, err := utils.UserIDFromToken(r, db)
		if err != nil {
			Logout(w, r)
			return
		}

		users := GetOnlineUsers()

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(users); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

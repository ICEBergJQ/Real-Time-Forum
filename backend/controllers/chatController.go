package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"forum/utils"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var connection map[int][]*websocket.Conn

type Message struct {
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Message  string `json:"message"`
	Date     string `json:"date"`
}

type ChatHistoryRequest struct {
	OtherUserID string `json:"receiver"`
	Offset      int    `json:"offset"`
}

type User struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
}

func GetAllUsers(db *sql.DB, currentUserID int) ([]User, error) {
	query := `
		SELECT user_id, username 
		FROM users 
		WHERE user_id != ? 
		ORDER BY username ASC
	`

	rows, err := db.Query(query, currentUserID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users: %v", err)
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.UserID, &user.Username); err != nil {
			return nil, fmt.Errorf("failed to scan user: %v", err)
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating users: %v", err)
	}

	return users, nil
}

func GetUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		currentUserID, err := utils.UserIDFromToken(r, db)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		users, err := GetAllUsers(db, currentUserID)
		if err != nil {
			http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
			fmt.Printf("Error fetching users: %v\n", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(users); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

func StoreMessage(db *sql.DB, msg Message) error {
	_, err := db.Exec(
		`INSERT INTO chat_messages (message, sender, receiver, sent_at) 
		VALUES (?, ?, ?, ?)`,
		msg.Message, msg.Sender, msg.Receiver, msg.Date,
	)
	if err != nil {
		return fmt.Errorf("failed to store message: %v", err)
	}
	return nil
}

func GetChatHistory(db *sql.DB, username string, MsgData ChatHistoryRequest) ([]Message, error) {
	// add offset to the query
	// OFFSET := from front-end
	query := `
		SELECT sender, receiver, message, sent_at 
		FROM chat_messages 
		WHERE (sender = ? AND receiver = ?) 
		   OR (sender = ? AND receiver = ?)
		ORDER BY sent_at DESC 
		LIMIT 10 OFFSET ?
	`
	rows, err := db.Query(query, username, MsgData.OtherUserID, MsgData.OtherUserID, username, MsgData.Offset)
	// fmt.Println(MsgData,userID1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var msg Message
		err := rows.Scan(&msg.Sender, &msg.Receiver, &msg.Message, &msg.Date)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	return messages, nil
}

// handles WebSocket connections
func ChatHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			fmt.Println("Error upgrading WebSocket:", err)
			return
		}
		connection = make(map[int][]*websocket.Conn)
		defer conn.Close()

		userID, err := utils.UserIDFromToken(r, db)
		if err != nil {
			fmt.Println("Unauthorized:", err)
			return
		}
		username, err := utils.GetUserName(userID, db)
		if err != nil {
			fmt.Println("can't get username:", err)
			return
		}
		mutex.Lock()
		connection[userID] = append(connection[userID], conn)
		mutex.Unlock()
		// Handle incoming messages
		for {
			var msg Message
			if err := conn.ReadJSON(&msg); err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					fmt.Printf("websocket error: %v\n", err)
				}
				// instead of break i need to handle close websocket and delete the user from the map
				delete(connection, userID)
				break
			}
			msg.Sender = username
			msg.Date = time.Now().Format("2006-01-02 15:04:05")

			if err := StoreMessage(db, msg); err != nil {
				fmt.Printf("Error storing message: %v\n", err)
				continue
			}

			user_id, err := utils.GetUserid(username, db)
			if err != nil {
				fmt.Println("Unauthorized:", err)
				return
			}
			con, ok := connection[user_id]
			if ok {
				for _, co := range con {
					err := co.WriteJSON(msg)
					if err != nil {
						fmt.Printf("Error sending confirmation: %v\n", err)
					}
				}
			}
			if err := conn.WriteJSON(msg); err != nil {
				fmt.Printf("Error sending confirmation: %v\n", err)
			}
		}
	}
}

func GetChatHistoryHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		userID, err := utils.UserIDFromToken(r, db)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		// convert userid into username
		username, err := utils.GetUserName(userID, db)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var req ChatHistoryRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		messages, err := GetChatHistory(db, username, req)
		if err != nil {
			http.Error(w, "Failed to fetch chat history", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(messages)
	}
}

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

// var connection map[int][]*websocket.Conn
var connection = make(map[int][]*websocket.Conn)

type Message struct {
	Type     string `json:"type"`
	Status   string `json:"status"`
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
	var users []User
	currentUsername := ""

	// Get current user's username
	err := db.QueryRow("SELECT username FROM users WHERE user_id = ?", currentUserID).Scan(&currentUsername)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch current username: %v", err)
	}

	// Get users with messages, ordered by last message sent
	queryWithMessages := `
		SELECT u.user_id, u.username
		FROM users u
		WHERE u.user_id != ?
		AND u.username IN (
			SELECT sender FROM chat_messages WHERE receiver = ?
			UNION
			SELECT receiver FROM chat_messages WHERE sender = ?
		)
		ORDER BY (
			SELECT MAX(sent_at) 
			FROM chat_messages 
			WHERE (sender = u.username AND receiver = ?) OR (receiver = u.username AND sender = ?)
		) DESC
	`

	rows, err := db.Query(queryWithMessages, currentUserID, currentUsername, currentUsername, currentUsername, currentUsername)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users with messages: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var user User
		if err := rows.Scan(&user.UserID, &user.Username); err != nil {
			return nil, fmt.Errorf("failed to scan user: %v", err)
		}
		users = append(users, user)
	}

	// Get users with no messages, ordered alphabetically
	queryWithoutMessages := `
		SELECT user_id, username 
		FROM users 
		WHERE user_id != ? 
		AND username NOT IN (
			SELECT sender FROM chat_messages WHERE receiver = ?
			UNION
			SELECT receiver FROM chat_messages WHERE sender = ?
		)
		ORDER BY username ASC
	`

	rows, err = db.Query(queryWithoutMessages, currentUserID, currentUsername, currentUsername)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users without messages: %v", err)
	}
	defer rows.Close()

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
			http.Error(w, "can't get user_id: ", http.StatusUnauthorized)
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
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Error upgrading WebSocket")
			// fmt.Println("Error upgrading WebSocket:", err)
			return
		}
		defer conn.Close()

		userID, err := utils.UserIDFromToken(r, db)
		if err != nil {
			conn.Close()
			Logout(w, r)
			utils.CreateResponseAndLogger(w, http.StatusBadGateway, err, "can't get userFrom token")
			// fmt.Println("can't get userFrom token, ", err)
			return
		}
		username, err := utils.GetUserName(userID, db)
		if err != nil {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "can't get username")
			// fmt.Println("can't get username:", err)
			return
		}

		mutex.Lock()
		connection[userID] = append(connection[userID], conn)

		onlineUsers[userID] = User{
			UserID:   userID,
			Username: username,
		}
		mutex.Unlock()

		for _, v := range connection {
			for _, val := range v {
				var msg Message
				msg.Type = "status"
				msg.Status = "online"
				msg.Sender = username
				val.WriteJSON(msg)
			}
		}
		// Handle incoming messages
		for {
			var msg Message
			if err := conn.ReadJSON(&msg); err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "websocket error")
					return
				}
				delete(connection, userID)
				break
			}
			msg.Sender = username
			msg.Date = time.Now().Format("2006-01-02 15:04:05")
			if msg.Type == "" {
				if len(msg.Message) > 400 {
					err = fmt.Errorf("message is too long. max  = 400")
					utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "message is too long!!! max = 400")
				} else if err := StoreMessage(db, msg); err != nil {
					utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Error storing message")
					continue
				}
			} 

			user_id, err := utils.GetUserid(msg.Receiver, db)
			if err != nil {
				utils.CreateResponseAndLogger(w, http.StatusNotFound, err, "Unauthorized")
				return
			}
			con, ok := connection[user_id]
			if ok {
				for _, co := range con {
					err := co.WriteJSON(msg)
					if err != nil {
						utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Error sending confirmation")
					}
				}
			}
			if err := conn.WriteJSON(msg); err != nil {
				utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Error sending confirmation")
				// fmt.Printf("Error sending confirmation: %v\n", err)
			}
		}
		for _, v := range connection {
			for _, val := range v {
				var msg Message
				msg.Type = "status"
				msg.Status = "offline"
				msg.Sender = username
				err := val.WriteJSON(msg)
				if err != nil {
					utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Error sending confirmation")
				}
			}
		}
	}
}

func GetChatHistoryHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			err := fmt.Errorf("method not allowed") 
			utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Method not allowed")
			// http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		userID, err := utils.UserIDFromToken(r, db)
		if err != nil {
			utils.CreateResponseAndLogger(w, http.StatusUnauthorized, err, "can't get user from token")
			// http.Error(w, "user from token error: ", http.StatusUnauthorized)
			return
		}
		// convert userid into username
		username, err := utils.GetUserName(userID, db)
		if err != nil {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "can't get username with user_id")
			// http.Error(w, "can't get username: ", http.StatusUnauthorized)
			return
		}

		var req ChatHistoryRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "Invalid request body")
			// http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		messages, err := GetChatHistory(db, username, req)
		if err != nil {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Failed to fetch chat history")
			// http.Error(w, "Failed to fetch chat history", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(messages)
	}
}

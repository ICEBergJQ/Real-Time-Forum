package controllers

import (
	"database/sql"
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

type Message struct {
	Sender   int    `json:"sender"`
	Receiver int    `json:"receiver"`
	Message  string `json:"message"`
	Date     string `json:"date"`
}

var clients = make(map[int]*websocket.Conn)

func ChatHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading WebSocket:", err)
		return
	}

	// Get user ID from token
	userID, err := utils.UserIDFromToken(r, db)
	if err != nil {
		fmt.Println("Unauthorized:", err)
		conn.Close()
		return
	}

	// Store user connection
	clients[userID] = conn
	defer func() {
		conn.Close()
		delete(clients, userID)
	}()

	for {
		var msg Message
		if err := conn.ReadJSON(&msg); err != nil {
			fmt.Println("Error reading JSON:", err)
			return
		}

		msg.Date = time.Now().Format("2006-01-02 15:04:05")

		_, err := db.Exec(`INSERT INTO chat_messages (message, sender_id, receiver_id, sent_at) VALUES (?, ?, ?, ?)`, msg.Message, msg.Sender, msg.Receiver, msg.Date)
		if err != nil {
			fmt.Println("Database insert error:", err)
			continue
		}

		// Send message to the receiver if online
		if receiverConn, ok := clients[msg.Receiver]; ok {
			if err := receiverConn.WriteJSON(msg); err != nil {
				fmt.Println("Error sending message:", err)
			}
		}

		// Send message back to sender for UI update
		if err := conn.WriteJSON(msg); err != nil {
			fmt.Println("Error sending confirmation:", err)
		}
	}


	//add broadcast function to store all users that registers
	
}

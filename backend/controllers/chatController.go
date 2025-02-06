package controllers

import (
	"database/sql"
	"fmt"
	"net/http"

	"forum/utils"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Data struct {
	Sender   int    `json:"sender"`
	Receiver int    `json:"receiver"`
	Message  string `json:"message"`
	Date     string `json:"date"`
}

var Messages = make(map[int]*websocket.Conn)

func ChatHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("err : ", err)
		return
	}
	// userid add it to the map  Messages[user_id] = conn
	id, err := utils.UserIDFromToken(r, db)
	Messages[id] = conn
	defer func() {
		conn.Close()
		delete(Messages, id)
	}()

	for {
		var msg Data
		if err = conn.ReadJSON(msg); err != nil {
			fmt.Println("eroor : ", err)
			return
		}
		// add data the databse
		Messages[msg.Receiver].WriteJSON(msg)
		conn.WriteJSON(msg)
	}
}

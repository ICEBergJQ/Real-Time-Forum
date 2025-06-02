package models

import "time"

type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	FirstName string	`json:"fname"`
	LastName string		`json:"lname"`
	Email     string    `json:"email"`
	Age       string    `json:"age"`
	Gender    string    `json:"gender"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"createdat"`
}

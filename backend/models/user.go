package models

import "time"

type User struct{
	Username string `json:"fullname"`
	Email string	`json:"email"`
	Password string	`json:"password"`
	CreatedAt   time.Time `json:"createdat"`
}

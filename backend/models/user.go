package models

import "time"

type User struct{
	ID int	`json:"id"`
	Username string `json:"fullname"`
	Email string	`json:"email"`
	Password string	`json:"password"`
	CreatedAt   time.Time `json:"createdat"`
}

package models

import "time"

type Reactions struct {
	User_id  int    `json:"user_id"`
	Post_id    string    `json:"post_id"`
	Comment_id string    `json:"comment_id"`
	Reaction_Type string `json:"reaction_type"`
	CreatedAt  time.Time `json:"created_at"`
}

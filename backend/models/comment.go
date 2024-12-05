package models

import "time"

type Comment struct {
	Author_id string    `json:"author_id"`
	Post_id   string    `json:"post_id"`
	ID        string    `json:"id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdat"`
}

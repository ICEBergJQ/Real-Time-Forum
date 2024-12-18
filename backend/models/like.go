package models

import "time"

type LikeOrDislike struct {
	Author_id  string    `json:"author_id"`
	Post_id    string    `json:"post_id"`
	ID         string    `json:"id"`
	Content    string    `json:"content"`
	Comment_id string    `json:"comment_id"`
	CreatedAt  time.Time `json:"createdat"`
}

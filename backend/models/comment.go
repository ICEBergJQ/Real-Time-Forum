package Forum

import "time"

type Comment struct {
	Post_id   string    `json:"post_id"`
	Author_id string    `json:"author_id"`
	ID        string    `json:"id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdat"`
}

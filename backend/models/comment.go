package models

type Comment struct {
	Author_id int    `json:"author_id"`
	Post_id   string `json:"post_id"`
	ID        string `json:"id"`
	Content   string `json:"content"`
	CreatedAt string `json:"createdat"`
}

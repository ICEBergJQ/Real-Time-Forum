package models


import "time"

type Post struct {
	Author_id   string    `json:"author_id"`
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	Categories  []string  `json:"categories"`
	Category_id []int     `json:"category_id"`
	CreatedAt   time.Time `json:"createdat"`
}



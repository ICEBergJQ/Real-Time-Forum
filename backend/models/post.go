package models

type Post struct {
	Author_id   int      `json:"author_id"`
	Author_name string   `json:"author_name"`
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Content     string   `json:"content"`
	Categories  []string `json:"categories"`
	Category_id []int    `json:"category_id"`
	CreatedAt   string   `json:"createdat"`
}

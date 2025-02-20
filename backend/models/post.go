package models

type Post struct {
	Author_id        int      `json:"author_id"`
	Author_name      string   `json:"author"`
	ID               string   `json:"id"`
	Title            string   `json:"title"`
	Content          string   `json:"content"`
	Category_id      []int    `json:"category_id"`
	Categories       []string `json:"categories"`
	Likes_Counter    int      `json:"likes_count"`
	Dislikes_counter int      `json:"dislikes_count"`
	Comments_Counter int      `json:"comments_count"`
	CreatedAt        string   `json:"createdat"`
	Reaction         string   `json:"reaction"`
}

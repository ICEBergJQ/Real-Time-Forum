package models

type PaginationRequest struct {
	Cursor string `json:"cursor"`
	Limit  int    `json:"limit"`
}

type PaginationResponse struct {
	Author_id        int      `json:"author_id"`
	ID               string   `json:"id"`
	Title            string   `json:"title"`
	Content          string   `json:"content"`
	Categories       []string `json:"categories"`
	Category_id      []int    `json:"category_id"`
	Likes_Counter    int      `json:"likes_count"`
	Dislikes_counter int      `json:"dislikes_count"`
	Comments_Counter int      `json:"comments_count"`
	CreatedAt        string   `json:"createdat"`
}

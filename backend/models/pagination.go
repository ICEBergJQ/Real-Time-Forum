package models

type PaginationRequest struct {
	Cursor string `json:"cursor"`
}

type PaginationResponse struct {
	Author_id        int      `json:"author_id"`
	Author_name      string   `json:"author_name"`
	ID               string   `json:"id"`
	Title            string   `json:"title"`
	Content          string   `json:"content"`
	Categories       []string `json:"categories"`
	Likes_Counter    int      `json:"likes_count"`
	Dislikes_counter int      `json:"dislikes_count"`
	Comments_Counter int      `json:"comments_count"`
	CreatedAt        string   `json:"createdat"`
}

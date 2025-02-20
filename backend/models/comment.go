package models

type Comment struct {
	Author_id     int    `json:"author_id"`
	Author_name   string `json:"author"`
	Post_id       string `json:"post_id"`
	ID            string `json:"id"`
	Content       string `json:"content"`
	CreatedAt     string `json:"createdat"`
	LikesCount    int    `json:"likescount"`
	DislikesCount int    `json:"dislikescount"`
	Reaction      string `json:"reaction"`
}

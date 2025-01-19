package models

type Response struct {
	Message string `json:"Message"`
}

type PostResponse struct {
	Posts          []Post `json:"posts"`
	Postsremaining int    `json:"postsremaing"`
	Message        string `json:"Message"`
}

type CommentResponse struct {
	Comments []Comment `json:"comments"`
	Message  string    `json:"Message"`
}

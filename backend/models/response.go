package models

type Response struct {
	Message string
}

type PostResponse struct {
	Posts          []Post `json:"posts"`
	Postsremaining int    `json:"postsremaing"`
	Message        string `json:"message"`
}

type CommentResponse struct {
	Comments []Comment `json:"comments"`
	Message  string    `json:"message"`
}

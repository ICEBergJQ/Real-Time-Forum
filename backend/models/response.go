package models

type Response struct {
	Message string
}

type PostResponse struct {
	Posts          []Post `json:"posts"`
	Postsremaining int    `json:"postsremaing"`
}

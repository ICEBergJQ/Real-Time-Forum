package models

type FilterRequest struct {
	FilterMethod string   `json:"filtermethod"`
	Categories   []string `json:"categories"`
	Cursor       string   `json:"cursor"`
	Id           int      `json:"id"`
}

package models

type Request struct {
	FilterMethod string   `json:"filtermethod"`
	Categories   []string `json:"categories"`
	Cursor       string   `json:"cursor"`
}

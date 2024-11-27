package Forum

type Post struct {
	Author     string   `json:"author"`
	ID         int      `json:"id"`
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Categories []string `json:"categories"`
}

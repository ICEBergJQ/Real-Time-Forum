package Forum

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"sync"
	uuid "github.com/gofrs/uuid"

	forum "Forum/models"
)

var (
	mu    sync.Mutex // To handle concurrent writes
)

func CreatePost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	var newPost forum.Post
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	mu.Lock()
	id, err := uuid.NewV4()
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	newPost.ID = id.String()

	query := `INSERT INTO posts (id, title, content, category) VALUES (?, ?, ?, ?)`
	_, err = db.Exec(query, newPost.ID, newPost.Title, newPost.Content, newPost.Categories, newPost.CreatedAt)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	mu.Unlock()

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newPost)
}

func GetPosts(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	query := `SELECT id, title, content, category, created_at FROM posts`
	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []forum.Post
	for rows.Next() {
		var post forum.Post
		err := rows.Scan(&post.ID, &post.Title, &post.Content, &post.Categories, &post.CreatedAt)
		if err != nil {
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}

	json.NewEncoder(w).Encode(posts)
}

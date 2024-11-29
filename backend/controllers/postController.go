package Forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	uuid "github.com/gofrs/uuid"

	forum "Forum/models"
)

var mu sync.Mutex

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

	_, err := db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		http.Error(w, "Failed to enable foreign keys", http.StatusInternalServerError)
		return
	}

	mu.Lock()
	defer mu.Unlock()

	postID, err := uuid.NewV4()
	if err != nil {
		http.Error(w, "Internal server error generating post ID", http.StatusInternalServerError)
		return
	}
	newPost.ID = postID.String()
	// newPost.CreatedAt = time.Now()

	// var categoryID int
	var validCategories []int
	for _, categoryName := range newPost.Categories {
		var categoryID int
		err := db.QueryRow("SELECT category_id FROM categories WHERE name = ?", categoryName).Scan(&categoryID)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Category does not exist: "+categoryName, http.StatusBadRequest)
				return
			} else {
				http.Error(w, fmt.Sprintf("Error checking category: %v", err), http.StatusInternalServerError)
				return
			}
		}
		validCategories = append(validCategories, categoryID)
	}

	// query := `INSERT INTO posts (post_id, user_id, title, content)
	// VALUES (?, ?, ?, ?);`
	// result, err := db.Exec(query, newPost.ID, newPost.Author, newPost.Title, newPost.Content)
	// if err != nil {
	// 	http.Error(w, fmt.Sprintf("Error creating post: %v", err), http.StatusInternalServerError)
	// 	return
	// }

	// Insert the post
	query := "INSERT INTO posts (post_id, user_id, title, content) VALUES (?, ?, ?, ?)"
	_, err = db.Exec(query, newPost.ID, newPost.Author_id, newPost.Title, newPost.Content)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating post: %v", err), http.StatusInternalServerError)
		return
	}

	// Insert the relationships into postsCategories
	for _, categoryID := range validCategories {
		_, err := db.Exec("INSERT INTO postsCategories (post_id, category_id) VALUES (?, ?)", newPost.ID, categoryID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error linking post to category: %v", err), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newPost)
}

func GetPosts(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	query := "SELECT post_id, user_id, title, content, created_at FROM posts"
	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, "internal server error v", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []forum.Post
	for rows.Next() {
		var post forum.Post
		err := rows.Scan(&post.ID,&post.Author_id , &post.Title, &post.Content, &post.CreatedAt)
		if err != nil {
			http.Error(w, fmt.Sprintf("internal server error x: %v", err), http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}

	json.NewEncoder(w).Encode(posts)
}

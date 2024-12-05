package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	uuid "github.com/gofrs/uuid"

	forum "forum/models"
)

var mu sync.Mutex

func CreatePost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}
	if r.URL.Path != "/" {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	var newPost forum.Post

	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

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
	newPost.CreatedAt = time.Now()

	// var categoryID int
	// var validCategories []int
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
		newPost.Category_id = append(newPost.Category_id, categoryID)
	}

	categoriesJSON, err := json.Marshal(newPost.Category_id)
	if err != nil {
		http.Error(w, fmt.Sprintf("internal server error: %v", err), http.StatusInternalServerError)
		return
	}

	// Insert the post
	query := "INSERT INTO posts (post_id, user_id, category_id, title, content, created_at) VALUES (?, ?, ?, ?, ?, ?)"
	_, err = db.Exec(query, newPost.ID, newPost.Author_id, categoriesJSON, newPost.Title, newPost.Content, newPost.CreatedAt)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating post: %v", err), http.StatusInternalServerError)
		return
	}

	// Insert the relationships into postsCategories
	for _, categoryID := range newPost.Category_id {
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

	query := "SELECT post_id, user_id, category_id,title, content, created_at FROM posts"
	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, "internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []forum.Post
	var categoryJSON []byte
	for rows.Next() {
		var post forum.Post
		err := rows.Scan(&post.ID, &post.Author_id, &categoryJSON, &post.Title, &post.Content, &post.CreatedAt)
		if err != nil {
			http.Error(w, fmt.Sprintf("internal server error x: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.Unmarshal(categoryJSON, &post.Category_id)
		if err != nil {
			http.Error(w, fmt.Sprintf("internal server error: %v", err), http.StatusInternalServerError)
			return
		}

		posts = append(posts, post)
	}

	json.NewEncoder(w).Encode(posts)
}

func GetFilteredPostsByCategory(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	categoryQuery := r.URL.Query().Get("categories")
	if categoryQuery == "" {
		http.Error(w, "categories query parameter is required", http.StatusBadRequest)
		return
	}
	categoryNames := strings.Split(categoryQuery, ",")

	placeholders := strings.Repeat("?,", len(categoryNames))
	placeholders = strings.TrimRight(placeholders, ",") // Remove the trailing comma

	query := fmt.Sprintf(`
		SELECT 
			p.post_id, 
			p.title, 
			p.content, 
			p.created_at, 
			c.name AS category_name
		FROM 
			posts AS p
		JOIN 
			postsCategories AS pc ON p.post_id = pc.post_id
		JOIN 
			categories AS c ON pc.category_id = c.category_id
		WHERE 
			c.name IN (%s);
	`, placeholders)

	// Convert the slice of category names to a slice of interface{}
	args := make([]interface{}, len(categoryNames))
	for i, v := range categoryNames {
		args[i] = v
	}

	rows, err := db.Query(query, args...)
	if err != nil {
		http.Error(w, "internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []forum.Post
	var categoryJSON []byte
	for rows.Next() {
		var post forum.Post
		err := rows.Scan(&post.ID, &post.Author_id, &categoryJSON, &post.Title, &post.Content, &post.CreatedAt)
		if err != nil {
			http.Error(w, fmt.Sprintf("internal server error x: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.Unmarshal(categoryJSON, &post.Category_id)
		if err != nil {
			http.Error(w, fmt.Sprintf("internal server error: %v", err), http.StatusInternalServerError)
			return
		}

		posts = append(posts, post)
	}

	json.NewEncoder(w).Encode(posts)
}

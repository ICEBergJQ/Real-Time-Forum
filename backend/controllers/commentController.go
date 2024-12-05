package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	forum "forum/models"

	uuid "github.com/gofrs/uuid"
)

func CreateComment(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	if r.URL.Path != "/post" {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	var newComment forum.Comment

	if err := json.NewDecoder(r.Body).Decode(&newComment); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		fmt.Println(err)
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

	commentID, err := uuid.NewV4()
	if err != nil {
		http.Error(w, "Internal server error generating post ID", http.StatusInternalServerError)
		return
	}
	newComment.ID = commentID.String()
	newComment.CreatedAt = time.Now()

	if !postExists(db, newComment.Post_id) {
		http.Error(w, "Post does not exist Bad request", http.StatusBadRequest)
		return
	}

	// Insert the post
	query := "INSERT INTO comments (comment_id, user_id, post_id, content, created_at) VALUES (?, ?, ?, ?, ?)"
	_, err = db.Exec(query, newComment.ID, newComment.Author_id, newComment.Post_id, newComment.Content, newComment.CreatedAt)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating comment: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newComment)
}

func postExists(db *sql.DB, postID string) bool {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM posts WHERE post_id = ?)`
	err := db.QueryRow(query, postID).Scan(&exists)
	if err != nil {
		return false
	}
	return exists
}

func GetComment(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}
	var comments []forum.Comment
	postID := r.URL.Query().Get("id")
	if postID == "" {
        http.Error(w, "Missing id parameter", http.StatusBadRequest)
        return
    }

	rows, err := db.Query("SELECT comment_id, user_id, post_id, content, created_at FROM comments WHERE post_id = ?", postID)
	if err != nil {
		http.Error(w, "internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	
	for rows.Next() {
		var comment forum.Comment
		err := rows.Scan(&comment.ID, &comment.Author_id, &comment.Post_id, &comment.Content, &comment.CreatedAt)
		if err != nil {
			http.Error(w, fmt.Sprintf("internal server error x: %v", err), http.StatusInternalServerError)
			return
		}

		comments = append(comments, comment)
	}

	json.NewEncoder(w).Encode(comments)
}

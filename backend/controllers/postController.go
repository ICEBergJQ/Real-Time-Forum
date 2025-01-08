package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"forum/utils"

	uuid "github.com/gofrs/uuid"

	forum "forum/models"
)

func CreatePost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/post" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	var newPost forum.Post
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()
	if len(newPost.Title) == 0 || len(newPost.Content) == 0 || len(newPost.Title) > 300 || len(newPost.Content) > 40000 {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	postID, err := uuid.NewV4()
	if err != nil {
		http.Error(w, "Internal server error generating post ID", http.StatusInternalServerError)
		return
	}
	newPost.ID = postID.String()
	newPost.Author_name, err = utils.GetUserName(newPost.Author_id, db)
	if err != nil {
		http.Error(w, "There was a problem getting username", http.StatusInternalServerError)
		return
	}

	// Begin transaction
	tx, err := db.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()
	categories := ""

	newPost.Category_id, categories, err = utils.CategoriesChecker(db, newPost.Categories)
	if err != nil {
		http.Error(w, "invalid categories", http.StatusBadRequest)
		return
	}

	query := "INSERT INTO posts (post_id, user_id, category_name, title, content) VALUES (?, ?, ?, ?, ?)"
	_, err = tx.Exec(query, newPost.ID, newPost.Author_id, categories, newPost.Title, newPost.Content)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating post: %v", err), http.StatusInternalServerError)
		return
	}

	// Link categories to the post
	for _, categoryID := range newPost.Category_id {
		_, err := tx.Exec("INSERT INTO postsCategories (post_id, category_id) VALUES (?, ?)", newPost.ID, categoryID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error linking post to category: %v", err), http.StatusInternalServerError)
			return
		}
	}

	if err := tx.Commit(); err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(newPost); err != nil {
		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
	}
}

func GetPosts(cursor string, db *sql.DB, w http.ResponseWriter, r *http.Request) {
	query := "SELECT post_id, user_id, category_name, title, content, created_at FROM posts WHERE created_at < ? ORDER BY created_at DESC limit ?;"
	rows, err := db.Query(query, cursor, 20)
	if err != nil {
		http.Error(w, "internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []forum.PaginationResponse
	category := ""
	for rows.Next() {
		var post forum.PaginationResponse
		err := rows.Scan(&post.ID, &post.Author_id, &category, &post.Title, &post.Content, &post.CreatedAt)
		if err != nil {
			http.Error(w, fmt.Sprintf("internal server error: %v", err), http.StatusInternalServerError)
			return
		}
		post.Author_name, err = utils.GetUserName(post.Author_id, db)
		if err != nil {
			http.Error(w, "There was a problem getting username", http.StatusInternalServerError)
			return
		}
		post.Likes_Counter = RowCounter(`
		SELECT COUNT(*) AS count
		FROM Reactions
		WHERE reaction_type = 'like'
		AND post_id = ?;`, post.ID, db)

		post.Dislikes_counter = RowCounter(`
		SELECT COUNT(*) AS count
		FROM Reactions
		WHERE reaction_type = 'dislike'
		AND post_id = ?;`, post.ID, db)

		post.Comments_Counter = RowCounter(`SELECT COUNT(*) AS count FROM comments WHERE post_id = ?;`, post.ID, db)
		post.Categories = strings.Split(category, ",")
		posts = append(posts, post)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
	}
}

func RowCounter(query string, ID string, db *sql.DB) int {
	count := 0
	db.QueryRow(query, ID).Scan(&count)
	return count
}

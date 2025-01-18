package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html"
	"net/http"
	"strings"
	"time"

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
	if len(newPost.Title) == 0 || len(newPost.Content) == 0 || len(newPost.Title) > 300 || len(newPost.Content) > 4000 {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	postID, err := uuid.NewV4()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	newPost.ID = postID.String()

	newPost.Author_id, err = utils.UserIDFromToken(r, db)
	if err != nil {
		Logout(w,r)
		return
	}
	newPost.Author_name, err = utils.GetUserName(newPost.Author_id, db)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Begin transaction
	tx, err := db.Begin()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()
	categories := ""

	newPost.Category_id, categories, err = utils.CategoriesChecker(db, newPost.Categories)
	if err != nil {
		http.Error(w, "invalid categories", http.StatusBadRequest)
		return
	}

	newPost.Title = html.EscapeString(newPost.Title)
	newPost.Content = html.EscapeString(newPost.Content)

	query := "INSERT INTO posts (post_id, user_id, category_name, title, content) VALUES (?, ?, ?, ?, ?)"
	_, err = tx.Exec(query, newPost.ID, newPost.Author_id, categories, newPost.Title, newPost.Content)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if err := tx.Commit(); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	newPost.CreatedAt = time.Now().Format("2006-01-02 15:04:05")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(newPost); err != nil {
		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
	}
}

func GetPosts(cursor string, db *sql.DB, w http.ResponseWriter, r *http.Request) {
	var Cookie bool 
	logged := true
	query := "SELECT post_id, user_id, category_name, title, content, created_at FROM posts WHERE created_at < ? ORDER BY created_at DESC limit ?;"
	rows, err := db.Query(query, cursor, 20)
	if err != nil {
		http.Error(w, "internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	userid, err := utils.UserIDFromToken(r, db)
	if err != nil {
		logged = false
		Cookie = utils.DeleteCookie(w,r)
	}
	var response forum.PostResponse

	category := ""
	for rows.Next() {
		var post forum.Post
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
		if logged {
			post.Reaction = utils.IfPostReacted(post.ID, userid, db)
		}
		post.Likes_Counter = RowCounter(`
		SELECT COUNT(*) AS count
		FROM Reactions
		WHERE reaction_type = 'like'
		AND post_id = ? AND comment_id = 'none';`, post.ID, db)

		post.Dislikes_counter = RowCounter(`
		SELECT COUNT(*) AS count
		FROM Reactions
		WHERE reaction_type = 'dislike'
		AND post_id = ? AND comment_id = 'none';`, post.ID, db)

		post.Comments_Counter = RowCounter(`SELECT COUNT(*) AS count FROM comments WHERE post_id = ?;`, post.ID, db)
		post.Categories = strings.Split(category, ",")
		response.Posts = append(response.Posts, post)
	}
	if len(response.Posts) == 20{
		cursor = response.Posts[len(response.Posts)-1].CreatedAt
		response.Postsremaining = RowCounter(`SELECT COUNT(*) AS count
		FROM Posts
		WHERE created_at < ? ORDER BY created_at;`, cursor, db)
	}
	if Cookie {
		response.Message = "user logged-out successfully"
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
	}
}

func RowCounter(query string, arg string, db *sql.DB) int {
	count := 0
	db.QueryRow(query, arg).Scan(&count)
	return count
}

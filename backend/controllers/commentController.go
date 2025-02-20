package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html"
	"net/http"
	"time"

	forum "forum/models"
	"forum/utils"

	uuid "github.com/gofrs/uuid"
)

func CreateComment(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	var newComment forum.Comment

	if err := json.NewDecoder(r.Body).Decode(&newComment); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()
	if len(newComment.Content) == 0 || len(newComment.Content) > 300 {
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, nil, "comment cannot be empty or longer than 300 characters")
		return
	}
	tx, err := db.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	commentID, err := uuid.NewV4()
	if err != nil {
		http.Error(w, "Internal server error generating post ID", http.StatusInternalServerError)
		return
	}
	newComment.ID = commentID.String()

	newComment.Author_id, err = utils.UserIDFromToken(r, db)
	if err != nil {
		Logout(w,r)
		return
	}

	if !utils.PostExists(db, newComment.Post_id) {
		http.Error(w, "Post does not exist Bad request", http.StatusBadRequest)
		return
	}
	newComment.Author_name, err = utils.GetUserName(newComment.Author_id, db)
	if err != nil {
		http.Error(w, "There was a problem getting username", http.StatusInternalServerError)
		return
	}

	newComment.Content = html.EscapeString(newComment.Content)

	query := "INSERT INTO comments (comment_id, user_id, post_id, content) VALUES (?, ?, ?, ?)"
	_, err = tx.Exec(query, newComment.ID, newComment.Author_id, newComment.Post_id, newComment.Content)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating comment: %v", err), http.StatusInternalServerError)
		return
	}

	if err := tx.Commit(); err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}
	newComment.CreatedAt = time.Now().Format("2006-01-02 15:04:05")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(newComment); err != nil {
		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
}

func GetComment(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	var Cookie bool
	logged := true
	var response forum.CommentResponse
	postID := r.URL.Query().Get("id")
	if postID == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	rows, err := db.Query("SELECT comment_id, user_id, post_id, content, created_at FROM comments WHERE post_id = ? ORDER BY created_at DESC;", postID)
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

	for rows.Next() {
		var comment forum.Comment
		err := rows.Scan(&comment.ID, &comment.Author_id, &comment.Post_id, &comment.Content, &comment.CreatedAt)
		if err != nil {
			http.Error(w, fmt.Sprintf("internal server error x: %v", err), http.StatusInternalServerError)
			return
		}
		comment.Author_name, err = utils.GetUserName(comment.Author_id, db)
		if err != nil {
			http.Error(w, "There was a problem getting username", http.StatusInternalServerError)
			return
		}
		if logged {
			comment.Reaction = utils.IfCommentReacted(comment.ID, userid, db)
		}
		comment.LikesCount = RowCounter(`
		SELECT COUNT(*) AS count
		FROM Reactions
		WHERE reaction_type = 'like'
		AND comment_id = ?;`, comment.ID, db)
		comment.DislikesCount = RowCounter(`
		SELECT COUNT(*) AS count
		FROM Reactions
		WHERE reaction_type = 'dislike'
		AND comment_id = ?;`, comment.ID, db)
		response.Comments = append(response.Comments, comment)
	}
	if Cookie {
		response.Message = "user logged-out successfully"
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
}

package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	forum "forum/models"
)

func hasUserReactedToPost(db *sql.DB, postID string) bool {
	var hasReacted bool

	query := `SELECT EXISTS (
		SELECT 1
		FROM likeAndDislike
		WHERE user_id = ? AND post_id = ? AND comment_id IS NULL
	) AS has_reacted;`

	err := db.QueryRow(query, postID).Scan(&hasReacted)
	if err != nil {
		return false
	}

	return hasReacted
}

func insertOrUpdate(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	if r.URL.Path != "/post" {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	newLike := forum.LikeOrDislike{}
	// check if the user already react or not 

	// query := `SELECT EXISTS (
	// 	SELECT 1
	// 	FROM likeAndDislike
	// 	WHERE user_id = ?  
	// 	AND post_id = ?
	// 	AND comment_id IS NULL
	// ) AS has_reacted;`

	if err := json.NewDecoder(r.Body).Decode(&newLike); err != nil {
		http.Error(w, "Invalid action", http.StatusBadRequest)
		fmt.Println(err)
		return
	}
	defer r.Body.Close()

	_, err := db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		http.Error(w, "Failed to enable foreign keys", http.StatusInternalServerError)
		return
	}
	if hasUserReactedToPost(db, newLike.Post_id) {
		//
	}
}
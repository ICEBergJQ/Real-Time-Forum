package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"forum/models"
	"forum/utils"
)

func HasUserReacted(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := fmt.Errorf("method not allowed")
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Method Not Allowed")
		return
	}

	if r.URL.Path != "/reaction" {
		err := fmt.Errorf("unauthorized path")
		utils.CreateResponseAndLogger(w, http.StatusUnauthorized, err, "Unauthorized path")
		return
	}

	var reaction models.Reactions
	userID, err := utils.UserIDFromToken(r, db)
	if err != nil {
		Logout(w, r)
		return
	}
	reaction.User_id = userID

	if err := json.NewDecoder(r.Body).Decode(&reaction); err != nil {
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "Invalid JSON payload")
		return
	}
	defer r.Body.Close()

	// Handle comment_id NULL logic
	var commentNull sql.NullString
	if reaction.Comment_id == "" {
		commentNull = sql.NullString{Valid: false}
	} else {
		commentNull = sql.NullString{String: reaction.Comment_id, Valid: true}
	}

	// Check if post and (optional) comment exist
	if !utils.PostExists(db, reaction.Post_id) {
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, fmt.Errorf("post does not exist"), "Post does not exist")
		return
	}
	if commentNull.Valid && !utils.CommentExists(db, reaction.Comment_id) {
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, fmt.Errorf("comment does not exist"), "Comment does not exist")
		return
	}

	// Check if the user already reacted
	query := `
		SELECT reaction_type
		FROM Reactions
		WHERE user_id = ? AND post_id = ? AND
		((comment_id = ?) OR (comment_id IS NULL AND ? IS NULL))
	`
	var existingReactionType string
	err = db.QueryRow(query, reaction.User_id, reaction.Post_id, commentNull, commentNull).
		Scan(&existingReactionType)

	action := ""
	if err != nil {
		if err == sql.ErrNoRows {
			action = "add"
		} else {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
			return
		}
	} else {
		if existingReactionType == reaction.Reaction_Type {
			action = "remove"
		} else {
			action = "update"
		}
	}

	Reaction(db, reaction, action, w)
}

func Reaction(db *sql.DB, newReaction models.Reactions, action string, w http.ResponseWriter) {
	var commentNull sql.NullString
	if newReaction.Comment_id == "" {
		commentNull = sql.NullString{Valid: false}
	} else {
		commentNull = sql.NullString{String: newReaction.Comment_id, Valid: true}
	}

	var err error
	var message string

	switch action {
	case "remove":
		_, err = db.Exec(`
			DELETE FROM Reactions
			WHERE user_id = ? AND post_id = ? AND
			((comment_id = ?) OR (comment_id IS NULL AND ? IS NULL))`,
			newReaction.User_id, newReaction.Post_id, commentNull, commentNull)
		message = "Removed"
	case "update":
		_, err = db.Exec(`
			UPDATE Reactions
			SET reaction_type = ?, created_at = datetime('now')
			WHERE user_id = ? AND post_id = ? AND
			((comment_id = ?) OR (comment_id IS NULL AND ? IS NULL))`,
			newReaction.Reaction_Type, newReaction.User_id, newReaction.Post_id, commentNull, commentNull)
		message = "Updated"
	case "add":
		_, err = db.Exec(`
			INSERT INTO Reactions (user_id, post_id, comment_id, reaction_type)
			VALUES (?, ?, ?, ?)`,
			newReaction.User_id, newReaction.Post_id, commentNull, newReaction.Reaction_Type)
		message = "Added"
	default:
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, fmt.Errorf("unknown action"), "Invalid reaction action")
		return
	}

	if err != nil {
		utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Reaction operation failed")
		return
	}
	utils.CreateResponseAndLogger(w, http.StatusOK, nil, message)
}

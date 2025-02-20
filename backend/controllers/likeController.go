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
		err := fmt.Errorf("unauthorized")
		utils.CreateResponseAndLogger(w, http.StatusUnauthorized, err, "unauthorized path")
		return
	}
	var reaction models.Reactions
	var err error

	reaction.User_id, err = utils.UserIDFromToken(r, db)
	if err != nil {
		Logout(w, r)
		return
	}
	if err := json.NewDecoder(r.Body).Decode(&reaction); err != nil {
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "Invalid JSON payload")
		return
	}
	defer r.Body.Close()
	var hasReacted string
	var query string
	var reactionFromDB models.Reactions

	if reaction.Comment_id == "" {
		reaction.Comment_id = "none"
	}
	// r1 := strings.TrimSpace(reaction.Comment_id)
	query = "SELECT user_id, post_id, comment_id, reaction_type FROM Reactions WHERE user_id = ? AND post_id = ? AND comment_id = ?"

	err = db.QueryRow(query, reaction.User_id, reaction.Post_id, reaction.Comment_id).Scan(&reactionFromDB.User_id, &reactionFromDB.Post_id, &reactionFromDB.Comment_id, &reactionFromDB.Reaction_Type)
	if err != nil {
		if err == sql.ErrNoRows {
			Reaction(db, reaction, "add", w)
			return
		}
		utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
		return
	}
	if reactionFromDB.Reaction_Type == reaction.Reaction_Type {
		hasReacted = "remove"
	} else if reactionFromDB.Reaction_Type != reaction.Reaction_Type {
		hasReacted = "update"
	}
	Reaction(db, reaction, hasReacted, w)
}

func Reaction(db *sql.DB, newReaction models.Reactions, hasReacted string, w http.ResponseWriter) {
	if !utils.PostExists(db, newReaction.Post_id) {
		err := fmt.Errorf("post does not exist")
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "Post Does not Exist")
		return
	}
	if newReaction.Comment_id != "none"{
		if !utils.CommentExists(db, newReaction.Comment_id) {
			err := fmt.Errorf("comment does not exist")
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "Comment Does not Exist")
			return
		}	
	}
	var ReactionStatus string
	if hasReacted == "remove" {
		_, err := db.Exec(`
				DELETE FROM Reactions
				WHERE user_id = ? AND post_id = ? AND comment_id = ?;`,
			newReaction.User_id, newReaction.Post_id, newReaction.Comment_id)
		if err != nil {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Failed to delete reaction")
			return
		}
		ReactionStatus = "Removed"
		utils.CreateResponseAndLogger(w, http.StatusOK, nil, ReactionStatus)
		return
	} else if hasReacted == "update" {
		_, err := db.Exec(`
				UPDATE Reactions
				SET reaction_type = ?
				WHERE user_id = ? AND post_id = ? AND comment_id = ?;`,
			newReaction.Reaction_Type, newReaction.User_id, newReaction.Post_id, newReaction.Comment_id)
		if err != nil {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Failed to update reaction")
			return
		}
		ReactionStatus = "Updated"
		utils.CreateResponseAndLogger(w, http.StatusOK, nil, ReactionStatus)
		return
	} else if hasReacted == "add" {
		_, err := db.Exec(`
			INSERT INTO Reactions (user_id, post_id, comment_id, reaction_type)
			VALUES (?, ?, ?, ?);`,
			newReaction.User_id, newReaction.Post_id, newReaction.Comment_id, newReaction.Reaction_Type)
		if err != nil {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Failed to insert reaction")
			return
		}
		ReactionStatus = "Added"
		utils.CreateResponseAndLogger(w, http.StatusOK, nil, ReactionStatus)
		return
	}
}

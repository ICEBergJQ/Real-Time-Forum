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
		err := fmt.Errorf("Methode Not Allowed")
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Methode Not Allowed")
		return
	}

	if r.URL.Path != "/reaction" {
		err := fmt.Errorf("unauthorized")
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "unauthorized path")
		return
	}
	var reaction models.Reactions
	var err error
	
	reaction.User_id, err = utils.UserIDFromToken(r, db)
	if err != nil {
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "user_id not found")
		return
	}
	if err := json.NewDecoder(r.Body).Decode(&reaction); err != nil {
		utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
		return
	}
	defer r.Body.Close()


	var hasReacted bool
	var reactionType *string
	

	var query string
	if reaction.Comment_id == "" {
		// Case: Reaction to a post
		query = `
			SELECT EXISTS (
				SELECT 1
				FROM Reactions
				WHERE user_id = ? AND post_id = ? AND comment_id IS NULL
			), (
				SELECT reaction_type
				FROM Reactions
				WHERE user_id = ? AND post_id = ? AND comment_id IS NULL
			);
		`
		err := db.QueryRow(query, reaction.User_id, reaction.Post_id, reaction.User_id, reaction.Post_id).Scan(&hasReacted, &reactionType)
		if err != nil {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
			return
		}
		PostReaction(db, reaction,hasReacted, reactionType, w)
	} else {
		// Case: Reaction to a comment
		query = `
			SELECT EXISTS (
				SELECT 1
				FROM Reactions
				WHERE user_id = ? AND post_id = ? AND comment_id = ?
			), (
				SELECT reaction_type
				FROM Reactions
				WHERE user_id = ? AND post_id = ? AND comment_id = ?
			);
		`
		err := db.QueryRow(query, reaction.User_id, reaction.Post_id, reaction.Comment_id, reaction.User_id, reaction.Post_id, reaction.Comment_id).Scan(&hasReacted, &reactionType)
		if err != nil {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
			return
		}
		CommentReaction(db, reaction,hasReacted, reactionType, w)
	}
}

func PostReaction(db *sql.DB, newReaction models.Reactions ,hasReacted bool, reactionType *string, w http.ResponseWriter) {

	if !utils.PostExists(db, newReaction.Post_id) {
		err := fmt.Errorf("Post Does not Exist")
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "Post Does not Exist")
		return
	}

	var ReactionStatus string
	if hasReacted {
		if reactionType == &newReaction.Reaction_Type {
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
		} else {
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
		}
	} else {
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

func CommentReaction(db *sql.DB, newReaction models.Reactions,hasReacted bool, reactionType *string, w http.ResponseWriter) {
	
	var ReactionStatus string

	if hasReacted {
		if *reactionType == newReaction.Reaction_Type {
			_, err := db.Exec(`
				DELETE FROM Reactions
				WHERE user_id = ? AND post_id = ? AND comment_id IS NULL;`,
				newReaction.User_id, newReaction.Post_id, newReaction.Comment_id)
			if err != nil {
				utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Failed to delete reaction")
				return
			}
			ReactionStatus = "Removed"
			utils.CreateResponseAndLogger(w, http.StatusOK, nil, ReactionStatus)
			return 
		} else {
			_, err := db.Exec(`
				UPDATE Reactions
				SET reaction_type = ?
				WHERE user_id = ? AND post_id = ? AND comment_id IS NULL;`,
				newReaction.Reaction_Type, newReaction.User_id, newReaction.Post_id, newReaction.Comment_id)
			if err != nil {
				utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Failed to update reaction")
				return
			}
			ReactionStatus = "Updated"
			utils.CreateResponseAndLogger(w, http.StatusOK, nil, ReactionStatus)
			return 
		}
	} else {
		_, err := db.Exec(`
			INSERT INTO Reactions (user_id, post_id, comment_id, reaction_type)
			VALUES (?, ?, NULL, ?);`,
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

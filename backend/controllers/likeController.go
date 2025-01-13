package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	forum "forum/models"
	"forum/utils"
)

func hasUserReacted(db *sql.DB, userID int, postID string, commentID *string) (bool, *string) {
	var hasReacted bool
	var reactionType *string

	var query string
	if commentID == nil {
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
		err := db.QueryRow(query, userID, postID, userID, postID).Scan(&hasReacted, &reactionType)
		if err != nil {
			fmt.Println("Error checking user reactions to post: ", err)
			return false, nil
		}
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
		err := db.QueryRow(query, userID, postID, *commentID, userID, postID, *commentID).Scan(&hasReacted, &reactionType)
		if err != nil {
			fmt.Println("Error checking user reactions to comment: ", err)
			return false, nil
		}
	}

	return hasReacted, reactionType
}

func InsertOrUpdate(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	if r.URL.Path != "/reaction" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	newReaction := forum.Reactions{}
	var err error
	newReaction.User_id, err = utils.UserIDFromToken(r, db)
	if err != nil {
		http.Error(w, "Failed to get user_id", http.StatusNotFound)
		fmt.Println("Error user_id not found: ", err)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&newReaction); err != nil {
		http.Error(w, "Failed to decode newReaction", http.StatusBadRequest)
		fmt.Println("Error decoding request: ", err)
		return
	}
	defer r.Body.Close()

	// Check if the post exists
	if !utils.PostExists(db, newReaction.Post_id) {
		fmt.Println("Error, Post does not exist!!")
		http.Error(w, "Post Does not Exist", http.StatusBadRequest)
		return
	}

	// Check if the user has already reacted
	Reacted, currentReaction := hasUserReacted(db, newReaction.User_id, newReaction.Post_id, &newReaction.Comment_id)

	// Handle existing reaction
	if Reacted {
		var currentReactionValue string
		if currentReaction != nil {
			currentReactionValue = *currentReaction
		}

		if currentReactionValue == newReaction.Reaction_Type {
			// Remove the reaction
			_, err := db.Exec(`
				DELETE FROM Reactions
				WHERE user_id = ? AND post_id = ? AND comment_id = ?;`,
				newReaction.User_id, newReaction.Post_id, newReaction.Comment_id)
			if err != nil {
				http.Error(w, "Failed to delete reaction", http.StatusInternalServerError)
				fmt.Println("Error deleting reaction: ", err)
				return
			}
			w.WriteHeader(http.StatusOK)
			fmt.Fprint(w, "Reaction removed successfully")
		} else {
			// Update the reaction type
			_, err := db.Exec(`
				UPDATE Reactions
				SET reaction_type = ?
				WHERE user_id = ? AND post_id = ? AND comment_id = ?;`,
				newReaction.Reaction_Type, newReaction.User_id, newReaction.Post_id, newReaction.Comment_id)
			if err != nil {
				http.Error(w, "Failed to update reaction", http.StatusInternalServerError)
				fmt.Println("Error updating reaction: ", err)
				return
			}
			w.WriteHeader(http.StatusOK)
			fmt.Fprint(w, "Reaction updated successfully")
		}
	} else {
		// Add a new reaction
		_, err := db.Exec(`
			INSERT INTO Reactions (user_id, post_id, comment_id, reaction_type)
			VALUES (?, ?, ?, ?);`,
			newReaction.User_id, newReaction.Post_id, newReaction.Comment_id, newReaction.Reaction_Type)
		if err != nil {
			http.Error(w, "Failed to insert reaction", http.StatusInternalServerError)
			fmt.Println("Error inserting reaction: ", err)
			return
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "Reaction added successfully")
	}
}

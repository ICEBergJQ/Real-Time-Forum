package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	forum "forum/models"
)

func hasUserReactedToPost(db *sql.DB, userID int, postID string) (bool, string) {
	var hasReacted bool
	var reactionType string
	query := `SELECT EXISTS (
		SELECT 1
		FROM likeAndDislike
		WHERE user_id = ? AND post_id = ? AND comment_id IS NULL
	) AS has_reacted, reaction_type
	 FROM likeAndDislike
	 WHERE user_id = ? AND post_id = ? AND comment_id IS NULL;`

	err := db.QueryRow(query, userID, postID).Scan(&hasReacted, &reactionType)
	if err != nil {
		fmt.Println("Error checking user reactions: ", err)
		return false, ""
	}

	return hasReacted, reactionType
}

func InsertOrUpdate(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	if r.URL.Path != "/post" {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	newLike := forum.LikeOrDislike{}
	if err := json.NewDecoder(r.Body).Decode(&newLike); err != nil {
		http.Error(w, "Invalid action", http.StatusBadRequest)
		fmt.Println("Error decoding request: ", err)
		return
	}
	defer r.Body.Close()

	_, err := db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		http.Error(w, "Failed to enable foreign keys", http.StatusInternalServerError)
		return
	}

	Reacted, Exist := hasUserReactedToPost(db, newLike.User_id, newLike.Post_id)
	if Reacted {
		// case : user already reacted
		// check this reaction
		if Exist == newLike.Reaction_Type {
			_, err := db.Exec(`
			DELETE FROM likeAndDislike WHERE user_id = ? AND post_id = ? AND comment_id IS NULL;`,
				newLike.User_id, newLike.Post_id, newLike.Comment_id)
			if err != nil {
				http.Error(w, "Failed to delet reaction", http.StatusInternalServerError)
				fmt.Println("Error deleting reaction: ", err)
				return
			}
			w.WriteHeader(http.StatusOK)
			fmt.Fprintf(w, "Reaction removed successfully")
		} else {
			_, err := db.Exec(`
			UPADTE likeAndDislike SET reaction_type = ? WHERE user_id = ? AND post_id = ? AND comment_id IS NULL;
			`, newLike.Reaction_Type, newLike.User_id, newLike.Post_id, newLike.Comment_id)
			if err != nil {
				http.Error(w, "Failed to update reaction", http.StatusInternalServerError)
				fmt.Println("Error updating reaction: ", err)
				return
			}
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Reaction updated successfully")

	} else {
		// case : user first reaction
		_, err := db.Exec(`
		INSERT INTO likeAndDislike (user_id, post_id, comment_id, reaction_type)
		VALUES (?, ?, NULL, ?);`,
			newLike.User_id, newLike.Post_id, newLike.Reaction_Type)
		if err != nil {
			http.Error(w, "Failed to insert reaction", http.StatusInternalServerError)
			fmt.Println("Error inserting reaction: ", err)
			return
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Reaction added successfully")
	}
}

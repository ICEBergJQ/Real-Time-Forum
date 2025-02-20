package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	forum "forum/models"
	"forum/utils"
)

func CreateQuery(categories []string) string {
	query := "SELECT post_id, user_id, category_name, title, content, created_at FROM posts WHERE category_name LIKE "
	for i, cat := range categories {
		if i == 0 {
			query += "'%" + cat + "%'"
		} else {
			query += " AND category_name LIKE '%" + cat + "%'"
		}
	}
	return query
}

func FilterPosts(query string, cursor string, db *sql.DB, w http.ResponseWriter, r *http.Request) {
	logged := true
	var cookie bool
	rows, err := db.Query(query, cursor, 20)
	if err != nil {
		http.Error(w, "Internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	userid, err := utils.UserIDFromToken(r, db)
	if err != nil {
		logged = false
		cookie = utils.DeleteCookie(w, r)
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

	if len(response.Posts) == 20 {
		cursor = response.Posts[len(response.Posts)-1].CreatedAt
		response.Postsremaining = RowCounter(`SELECT COUNT(*) AS count
		FROM Posts
		WHERE created_at < ? ORDER BY created_at DESC;`, cursor, db)
	}
	if cookie {
		response.Message = "user logged-out successfully"
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
}

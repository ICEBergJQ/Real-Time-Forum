package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	forum "forum/models"
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
	rows, err := db.Query(query , cursor, 20)
	if err != nil {
		http.Error(w, "Internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
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
		return
	}
}

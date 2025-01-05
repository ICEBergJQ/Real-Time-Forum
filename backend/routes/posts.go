package routes

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"forum/controllers"
	"forum/models"
)

func PostRoute(db *sql.DB) {
	http.HandleFunc("/post", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			controllers.CreatePost(db, w, r)
		} else if r.Method == http.MethodGet {
			controllers.GetPosts(db, w, r)
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

func FilterRoute(db *sql.DB) {
	http.HandleFunc("/filter", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			var req models.FilterRequest
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				http.Error(w, "Invalid input", http.StatusBadRequest)
				return
			}
			query := ""
			switch req.FilterMethod {
			case "getlikedposts":
				query = `SELECT p.post_id, p.user_id, p.category_name, p.title, p.content, p.created_at
						FROM posts p
						JOIN Reactions l ON p.post_id = l.post_id
						WHERE l.reaction_type = 'like' AND l.user_id = ` + strconv.Itoa(req.Id) +
					` AND p.created_at < ? ORDER BY p.created_at DESC limit ?`

				controllers.FilterPosts(query, req.Cursor, db, w, r)
			case "filterbycategories":
				_, _, err := controllers.CategoriesChecker(db, req.Categories)
				if err != nil {
					http.Error(w, "Invalid Categories", http.StatusBadRequest)
					return
				}
				query = controllers.CreateQuery(req.Categories) + ` AND created_at < ? ORDER BY created_at DESC limit ?`
				controllers.FilterPosts(query, req.Cursor, db, w, r)
			case "getcreatedposts":
				query = `SELECT post_id, user_id, category_name, title, content, created_at FROM posts WHERE user_id = ` + strconv.Itoa(req.Id)
				controllers.FilterPosts(query, req.Cursor, db, w, r)
			default:
				http.Error(w, "Unsupported filter method", http.StatusBadRequest)
			}
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

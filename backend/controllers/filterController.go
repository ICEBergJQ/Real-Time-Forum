package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	forum "forum/models"
)

// func GetFilteredPostsByCategory(db *sql.DB, w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodGet {
// 		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	categoryQuery := r.URL.Query().Get("categories")
// 	if categoryQuery == "" {
// 		http.Error(w, "categories query parameter is required", http.StatusBadRequest)
// 		return
// 	}
// 	_, categoryNames, err := CategoriesChecker(db, strings.Split(categoryQuery, ","))
// 	if err != nil {
// 		http.Error(w, "invalid categories", http.StatusBadRequest)
// 		return
// 	}

// 	query := createquery(strings.Split(categoryQuery, ","))

// 	rows, err := db.Query(query, categoryNames)
// 	if err != nil {
// 		http.Error(w, "Internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
// 		return
// 	}
// 	defer rows.Close()

// 	var posts []forum.Post
// 	for rows.Next() {
// 		var post forum.Post
// 		var categoryNames string
// 		err := rows.Scan(&post.ID, &post.Author_id, &categoryNames, &post.Title, &post.Content, &post.CreatedAt)
// 		if err != nil {
// 			http.Error(w, "Internal server error (scan): "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
// 			return
// 		}
// 		post.Categories = strings.Split(categoryNames, ",")

// 		posts = append(posts, post)
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	if err := json.NewEncoder(w).Encode(posts); err != nil {
// 		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
// 	}
// }

// func GetCreatedPosts(db *sql.DB, w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodGet {
// 		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	userID := r.URL.Query().Get("user_id")
// 	if userID == "" {
// 		http.Error(w, "user_id query parameter is required", http.StatusBadRequest)
// 		return
// 	}
// 	ID, err := strconv.Atoi(userID)
// 	if err != nil {
// 		http.Error(w, "invalid user_id", http.StatusBadRequest)
// 		return
// 	}

// 	query := `SELECT post_id, user_id, category_name, title, content, created_at FROM posts WHERE user_id = ?`
// 	rows, err := db.Query(query, ID)
// 	if err != nil {
// 		http.Error(w, "Internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
// 		return
// 	}
// 	defer rows.Close()

// 	var posts []forum.Post
// 	for rows.Next() {
// 		var post forum.Post
// 		var categoryNames string

// 		err := rows.Scan(&post.ID, &post.Author_id, &categoryNames, &post.Title, &post.Content, &post.CreatedAt)
// 		if err != nil {
// 			http.Error(w, "Internal server error (scan): "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
// 			return
// 		}

// 		post.Categories = strings.Split(categoryNames, ",")
// 		posts = append(posts, post)
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	if err := json.NewEncoder(w).Encode(posts); err != nil {
// 		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
// 	}
// }

// func GetLikedPosts(db *sql.DB, w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodGet {
// 		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	userID := r.URL.Query().Get("liked_user")
// 	if userID == "" {
// 		http.Error(w, "user_id query parameter is required", http.StatusBadRequest)
// 		return
// 	}

// 	query := `
// 	SELECT p.user_id, p.post_id, p.title, p.content, p.created_at
// 	FROM posts p
// 	JOIN likeAndDislike l ON p.post_id = l.post_id
// 	WHERE l.reaction_type = 'like' AND l.user_id = ?;
// 	`
// 	rows, err := db.Query(query, userID)
// 	if err != nil {
// 		http.Error(w, "Internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
// 		return
// 	}
// 	defer rows.Close()

// 	var posts []forum.Post
// 	for rows.Next() {
// 		var post forum.Post
// 		var categoryNames string

// 		err := rows.Scan(&post.Author_id, &post.ID, &post.Title, &post.Content, &post.CreatedAt)
// 		if err != nil {
// 			http.Error(w, "Internal server error (scan): "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
// 			return
// 		}
// 		categoryNameList := strings.Split(categoryNames, ",")
// 		post.Categories = categoryNameList

// 		posts = append(posts, post)
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	if err := json.NewEncoder(w).Encode(posts); err != nil {
// 		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
// 	}
// }

func CategoriesChecker(db *sql.DB, categoryNames []string) ([]int, string, error) {
	if len(categoryNames) < 1 {
		return nil, "", fmt.Errorf("no categories provided")
	}

	type Category struct {
		ID   int
		Name string
	}

	var categories []Category
	var ids []int

	for _, categoryName := range categoryNames {
		var category Category
		err := db.QueryRow("SELECT category_id, category_name FROM categories WHERE category_name = ?", categoryName).Scan(&category.ID, &category.Name)
		if err != nil {
			if err == sql.ErrNoRows {
				return nil, "", fmt.Errorf("category not found: %s", categoryName)
			}
			return nil, "", fmt.Errorf("error fetching category: %w", err)
		}
		categories = append(categories, category)
	}

	var CategoryNames string
	for i, category := range categories {
		if i != len(categories)-1 {
			CategoryNames += category.Name + ","
		}
		ids = append(ids, category.ID)
	}
	return ids, CategoryNames, nil
}

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
	}
}

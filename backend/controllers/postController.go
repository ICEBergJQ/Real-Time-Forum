package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"sync"

	uuid "github.com/gofrs/uuid"

	forum "forum/models"
)

var mu sync.Mutex

func CreatePost(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}
	if r.URL.Path != "/post" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	var newPost forum.Post
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()
	if len(newPost.Title) == 0 || len(newPost.Content) == 0 || len(newPost.Title) > 300 || len(newPost.Content) > 40000 {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	postID, err := uuid.NewV4()
	if err != nil {
		http.Error(w, "Internal server error generating post ID", http.StatusInternalServerError)
		return
	}
	newPost.ID = postID.String()

	// Begin transaction
	tx, err := db.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()
	categories := ""

	newPost.Category_id, categories, err = FetchAndSortCategoriesByID(db, newPost.Categories)
	if err != nil {
		http.Error(w, "invalid categories", http.StatusBadRequest)
		return
	}

	query := "INSERT INTO posts (post_id, user_id, category_name, title, content) VALUES (?, ?, ?, ?, ?)"
	_, err = tx.Exec(query, newPost.ID, newPost.Author_id, categories, newPost.Title, newPost.Content)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating post: %v", err), http.StatusInternalServerError)
		return
	}

	// Link categories to the post
	for _, categoryID := range newPost.Category_id {
		_, err := tx.Exec("INSERT INTO postsCategories (post_id, category_id) VALUES (?, ?)", newPost.ID, categoryID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error linking post to category: %v", err), http.StatusInternalServerError)
			return
		}
	}

	if err := tx.Commit(); err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newPost)
}

func GetPosts(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	query := "SELECT post_id, user_id, category_name, title, content, created_at FROM posts"
	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, "internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []forum.Post
	category := ""
	for rows.Next() {
		var post forum.Post
		err := rows.Scan(&post.ID, &post.Author_id, &category, &post.Title, &post.Content, &post.CreatedAt)
		if err != nil {
			http.Error(w, fmt.Sprintf("internal server error x: %v", err), http.StatusInternalServerError)
			return
		}
		post.Categories = strings.Split(category, ",")
		posts = append(posts, post)
	}

	json.NewEncoder(w).Encode(posts)
}

func GetFilteredPostsByCategory(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	categoryQuery := r.URL.Query().Get("categories")
	if categoryQuery == "" {
		http.Error(w, "categories query parameter is required", http.StatusBadRequest)
		return
	}
	_, categoryNames, err := FetchAndSortCategoriesByID(db, strings.Split(categoryQuery, ","))
	if err != nil {
		http.Error(w, "invalid categories", http.StatusBadRequest)
		return
	}

	query := `SELECT post_id, user_id, category_name, title, content, created_at FROM posts WHERE category_name LIKE ?;`

	rows, err := db.Query(query, categoryNames)
	if err != nil {
		http.Error(w, "Internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []forum.Post
	for rows.Next() {
		var post forum.Post
		var categoryNames string
		err := rows.Scan(&post.ID, &post.Author_id, &categoryNames, &post.Title, &post.Content, &post.CreatedAt)
		if err != nil {
			http.Error(w, "Internal server error (scan): "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
			return
		}
		post.Categories = strings.Split(categoryNames, ",")

		posts = append(posts, post)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
	}
}

func GetCreatedPosts(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "user_id query parameter is required", http.StatusBadRequest)
		return
	}
	ID, err := strconv.Atoi(userID)
	if err != nil {
		http.Error(w, "invalid user_id", http.StatusBadRequest)
		return
	}

	query := `SELECT post_id, user_id, category_name, title, content, created_at FROM posts WHERE user_id = ?`
	rows, err := db.Query(query, ID)
	if err != nil {
		http.Error(w, "Internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []forum.Post
	for rows.Next() {
		var post forum.Post
		var categoryNames string

		err := rows.Scan(&post.ID, &post.Author_id, &categoryNames, &post.Title, &post.Content, &post.CreatedAt)
		if err != nil {
			http.Error(w, "Internal server error (scan): "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
			return
		}

		post.Categories = strings.Split(categoryNames, ",")
		posts = append(posts, post)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
	}
}

func GetLikedPosts(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	userID := r.URL.Query().Get("liked_user")
	if userID == "" {
		http.Error(w, "user_id query parameter is required", http.StatusBadRequest)
		return
	}

	query := `
	SELECT p.user_id, p.post_id, p.title, p.content, p.created_at
	FROM posts p
	JOIN likeAndDislike l ON p.post_id = l.post_id
	WHERE l.reaction_type = 'like' AND l.user_id = ?;
	`
	rows, err := db.Query(query, userID)
	if err != nil {
		http.Error(w, "Internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []forum.Post
	for rows.Next() {
		var post forum.Post
		var categoryNames string

		err := rows.Scan(&post.Author_id, &post.ID, &post.Title, &post.Content, &post.CreatedAt)
		if err != nil {
			http.Error(w, "Internal server error (scan): "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
			return
		}
		categoryNameList := strings.Split(categoryNames, ",")
		post.Categories = categoryNameList

		posts = append(posts, post)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		http.Error(w, "Failed to encode response: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
	}
}

func FetchAndSortCategoriesByID(db *sql.DB, categoryNames []string) ([]int, string, error) {
	if len(categoryNames) < 1 {
		return nil,"", fmt.Errorf("no categories provided")
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

	// Sort categories by ID
	sort.Slice(categories, func(i, j int) bool {
		return categories[i].ID < categories[j].ID
	})

	// Extract sorted category names
	var sortedCategoryNames string
	for _, category := range categories {
		sortedCategoryNames += category.Name + ","
		ids = append(ids, category.ID)
	}
	sortedCategoryNames = strings.TrimRight(sortedCategoryNames, ",")

	return ids, sortedCategoryNames, nil
}

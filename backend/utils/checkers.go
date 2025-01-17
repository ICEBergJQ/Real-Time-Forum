package utils

import (
	"database/sql"
	"fmt"
	"time"
)

func IsTimestamp(input string) bool {
	layout := "2006-01-02 15:04:05"
	_, err := time.Parse(layout, input)
	return err == nil
}

func PostExists(db *sql.DB, postID string) bool {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM posts WHERE post_id = ?)`
	err := db.QueryRow(query, postID).Scan(&exists)
	if err != nil {
		return false
	}
	return exists
}

func CommentExists(db *sql.DB, commentID string) bool {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM comments WHERE comment_id = ?)`
	err := db.QueryRow(query, commentID).Scan(&exists)
	if err != nil {
		return false
	}
	return exists
}

func CategoriesChecker(db *sql.DB, categoryNames []string) ([]int, string, error) {
	if len(categoryNames) < 1 {
		return nil, "", fmt.Errorf("no categories provided")
	} else if !IfCategoryisunique(categoryNames) {
		return nil, "", fmt.Errorf("duplicated categories")
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
		} else {
			CategoryNames += category.Name
		}
		ids = append(ids, category.ID)
	}
	return ids, CategoryNames, nil
}

func IfCategoryisunique(categories []string) bool {
	for i, v := range categories {
		for i2, v2 := range categories {
			if v2 == v && i != i2 {
				return false
			}
		}
	}
	return true
}

func GetUserName(userid int, db *sql.DB) (string, error) {
	username := ""
	err := db.QueryRow(`SELECT username FROM users WHERE user_id = ?;`, userid).Scan(&username)
	if err != nil {
		return "", err
	}
	return username, nil
}

func IfPostReacted(postid string, userid int, db *sql.DB) string {
	var reaction string
	err := db.QueryRow(`SELECT reaction_type FROM Reactions WHERE post_id = ? AND user_id = ? AND comment_id = 'none'`, postid, userid).Scan(&reaction)
	if err != nil {
		return ""
	}
	return reaction
}

func IfCommentReacted(id string, userid int, db *sql.DB) string {
	var reaction string
	err := db.QueryRow(`SELECT reaction_type FROM Reactions WHERE user_id = ? AND comment_id = ?`, userid, id).Scan(&reaction)
	if err != nil {
		return ""
	}
	return reaction
}

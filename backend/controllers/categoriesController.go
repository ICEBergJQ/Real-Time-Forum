package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	forum "forum/models"
)

func GetCategories(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}
	var categories []forum.Category

	rows, err := db.Query("SELECT * FROM categories;")
	if err != nil {
		http.Error(w, "internal server error: "+fmt.Sprintf("%v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var category forum.Category
		err := rows.Scan(&category.Category_id,&category.Category_name)
		if err != nil {
			http.Error(w, fmt.Sprintf("internal server error x: %v", err), http.StatusInternalServerError)
			return
		}

		categories = append(categories, category)
	}

	json.NewEncoder(w).Encode(categories)
}

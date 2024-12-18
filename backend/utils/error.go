package utils

import (
	"database/sql"
	"fmt"
	"net/http"
)

func HandlerWithError(f func(*sql.DB, http.ResponseWriter, *http.Request) error, db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := f(db, w, r); err != nil {
			// http.Error(w, err.Error(), http.StatusBadRequest)
			fmt.Println(err)
		}
	}
}
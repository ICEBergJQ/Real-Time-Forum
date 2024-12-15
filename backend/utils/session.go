package utils

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gofrs/uuid"
)
func SeesionCreation(user_id int, db *sql.DB) (string ,error){

	token, err := uuid.NewV4()
	if err != nil {
		return "error",fmt.Errorf("invalid payload: %w", err)
	}
	query := `INSERT INTO session (session_id, user_id, expired_at) 
          VALUES (?, ?, datetime('now', '+1 hour', '+5 days'))`
    _, err = db.Exec(query, token.String(), user_id)
    if err != nil {
		fmt.Println(err)
        return "error", fmt.Errorf("invalid payload: %w", err)
    }
    return token.String(), nil
}

func TokenCheck(user_id int, r *http.Request, db *sql.DB) bool{
	cookie, err := r.Cookie("session_token")
	if err != nil {
		return false
	}
	var dbToken string
	query := "SELECT session_id FROM session WHERE user_id = ?"
	row := db.QueryRow(query, user_id)
	err = row.Scan(&dbToken)
	if err != nil {
		if err == sql.ErrNoRows{
			return false
		}
		return true
	}
	if cookie.Value == dbToken{
		return true
	}
	return false
}
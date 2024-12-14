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
    VALUES (?, ?, datetime(datetime('now', '+1hour'),'+5day'))`
    _, err = db.Exec(query, token.String(), user_id)
    if err != nil {
        return "error", fmt.Errorf("invalid payload: %w", err)
    }
    return token.String(), nil
}

func TokenCheck(user_id int, r *http.Request, db *sql.DB) bool{
	cookie, err := r.Cookie("session_token")
	if err != nil {
		return false
	}
	var dbCookie string
	query := "SELECT session_id FROM session WHERE us" 
	return false
}
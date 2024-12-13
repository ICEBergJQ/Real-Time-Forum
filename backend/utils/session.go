package utils

import (
	"github.com/gofrs/uuid"
	"fmt"
	"database/sql"
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
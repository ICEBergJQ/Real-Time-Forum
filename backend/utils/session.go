package utils

import (
	"github.com/gofrs/uuid"
	"fmt"
)
func SeesionCreation(user_id int) (uuid.UUID,error){

	token, err := uuid.NewV4()
	if err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}
	query := "INSERT INTO session (session)"
}
package controllers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"forum/models"
	"forum/utils"
	"net/http"
)

// RegisterUser handles user registration
func RegisterUser(db *sql.DB, w http.ResponseWriter, r *http.Request) error {
	if r.Method != http.MethodPost {
		return errors.New("invalid request method")
	}
	var user models.User
	var response models.Response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}
	
	if err := utils.Validation(user); err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}

	if err := utils.Hash(&user.Password); err != nil{
		return fmt.Errorf("invalid payload: %w", err)
	}

	query := "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
	_, err := db.Exec(query, user.Username, user.Email, user.Password)
	if err != nil {
		return err
	}
	response.Message = "user created successfully"
	response_encoding, err:= json.Marshal(response)
	if err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}
	w.WriteHeader(http.StatusCreated)
	w.Write(response_encoding)
	return nil
}

// LoginUser handles user login
// func LoginUser(db *sql.DB, w http.ResponseWriter, r *http.Request) error {
// 	if r.Method != http.MethodPost {
// 		return errors.New("invalid request method")
// 	}

// 	var payload map[string]string
// 	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
// 		return fmt.Errorf("invalid payload: %w", err)
// 	}

	

// 	token := "mock-token-for-" + // Mock token
// 	w.WriteHeader(http.StatusOK)
// 	json.NewEncoder(w).Encode(map[string]string{"token": token})
// 	return nil
// }

package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

// Mock database for users
var users = map[string]string{} // key: username, value: password

// RegisterUser handles user registration
func RegisterUser(w http.ResponseWriter, r *http.Request) error {
	if r.Method != http.MethodPost {
		return errors.New("invalid request method")
	}

	var payload map[string]string
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}

	username := payload["username"]
	password := payload["password"]
	if username == "" || password == "" {
		return errors.New("username and password are required")
	}

	if _, exists := users[username]; exists {
		return errors.New("user already exists")
	}

	users[username] = password
	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "User %s registered successfully", username)
	return nil
}

// LoginUser handles user login
func LoginUser(w http.ResponseWriter, r *http.Request) error {
	if r.Method != http.MethodPost {
		return errors.New("invalid request method")
	}

	var payload map[string]string
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}

	username := payload["username"]
	password := payload["password"]
	if storedPassword, exists := users[username]; !exists || storedPassword != password {
		return errors.New("invalid username or password")
	}

	token := "mock-token-for-" + username // Mock token
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"token": token})
	return nil
}

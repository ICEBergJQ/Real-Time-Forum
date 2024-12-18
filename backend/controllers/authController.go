package controllers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"forum/models"
	"forum/utils"
	"net/http"
	"time"
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
	fmt.Println("r.Method : ", json.NewDecoder(r.Body).Decode(&user))

	if err := utils.Validation(user); err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}

	if err := utils.Hash(&user.Password); err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}

	query := "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
	_, err := db.Exec(query, user.Username, user.Email, user.Password)
	if err != nil {
		return err
	}
	response.Message = "user created successfully"
	response_encoding, err := json.Marshal(response)
	if err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}
	w.WriteHeader(http.StatusCreated)
	w.Write(response_encoding)
	return nil
}

// LoginUser handles user login
func LoginUser(db *sql.DB, w http.ResponseWriter, r *http.Request) error {
	if r.Method != http.MethodPost {
		return errors.New("invalid request method")
	}
	var user models.User
	var userFromDb models.User
	var response models.Response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}
	if err := utils.Validation(user); err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}
	
	query := "SELECT user_id, username, email, password FROM users WHERE username = ?"
	row := db.QueryRow(query, user.Username)
	err := row.Scan(&userFromDb.ID, &userFromDb.Username, &userFromDb.Email, &userFromDb.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			response.Message = "no user found with this username"
			response_encoding, err := json.Marshal(response)
			if err != nil {
				return fmt.Errorf("invalid payload: %w", err)
			}
		  	w.WriteHeader(http.StatusNoContent)
		  	w.Write(response_encoding)
		}
		return fmt.Errorf("invalid payload: %w", err)
	}
	if utils.TokenCheck(userFromDb.ID, r, db){
		response.Message = "user already logged in"
		response_encoding, err := json.Marshal(response)
		if err != nil {
			return fmt.Errorf("invalid payload: %w", err)
		}
		w.WriteHeader(http.StatusNoContent)
		w.Write(response_encoding)
		fmt.Println(userFromDb)
		return fmt.Errorf("user already logged in: %w", err)
	}
	token, err := utils.SeesionCreation(userFromDb.ID, db)
	if err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}
	cookie := &http.Cookie{
		Name: "session_token",
		Value: token,
		Path: "/",
		HttpOnly: true,
		Secure: false,
		Expires: time.Now().Add(120 * time.Hour),
	}
	response.Message = "user logged-in successfully"
	response_encoding, err := json.Marshal(response)
	if err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}
	http.SetCookie(w, cookie)
	w.WriteHeader(http.StatusOK)
	w.Write(response_encoding)
	return nil
}

package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"forum/config"
	"forum/models"
	"forum/utils"
)

// RegisterUser handles user registration
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		// call error func
	}
	var user models.User
	var response models.Response
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		// call error func
	}
	if err := utils.Validation(user); err != nil {
		// call error func
	}

	if err := utils.Hash(&user.Password); err != nil {
		// call error func
	}

	query := "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
	_, err := config.DB.Exec(query, user.Username, user.Email, user.Password)
	if err != nil {
		// call error func
	}
	response.Message = "user created successfully"
	response_encoding, err := json.Marshal(response)
	if err != nil {
		// call error func
	}
	w.WriteHeader(http.StatusCreated)
	w.Write(response_encoding)
}

// LoginUser handles user login
func LoginUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		// call error func
	}
	var user models.User
	var userFromDb models.User
	var response models.Response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		// call error func
	}
	if err := utils.Validation(user); err != nil {
		// call error func
	}

	query := "SELECT user_id, username, email, password FROM users WHERE username = ?"
	row := config.DB.QueryRow(query, user.Username)
	err := row.Scan(&userFromDb.ID, &userFromDb.Username, &userFromDb.Email, &userFromDb.Password)
	if err != nil {
		// call error func
		if err == sql.ErrNoRows {
			response.Message = "no user found with this username"
			response_encoding, err := json.Marshal(response)
			if err != nil {
				// call error func
			}
			w.WriteHeader(http.StatusNoContent)
			w.Write(response_encoding)
		}
		// call error func
	}
	err = utils.TokenCheck(userFromDb.ID, r, config.DB)
	if err != nil {
		if err.Error() == "token mismatch" {
			cookie := &http.Cookie{
				Name:     "session_token",
				Value:    "",
				Path:     "/",
				HttpOnly: true,
				Secure:   false,
				Expires:  time.Now().Add(-time.Hour * 24 * 365),
			}
			http.SetCookie(w, cookie)
			response.Message = "Token Expired. Please login again"
			response_encoding, err := json.Marshal(response)
			if err != nil {
				// call error func
			}
			w.WriteHeader(http.StatusBadRequest)
			w.Write(response_encoding)
			return
		}
		response.Message = "user already logged in"
		response_encoding, err := json.Marshal(response)
		if err != nil {
			// call error func
		}
		w.WriteHeader(http.StatusBadRequest)
		w.Write(response_encoding)
		// call error func
		return
	}
	token, err := utils.SeesionCreation(userFromDb.ID, config.DB)
	if err != nil {
		// call error func
	}
	cookie := &http.Cookie{
		Name:     "session_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(config.EXPIRING_SESSION_DATE),
	}
	response.Message = "user logged-in successfully"
	response_encoding, err := json.Marshal(response)
	if err != nil {
		// call error func
	}
	http.SetCookie(w, cookie)
	w.WriteHeader(http.StatusOK)
	w.Write(response_encoding)
}

// LogoutUser handles user logout

func Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		// call error func
	}
	var response models.Response
	w.Header().Set("Content-Type", "application/json")
	cookie, err := r.Cookie("session_token")
	if err != nil {
		// call error func
	}
	query := "DELETE FROM sessions WHERE session_id = ?"
	_, err = config.DB.Exec(query, cookie.Value)
	if err != nil {
		// call error func
	}
	deleteCookie := &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(-time.Hour * 24 * 365),
	}
	cookie.Expires = time.Now().Add(-time.Hour * 24 * 365)
	http.SetCookie(w, deleteCookie)
	response.Message = "user logged-out successfully"
	response_encoding, err := json.Marshal(response)
	if err != nil {
		// call error func
	}
	w.WriteHeader(http.StatusOK)
	w.Write(response_encoding)
}

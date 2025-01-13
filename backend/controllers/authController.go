package controllers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"forum/config"
	"forum/models"
	"forum/utils"
)

// RegisterUser handles user registration
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := errors.New("method not allowed")
        utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Method not allowed")
	}
	var user models.User
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
	}
	if err := utils.Validation(user); err != nil {
        utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, err.Error())
	}

	if err := utils.Hash(&user.Password); err != nil {
        utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
	}

	query := "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
	_, err := config.DB.Exec(query, user.Username, user.Email, user.Password)
	if err != nil {
        utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
	}
	utils.CreateResponseAndLogger(w, http.StatusCreated, nil, "user created successfully")
}

// LoginUser handles user login
func LoginUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := errors.New("method not allowed")
        utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Method not allowed")
	}
	var user models.User
	var userFromDb models.User

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
	}
	if err := utils.Validation(user); err != nil {
        utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, err.Error())
	}

	query := "SELECT user_id, username, email, password FROM users WHERE username = ?"
	row := config.DB.QueryRow(query, user.Username)
	err := row.Scan(&userFromDb.ID, &userFromDb.Username, &userFromDb.Email, &userFromDb.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "no user found with this username")
		}else{
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
		}
	}
	err = utils.TokenCheck(userFromDb.ID, r, config.DB)
	if err != nil {
		if err.Error() == "token mismatch" {
			deleteCookie := &http.Cookie{
				Name:     "session_token",
				Value:    "",
				Path:     "/",
				HttpOnly: true,
				Secure:   false,
				Expires:  time.Now().Add(-time.Hour * 24 * 365),
			}
			http.SetCookie(w, deleteCookie)
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "Token Expired. Please login again")
		}else{
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "user already logged in")
		}
	}
	token, err := utils.SeesionCreation(userFromDb.ID, config.DB)
	if err != nil {
        utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
	}
	cookie := &http.Cookie{
		Name:     "session_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(config.EXPIRING_SESSION_DATE),
	}
	http.SetCookie(w, cookie)
	utils.CreateResponseAndLogger(w, http.StatusOK, nil, "user logged-in successfully")
}

// LogoutUser handles user logout

func Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := errors.New("method not allowed")
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Method not allowed")

	}
	
	cookie, err := r.Cookie("session_token")
	if err != nil {
        utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "user not logged-in")
	}
	query := "DELETE FROM sessions WHERE session_id = ?"
	_, err = config.DB.Exec(query, cookie.Value)
	if err != nil {
        utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
	}
	deleteCookie := &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(-time.Hour * 24 * 365),
	}
	http.SetCookie(w, deleteCookie)
	utils.CreateResponseAndLogger(w, http.StatusOK, nil, "user logged-out successfully")
}

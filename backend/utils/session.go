package utils

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"forum/config"
	"forum/models"

	"github.com/gofrs/uuid"
)

func SeesionCreation(user_id int, db *sql.DB) (string, error) {
	token, err := uuid.NewV4()
	if err != nil {
		return "empty", err
	}
	query := `INSERT INTO sessions (session_id, user_id, expired_at) 
          VALUES (?, ?, datetime('now', '+1 hour', '+1 day'))`
	_, err = db.Exec(query, token.String(), user_id)
	if err != nil {
		return "empty", err
	}
	return token.String(), nil
}

func TokenCheck(user_id int, r *http.Request, db *sql.DB) error {
	var session models.Session
	var check error
	query := "SELECT session_id, user_id, expired_at FROM sessions WHERE user_id = ?"
	row := db.QueryRow(query, user_id)
	err := row.Scan(&session.SessionID, &session.UserID, &session.ExpiredAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		return err
	}
	cookie, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			query := "DELETE FROM sessions WHERE user_id = ?"
			_, err = config.DB.Exec(query, session.UserID)
			if err != nil {
				return err
			}
			return nil
		} else {
			return err
		}
	}
	if cookie.Value == session.SessionID {
		check = fmt.Errorf("token already exists")
	}
	if cookie.Value != session.SessionID {
		if cookie.Value == "" {
			query := "DELETE FROM sessions WHERE user_id = ?"
			_, err = config.DB.Exec(query, session.UserID)
			if err != nil {
				return err
			}
			return nil
		}
		check = fmt.Errorf("token mismatch")
	}
	return check
}

func UserIDFromToken(r *http.Request, db *sql.DB) (int, error) {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		return 0, err
	}
	var session models.Session
	query := "SELECT session_id, user_id, expired_at FROM sessions WHERE session_id = ?"
	row := db.QueryRow(query, cookie.Value)
	err = row.Scan(&session.SessionID, &session.UserID, &session.ExpiredAt)
	if err != nil {
		return 0, err
	}
	if err := IsExpired(session.ExpiredAt); err != nil {
		if err.Error() == "token expired" {
			query := "DELETE FROM sessions WHERE session_id = ?"
			_, err = config.DB.Exec(query, session.SessionID)
			if err != nil {
				return 0, err
			}
			return 0, fmt.Errorf("token expired")
		} else {
			return 0, err
		}
	}
	return session.UserID, nil
}

func DeleteCookie(w http.ResponseWriter, r *http.Request) bool {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		return true
	}
	query := "DELETE FROM sessions WHERE session_id = ?"
	_, err = config.DB.Exec(query, cookie.Value)
	if err != nil {
		return true
	}
	deleteCookie := &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(config.DELETE_COOKIE_DATE),
	}
	http.SetCookie(w, deleteCookie)
	return true
}

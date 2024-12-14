package routes

import (
	"database/sql"
	"forum/controllers"
	"forum/utils"
	"net/http"
)

// RegisterAuthRoutes sets up authentication-related routes
func AuthRoutes(db *sql.DB) {
	http.HandleFunc("/auth/register", utils.HandlerWithError(controllers.RegisterUser, db))
	http.HandleFunc("/auth/login", utils.HandlerWithError(controllers.LoginUser, db))
}

package routes

import (
	"database/sql"
	"net/http"

	"forum/controllers"
	"forum/utils"
)

// RegisterAuthRoutes sets up authentication-related routes
func AuthRoutes(db *sql.DB) {
	http.HandleFunc("/auth/register", utils.HandlerWithError(controllers.RegisterUser, db))
	http.HandleFunc("/auth/login", utils.HandlerWithError(controllers.LoginUser, db))
}

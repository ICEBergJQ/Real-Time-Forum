package routes

import (
	"database/sql"
	"net/http"

	"forum/controllers"
)

// RegisterAuthRoutes sets up authentication-related routes
func AuthRoutes(db *sql.DB) {
	http.HandleFunc("/auth/register", controllers.RegisterUser)
	http.HandleFunc("/auth/login", controllers.LoginUser)
	http.HandleFunc("/auth/logout", controllers.Logout)
}

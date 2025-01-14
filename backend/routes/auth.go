package routes

import (
	"net/http"

	"forum/controllers"
)

// RegisterAuthRoutes sets up authentication-related routes
func AuthRoutes() {
	http.HandleFunc("/auth/register", controllers.RegisterUser)
	http.HandleFunc("/auth/login", controllers.LoginUser)
	http.HandleFunc("/auth/logout", controllers.Logout)
}

package routes

import (
	"net/http"
	"forum/controllers"
	"forum/utils"
)


// RegisterAuthRoutes sets up authentication-related routes
func AuthRoutes() {
	http.HandleFunc("/auth/register", utils.handlerWithError(controllers.RegisterUser))
	http.HandleFunc("/auth/login", utils.handlerWithError(controllers.LoginUser))
}

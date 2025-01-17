package routes

import (
	"net/http"

	"forum/controllers"
)

func HomeRoute() {
	http.HandleFunc("/static/", controllers.ServeFile)
	http.HandleFunc("/", controllers.Index)
}

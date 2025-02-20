package routes

import (
	"net/http"

	"forum/controllers"
)

func HomeRoute() {
	controllers.ServeFiles()
	http.HandleFunc("/", controllers.Index)
}

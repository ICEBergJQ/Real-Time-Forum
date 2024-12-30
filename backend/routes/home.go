package routes

import (
	"forum/controllers"
	"net/http"
)

func HomeRoute(){
	http.HandleFunc("/", controllers.Index)
}
package main

import (
	"fmt"
	"net/http"
	"forum/routes"
)

func main() {
	// authentication routes
	routes.AuthRoutes()

	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", nil)
}

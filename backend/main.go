package main

import (
	"fmt"
	"net/http"
	"os"
	"forum/config"
	"forum/routes"
)

func main() {
	config.DB = config.InitDB("../database/forum.db")
	config.CreateDatabaseTables(config.DB, "../database/schema.sql")
	defer config.DB.Close()
	address := "localhost:8080"
	config.ServeFiles()
	// home routes
	routes.HomeRoute()
	// authentication routes
	routes.AuthRoutes(config.DB)
	// post routes
	routes.PostRoute(config.DB)
	// comment routes
	routes.CommentsRoute(config.DB)
	fmt.Printf("Server is running on http://%s \n", address)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		os.Exit(1)
	}
}

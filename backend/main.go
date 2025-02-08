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
	routes.HomeRoute()
	routes.AuthRoutes()
	routes.PostRoute(config.DB)
	routes.ReactionsRoute(config.DB)
	routes.CommentsRoute(config.DB)
	routes.CategoriesRoute(config.DB)
	routes.FilterRoute(config.DB)
	routes.WebsocketRoutes(config.DB)

	fmt.Printf("Server is running on http://%s \n", address)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Server error:", err)
		os.Exit(1)
	}
}
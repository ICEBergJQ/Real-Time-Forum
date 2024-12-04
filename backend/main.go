package main

import (
	"fmt"
	"net/http"
	"os"

	"forum/routes"
	database "forum/config"
)

func main() {
	db := database.InitDB("../database/data/forum.db")
	database.CreateDatabaseTables(db, "../database/schema.sql")
	defer db.Close()
	address := "localhost:8080"
	// authentication routes
	routes.AuthRoutes()
	routes.PostRout(db)
	fmt.Printf("Server is running on http://%s \n", address)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		os.Exit(1)
	}
}

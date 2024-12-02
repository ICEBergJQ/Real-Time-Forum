package main

import (
	"fmt"
	"net/http"
	"os"

	routes "forum/routes"
	database "forum/config"
)

func main() {
	db := database.InitDB("../database/forum.db")
	defer db.Close()
	routes.PostRout(db)
	fmt.Println("Server is running on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		os.Exit(1)
	}
}

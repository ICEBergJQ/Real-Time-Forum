package main

import (
	"fmt"
	"net/http"
	"os"

	handlers "Forum/routes"
	database "Forum/config"
)

func main() {
	db := database.InitDB("../database/forum.db")
	defer db.Close()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.CreatePost(db,w, r)
		} else if r.Method == http.MethodGet {
			handlers.GetPosts(db, w, r)
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})

	fmt.Println("Server is running on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		os.Exit(1)
	}
}

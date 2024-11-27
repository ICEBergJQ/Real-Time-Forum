package main

import (
	"fmt"
	"net/http"
	"os"

	forum "Forum/routes"
)

func main() {
	http.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
        if r.Method == http.MethodPost {
            forum.CreatePost(w, r)
        } else if r.Method == http.MethodGet {
            forum.GetPosts(w, r)
        } else {
            http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
        }
    })

	fmt.Println("Server is running on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		os.Exit(1)
	}
}

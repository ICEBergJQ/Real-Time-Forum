package main

import (
	"fmt"
	"net/http"
	"os"

	forum "Forum/routes"
)

func main() {
	http.HandleFunc("/posts", forum.CreatePost)

	fmt.Println("Server is running on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		os.Exit(1)
	}
}

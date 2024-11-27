package Forum

import (
	"encoding/json"
	"net/http"
	"sync"
)

type Post struct {
	Author     string	`json:"author"`
	ID         int      `json:"id"`
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Categories []string `json:"categories"`
}

var (
	posts         []Post
	postIDCounter = 1
	mu            sync.Mutex // To handle concurrent writes
)

func CreatePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	var newPost Post
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	mu.Lock()
	newPost.ID = postIDCounter
	postIDCounter++
	posts = append(posts, newPost)
	mu.Unlock()

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newPost)
}

func GetPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	category := r.URL.Query().Get("category")
	var filteredPosts []Post

	mu.Lock()
	defer mu.Unlock()

	if category != "" {
		for _, post := range posts {
			for _, cat := range post.Categories {
				if cat == category {
					filteredPosts = append(filteredPosts, post)
					break
				}
			}
		}
	} else {
		filteredPosts = posts
	}

	json.NewEncoder(w).Encode(filteredPosts)
}

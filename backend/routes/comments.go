package Forum

import (
	"database/sql"
	"net/http"
	controllers "Forum/controllers"
)

func CommentsRoute(db *sql.DB) {
	http.HandleFunc("/post", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			go controllers.CreateComment(db, w, r)
		} else if r.Method == http.MethodGet {
			controllers.GetComment(db, w, r)
		} else {
			go http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

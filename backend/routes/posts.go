package routes
import (
	"database/sql"
	"net/http"

	controllers "Forum/controllers"
)

func PostRout(db *sql.DB) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			controllers.CreatePost(db, w, r)
		} else if r.Method == http.MethodGet {
			controllers.GetPosts(db, w, r)
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}

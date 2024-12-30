package config

import "net/http"

func ServeFiles(){
	fs := http.FileServer(http.Dir("../frontend"))
	http.Handle("/static/", http.StripPrefix("/static", fs))
}
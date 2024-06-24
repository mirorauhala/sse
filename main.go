package main

import (
	"encoding/json"
	"net/http"
	"time"
)

type Message struct {
	username  string
	body      string
	createdAt time.Time
}

func main() {

	var messages []Message

	server := http.NewServeMux()
	server.HandleFunc("/api/messages", func(w http.ResponseWriter, r *http.Request) {
		messages = append(messages, Message{
			username:  "Miro",
			body:      "New message",
			createdAt: time.Now(),
		})
		json, err := json.Marshal(messages)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal Server Error"))
		}

		w.Write(json)
	})

	server.HandleFunc("/api/messages", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("POST endpoint"))
	})

	server.HandleFunc("/api/subscribe", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("SSE endpoint"))
	})

	http.ListenAndServe(":3030", server)
}

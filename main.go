package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type Message struct {
	Id        int
	Username  string
	Body      string
	CreatedAt time.Time
}

var messages []Message
var subscribers = make(map[chan Message]bool)

func notifySubscribers(newMessage Message) {
	for subscriber := range subscribers {
		subscriber <- newMessage
	}
}

func main() {
	server := http.NewServeMux()
	server.HandleFunc("/api/messages", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Log", time.Now())
		if r.Method == http.MethodGet {
			json, err := json.Marshal(messages)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(json)
		} else if r.Method == http.MethodPost {
			body, err := io.ReadAll(r.Body)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			defer r.Body.Close()

			type Request = struct {
				Username string
				Body     string
			}

			var message Request

			err = json.Unmarshal(body, &message)

			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			if len(message.Username) < 3 {
				http.Error(w, "Username too short.", http.StatusBadRequest)
				return
			}

			if len(message.Body) == 0 {
				http.Error(w, "Body too short.", http.StatusBadRequest)
				return
			}

			var maxId int

			for _, message := range messages {
				if message.Id > maxId {
					maxId = message.Id
				}
			}

			newMessage := Message{
				Id:        maxId + 1,
				Body:      message.Body,
				Username:  message.Username,
				CreatedAt: time.Now(),
			}

			messages = append(messages, newMessage)
			notifySubscribers(newMessage)

			w.WriteHeader(http.StatusCreated)
			w.Write([]byte("Successfully received JSON data"))

		} else {
			w.Header().Add("Allow", "GET, POST")
			http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		}
	})

	server.HandleFunc("/api/subscribe", func(w http.ResponseWriter, r *http.Request) {
		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
			return
		}

		subscriber := make(chan Message)
		subscribers[subscriber] = true

		defer func() {
			delete(subscribers, subscriber)
		}()

		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		for newMessage := range subscriber {
			data, _ := json.Marshal(newMessage)
			fmt.Fprintf(w, "data: %s\n\n", data)
			flusher.Flush()
		}

	})

	http.ListenAndServe("127.0.0.1:3030", server)
}

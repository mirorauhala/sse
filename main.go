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

func main() {

	messages := []Message{
		{
			Id:        1,
			CreatedAt: time.Now().Add(time.Minute * 1),
			Body:      "Hello! How are you?",
			Username:  "Alice",
		},
		{
			Id:        2,
			CreatedAt: time.Now().Add(time.Minute * 2),
			Body:      "I'm doing well, thank you. How about you?",
			Username:  "Bob",
		},
		{
			Id:        3,
			CreatedAt: time.Now().Add(time.Minute * 3),
			Body:      "I'm good too. Just working on some projects.",
			Username:  "Alice",
		},
		{
			Id:        4,
			CreatedAt: time.Now().Add(time.Minute * 4),
			Body:      "Sounds interesting. What kind of projects?",
			Username:  "Bob",
		},
		{
			Id:        5,
			CreatedAt: time.Now().Add(time.Minute * 5),
			Body:      "I'm working on a new website design.",
			Username:  "Alice",
		},
		{
			Id:        6,
			CreatedAt: time.Now().Add(time.Minute * 6),
			Body:      "That's cool. Do you need any help with it?",
			Username:  "Bob",
		},
		{
			Id:        7,
			CreatedAt: time.Now().Add(time.Minute * 7),
			Body:      "Not at the moment, but I'll let you know if I do.",
			Username:  "Alice",
		},
		{
			Id:        8,
			CreatedAt: time.Now().Add(time.Minute * 8),
			Body:      "Sure, just give me a shout when you need assistance.",
			Username:  "Bob",
		},
		{
			Id:        9,
			CreatedAt: time.Now().Add(time.Minute * 9),
			Body:      "Thanks, Bob. I appreciate it.",
			Username:  "Alice",
		},
		{
			Id:        10,
			CreatedAt: time.Now().Add(time.Minute * 10),
			Body:      "No problem, that's what friends are for.",
			Username:  "Bob",
		},
		{
			Id:        11,
			CreatedAt: time.Now().Add(time.Minute * 11),
			Body:      "Hey, have you seen the latest movie release?",
			Username:  "Alice",
		},
		{
			Id:        12,
			CreatedAt: time.Now().Add(time.Minute * 12),
			Body:      "Not yet. Is it any good?",
			Username:  "Bob",
		},
		{
			Id:        13,
			CreatedAt: time.Now().Add(time.Minute * 13),
			Body:      "I heard it's amazing. We should go watch it together sometime.",
			Username:  "Alice",
		},
		{
			Id:        14,
			CreatedAt: time.Now().Add(time.Minute * 14),
			Body:      "That sounds like a plan. Let me know when you're free.",
			Username:  "Bob",
		},
	}

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

			type Request 

			err = json.Unmarshal(body, &message)

			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			var maxId int

			for _, message := range messages {
				if message.Id > maxId {
					maxId = message.Id
				}
			}

			messages = append(messages, Message{
				Id:        maxId + 1,
				Body:      message.message,
				Username:  "Miro",
				CreatedAt: time.Now(),
			})

			// Respond with a success message
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Successfully received JSON data"))

		} else {
			w.Header().Add("Allow", "GET, POST")
			http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		}
	})

	server.HandleFunc("/api/subscribe", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("SSE endpoint"))
	})

	http.ListenAndServe("127.0.0.1:3030", server)
}

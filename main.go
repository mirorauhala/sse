package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	subs := make(map[int]*chan Message)
	channelIdAcc := 1
	var idAccMutex sync.Mutex

	SetupDb()
	defer CloseDb()

	server := http.NewServeMux()
	server.HandleFunc("/api/messages", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			messages, err := GetMessages()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

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

			var message Message
			err = json.Unmarshal(body, &message)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			err = SaveMessage(&message)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Respond with a success message
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Successfully received JSON data"))

			for _, sub := range subs {
				(*sub) <- message
			}

		} else {
			w.Header().Add("Allow", "GET, POST")
			http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		}
	})

	server.HandleFunc("/api/subscribe", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		fmt.Println("Adding a sub to subs list")
		mychan := make(chan Message)
		idAccMutex.Lock()
		channelIdAcc++
		thisChannelsId := channelIdAcc
		subs[thisChannelsId] = &mychan
		idAccMutex.Unlock()

		ctx := r.Context()

		for {
			select {
			case msg := <-mychan:
				json, err := json.Marshal(msg)
				if err != nil {
					fmt.Println("Error marshaling json")
					return
				}
				fmt.Fprintf(w, "event: message\ndata: %s\n\n", json)
				w.(http.Flusher).Flush()
			case <-ctx.Done():
				delete(subs, thisChannelsId)
				return
			}
		}
	})

	http.ListenAndServe("127.0.0.1:3030", server)
}

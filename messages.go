package main

import (
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type Message struct {
	Id        int64
	Username  string
	Body      string
	CreatedAt time.Time
}

func GetMessages() ([]Message, error) {
	var messages []Message

	rows, err := db.Query("SELECT id, username, body, created_at FROM messages")
	if err != nil {
		return nil, fmt.Errorf("GetMessages: %v", err)
	}
	defer rows.Close()

	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var msg Message
		if err := rows.Scan(&msg.Id, &msg.Username, &msg.Body, &msg.CreatedAt); err != nil {
			return nil, fmt.Errorf("GetMessages: %v", err)
		}
		messages = append(messages, msg)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetMessages: %v", err)
	}
	return messages, nil

}

func SaveMessage(msg *Message) error {

	id := time.Now().UnixNano()

	msg.Id = id
	msg.CreatedAt = time.Now()

	_, err := db.Exec("INSERT INTO messages (id, username, body, created_at) VALUES (?, ?, ?, ?)", msg.Id, msg.Username, msg.Body, msg.CreatedAt.Format(time.RFC3339))
	if err != nil {
		return fmt.Errorf("SaveMessage exec: %v", err)
	}

	return nil

}

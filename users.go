package main

import (
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type User struct {
	Id        int
	Name      string
	CreatedAt time.Time
}

func GetUsers() ([]User, error) {
	var users []User

	rows, err := db.Query("SELECT * FROM users ")
	if err != nil {
		return nil, fmt.Errorf("GetUsers: %v", err)
	}
	defer rows.Close()

	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var usr User
		if err := rows.Scan(&usr.Id, &usr.Name, &usr.CreatedAt); err != nil {
			return nil, fmt.Errorf("GetUsers: %v", err)
		}
		users = append(users, usr)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetUsers: %v", err)
	}
	return users, nil

}

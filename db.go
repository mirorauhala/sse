package main

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func SetupDb() {
	conn, err := sql.Open("sqlite3", "db.sqlite3")
	if err != nil {
		panic("No database")
	}

	db = conn
}

func CloseDb() {
	db.Close()
}

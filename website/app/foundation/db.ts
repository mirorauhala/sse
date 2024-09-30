"use server";
import sqlite from "better-sqlite3";
const db = sqlite("./db.sqlite3", {
  fileMustExist: true,
});

db.pragma("journal_mode = WAL");

export { db };

import Database from "better-sqlite3"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
)

const DB_PATH =
  process.env.DB_PATH ||
  path.join(__dirname, "../../data/notes.db")

export const db = new Database(DB_PATH)

export function connectDB() {
  // Enable WAL mode for better performance
  db.pragma("journal_mode = WAL")
  db.pragma("foreign_keys = ON")

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      title     TEXT    NOT NULL,
      slug      TEXT    NOT NULL UNIQUE,
      content   TEXT    NOT NULL,
      category  TEXT    NOT NULL CHECK(category IN ('essay', 'poem', 'story')),
      tags      TEXT    NOT NULL DEFAULT '[]',
      isPublished INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS comments (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      postId    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      name      TEXT    NOT NULL,
      content   TEXT    NOT NULL,
      createdAt TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `)

  console.log("SQLite connected")
}

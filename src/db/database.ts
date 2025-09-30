import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

sqlite3.verbose();

let db: sqlite3.Database | null = null;

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'app.sqlite');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDB(): sqlite3.Database {
  if (db) return db;

  ensureDataDir();
  db = new sqlite3.Database(DB_PATH);

  db.serialize(() => {
    db!.run(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_message TEXT NOT NULL,
        bot_message TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );`
    );
  });

  return db;
}

export type MessageRow = {
  id: number;
  user_message: string;
  bot_message: string;
  created_at: string;
};

import Database from "better-sqlite3";
import path from "path";

// CRITICAL: Ensure this points to the correct database file
const dbPath = path.join(process.cwd(), "api", "db", "student_records.db");

const db = new Database(dbPath, {
  readonly: true,
  fileMustExist: true
});

export default db;

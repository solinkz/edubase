import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "api", "db", "students.db");

const db = new Database(dbPath, {
  readonly: true,
  fileMustExist: true
});

export default db;

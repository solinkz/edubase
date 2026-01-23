import db from "./db/connect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Example test query (temporary)
  const rows = db
    .prepare("SELECT name, country, qpa FROM students LIMIT 5")
    .all();

  res.status(200).json({
    rows
  });
}

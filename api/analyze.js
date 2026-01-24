import db from "./db/connect.js";
import { generateIntent } from "./lib/gemini.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { NLInput } = req.body;

  if (!NLInput) {
    return res.status(400).json({ error: "NLInput is required" });
  }

  try {
    // 1. Generate Intent from AI
    const intent = await generateIntent(NLInput);

    // 2. Process Intent (Temporary placeholder for SQL translation)
    // For now, we'll return the intent and a sample result or attempt a simple translation
    console.log("Generated Intent:", JSON.stringify(intent, null, 2));

    // Note: In the next step, we will implement a robust intent-to-SQL translator.
    // For this demonstration, we'll just return the intent to show the AI is working.
    
    // Example: Just to give back some data if simple
    let rows = [];
    if (intent.table === "students") {
      rows = db.prepare("SELECT * FROM students LIMIT 5").all();
    }

    res.status(200).json({
      success: true,
      intent,
      rows
    });

  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message });
  }
}

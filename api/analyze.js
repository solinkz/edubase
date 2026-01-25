import db from "./db/connect.js";
import { generateIntent } from "./lib/gemini.js";
import { buildQuery } from "./lib/sqlBuilder.js";

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
    console.log("Generated Intent:", JSON.stringify(intent, null, 2));

    // 2. Validate and translate intent to SQL
    const queryResult = buildQuery(intent);
    
    if (!queryResult.success) {
      return res.status(400).json({
        success: false,
        error: queryResult.error,
        intent
      });
    }

    const { sql, params } = queryResult;
    console.log("Generated SQL:", sql);
    console.log("Parameters:", params);

    // 3. Execute the query safely with parameters
    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);

    res.status(200).json({
      success: true,
      intent,
      sql,
      params,
      data: rows,
      metadata: {
        rowCount: rows.length
      }
    });

  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

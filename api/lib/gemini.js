import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaContract = JSON.parse(fs.readFileSync(path.join(__dirname, "../schemas/schema_contract.json"), "utf8"));
const intentSchema = JSON.parse(fs.readFileSync(path.join(__dirname, "../schemas/intent_schema.json"), "utf8"));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  }
});

const SYSTEM_PROMPT = `
You are a Senior Data Engineer specializing in translating natural language questions into structured data query intents.

### CONTEXT
We are working with a SQLite database. You must generate a JSON intent object that will later be translated into safe, parameterized SQL.

### DATABASE SCHEMA
Available tables and columns:
${JSON.stringify(schemaContract.tables, null, 2)}

### TARGET SCHEMA (INTENT SCHEMA)
Your output MUST conform strictly to this JSON schema:
${JSON.stringify(intentSchema, null, 2)}

### RULES
1. ONLY output valid JSON. No explanations, no markdown blocks, no SQL.
2. Use ONLY the tables and columns defined in the DATABASE SCHEMA.
3. If the user asks for something not possible with the schema, return a valid intent object but potentially with an empty/minimal field set or reflect the limitation in the logic.
4. Always prioritize safety and precision.
5. All queries are READ-ONLY (SELECT). NEVER attempt to generate write operations.
6. For "count", use the aggregation function "COUNT" with column "*" and provide an alias.
7. For averages or sums, use the "aggregations" field with appropriate aliases.
8. Only include a "limit" if the user explicitly asks for a specific number (e.g., "top 10", "first 5"). Otherwise, omit the "limit" field to return all matching results.
9. If the user asks for aggregations only (e.g., "How many students?"), you can omit the "fields" array entirely.

### EXAMPLE 1 - Filtering with fields
User: "Show me students from Canada with QPA above 3.5"
Intent:
{
  "table": "students",
  "fields": [{"column": "name"}, {"column": "qpa"}, {"column": "country"}],
  "filters": [
    {"column": "country", "operator": "=", "value": "Canada"},
    {"column": "qpa", "operator": ">", "value": 3.5}
  ]
}

### EXAMPLE 2 - Aggregation only
User: "How many students are there?"
Intent:
{
  "table": "students",
  "aggregations": [
    {"function": "COUNT", "column": "*", "alias": "total_students"}
  ]
}
`;

/**
 * Generates an intent JSON from a natural language query.
 * @param {string} nlQuery - The user's natural language query.
 * @returns {Promise<Object>} The generated intent object.
 */
export async function generateIntent(nlQuery) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will generate JSON intents following the strict schema provided." }],
        },
      ],
    });

    const result = await chat.sendMessage(nlQuery);
    const responseText = result.response.text();
    
    // Parse the JSON response
    const intent = JSON.parse(responseText);
    
    return intent;
  } catch (error) {
    console.error("Gemini Intent Generation Error:", error);
    throw new Error("Failed to generate intent from AI.");
  }
}

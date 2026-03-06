const Groq = require("groq-sdk");

const { logAICall } = require("./logger");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is required to initialize the AI service.");
}

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

/**
 * Sends a system prompt and a user prompt to Groq and forces the model to
 * return a JSON object that our backend can parse deterministically.
 *
 * Why forced JSON output matters in this project:
 * - The frontend and controllers need structured fields like category names,
 *   tags, filters, and proposal sections. Free-form prose is unreliable for
 *   that because the model might add explanations, markdown, or inconsistent
 *   keys.
 * - `response_format: { type: "json_object" }` pushes the model toward a strict
 *   machine-readable shape instead of chatty natural language output.
 * - This is critical in production systems because downstream code depends on
 *   predictable structure. If the model always returns JSON, the application can
 *   parse it, validate it, save it, and display it with much less brittle
 *   string-cleaning logic.
 * - In interview language: structured generation reduces integration risk. We
 *   are treating the LLM as a data-producing service, not just a text chatbot.
 *
 * Logging is done before returning so we retain the original model output for
 * debugging, audits, and prompt tuning.
 *
 * @param {string} systemPrompt - High-level instruction describing model behavior.
 * @param {string} userPrompt - Task-specific user content.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON response from Groq.
 */
async function generateJSON(systemPrompt, userPrompt) {
  if (!systemPrompt || !userPrompt) {
    throw new Error("generateJSON requires both systemPrompt and userPrompt.");
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const rawResponse = completion.choices?.[0]?.message?.content || "{}";

  await logAICall(
    "generateJSON",
    JSON.stringify({
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      systemPrompt,
      userPrompt,
    }),
    rawResponse,
  );

  return JSON.parse(rawResponse);
}

module.exports = {
  generateJSON,
};

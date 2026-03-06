const prisma = require("../config/db");

/**
 * Persists one AI interaction into the `AILog` collection.
 *
 * Why logging matters in production AI systems:
 * - AI outputs are probabilistic, which means the same category of prompt can
 *   produce different responses over time as prompts, models, or context change.
 * - When a user reports "the AI returned wrong JSON" or "the summary looked
 *   unsafe", logs let engineers reconstruct exactly what prompt payload was sent
 *   and exactly what raw response came back.
 * - Logging also supports audits, quality reviews, prompt tuning, cost tracking,
 *   and incident investigation. In other words, logs are the observability layer
 *   for AI systems, similar to how request logs and database logs help debug
 *   traditional backend services.
 * - This project stores AI interactions in MongoDB through Prisma so the team
 *   has a durable record of model behavior rather than relying only on console
 *   output that disappears after a process restart.
 *
 * @param {string} moduleName - Logical subsystem name such as `generateJSON`.
 * @param {string} promptPayload - Serialized prompt/body sent to the AI model.
 * @param {string} rawResponse - Raw text returned by the model before parsing.
 * @returns {Promise<import("@prisma/client").Prisma.PromiseReturnType<typeof prisma.aILog.create>>}
 */
async function logAICall(moduleName, promptPayload, rawResponse) {
  return prisma.aILog.create({
    data: {
      moduleName,
      promptPayload,
      rawResponse,
    },
  });
}

module.exports = {
  logAICall,
};

const prisma = require("../config/db");
const { generateJSON } = require("../services/ai");
const { generateEmbedding, cosineSimilarity } = require("../services/ml");

/**
 * Generates a B2B proposal using vector retrieval plus LLM reasoning.
 *
 * Semantic Vector Search explanation for interviews:
 * - First we convert the client's need statement into an embedding. That means
 *   the plain-English requirement is transformed into a numeric vector that
 *   captures semantic meaning.
 * - Then we fetch all products from MongoDB and compare the client's vector to
 *   each product embedding using cosine similarity.
 * - Cosine similarity tells us how closely two vectors point in the same
 *   direction. In practical terms, higher similarity means the product meaning
 *   is more aligned with the client's need, even if the exact words differ.
 * - After calculating similarity scores, we sort descending and keep the top 5.
 * - Those top 5 are the retrieval step in RAG: instead of sending the entire
 *   product database to the LLM, we send only the most relevant candidates.
 * - That makes generation cheaper, more focused, and more grounded in the
 *   actual catalog instead of relying on model guesswork.
 *
 * @param {import("express").Request} req - Express request with clientName, clientNeeds, and budget.
 * @param {import("express").Response} res - Express response returning the generated proposal.
 * @returns {Promise<void>}
 */
async function generateProposal(req, res) {
  try {
    const { clientName, clientNeeds, budget } = req.body;

    if (!clientName || !clientNeeds || budget === undefined || budget === null) {
      return res.status(400).json({
        success: false,
        message: "clientName, clientNeeds, and budget are required.",
      });
    }

    const normalizedBudget = Number(budget);

    if (Number.isNaN(normalizedBudget) || normalizedBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: "budget must be a valid positive number.",
      });
    }

    const clientEmbedding = await generateEmbedding(clientNeeds);
    const products = await prisma.product.findMany();

    const matchedProducts = products
      .filter((product) => Array.isArray(product.embedding) && product.embedding.length > 0)
      .map((product) => ({
        ...product,
        similarityScore: cosineSimilarity(clientEmbedding, product.embedding),
      }))
      .sort((left, right) => right.similarityScore - left.similarityScore)
      .slice(0, 5);

    if (matchedProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products with embeddings are available for semantic search yet.",
      });
    }

    const productContext = matchedProducts.map((product) => ({
      name: product.name,
      cost: product.cost,
      price: product.price,
      similarityScore: Number(product.similarityScore.toFixed(4)),
    }));

    const systemPrompt = `You are a B2B eco-commerce sales expert.
Return ONLY valid JSON with these keys:
- productsMix: array of objects with productName, suggestedQuantity, unitCost, totalLineCost
- totalEstimatedCost: number
- impactPositioningSummary: warm persuasive paragraph

Rules:
- All monetary values, budgets, and costs are in Indian Rupees (INR). Ensure your calculations and JSON output reflect INR values.
- Use only the provided retrieved products.
- totalEstimatedCost must be less than or equal to the client budget.
- Keep suggestedQuantity realistic for a B2B proposal.
- Do not return markdown or extra keys.`;

    const userPrompt = `Client name: ${clientName}
Client needs: ${clientNeeds}
Maximum budget: ${normalizedBudget}
Retrieved products: ${JSON.stringify(productContext, null, 2)}`;

    const proposal = await generateJSON(systemPrompt, userPrompt);

    return res.json({
      success: true,
      proposal,
      matchedProducts,
    });
  } catch (error) {
    console.error("Proposal generation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate proposal.",
    });
  }
}

/**
 * Saves a finalized proposal into the MongoDB `Proposal` collection.
 *
 * The frontend sends the reviewed proposal JSON after generation. This method
 * maps the LLM response shape into the Prisma schema shape used by the project.
 *
 * @param {import("express").Request} req - Express request carrying the final proposal payload.
 * @param {import("express").Response} res - Express response confirming persistence.
 * @returns {Promise<void>}
 */
async function saveProposal(req, res) {
  try {
    const { clientName, budget, proposal } = req.body;

    if (!clientName || budget === undefined || !proposal) {
      return res.status(400).json({
        success: false,
        message: "clientName, budget, and proposal are required to save.",
      });
    }

    const createdProposal = await prisma.proposal.create({
      data: {
        clientName,
        budget: Number(budget),
        productsMix: proposal.productsMix || [],
        totalCost: Number(proposal.totalEstimatedCost) || 0,
        impactSummary: proposal.impactPositioningSummary || "",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Proposal saved successfully.",
      proposal: createdProposal,
    });
  } catch (error) {
    console.error("Saving proposal failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save proposal.",
    });
  }
}

module.exports = {
  generateProposal,
  saveProposal,
};

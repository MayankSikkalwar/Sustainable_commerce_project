const prisma = require("../config/db");
const { generateJSON } = require("../services/ai");
const { generateEmbedding } = require("../services/ml");

const ALLOWED_PRIMARY_CATEGORIES = ["Utensils", "Drinkware", "Cookware", "Storage"];

/**
 * Generates AI enrichment data for a product draft.
 *
 * End-to-end data flow:
 * 1. The React form sends `name` and `description` to this controller.
 * 2. The controller builds a constrained system prompt for Groq so the LLM
 *    returns only the categories, tags, and sustainability filters needed by
 *    the product onboarding workflow.
 * 3. The same controller asks the ML service to generate a vector embedding
 *    from the description text using Hugging Face.
 * 4. Both the structured AI metadata and the embedding are returned to the
 *    frontend so the admin can review the suggestion before saving.
 *
 * This is a good Clean Architecture example for interviews because the
 * controller orchestrates the request/response lifecycle while delegating AI
 * generation and ML computation to dedicated services.
 *
 * @param {import("express").Request} req - Express request carrying product input.
 * @param {import("express").Response} res - Express response used to return AI output.
 * @returns {Promise<void>}
 */
async function enrichProductData(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Both name and description are required for enrichment.",
      });
    }

    const systemPrompt = `You are an eco-commerce catalog expert for a sustainable SaaS admin portal.
Return ONLY a valid JSON object with these keys:
- primaryCategory: strictly one of ${ALLOWED_PRIMARY_CATEGORIES.map((item) => `"${item}"`).join(", ")}
- subCategory: a short descriptive string
- seoTags: an array of exactly 5 short SEO-friendly strings
- sustainabilityFilters: an array of eco-friendly filter strings

Rules:
- Do not return markdown.
- Do not include extra keys.
- Keep tags concise and commercially useful.
- Choose the closest category from the allowed list even if the product is not a perfect match.`;

    const userPrompt = `Product name: ${name}
Product description: ${description}`;

    const [jsonResult, embedding] = await Promise.all([
      generateJSON(systemPrompt, userPrompt),
      generateEmbedding(description),
    ]);

    if (!ALLOWED_PRIMARY_CATEGORIES.includes(jsonResult.primaryCategory)) {
      jsonResult.primaryCategory = "Storage";
    }

    return res.json({
      success: true,
      aiData: jsonResult,
      mlEmbedding: embedding,
    });
  } catch (error) {
    console.error("Product enrichment failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to enrich product data.",
    });
  }
}

/**
 * Persists the reviewed and enriched product into MongoDB through Prisma.
 *
 * Data flow explanation:
 * 1. The frontend first calls `/enrich` to get AI-generated categories, tags,
 *    sustainability filters, and the ML embedding.
 * 2. After the admin reviews that data, the frontend sends the complete payload
 *    to this controller.
 * 3. The controller translates the payload into the Prisma `product.create()`
 *    call, which writes the document to the MongoDB `Product` collection.
 *
 * This two-step pattern is useful in admin portals because AI suggestions are
 * generated first, reviewed second, and persisted only after user approval.
 *
 * @param {import("express").Request} req - Express request containing full product data.
 * @param {import("express").Response} res - Express response used to confirm persistence.
 * @returns {Promise<void>}
 */
async function saveProduct(req, res) {
  try {
    const {
      name,
      description,
      primaryCategory,
      subCategory,
      seoTags,
      sustainabilityFilters,
      embedding,
      price = 0,
      cost = 0,
    } = req.body;

    const parsedPrice = Number.parseFloat(price);
    const parsedCost = Number.parseFloat(cost);

    if (!name || !description || !primaryCategory || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "Missing required product fields for saving.",
      });
    }

    /**
     * Price and cost must be stored as real numeric values instead of silently
     * falling back to zero.
     *
     * Why this matters for AI integrity:
     * - Module 2 asks the LLM to satisfy a budget constraint using catalog cost
     *   data retrieved from the database.
     * - If cost and price are missing or coerced to zero unintentionally, the
     *   model is grounded on false business data and can appear to "hallucinate"
     *   unrealistic free-item proposals.
     * - Parsing and validating floats here protects downstream RAG generation by
     *   ensuring the stored commercial inputs match the admin's intended values.
     */
    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedCost)) {
      return res.status(400).json({
        success: false,
        message: "price and cost must be valid numeric values.",
      });
    }

    const createdProduct = await prisma.product.create({
      data: {
        name,
        description,
        primaryCategory,
        subCategory,
        seoTags: Array.isArray(seoTags) ? seoTags : [],
        sustainabilityFilters: Array.isArray(sustainabilityFilters) ? sustainabilityFilters : [],
        embedding: Array.isArray(embedding) ? embedding.map(Number) : [],
        price: parsedPrice,
        cost: parsedCost,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product saved successfully.",
      product: createdProduct,
    });
  } catch (error) {
    console.error("Saving product failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save product.",
    });
  }
}

module.exports = {
  enrichProductData,
  saveProduct,
};

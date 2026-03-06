const { InferenceClient } = require("@huggingface/inference");

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!HUGGINGFACE_API_KEY) {
  throw new Error("HUGGINGFACE_API_KEY is required to initialize the ML service.");
}

const hf = new InferenceClient(HUGGINGFACE_API_KEY);

const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const SENTIMENT_MODEL = "distilbert-base-uncased-finetuned-sst-2-english";

/**
 * Converts a sentence into a dense numeric vector called an embedding.
 *
 * Plain-English explanation of embeddings:
 * - An embedding is a list of numbers that captures semantic meaning.
 * - Instead of storing text only as characters or words, an embedding stores a
 *   mathematical representation of "what the text is about".
 * - Texts with similar meaning end up with vectors that point in similar
 *   directions in high-dimensional space. For example, "eco bottle" and
 *   "reusable steel water bottle" should produce embeddings that are closer to
 *   each other than to a sentence about office notebooks.
 * - This is the foundation for semantic search, recommendation, and RAG because
 *   the application can compare meaning numerically instead of matching only
 *   exact keywords.
 *
 * @param {string} text - Product or query text that should be embedded.
 * @returns {Promise<number[]>} A vector of floats produced by the embedding model.
 */
async function generateEmbedding(text) {
  if (!text || !text.trim()) {
    throw new Error("generateEmbedding requires non-empty text.");
  }

  const embedding = await hf.featureExtraction({
    model: EMBEDDING_MODEL,
    inputs: text,
  });

  return Array.isArray(embedding) ? embedding.map(Number) : [];
}

/**
 * Runs sentiment classification and normalizes the result into a simple shape
 * that the rest of the backend can consume consistently.
 *
 * @param {string} text - The sentence or paragraph whose sentiment should be checked.
 * @returns {Promise<{label: "positive" | "negative", score: number, raw: Array<{label: string, score: number}>}>}
 */
async function analyzeSentiment(text) {
  if (!text || !text.trim()) {
    throw new Error("analyzeSentiment requires non-empty text.");
  }

  const rawResult = await hf.textClassification({
    model: SENTIMENT_MODEL,
    inputs: text,
  });

  const normalized = Array.isArray(rawResult) ? rawResult : [];
  const topResult =
    normalized.reduce((best, item) => {
      if (!best || item.score > best.score) {
        return item;
      }

      return best;
    }, null) || { label: "NEGATIVE", score: 0 };

  const label = topResult.label.toLowerCase().includes("pos") ? "positive" : "negative";

  return {
    label,
    score: topResult.score,
    raw: normalized,
  };
}

/**
 * Computes the cosine similarity between two vectors.
 *
 * Conceptual interview explanation:
 * - Each embedding is a point, or more accurately a direction, in a space that
 *   may contain hundreds of dimensions.
 * - Cosine similarity measures how aligned two directions are.
 * - If two vectors point in almost the same direction, the cosine of the angle
 *   between them is close to 1, which means the meanings are similar.
 * - If they are unrelated and point in very different directions, the score
 *   moves toward 0.
 * - If they point in opposite directions, the score can become negative.
 *
 * The formula is:
 * cosineSimilarity = dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB))
 *
 * Why this formula works:
 * - The dot product adds up pairwise multiplications of matching dimensions.
 *   Example: A[0] * B[0] + A[1] * B[1] + ...
 * - Large positive contributions happen when the same dimensions are strong in
 *   both vectors, which suggests semantic alignment.
 * - But the raw dot product alone is not enough, because longer vectors would
 *   naturally get bigger scores. That would mix up "direction" with "size".
 * - So we divide by the magnitudes (vector lengths). Magnitude is the Euclidean
 *   length of a vector:
 *   sqrt(v1^2 + v2^2 + v3^2 + ...)
 * - That normalization removes scale and focuses on angle. In plain English:
 *   cosine similarity asks, "Are these vectors pointing the same way?"
 *
 * Practical meaning in this project:
 * - We will embed a client need statement.
 * - We will compare that query vector to every product embedding.
 * - Products with the highest cosine similarity are the semantically closest
 *   matches, even when the exact words are not identical.
 *
 * @param {number[]} vecA - First vector.
 * @param {number[]} vecB - Second vector.
 * @returns {number} Similarity score in the range [-1, 1].
 */
function cosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
    throw new Error("cosineSimilarity expects two numeric arrays.");
  }

  if (vecA.length === 0 || vecB.length === 0) {
    throw new Error("cosineSimilarity cannot compare empty vectors.");
  }

  if (vecA.length !== vecB.length) {
    throw new Error("cosineSimilarity requires vectors of equal length.");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let index = 0; index < vecA.length; index += 1) {
    const a = Number(vecA[index]);
    const b = Number(vecB[index]);

    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  }

  const denominator = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);

  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

module.exports = {
  generateEmbedding,
  analyzeSentiment,
  cosineSimilarity,
};

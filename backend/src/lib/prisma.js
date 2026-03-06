const { PrismaClient } = require("@prisma/client");

/**
 * Prisma is the ORM layer between our Node.js code and MongoDB.
 *
 * Interview framing:
 * - Prisma gives us a typed client API instead of writing raw database queries.
 * - The schema in `prisma/schema.prisma` becomes the single source of truth for
 *   our collections and field shapes.
 * - `PrismaClient` exposes model helpers such as `prisma.product.findMany()`,
 *   which makes data access more maintainable and safer than hand-written query
 *   objects scattered across the codebase.
 */
const prisma = new PrismaClient();

module.exports = prisma;

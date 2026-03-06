const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const prisma = require("./lib/prisma");

const PORT = Number(process.env.PORT || 5000);

/**
 * Boots the HTTP server and verifies that Prisma can reach MongoDB.
 *
 * The explicit `prisma.$connect()` call is useful in interview explanations
 * because it separates two concerns:
 * 1. Starting the Express server.
 * 2. Confirming the ORM/database connection is healthy first.
 *
 * If the database is unavailable, we fail fast during startup rather than
 * discovering the problem only after the first API request hits production.
 */
async function startServer() {
  await prisma.$connect();

  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

startServer().catch(async (error) => {
  console.error("Server startup failed:", error);
  await prisma.$disconnect();
  process.exit(1);
});

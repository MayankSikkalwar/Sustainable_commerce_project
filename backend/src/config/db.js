const { PrismaClient } = require("@prisma/client");

/**
 * Central database configuration module.
 *
 * Clean Architecture reason:
 * - Infrastructure concerns such as database clients should live in a dedicated
 *   configuration or infrastructure layer instead of being instantiated inside
 *   controllers or business logic files.
 * - This keeps object creation in one place and lets the rest of the codebase
 *   depend on a shared, well-known database entry point.
 * - In interview language: controllers handle HTTP, services handle business
 *   logic, and config modules handle environment-dependent infrastructure.
 */
const prisma = new PrismaClient();

module.exports = prisma;

const express = require("express");

const router = express.Router();

/**
 * Product routing module.
 *
 * Why a dedicated routes layer is useful:
 * - Route files define URL structure and HTTP method mapping in one place.
 * - Controllers can evolve independently from the route table.
 * - This mirrors how scalable SaaS backends separate transport concerns from
 *   business logic and from infrastructure code such as Prisma and AI clients.
 *
 * Phase 3 will mount real product endpoints here.
 */

module.exports = router;

const express = require("express");
const {
  generateProposal,
  saveProposal,
} = require("../controllers/proposal.controller");

const router = express.Router();

/**
 * Proposal routes.
 *
 * This router keeps proposal-generation transport details separate from the
 * proposal controller logic and from the global app bootstrap.
 */
router.post("/generate", generateProposal);
router.post("/save", saveProposal);

module.exports = router;

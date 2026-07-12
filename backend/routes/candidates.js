const express = require("express");
const router = express.Router();

const { createCandidate, deleteCandidate } = require("../models/Candidate");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

// Create Candidate
router.post(
  "/:election_id/constituencies/:constituency_id/candidates/create",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const { constituency_id } = req.params;
      const { candidate_name } = req.body;

      const result = await createCandidate(constituency_id, candidate_name);

      res.status(201).json({
        success: true,
        message: "Candidate created successfully",
        candidate_id: result.insertId,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

// Delete Candidate
router.delete(
  "/:election_id/constituencies/:constituency_id/candidates/:candidate_id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const { candidate_id } = req.params;
      console.log(candidate_id);

      const result = await deleteCandidate(candidate_id);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Candidate deleted successfully",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

module.exports = router;

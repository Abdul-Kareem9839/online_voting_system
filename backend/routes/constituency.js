const express = require("express");
const router = express.Router();
const {
  createConstituency,
  deleteConstituency,
} = require("../models/Constituency");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

//create constituencies
router.post(
  "/:election_id/constituencies/create",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const { election_id } = req.params;
      const { constituency_name } = req.body;

      const result = await createConstituency(election_id, constituency_name);

      res.status(201).json({
        success: true,
        message: "Constituency created successfully",
        constituency_id: result.insertId,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// Delete constituency
router.delete(
  "/:election_id/constituencies/:constituency_id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const { constituency_id } = req.params;

      const result = await deleteConstituency(constituency_id);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Constituency not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Constituency deleted successfully",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

module.exports = router;

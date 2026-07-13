const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../config/database");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });
const {
  createElection,
  getElectionById,
  deleteElection,
  updateElection,
} = require("../models/Election");
const { validateElection } = require("../middlewares/validation");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const { sendInvitationEmail } = require("../utils/email");

// CREATE ELECTION
router.post(
  "/create",
  isAuthenticated,
  isAdmin,
  validateElection,
  async (req, res) => {
    try {
      const electionId = await createElection({
        ...req.body,
        admin_id: req.user.admin_id,
      });

      res.status(201).json({
        success: true,
        message: "Election created successfully",
        election_id: electionId,
      });
    } catch (err) {
      console.error("Election route error:", err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },
);

// Get Edit form
router.get("/:election_id/edit", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { election_id } = req.params;

    const election = await getElectionById(election_id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    res.json({
      success: true,
      election,
    });
  } catch (err) {
    console.error("Election edit route error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// UPDATE ELECTION
router.put(
  "/:election_id",
  isAuthenticated,
  isAdmin,
  validateElection,
  async (req, res) => {
    try {
      const { election_id } = req.params;

      const existing = await getElectionById(election_id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Election not found",
        });
      }

      await updateElection(election_id, req.body);

      res.json({
        success: true,
        message: "Election updated successfully",
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// DELETE ELECTION
router.delete("/:election_id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { election_id } = req.params;

    const existing = await getElectionById(election_id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    await deleteElection(election_id);

    res.json({
      success: true,
      message: "Election deleted successfully",
    });
  } catch (err) {
    console.error("Election delete route error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post(
  "/upload-voters/:election_id",
  upload.single("csv_file"),
  async (req, res) => {
    const { election_id } = req.params;
    const results = [];
    const errors = [];

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    fs.createReadStream(req.file.path)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.replace(/"/g, "").trim(),
          mapValues: ({ value }) => value.replace(/"/g, "").trim(),
        }),
      )
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        const emailsSent = [];
        const emailsFailed = [];

        const [electionRows] = await db.query(
          `SELECT election_type
   FROM elections
   WHERE election_id = ?`,
          [election_id],
        );

        if (electionRows.length === 0) {
          fs.unlinkSync(req.file.path);

          return res.status(404).json({
            success: false,
            message: "Election not found",
          });
        }

        const electionType = electionRows[0].election_type;

        for (const row of results) {
          const { voter_name, email, voter_id_number, constituency_name } = row;

          if (!voter_name || !email || !voter_id_number || !constituency_name) {
            errors.push({ row, reason: "Missing fields" });
            continue;
          }

          const [constituencies] = await db.query(
            `SELECT constituency_id FROM constituencies 
           WHERE constituency_name = ? AND election_id = ?`,
            [constituency_name.trim(), election_id],
          );

          if (constituencies.length === 0) {
            errors.push({
              row,
              reason: `Constituency "${constituency_name}" not found`,
            });
            continue;
          }

          const constituency_id = constituencies[0].constituency_id;

          try {
            const [result] = await db.query(
              `INSERT IGNORE INTO voters 
              (voter_name, email, voter_id_number, constituency_id, election_id, is_approved, is_registered, has_voted)
             VALUES (?, ?, ?, ?, ?, TRUE, FALSE, FALSE)`,
              [
                voter_name.trim(),
                email.trim(),
                voter_id_number.trim(),
                constituency_id,
                election_id,
              ],
            );

            if (result.affectedRows === 0) {
              errors.push({
                row,
                reason:
                  "Duplicate voter for this election (email or voter ID already registered)",
              });
              continue;
            }

            await sendInvitationEmail(
              email.trim(),
              voter_name.trim(),
              voter_id_number.trim(),
              electionType,
            );
            emailsSent.push(email.trim());
          } catch (err) {
            errors.push({ row, reason: err.message });
            emailsFailed.push(email.trim());
          }
        }

        // Delete temp file
        fs.unlinkSync(req.file.path);

        res.json({
          success: true,
          message: `Upload complete. ${results.length - errors.length} voters added. ${emailsSent.length} invitation emails sent.`,
          errors: errors.length > 0 ? errors : null,
          emailsFailed: emailsFailed.length > 0 ? emailsFailed : null,
        });
      });
  },
);

module.exports = router;

const express = require("express");
const router = express.Router();

const { castVote } = require("../models/Vote");
const { getVoterById } = require("../models/Voter");
const {
  faceVerifyLimiter,
  voteLimiter,
} = require("../middlewares/rateLimiter");
const { isAuthenticated, isVoter } = require("../middlewares/auth");

router.post(
  "/verify-face",
  faceVerifyLimiter,
  isAuthenticated,
  isVoter,
  async (req, res) => {
    try {
      const { voter_id, image } = req.body;

      if (!voter_id || !image) {
        return res.status(400).json({
          success: false,
          message: "Voter ID and image are required.",
        });
      }

      const voter = await getVoterById(voter_id);

      if (!voter) {
        return res.status(404).json({
          success: false,
          message: "Voter not found.",
        });
      }

      if (!voter.face_registered || !voter.face_embedding) {
        return res.status(400).json({
          success: false,
          message: "Face is not registered for this voter.",
        });
      }

      let storedEmbeddings = voter.face_embedding;

      if (typeof storedEmbeddings === "string") {
        try {
          storedEmbeddings = JSON.parse(storedEmbeddings);
        } catch (error) {
          storedEmbeddings = voter.face_embedding;
        }
      }

      const faceResponse = await fetch("FACE_SERVICE_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          stored_embeddings: storedEmbeddings,
        }),
      });

      const faceData = await faceResponse.json();

      if (!faceResponse.ok) {
        return res.status(faceResponse.status).json(faceData);
      }

      return res.status(200).json({
        success: true,
        verified: faceData.verified,
        similarity: faceData.similarity,
        message: faceData.verified
          ? "Face verified successfully."
          : "Face verification failed.",
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

router.post("/", voteLimiter, isAuthenticated, isVoter, async (req, res) => {
  try {
    const voteId = await castVote(req.body);

    res.status(201).json({
      success: true,
      vote_id: voteId,
      message: "Vote cast successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;

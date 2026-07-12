const ElectionService = require("../services/electionResult");

class ElectionController {
  static async declareResult(req, res) {
    const adminId = req.user?.admin_id;
    const { election_id: electionId, constituency_id: constituencyId } =
      req.body;

    if (!electionId || !constituencyId || !adminId) {
      return res.status(400).json({
        error:
          "Missing required fields: election_id, constituency_id, admin_id",
      });
    }

    try {
      const result = await ElectionService.declareResult({
        electionId,
        constituencyId,
        adminId,
      });
      return res.status(200).json({
        success: true,
        message: "Result declared successfully",
        result,
      });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error("Declare Result Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = ElectionController;

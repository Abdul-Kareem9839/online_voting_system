const voterService = require("../services/voter");

const getElections = async (req, res) => {
  try {
    const elections = await voterService.getElections();

    return res.json({
      success: true,
      elections,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch elections",
    });
  }
};

const getConstituencies = async (req, res) => {
  try {
    const { election_id } = req.params;

    const constituencies = await voterService.getConstituencies(election_id);

    return res.json({
      success: true,
      constituencies,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch constituencies",
    });
  }
};

const getDashboard = async (req, res) => {
  try {
    const email = req.user.email;

    const dashboard = await voterService.getDashboard(email);

    return res.status(200).json({
      success: true,
      ...dashboard,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Voter not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getElections,
  getConstituencies,
  getDashboard,
};

const voterAuthService = require("../services/voterAuth");

const checkEligibility = async (req, res) => {
  try {
    const { email, voter_id_number } = req.body;

    const result = await voterAuthService.checkEligibility(
      email,
      voter_id_number,
    );

    return res.status(result.status).json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email, voter_id_number, election_id } = req.body;

    const result = await voterAuthService.sendOtp(
      email,
      voter_id_number,
      election_id,
    );

    return res.status(result.status).json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, election_id, otp } = req.body;

    const result = await voterAuthService.verifyOtp(email, election_id, otp);

    return res.status(result.status).json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, voter_id_number, election_id, images } = req.body;

    const result = await voterAuthService.register(
      email,
      voter_id_number,
      election_id,
      images,
    );

    if (!result.success) {
      return res.status(result.status).json(result);
    }

    req.login(result.voterSession, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Registration completed successfully.",
        voter: {
          voter_id: result.voterSession.voter_id,
          voter_name: result.voterSession.voter_name,
          email: result.voterSession.email,
        },
      });
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const verifyFace = async (req, res) => {
  try {
    const { voter_id, image } = req.body;

    const result = await voterAuthService.verifyFace(voter_id, image);

    return res.status(result.status).json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const loginSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await voterAuthService.loginSendOtp(email);

    return res.status(result.status).json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const loginVerifyOtp = (passport) => {
  return (req, res, next) => {
    passport.authenticate("voter-local", (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info.message,
        });
      }

      voterAuthService.login(req, user, (err) => {
        if (err) {
          return next(err);
        }

        return res.status(200).json({
          success: true,
          message: "Login successful",
          voter: user,
        });
      });
    })(req, res, next);
  };
};

module.exports = {
  checkEligibility,
  sendOtp,
  verifyOtp,
  register,
  verifyFace,
  loginSendOtp,
  loginVerifyOtp,
};

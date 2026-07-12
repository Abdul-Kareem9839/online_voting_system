const validateElection = (req, res, next) => {
  const { election_name, start_date, end_date, election_type } = req.body;

  if (!election_name || !start_date || !end_date || !election_type) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const now = new Date();

  if (isNaN(startDate) || isNaN(endDate)) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  if (startDate < now) {
    return res.status(400).json({
      success: false,
      message: "Start date cannot be in the past",
    });
  }

  if (endDate <= startDate) {
    return res.status(400).json({
      success: false,
      message: "End date must be after start date",
    });
  }

  next();
};

const validateEligibility = (req, res, next) => {
  const { email, voter_id_number } = req.body;

  if (!email || !voter_id_number) {
    return res.status(400).json({
      success: false,
      message: "Email and Voter ID Number are required.",
    });
  }

  next();
};

const validateSendOtp = (req, res, next) => {
  const { email, voter_id_number, election_id } = req.body;

  if (!email || !voter_id_number || !election_id) {
    return res.status(400).json({
      success: false,
      message: "Email, Voter ID Number and Election ID are required.",
    });
  }

  next();
};

const validateVerifyOtp = (req, res, next) => {
  const { email, election_id, otp } = req.body;

  if (!email || !election_id || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email, Election ID and OTP are required.",
    });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { email, voter_id_number, election_id } = req.body;

  if (!email || !voter_id_number || !election_id) {
    return res.status(400).json({
      success: false,
      message: "Email, Voter ID Number and Election ID are required.",
    });
  }

  next();
};

const validateVerifyFace = (req, res, next) => {
  const { voter_id, image } = req.body;

  if (!voter_id || !image) {
    return res.status(400).json({
      success: false,
      message: "Voter ID and image are required",
    });
  }

  next();
};

const validateLoginSendOtp = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  next();
};

module.exports = {
  validateEligibility,
  validateElection,
  validateSendOtp,
  validateVerifyOtp,
  validateRegister,
  validateVerifyFace,
  validateLoginSendOtp,
};

const { getElectionStatus } = require("../models/functions");
const voterAuthModel = require("../models/VoterAuth");
const otpStore = require("../utils/otpStore");
const { generateOtp, saveOtp } = require("../utils/otp");
const { sendOtpEmail } = require("../utils/email");

const checkEligibility = async (email, voterId) => {
  const rows = await voterAuthModel.getPendingRegistrations(email, voterId);

  const pendingElections = [];

  for (const election of rows) {
    const status = getElectionStatus(election.start_date, election.end_date);

    if (status === "upcoming" || status === "ongoing") {
      pendingElections.push({
        ...election,
        status,
      });
    }
  }

  if (pendingElections.length > 0) {
    return {
      status: 200,
      success: true,
      pendingElections,
    };
  }

  const exists = await voterAuthModel.voterExists(email, voterId);

  if (!exists) {
    return {
      status: 404,
      success: false,
      message: "You are not eligible to participate in any election.",
    };
  }

  return {
    status: 400,
    success: false,
    message:
      "You have already completed registration for all eligible upcoming elections.",
  };
};

const sendOtp = async (email, voterId, electionId) => {
  const voter = await voterAuthModel.getVoterByEmailVoterIdElection(
    email,
    voterId,
    electionId,
  );

  if (!voter) {
    return {
      status: 404,
      success: false,
      message: "Voter not found for the selected election.",
    };
  }

  if (voter.is_registered) {
    return {
      status: 400,
      success: false,
      message: "Registration has already been completed for this election.",
    };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(`${email}:${electionId}`, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error("OTP email delivery failed:", err.message);
    return {
      status: 500,
      success: false,
      message: "Unable to send OTP email right now. Please try again later.",
    };
  }

  return {
    status: 200,
    success: true,
    message: "OTP sent successfully.",
  };
};

const verifyOtp = async (email, electionId, otp) => {
  const otpKey = `${email}:${electionId}`;
  const record = otpStore.get(otpKey);

  if (!record) {
    return {
      status: 400,
      success: false,
      message: "OTP not found. Please request a new one.",
    };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(otpKey);

    return {
      status: 400,
      success: false,
      message: "OTP has expired. Please request a new OTP.",
    };
  }

  if (record.otp !== otp) {
    return {
      status: 400,
      success: false,
      message: "Invalid OTP.",
    };
  }

  otpStore.set(otpKey, {
    ...record,
    verified: true,
  });

  return {
    status: 200,
    success: true,
    message: "OTP verified successfully.",
  };
};

const register = async (email, voterId, electionId, images) => {
  const otpKey = `${email}:${electionId}`;
  const otpRecord = otpStore.get(otpKey);

  if (!otpRecord || !otpRecord.verified) {
    return {
      status: 400,
      success: false,
      message: "Please verify your OTP first.",
    };
  }

  const voter = await voterAuthModel.getVoterByEmailVoterIdElection(
    email,
    voterId,
    electionId,
  );

  if (!voter) {
    return {
      status: 404,
      success: false,
      message: "Voter not found.",
    };
  }

  if (voter.is_registered) {
    return {
      status: 400,
      success: false,
      message: "Registration has already been completed.",
    };
  }

  let embeddings;

  const existingFace = await voterAuthModel.getExistingFaceEmbedding(email);

  if (existingFace) {
    embeddings = existingFace;
  } else {
    if (!images || images.length < 3) {
      return {
        status: 400,
        success: false,
        message: "Face images are required.",
      };
    }

    const faceResponse = await fetch("http://localhost:5001/register-face", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images }),
    });

    const faceData = await faceResponse.json();

    if (!faceResponse.ok) {
      throw new Error(faceData.message || "Face service error.");
    }

    if (!faceData.embeddings) {
      return {
        status: 400,
        success: false,
        message: "Failed to generate face embeddings.",
      };
    }

    embeddings = JSON.stringify(faceData.embeddings);
  }

  await voterAuthModel.updateVoterRegistration(voter.voter_id, embeddings);

  otpStore.delete(otpKey);

  return {
    status: 200,
    success: true,
    voterSession: {
      voter_id: voter.voter_id,
      voter_name: voter.voter_name,
      email: voter.email,
      role: "voter",
    },
  };
};

const verifyFace = async (voterId, image) => {
  const voter = await voterAuthModel.getVoterById(voterId);

  if (!voter) {
    return {
      status: 404,
      success: false,
      message: "Voter not found",
    };
  }

  if (!voter.face_registered || !voter.face_embedding) {
    return {
      status: 400,
      success: false,
      message: "Face is not registered for this voter.",
    };
  }

  const faceResponse = await fetch("FACE_SERVICE_URL", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image,
      stored_embeddings: voter.face_embedding,
    }),
  });

  const faceData = await faceResponse.json();

  if (!faceResponse.ok) {
    throw new Error(faceData.message);
  }

  return {
    status: 200,
    success: true,
    verified: faceData.verified,
    similarity: faceData.similarity,
    message: "Face verified successfully",
  };
};

const loginSendOtp = async (email) => {
  const voter = await voterAuthModel.getVoterByEmail(email);

  if (!voter) {
    return {
      status: 404,
      success: false,
      message: "No account found with this email.",
    };
  }

  if (!voter.is_registered) {
    return {
      status: 403,
      success: false,
      message: "You have not completed registration yet.",
    };
  }

  const otp = generateOtp();

  saveOtp(email, otp, otpStore);

  await sendOtpEmail(email, otp);

  return {
    status: 200,
    success: true,
    message: "OTP sent successfully",
  };
};

module.exports = {
  checkEligibility,
  sendOtp,
  verifyOtp,
  register,
  verifyFace,
  loginSendOtp,
};

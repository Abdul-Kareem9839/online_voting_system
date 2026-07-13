const { sendMail } = require("../config/mail");

async function sendOtpEmail(email, otp) {
  const result = await sendMail({
    from: process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Voting System OTP",
    html: `
      <h2>Online Voting System</h2>
      <p>Your login OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `,
    text: `Your OTP is ${otp}`,
  });

  if (!result.delivered) {
    return {
      delivered: false,
      reason: "send_failed",
      otp,
      message: result.message,
    };
  }

  return { delivered: true, otp, id: result.id };
}

const electionLabels = {
  University: {
    idLabel: "Roll Number",
    message: "Please use your university Roll Number during registration.",
  },

  Organization: {
    idLabel: "Member ID",
    message: "Please use your Member ID during registration.",
  },

  "State Assembly": {
    idLabel: "Voter ID",
    message: "Please use your Voter ID during registration.",
  },

  "Municipal Corporation": {
    idLabel: "Voter ID",
    message: "Please use your Voter ID during registration.",
  },

  local: {
    idLabel: "Identification Number",
    message:
      "Please use the identification number provided by the election administrator.",
  },

  default: {
    idLabel: "Identification Number",
    message:
      "Please use the identification number provided by the election administrator.",
  },
};

const sendInvitationEmail = async (
  email,
  voter_name,
  voter_id_number,
  electionType,
) => {
  const { idLabel, message } =
    electionLabels[electionType] || electionLabels.default;

  const result = await sendMail({
    from: process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "You are invited to vote — Action Required",
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:30px; border:1px solid #e0e0e0; border-radius:10px;">

        <h2 style="color:#4f46e5;">You're Invited to Vote!</h2>

        <p>Dear <strong>${voter_name}</strong>,</p>

        <p>
          You have been registered as an eligible voter for an upcoming election.
        </p>

        <p>${message}</p>

        <div style="background:#f5f5f5; padding:15px; border-radius:8px; margin:20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>${idLabel}:</strong> ${voter_id_number}</p>
        </div>

        <p>Click the button below to complete your registration.</p>

        <a
          href="${process.env.CLIENT_URL}/register"
          style="display:inline-block; background:#4f46e5; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;"
        >
          Complete Registration
        </a>

        <p style="color:#888; font-size:13px; margin-top:30px;">
          If you did not expect this email, please ignore it.
        </p>

      </div>
    `,
    text: `You have been invited to vote. Use the registration link provided in the email.`,
  });

  if (!result.delivered) {
    throw new Error(result.message || "Invitation email delivery failed");
  }
};

const sendResultDeclaredEmail = async ({
  email,
  voter_name,
  election_name,
  constituency_name,
  winner_name,
  total_votes_cast,
  winning_margin,
}) => {
  const result = await sendMail({
    from: process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: `Election Result Declared for ${constituency_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:30px; border:1px solid #e0e0e0; border-radius:10px;">
        <h2 style="color:#1f2937;">Election Result Declared</h2>
        <p>Dear <strong>${voter_name || "Voter"}</strong>,</p>
        <p>The result for the election <strong>${election_name}</strong> in the constituency <strong>${constituency_name}</strong> has been declared.</p>
        <div style="background:#f5f5f5; padding:15px; border-radius:8px; margin:20px 0;">
          <p><strong>Winner:</strong> ${winner_name}</p>
          <p><strong>Total votes cast:</strong> ${total_votes_cast}</p>
          <p><strong>Winning margin:</strong> ${winning_margin}</p>
        </div>
        <p>Thank you for participating in the electoral process. Your vote contributes to a stronger and fairer system.</p>
        <p style="color:#6b7280; font-size:13px; margin-top:30px;">This is an automated notification from the voting system.</p>
      </div>
    `,
    text: `Election result declared for ${constituency_name}.`,
  });

  if (!result.delivered) {
    throw new Error(result.message || "Result email delivery failed");
  }
};

module.exports = { sendOtpEmail, sendInvitationEmail, sendResultDeclaredEmail };

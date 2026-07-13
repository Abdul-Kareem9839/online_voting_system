const brevo = require("@getbrevo/brevo");

if (!process.env.BREVO_API_KEY) {
  console.error("BREVO_API_KEY is not defined");
}

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

async function sendMail({ from, to, subject, html, text }) {
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    email: from || process.env.EMAIL_FROM || "civiconlinevoting@gmail.com",
    name: process.env.EMAIL_FROM_NAME || "CivicVote",
  };
  sendSmtpEmail.to = [{ email: Array.isArray(to) ? to[0] : to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.textContent = text || "";
  sendSmtpEmail.htmlContent = html || "";

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return {
      delivered: true,
      id: response?.messageId || response?.body?.messageId,
      message: response?.messageId ? "Email queued successfully" : "Email sent",
    };
  } catch (error) {
    const message =
      error.response?.body?.message || error.message || "Email delivery failed";
    console.error("Brevo email error:", message);
    return { delivered: false, reason: "send_failed", message };
  }
}

module.exports = { sendMail };

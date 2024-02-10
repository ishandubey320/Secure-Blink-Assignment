const nodemailer = require("nodemailer");

async function createTransporter() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "devloperdubey@gmail.com",
        pass: "DeveloperDubey@123",
      },
    });
    return transporter;
  } catch (error) {
    console.error("Failed to create transporter:", error);
    throw error;
  }
}

module.exports = { createTransporter };

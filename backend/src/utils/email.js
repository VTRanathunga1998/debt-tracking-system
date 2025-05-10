// emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Sends an email using Nodemailer.
 */
export async function sendEmail(fromName, fromAddress, to, subject, text, html) {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: {
        name: fromName,
        address: fromAddress,
      },
      to,
      subject,
      text,
      html,
    });

    console.log("Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;
  }
}

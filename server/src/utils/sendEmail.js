import nodemailer from "nodemailer";
import config from "../config/envConfig.js";

export const sendWelcomeEmail = async (email, name) => {
  try {
    let transporter;

    if (config.SMTP.HOST && config.SMTP.USER) {
      transporter = nodemailer.createTransport({
        host: config.SMTP.HOST,
        port: Number(config.SMTP.PORT) || 587,
        secure: config.SMTP.SECURE,
        auth: {
          user: config.SMTP.USER,
          pass: config.SMTP.PASS,
        },
      });
    } else {
      console.log(
        "⚠️ No SMTP config found. Generating Ethereal test account..."
      );
      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from:
        config.SMTP.FROM || '"CourseMaster Admin" <noreply@coursemaster.com>',
      to: email,
      subject: "Welcome to CourseMaster! 🚀",
      text: `Hello ${name},\n\nWelcome to the platform! We are excited to have you learn with us.\n\n- The Team`,
      html: `<b>Hello ${name},</b><br><br>Welcome to the platform! We are excited to have you learn with us.<br><br>- The Team`,
    });

    console.log("Message sent: %s", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Preview URL: %s", previewUrl);
    }
  } catch (error) {
    console.error("Email error:", error);
  }
};

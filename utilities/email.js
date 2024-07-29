const nodemailer = require("nodemailer");
const cheerio = require("cheerio");
require("dotenv").config();
const ejs = require("ejs");
const path = require("path"); // Import path module
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName; // Corrected splitting method
    this.url = url;
    this.from = "support@firmestone.com";
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          user: "support@firmestone.com",
          pass: "695372reLZ#",
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // send the actual email
  async send(template, subject) {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, `../views/email/${template}.ejs`), // Use path.join for correct file path
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        }
      );

      const $ = cheerio.load(html);

      // defining the email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: $.text(),
      };

      // creating a transport and sending the email
      await this.newTransport().sendMail(mailOptions);
    } catch (error) {
      console.error("Email sending failed:", error);
      // Handle error or throw it for higher-level handling
      throw new Error("Failed to send email");
    }
  }

  async sendWelcome() {
    try {
      await this.send("welcome", "Welcome to Firmestone"); // Ensure the template name matches
    } catch (error) {
      // Handle error for sendWelcome method
      console.error("Sending welcome email failed:", error);
      // Optionally, you can throw the error again for higher-level handling
      throw new Error("Failed to send welcome email");
    }
  }

  async sendPasswordReset() {
    try {
      await this.send(
        "passwordReset",
        "Your password reset token (valid for only 10 minutes)"
      );
    } catch (error) {
      // Handle error for sendPasswordReset method
      console.error("Sending password reset email failed:", error);
      // Optionally, you can throw the error again for higher-level handling
      throw new Error("Failed to send password reset email");
    }
  }

  async sendConfirmEmail() {
    try {
      await this.send(
        "confirmEmail",
        "Your email confirmation token (valid for only 10 minutes)"
      );
    } catch (error) {
      // Handle error for sendPasswordReset method
      console.error("Sending confirmation email failed:", error);
      // Optionally, you can throw the error again for higher-level handling
      throw new Error("Failed to send confirmation email");
    }
  }
};

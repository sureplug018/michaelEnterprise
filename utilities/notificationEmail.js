const nodemailer = require('nodemailer');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const ejs = require('ejs');
const path = require('path'); // Import path module

module.exports = class OrderEmail {
  constructor(user, url, orders) {
    this.to = user.email;
    this.firstName = user.firstName; // Corrected splitting method
    this.url = url;
    this.from = '"Michael Enterprise" <support@michael-enterprise.com>';
    this.orders = orders;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: 'mail.privateemail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
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
          orders: this.orders,
        },
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
      console.error('Email sending failed:', error);
      // Handle error or throw it for higher-level handling
      throw new Error('Failed to send email');
    }
  }
  async sendOrderNotification() {
    try {
      await this.send('orderNotification', 'New order notification');
    } catch (error) {
      // Handle error for sendPasswordReset method
      console.error('Sending order notification email failed:', error);
      // Optionally, you can throw the error again for higher-level handling
      throw new Error('Failed to send order notification email');
    }
  }

  async sendOrderConfirmationEmail() {
    try {
      await this.send('orderConfirmed', 'Order confirmation notification');
    } catch (error) {
      // Handle error for sendPasswordReset method
      console.error('Sending order confirmation email failed:', error);
      // Optionally, you can throw the error again for higher-level handling
      throw new Error('Failed to send order confirmation email');
    }
  }

  // async sendReviewEmail() {
  //   try {
  //     await this.send('pendingReview', 'Rate our order');
  //   } catch (error) {
  //     // Handle error for sendPasswordReset method
  //     console.error('Sending pending review email failed:', error);
  //     // Optionally, you can throw the error again for higher-level handling
  //     throw new Error('Failed to send pending review email');
  //   }
  // }

  async sendOrderCancelled() {
    try {
      await this.send('orderCancelled', 'Order cancelled');
    } catch (error) {
      // Handle error for sendPasswordReset method
      console.error('Sending order cancellation email failed:', error);
      // Optionally, you can throw the error again for higher-level handling
      throw new Error('Failed to send order cancellation email');
    }
  }

  async sendDelivery() {
    try {
      await this.send('deliveryNotification', 'Order delivered');
    } catch (error) {
      // Handle error for sendPasswordReset method
      console.error('Sending order cancellation email failed:', error);
      // Optionally, you can throw the error again for higher-level handling
      throw new Error('Failed to send order cancellation email');
    }
  }
};

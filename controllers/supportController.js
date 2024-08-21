const dotenv = require('dotenv');
// dotenv.config({ path: 'config.env' });
const nodemailer = require('nodemailer');
const Support = require('../models/supportModel');
const User = require('../models/userModel');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

exports.createSupport = async (req, res) => {
  const user = req.user.id;
  const { email, subject, message } = req.body;
  const requiredFields = ['email', 'subject', 'message'];

  // Validate request body
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ status: 'fail', message: `${field} is required` });
    }
  }
  try {
    const support = await Support.create({
      user,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        support,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.replySupport = async (req, res) => {
  const id = req.params.id;
  const { subject, message } = req.body;

  try {
    // Find the support message by email
    const support = await Support.findById({ _id: id });
    const email = support.email;

    if (!support) {
      return res.status(404).json({
        status: 'fail',
        message: 'Support message not found',
      });
    }

    // Send a reply email to the user
    await sendReplyEmail(email, subject, message);

    // Delete the support message
    await Support.findByIdAndDelete(support._id);

    return res.status(200).json({
      status: 'success',
      message: 'Reply sent and support message deleted',
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

async function sendReplyEmail(email, subject, message) {
  const mailOptions = {
    from: '"Michael Enterprise" <support@michael-enterprise.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    html: `<p>${message}</p>`, // html body
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw new Error('Failed to send email');
  }
}

exports.sendMail = async (req, res) => {
  const id = req.params.id;
  const { subject, message } = req.body;

  try {
    // Find the support message by email
    const user = await User.findById({ _id: id });
    const email = user.email;

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Send a reply email to the user
    await sendReplyEmail(email, subject, message);

    return res.status(200).json({
      status: 'success',
      message: 'Message Sent',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

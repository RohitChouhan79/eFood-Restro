import CustomerModel from "../models/customer.model.js";
// Import nodemailer for sending emails
import nodemailer from 'nodemailer';

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  // Configure your email service provider here
  service: 'Gmail',
  auth: {
    user: 'suryaumpteen@gmail.com',
        pass: 'egye onio jxeo rhmt'
  }
});

export async function sendEmailNotification(emailAddress, title, description) {
  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Survesh" suryaumpteen@gmail.com', // sender address
      to: emailAddress, // list of receivers
      subject: title, // Subject line
      text: description, // plain text body
      html: `<b>${description}</b>` // html body
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error;
  }
  }
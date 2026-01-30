const Newsletter = require("../models/newsletter_model");
const transporter = require("../config/mail");

exports.subscribe = async (email) => {
  try {
    // Save subscriber
    const subscriber = await Newsletter.create({ email });

    // Notify ADMIN
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "info@arraybots.com",
      subject: "New Newsletter Subscription",
      html: `
        <h3>New Newsletter Subscriber</h3>
        <p><b>Email:</b> ${email}</p>
      `,
    });

    // Auto-reply to SUBSCRIBER
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Subscription Confirmed 🎉",
      html: `
        <p>Hi,</p>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>You’ll now receive updates and announcements from us.</p>

        <p>Regards,<br/><b>Team</b></p>
      `,
    });

    return subscriber;
  } catch (error) {
    throw error;
  }
};



const Contact = require("../models/contact_model");
const transporter = require("../config/mail");

exports.createContact = async (data) => {
  try {

    const contact = await Contact.create(data);

    // Send mail to ADMIN
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact from ${data.source_page}`,
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Source:</b> ${data.source_page}</p>
        <p><b>Message:</b> ${data.message}</p>
      `,
    });

    // Auto-reply to USER
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: "We received your message",
      html: `
        <p>Hi ${data.name},</p>
        <p>Thank you for contacting us. Our team will get back to you shortly.</p>

        <p><b>Your Message:</b></p>
        <blockquote>${data.message}</blockquote>

        <p>Regards,<br/><b>Support Team</b></p>
      `,
    });

    return contact;
  } catch (error) {
    throw error;
  }
};



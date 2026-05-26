import nodemailer from "nodemailer";

export const sendSupportTicket = async (req, res) => {
  const { name, email, issue, message } = req.body;

  if (!name || !email || !issue || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. SMTP Transporter Setup (Gmail using App Password)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 2. Email Content Setup
    const mailOptions = {
      from: `"${name}" <${email}>`, 
      to: process.env.EMAIL_USER, 
      subject: `GoBus Support Ticket: ${issue}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1e3a8a;">New Support Ticket Raised</h2>
          <hr style="border: 1px dashed #cbd5e1; margin-bottom: 20px;" />
          <p><strong>Passenger Name:</strong> ${name}</p>
          <p><strong>Passenger Email:</strong> ${email}</p>
          <p><strong>Issue Category:</strong> <span style="background-color: #fef2f2; color: #dc2626; padding: 2px 8px; rounded: 4px; font-weight: bold;">${issue}</span></p>
          <br/>
          <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #1e3a8a; border-radius: 4px;">
            <p><strong>Message / Description:</strong></p>
            <p style="line-height: 1.6;">${message}</p>
          </div>
          <br/>
          <p style="font-size: 11px; color: #94a3b8;">*This email was dynamically triggered via GoBus System Support Module.</p>
        </div>
      `,
    };

    // 3. Trigger Email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Support ticket sent successfully!" });

  } catch (error) {
    console.error("Nodemailer Error:", error);
    res.status(500).json({ error: "Failed to send email. Server error." });
  }
};
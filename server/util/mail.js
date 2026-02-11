const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

exports.sendOverlapNotification = async (recipientEmail, userName, flatName, startDate, endDate) => {
    try {
        if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
            console.log("Email credentials not found. Skipping email notification.");
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: recipientEmail,
            subject: "Booking Date Conflict - Himalayan Ama",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                    <h2 style="color: #2563eb;">Hello ${userName},</h2>
                    <p>Thank you for your interest in <strong>${flatName}</strong>.</p>
                    <p style="color: #ef4444; font-weight: bold;">Unfortunately, your requested dates (${startDate} to ${endDate}) overlap with an already confirmed booking.</p>
                    <p>We kindly ask you to reconsider your dates and pick another available window on our calendar.</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-t: 1px solid #e2e8f0; font-size: 0.875rem; color: #64748b;">
                        Best regards,<br>
                        Himalayan Ama Team
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Overlap notification sent to ${recipientEmail}`);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

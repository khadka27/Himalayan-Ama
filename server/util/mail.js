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

exports.sendBookingConfirmation = async (recipientEmail, userName, flatName, startDate, endDate) => {
    try {
        if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
            console.log("Email credentials not found. Skipping email notification.");
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: recipientEmail,
            subject: "Booking Confirmed - Himalayan Ama",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #059669;">Your Booking is Confirmed!</h2>
                    <p>Hello ${userName},</p>
                    <p>We are delighted to confirm your stay at <strong>${flatName}</strong>.</p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #64748b; font-size: 0.875rem;">Stay Details:</p>
                        <p style="margin: 5px 0; font-weight: bold; font-size: 1.125rem;">${startDate} - ${endDate}</p>
                    </div>
                    <p>We are preparing everything for your arrival. If you have any questions, please feel free to reach out to us via WhatsApp or Email.</p>
                    <p>See you soon!</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 0.875rem; color: #64748b;">
                        Best regards,<br>
                        Himalayan Ama Team
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Booking confirmation sent to ${recipientEmail}`);
    } catch (error) {
        console.error("Error sending booking confirmation:", error.message);
    }
};

exports.sendBookingInquiry = async (recipientEmail, userName, flatName, startDate, endDate) => {
    try {
        if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
            console.log("Email credentials not found. Skipping email notification.");
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: recipientEmail,
            subject: "Booking Request Received - Himalayan Ama",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #2563eb;">We've Received Your Booking Request!</h2>
                    <p>Hello ${userName},</p>
                    <p>Thank you for choosing <strong>Himalayan Ama</strong>. We have received your booking request for <strong>${flatName}</strong>.</p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #64748b; font-size: 0.875rem;">Requested Dates:</p>
                        <p style="margin: 5px 0; font-weight: bold; font-size: 1.125rem;">${startDate} - ${endDate}</p>
                    </div>
                    <p>Our team is reviewing your request. We will get back to you shortly with a confirmation.</p>
                    <p>If you have any questions in the meantime, feel free to contact us.</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 0.875rem; color: #64748b;">
                        Best regards,<br>
                        Himalayan Ama Team
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Booking inquiry notification sent to ${recipientEmail}`);
    } catch (error) {
        console.error("Error sending booking inquiry email:", error.message);
    }
};

exports.sendBookingRejection = async (recipientEmail, userName, flatName, startDate, endDate) => {
    try {
        if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
            console.log("Email credentials not found. Skipping email notification.");
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: recipientEmail,
            subject: "Booking Update - Himalayan Ama",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #ef4444;">Update Regarding Your Booking Request</h2>
                    <p>Hello ${userName},</p>
                    <p>Thank you for your interest in <strong>Himalayan Ama</strong>.</p>
                    <p>Regarding your booking request for <strong>${flatName}</strong> from <strong>${startDate}</strong> to <strong>${endDate}</strong>, we regret to inform you that we are unable to accommodate your stay at this time.</p>
                    <p>This could be due to maintenance or other scheduling conflicts. We invite you to check our calendar for other available dates in the future.</p>
                    <p>If you have any questions, please feel free to reach out to us.</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 0.875rem; color: #64748b;">
                        Best regards,<br>
                        Himalayan Ama Team
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Booking rejection notification sent to ${recipientEmail}`);
    } catch (error) {
        console.error("Error sending booking rejection email:", error.message);
    }
};

exports.sendAdminNotification = async (userName, userEmail, userPhone, flatName, startDate, endDate, message) => {
    try {
        if (!process.env.ADMIN_EMAIL) {
            console.log("Admin email not found. Skipping admin notification.");
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: `New Booking Request - ${flatName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #2563eb;">New Booking Request</h2>
                    <p><strong>Guest:</strong> ${userName}</p>
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p><strong>Phone:</strong> ${userPhone || 'Not provided'}</p>
                    <p><strong>Property:</strong> ${flatName}</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #64748b; font-size: 0.875rem;">Requested Dates:</p>
                        <p style="margin: 5px 0; font-weight: bold;">${startDate} - ${endDate}</p>
                    </div>
                    ${message ? `<div style="margin-top: 15px;"><p><strong>Message:</strong></p><p style="background-color: #f1f5f9; padding: 10px; border-radius: 6px;">${message}</p></div>` : ''}
                    <div style="margin-top: 20px; font-size: 0.875rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                        Please log in to the admin dashboard to review and confirm this booking.
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Admin notification sent to ${process.env.ADMIN_EMAIL}`);
    } catch (error) {
        console.error("Error sending admin notification:", error.message);
    }
};


import axios from 'axios';

/**
 * Sends a WhatsApp notification to the admin using CallMeBot (Free API).
 */
export const sendWhatsAppNotification = async (bookingData: any) => {
    // .trim() is CRITICAL because .env files often have hidden spaces that break URLs
    const apiKey = process.env.NEXT_PUBLIC_CALLMEBOT_API_KEY?.trim();
    const adminNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER?.trim();

    if (!apiKey || !adminNumber) {
        console.error("WhatsApp Error: Missing API Key or Admin number in .env");
        return;
    }

    const message = `
🧘 *New Yoga Booking Received!* 🧘
---------------------------------
👤 *Client:* ${bookingData.name || bookingData.userName || "Guest"}
📧 *Email:* ${bookingData.email || bookingData.userEmail || "N/A"}
📱 *Phone:* ${bookingData.phone || "N/A"}
✨ *Service:* ${bookingData.serviceTitle}
📅 *Date:* ${bookingData.fromDate || "Check dashboard"}
⏰ *Time:* ${bookingData.time || "N/A"}
💳 *Payment:* ${bookingData.paymentType || "Onsite"}
---------------------------------
🚀 *Action:* Log in to admin panel to manage this booking.
  `.trim();

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${adminNumber}&text=${encodedMessage}&apikey=${apiKey}`;

    console.log(`[WhatsApp] Attempting notification to ${adminNumber}...`);

    try {
        // 'fetch' with 'no-cors' is the most reliable way in browsers to trigger a GET 
        // request to a 3rd party API that doesn't return CORS headers.
        if (typeof window !== "undefined") {
            await fetch(url, {
                mode: 'no-cors',
                method: 'GET',
                cache: 'no-cache',
                credentials: 'omit'
            });
            console.log("[WhatsApp] Request sent successfully via fetch (no-cors mode).");
        } else {
            await axios.get(url);
            console.log("[WhatsApp] Request sent successfully via axios.");
        }
    } catch (error) {
        console.error("[WhatsApp] Failed to trigger notification:", error);
    }
};

/**
 * Sends a WhatsApp notification for contact inquiries.
 */
export const sendInquiryNotification = async (inquiryData: any) => {
    const apiKey = process.env.NEXT_PUBLIC_CALLMEBOT_API_KEY?.trim();
    const adminNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER?.trim();

    if (!apiKey || !adminNumber) return;

    const message = `
📩 *New Website Inquiry!* 📩
---------------------------------
👤 *From:* ${inquiryData.name}
📧 *Email:* ${inquiryData.email}
📱 *Phone:* ${inquiryData.phone || "Not provided"}
📝 *Message:* ${inquiryData.message}
---------------------------------
  `.trim();

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${adminNumber}&text=${encodedMessage}&apikey=${apiKey}`;

    try {
        if (typeof window !== "undefined") {
            fetch(url, { mode: 'no-cors' });
        } else {
            await axios.get(url);
        }
    } catch (error) {
        console.error("[WhatsApp Inquiry] Failed:", error);
    }
};

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const Host = require("../model/Hosts");

const MONGO_URI = process.env.MONGODB_URL || "mongodb://localhost:27017/himalayan_ama";

const hostsData = [
    {
        hostName: "AMA YANG",
        profession: "MANAGER / HOST",
        quote: "Welcoming guests as part of the family and helping them experience Pokhara with warmth, comfort, and local care.",
        bio: "Part of the Gurung family, welcoming travelers with local hospitality and helping guests feel at home while exploring Pokhara.",
        bioParagraphs: [
            "Himalayan Aama is hosted by the Gurung family from the Himalayan region, who enjoy meeting travelers from different cultures and sharing their own culture and way of life.",
            "Guests can enjoy access to the yoga hall for self-practice, explore nearby walking routes, visit a Buddhist monastery uphill, and easily reach Lakeside, restaurants, cafés, and other places around Pokhara.",
            "The host is also available to help guests with apartment-related concerns and make their stay feel comfortable and personal."
        ],
        languages: ["English", "Nepali"],
        hospitalityBadge: "Gurung Family Hospitality",
        imageUri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
        isActive: true
    }
];

async function seedHosts() {
    try {
        console.log("Connecting to MongoDB for Host Seeding...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected successfully.");

        for (const hostItem of hostsData) {
            const existingHost = await Host.findOne({ hostName: hostItem.hostName });
            if (existingHost) {
                Object.assign(existingHost, hostItem);
                await existingHost.save();
                console.log(`Updated Host: "${hostItem.hostName}"`);
            } else {
                await Host.create(hostItem);
                console.log(`Created Host: "${hostItem.hostName}"`);
            }
        }

        console.log("Host Seeding Completed Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding hosts:", err);
        process.exit(1);
    }
}

seedHosts();

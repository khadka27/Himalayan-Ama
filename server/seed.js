const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const path = require("path");

// Load env vars
dotenv.config();

// Import Models
const User = require("./model/Users");
const Author = require("./model/Authors");
const Blog = require("./model/Blogs");
const Service = require("./model/Services");
const Flat = require("./model/Flats");
const Banner = require("./model/Banner");

const MONGO_URI = process.env.MONGODB_URL;

const seedData = async () => {
    try {
        console.log("Connecting to database for seeding...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        // 1. Seed Admin User
        const existingAdmin = await User.findOne({ email: "admin@himalayanama.com" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                userName: "Super Admin",
                email: "admin@himalayanama.com",
                password: hashedPassword,
                role: "super",
                isActive: true,
                approved: true
            });
            console.log("Admin user seeded.");
        }

        // 2. Seed Banner
        const existingBanner = await Banner.findOne();
        if (!existingBanner) {
            await Banner.create({
                bannerText: "Experience the tranquility of the Himalayas. Book your stay now!",
                backgroundColor: "#6B8E6A",
                textColor: "#ffffff",
                isActive: true
            });
            console.log("Banner data seeded.");
        }

        // 3. Seed Authors
        const authors = await Author.find();
        let authorId;
        if (authors.length === 0) {
            const newAuthor = await Author.create({
                authorName: "Swami Dhyanesh",
                authorImage: "author-placeholder.jpg",
                authorCertificate: "Yoga Alliance RYT-500"
            });
            authorId = newAuthor._id;
            console.log("Author seeded.");
        } else {
            authorId = authors[0]._id;
        }

        // 4. Seed Services
        const existingServices = await Service.find();
        if (existingServices.length === 0) {
            await Service.insertMany([
                {
                    title: "Yoga & Meditation",
                    description: "Daily guided sessions to find your inner peace and strength.",
                    icon: "Sparkles",
                    features: ["Hatha Yoga", "Vinyasa Flow", "Evening Meditation"],
                    order: 1
                },
                {
                    title: "Mountain Retreat",
                    description: "Breathtaking views and cozy stays in the heart of the Himalayas.",
                    icon: "Mountain",
                    features: ["Panoramic Views", "Organic Food", "Cozy Rooms"],
                    order: 2
                },
                {
                    title: "Organic Cafe",
                    description: "Farm-to-table meals prepared with locally sourced ingredients.",
                    icon: "Utensils",
                    features: ["Vegan Options", "Local Specialties", "Fresh Juices"],
                    order: 3
                }
            ]);
            console.log("Services seeded.");
        }

        // 5. Seed Flats
        const existingFlats = await Flat.find();
        if (existingFlats.length === 0) {
            await Flat.insertMany([
                {
                    flatName: "Everest View Suite",
                    location: "Upper Ridge, Manali",
                    price: 2500,
                    isActive: true,
                    imagesUri: ["suite-1.jpg", "suite-2.jpg"]
                },
                {
                    flatName: "Riverside Studio",
                    location: "Beas River Side, Kullu",
                    price: 1800,
                    isActive: true,
                    imagesUri: ["studio-1.jpg", "studio-2.jpg"]
                }
            ]);
            console.log("Flats seeded.");
        }

        // 6. Seed Blogs
        const existingBlogs = await Blog.find();
        if (existingBlogs.length === 0) {
            const admin = await User.findOne({ email: "admin@himalayanama.com" });
            await Blog.create({
                title: "Finding Peace in the Mountains",
                shortDescription: "A journey into the heart of silence and meditation.",
                slug: "finding-peace-in-the-mountains",
                bannerImageURI: "blog-peak.jpg",
                category: "Meditation",
                publishDate: new Date(),
                author: authorId,
                postedBy: admin ? admin._id : null,
                content: JSON.stringify([
                    { type: "heading", content: "The Mountain Call" },
                    { type: "paragraph", content: "Living in the Himalayas teaches you the value of silence. Every morning brings a new perspective on life." }
                ]),
                isActive: true
            });
            console.log("Blog seeded.");
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
};

seedData();

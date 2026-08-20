const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const Blog = require("../model/Blogs");
const User = require("../model/Users");

const MONGO_URI = process.env.MONGODB_URL || "mongodb://localhost:27017/himalayan_ama";

const journalEntries = [
    {
        title: "Living in Lakeside Pokhara: What to Expect on a One-Week Stay",
        slug: "living-in-lakeside-pokhara-one-week-stay",
        category: "Travel Guide",
        author: "Himalayan Aama",
        shortDescription: "Planning to stay in Lakeside Pokhara for a week? Discover the ideal 7-day itinerary for exploring adventure, Phewa Lake, Sarangkot sunrise, and local culture at a relaxed pace.",
        metaTitle: "Living in Lakeside Pokhara: 1-Week Itinerary & Guide | Himalayan Aama",
        metaDescription: "Planning a 7-day stay in Lakeside Pokhara? Read our complete 1-week travel itinerary covering paragliding, Sarangkot sunrise, Phewa Lake boating, and local culture.",
        bannerImageURI: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop",
        isActive: true,
        publishDate: new Date("2026-08-15"),
        keyTakeaways: [
            "7-day balanced itinerary for adventure, culture, and relaxation in Pokhara.",
            "Highlights include Sarangkot sunrise, Phewa Lake boating, and World Peace Pagoda.",
            "Self-catering 1BHK apartment stay provides flexibility for cooking and long stays."
        ],
        content: JSON.stringify([
            {
                heading: "Day 1: Experience Paragliding",
                paragraph: "Start your Pokhara trip with a paragliding experience and see the valley, surrounding hills, and Phewa Lake from above. After the adventure, return to Lakeside for lunch and spend the evening relaxing around the cafés or walking beside the lake."
            },
            {
                heading: "Day 2: Explore Phewa Lake and Tal Barahi Temple",
                paragraph: "Take a peaceful boat ride across Phewa Lake and visit Tal Barahi Temple. Spend the rest of the day walking through Lakeside, exploring shops and cafés, and enjoying the atmosphere around the lake as evening approaches."
            },
            {
                heading: "Day 3: Watch the Sunrise From Sarangkot",
                paragraph: "Wake up early and head toward Sarangkot for sunrise and panoramic mountain views. After returning to Pokhara, keep the afternoon relaxed with breakfast, a café visit, cycling, or some free time around Lakeside."
            },
            {
                heading: "Day 4: Visit Davis Falls and Gupteshwor Cave",
                paragraph: "Spend the day exploring Davis Falls and the nearby Gupteshwor Mahadev Cave. After sightseeing, return toward Lakeside and try a Nepali meal or enjoy a quiet evening at your accommodation."
            },
            {
                heading: "Day 5: Visit the World Peace Pagoda",
                paragraph: "Visit the World Peace Pagoda and spend some time enjoying views across Pokhara, Phewa Lake, and the surrounding landscape. Keep the visit peaceful and respectful before returning to Lakeside for a slower evening."
            },
            {
                heading: "Day 6: Choose Adventure or Relaxation",
                paragraph: "If you still want adventure, consider activities such as ziplining, bungee jumping, or an ultralight flight. If you prefer a slower day, visit a café, enjoy yoga or a spa, or simply spend some time relaxing around Lakeside."
            },
            {
                heading: "Day 7: Local Food and Souvenir Shopping",
                paragraph: "Use your final day to experience more Nepali food, explore local shops, and look for souvenirs or handmade products. Finish the week with one final walk around Phewa Lake and revisit a café or place you enjoyed earlier in the trip."
            }
        ]),
        conclusion: "After seven days in Lakeside, Pokhara starts to feel like more than just another stop on your Nepal itinerary. The mix of adventure, local culture, peaceful lake views, and slower everyday moments gives you enough time to enjoy the city naturally and leave with memories that go beyond sightseeing."
    },
    {
        title: "Trekking in Nepal: Explore the Himalayas Beyond Pokhara",
        slug: "trekking-in-nepal-explore-the-himalayas-beyond-pokhara",
        category: "Trekking & Adventure",
        author: "Himalayan Aama",
        shortDescription: "Walk into the heart of Nepal. Discover the top Himalayan trekking routes near Pokhara—including Annapurna Base Camp, Mardi Himal, Poon Hill, Everest Base Camp, Langtang, and Manaslu Circuit.",
        metaTitle: "Trekking in Nepal: Top Himalayan Routes Beyond Pokhara | Himalayan Aama",
        metaDescription: "Discover the best trekking routes in Nepal starting near Pokhara. Detailed guides for Annapurna Base Camp, Mardi Himal, Poon Hill, Everest Base Camp, Langtang, and Manaslu.",
        bannerImageURI: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
        isActive: true,
        publishDate: new Date("2026-08-18"),
        keyTakeaways: [
            "Detailed breakdown of top trekking routes near Pokhara (ABC, Mardi Himal, Poon Hill).",
            "Insights on long-haul treks like Everest Base Camp, Langtang, and Manaslu Circuit.",
            "Pokhara serves as the ultimate rest and recovery base before and after mountain trails."
        ],
        content: JSON.stringify([
            {
                heading: "Walk Into the Heart of Nepal",
                paragraph: "Nepal is a dream destination for travelers looking for breathtaking mountains, peaceful landscapes, traditional villages, and authentic Himalayan experiences. While Pokhara is famous for Phewa Lake, mountain views, and its relaxed Lakeside atmosphere, some of Nepal's greatest adventures begin beyond the city.\n\nFrom scenic short hikes near Pokhara to challenging high-altitude journeys, trekking in Nepal offers something for different types of travelers. Trails pass through lush forests, terraced hills, traditional settlements, river valleys, and dramatic Himalayan landscapes.\n\nFor travelers planning to stay in Lakeside Pokhara before or after trekking, the city can also serve as a comfortable base for preparing for the mountains, resting after the trail, and exploring nearby tourist attractions."
            },
            {
                heading: "Annapurna Base Camp Trek",
                paragraph: "The Annapurna Base Camp Trek is one of Nepal's most popular trekking routes and a favorite choice for travelers beginning their Himalayan journey from the Pokhara region.\n\nThe route passes through traditional villages, terraced fields, rhododendron forests, and increasingly dramatic mountain scenery before reaching Annapurna Base Camp.\n\nStanding at the base camp gives trekkers the chance to experience the Annapurna mountain environment up close while also passing through communities that reflect the culture and lifestyle of Nepal's mountain regions.\n\nFor travelers looking for a memorable Himalayan trekking experience near Pokhara, Annapurna Base Camp is one of the most rewarding options to consider."
            },
            {
                heading: "Mardi Himal Trek",
                paragraph: "Looking for a shorter trekking experience near Pokhara? The Mardi Himal Trek is a scenic route that takes travelers through peaceful forests, mountain settlements, and higher viewpoints.\n\nThe trail opens up to beautiful views of Machhapuchhre, also known as Fishtail, along with the surrounding Annapurna range.\n\nIts relatively shorter duration makes Mardi Himal attractive to visitors who want to experience Himalayan trekking without committing to one of Nepal's longest routes. It can also fit naturally into a longer Lakeside Pokhara stay, allowing travelers to enjoy both the mountains and the city."
            },
            {
                heading: "Ghorepani Poon Hill Trek",
                paragraph: "The Ghorepani Poon Hill Trek is another popular short trek in the Annapurna region and can be a good introduction for first-time trekkers.\n\nThe trail passes through forests, hillside settlements, and traditional mountain villages before reaching the famous Poon Hill viewpoint.\n\nMany travelers visit Poon Hill early in the morning to watch the sunrise over the Annapurna and Dhaulagiri ranges. For visitors who want to combine trekking with a tourist stay in Pokhara, this route can fit well into a shorter Nepal itinerary."
            },
            {
                heading: "Everest Base Camp Trek",
                paragraph: "The Everest Base Camp Trek is one of the world's most recognized Himalayan adventures.\n\nThe route passes through the Khumbu region, traditional Sherpa settlements, monasteries, valleys, and spectacular high-altitude landscapes.\n\nCompared with many trekking routes near Pokhara, Everest Base Camp requires considerably more time, preparation, and careful consideration of altitude. It can be a strong choice for travelers seeking a longer and more demanding Himalayan trekking experience in Nepal."
            },
            {
                heading: "Langtang Valley Trek",
                paragraph: "The Langtang Valley Trek, located north of Kathmandu, offers another way to experience Nepal's Himalayan landscapes beyond the Annapurna region.\n\nThe route combines forests, mountain villages, alpine scenery, and impressive Himalayan views. Travelers also get opportunities to experience Tamang and Himalayan culture along the way.\n\nFor a broader Nepal itinerary, Langtang can be combined with Kathmandu and Pokhara for a more varied travel experience."
            },
            {
                heading: "Manaslu Circuit Trek",
                paragraph: "For travelers seeking a quieter and more remote Himalayan adventure, the Manaslu Circuit Trek offers a more challenging trekking experience.\n\nThe route passes through remote villages, river valleys, forests, and dramatic mountain landscapes around the Manaslu region. Its remote character and demanding route make it more suitable for experienced trekkers looking for a less conventional side of trekking in Nepal.\n\nThe combination of nature, culture, and mountain scenery makes this route especially rewarding for adventurous travelers."
            },
            {
                heading: "Pokhara Before and After Your Trek",
                paragraph: "For many travelers, Pokhara becomes much more than a sightseeing destination. It is often a place to prepare before heading toward the mountains and somewhere to recover after the journey.\n\nBefore trekking, spending a few days in Pokhara gives you time to organize your belongings, relax, explore Phewa Lake, and prepare for the trail without rushing.\n\nAfter trekking, priorities can become much simpler. A hot shower, comfortable sleep, good food, space to unpack, and a peaceful evening can feel especially valuable. Many visitors search for a hotel in Pokhara, accommodation in Lakeside Pokhara, or a stay near Phewa Lake before and after their trek. Travelers staying longer may also consider a private apartment in Pokhara or a self-catering stay where they can prepare meals and recover at their own pace."
            }
        ]),
        conclusion: "Trekking allows travelers to experience a side of Nepal that cannot be discovered from a vehicle or city street. Whether you choose Annapurna Base Camp, Mardi Himal, Poon Hill, Everest Base Camp, Langtang, or Manaslu, choose a trail that suits your time and experience. Then pack your essentials, take your first step, and discover why trekking in Nepal remains one of the country's most unforgettable travel experiences."
    },
    {
        title: "The Nepali Way of Life: Culture, Traditions and Everyday Living",
        slug: "nepali-way-of-life-culture-traditions-everyday-living",
        category: "Culture & Lifestyle",
        author: "Himalayan Aama",
        shortDescription: "More than a destination, Nepal is a way of life. Discover the vibrant cultural diversity, family traditions, seasonal festivals, food heritage, and everyday customs of Nepal.",
        metaTitle: "The Nepali Way of Life: Culture, Traditions & Living | Himalayan Aama",
        metaDescription: "Explore the authentic Nepali way of life—from family customs and traditional Newari/Himalayan architecture to Dashain & Tihar festivals and authentic Dal Bhat cuisine.",
        bannerImageURI: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
        isActive: true,
        publishDate: new Date("2026-08-20"),
        keyTakeaways: [
            "Explore Nepal's rich cultural diversity across 100+ ethnic groups and traditions.",
            "Insights on family living, mountain/valley architecture, and vibrant seasonal festivals.",
            "Culinary traditions from Dal Bhat to Newari and Thakali cuisines."
        ],
        content: JSON.stringify([
            {
                heading: "More Than a Destination, Nepal Is a Way of Life",
                paragraph: "To truly understand Nepal, you need to look beyond its mountains and famous landmarks. Some of the country's most memorable experiences can be found in everyday moments—sharing a meal with family, greeting someone with a warm Namaste, gathering for a festival, or watching life unfold in a quiet village.\n\nNepal is home to more than a hundred ethnic groups, each bringing its own languages, traditions, food, music, beliefs, and customs. From the Himalayan communities in the north to the diverse cultures of the hills, Kathmandu Valley, and Terai, Nepal's cultural diversity is reflected in the way people live every day."
            },
            {
                heading: "Life Shaped by Community",
                paragraph: "Family and community play an important role in Nepali life. In many places, daily life still revolves around spending time with family, sharing meals, helping neighbours, and coming together during important occasions.\n\nWhile lifestyles are changing with modern cities and technology, traditional values remain an important part of everyday life. Travelers visiting Nepal may notice this balance between old and new—from traditional homes and local markets to modern cafés, businesses, and urban living."
            },
            {
                heading: "Homes That Reflect Nepal's Diversity",
                paragraph: "Where people live in Nepal often reflects their surroundings and cultural heritage. Mountain communities have adapted their homes and lifestyles to the Himalayan environment, while villages in the hills and Terai have their own distinctive architecture and way of life.\n\nIn Kathmandu Valley, traditional Newari architecture can be seen in historic courtyards, brick houses, carved wooden windows, temples, and ancient settlements. Across the country, homes and communities tell stories of the people who have lived there for generations."
            },
            {
                heading: "Festivals Bring People Together",
                paragraph: "If there is one thing that adds colour and energy to everyday life in Nepal, it is the country's festivals.\n\nDashain and Tihar are among the most widely celebrated festivals, bringing families together through blessings, gatherings, food, and traditions. Other communities celebrate festivals such as Indra Jatra, Losar, Teej, Chhath, and Buddha Jayanti, each with its own rituals, music, food, and meaning. Nepal's festivals are influenced by religious, cultural, agricultural, seasonal, and historical traditions.\n\nFor visitors, experiencing a local festival can offer a fascinating glimpse into the traditions and community spirit of Nepal."
            },
            {
                heading: "Food Is Part of Everyday Life",
                paragraph: "Food is more than something to eat in Nepal—it is an important part of family gatherings, festivals, and everyday routines.\n\nA traditional Nepali meal often includes dal, bhat, tarkari, and achar, while momos have become a favourite snack for locals and visitors alike. However, there is no single Nepali cuisine. Food varies across communities and regions, with Newari, Thakali, Himalayan, and Terai cuisines offering their own distinctive flavours and traditions.\n\nSharing food is often a simple way to connect with people and experience a part of local life."
            },
            {
                heading: "Traditions That Live in Everyday Moments",
                paragraph: "Nepali culture is not found only in museums or historic monuments. It can be seen in small everyday customs—from saying Namaste when greeting someone to removing shoes before entering a home or place of worship.\n\nVisitors may also notice the importance of respect when visiting temples, homes, and cultural spaces. Learning a few local customs can make your experience more meaningful and help you connect respectfully with the communities you visit."
            },
            {
                heading: "A Culture That Changes From Place to Place",
                paragraph: "One of the most fascinating things about Nepal is how quickly the culture can change as you travel. The traditions, languages, food, clothing, architecture, and celebrations you encounter in the Himalayan regions can be very different from those found in the Kathmandu Valley or the southern plains.\n\nYet this diversity exists within one country, creating a cultural landscape that is constantly changing while remaining distinctly Nepali."
            }
        ]),
        conclusion: "The beauty of Nepali lifestyle lies in its simplicity, diversity, and sense of community. It is found in family gatherings, traditional celebrations, shared meals, ancient customs, and the everyday rhythm of life. So, when you visit Nepal, don't just see the country—experience it. Take time to talk to the locals, taste traditional food, observe local traditions, and appreciate the different ways communities live. Sometimes, the most memorable part of your journey is not the place you visit, but the people and culture you encounter along the way."
    },
    {
        title: "How to Choose a Local Trekking Guide in Nepal",
        slug: "how-to-choose-a-local-trekking-guide-in-nepal",
        category: "Trekking & Tips",
        author: "Himalayan Aama",
        shortDescription: "The right guide can change your entire trek. Learn how to select a licensed, experienced local trekking guide in Nepal—covering route familiarity, safety, costs, and TIMS permits.",
        metaTitle: "How to Choose a Local Trekking Guide in Nepal | Himalayan Aama Guide",
        metaDescription: "Essential guide for selecting a licensed local trekking guide in Nepal. Covers TIMS permit requirements, route familiarity, mountain safety, costs, and pre-trek Pokhara prep.",
        bannerImageURI: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop",
        isActive: true,
        publishDate: new Date("2026-08-22"),
        keyTakeaways: [
            "Licensed and experienced guides ensure mountain safety and route navigation.",
            "Understand TIMS and Nepal Tourism Board mandatory guide regulations.",
            "Clear cost breakdowns (fees, food, accommodation, permits, porter service) prevent misunderstandings.",
            "Pokhara Lakeside is the ideal location to organize permits, gear, and guide briefings."
        ],
        content: JSON.stringify([
            {
                heading: "The Right Guide Can Change Your Entire Trek",
                paragraph: "A trek in Nepal is not only about following a trail to a destination. It is also about understanding the mountains, meeting local communities, learning about Himalayan culture, and knowing how to respond when conditions change.\n\nChoosing the right local trekking guide in Nepal can make your journey safer, smoother, and more meaningful. A knowledgeable guide can help with navigation, communication, local customs, accommodation, and practical decisions along the trail.\n\nNepal Tourism Board currently lists many popular trekking routes under mandatory guide and TIMS requirements, so travelers should always check the latest rules for their chosen route before setting out."
            },
            {
                heading: "Why Choose a Local Trekking Guide?",
                paragraph: "A local guide offers much more than directions. They often understand the trail, nearby villages, changing weather conditions, local traditions, and the everyday life of mountain communities.\n\nThey can also help travelers communicate with local people and understand customs that might otherwise be missed. Hiring local guides and porters can also contribute directly to livelihoods in Nepal’s trekking regions.\n\nFor travelers staying in Pokhara before beginning a trek, arranging a reliable guide in advance can make the transition from a comfortable Lakeside Pokhara stay to the mountain trail much easier."
            },
            {
                heading: "What Makes a Good Trekking Guide in Nepal?",
                paragraph: "1. Licensed and Experienced:\nAlways check whether the guide is properly licensed and has relevant trekking experience. For routes where licensed guides are required, arrange your trek through an appropriately registered trekking operator. Ask about their previous trips, how long they have worked as a guide, and whether they regularly guide international travelers.\n\n2. Familiar With Your Trekking Route:\nA guide may be highly experienced but still have limited knowledge of the specific route you plan to take. Ask whether they have recently completed your chosen trek, where the main overnight stops are, what conditions to expect, and what common difficulties travelers face. This is particularly useful for routes such as Annapurna Base Camp, Mardi Himal, Everest Base Camp, Manaslu Circuit, and other popular trekking areas in Nepal.\n\n3. Easy to Communicate With:\nYour guide should be someone you feel comfortable talking to. A good guide explains the day’s route clearly, answers questions, listens when you are uncomfortable, and makes sure you understand important decisions during the trek. You may spend many days together, so communication and personality can matter almost as much as technical experience.\n\n4. Focused on Mountain Safety:\nA responsible guide should take weather, trail conditions, altitude, and your physical condition seriously. Higher-altitude trekking carries additional risks, so your guide should understand gradual ascent, signs of altitude-related problems, and when continuing may no longer be sensible. Nepal Tourism Board advises trekkers to pay particular attention to altitude-related illness and to follow safe trekking practices in the mountains.\n\n5. Respectful of Local Culture:\nA great Nepal trekking guide should also help you experience local communities respectfully. They can explain how to behave when visiting monasteries, villages, temples, or local homes and help you understand traditions you encounter along the route. This makes trekking more than a physical journey. It becomes an opportunity to learn about the communities that have lived in Nepal’s mountain regions for generations.\n\n6. Clear About Costs:\nBefore confirming a guide, ask exactly what you are paying for. Clarify whether the quoted price includes guide fees, accommodation, meals, transportation, permits, porter services, insurance, or other expenses. Having everything explained beforehand helps prevent misunderstandings once you are already on the trail."
            },
            {
                heading: "Local Trekking Guide Checklist",
                paragraph: "Before choosing your guide, check:\n- Is the guide licensed and properly qualified?\n- Do they have experience on your chosen route?\n- Can you communicate comfortably with them?\n- Do they understand altitude and mountain safety?\n- Are they familiar with local communities and customs?\n- Have all costs and included services been explained?\n- Are necessary permits and TIMS arrangements clear?\n- Do they have a plan for emergencies?\n- Do you feel comfortable sharing concerns with them?\n\nTIMS and permit requirements can vary by route, and restricted areas may require additional trekking permits. Nepal Tourism Board advises trekkers to obtain the necessary documentation before entering applicable trekking areas."
            },
            {
                heading: "Arrange Your Trek From Pokhara",
                paragraph: "Pokhara is a convenient place to prepare for several popular Himalayan trekking routes, especially those around the Annapurna region.\n\nTravelers often spend a few days looking for a hotel in Pokhara, an apartment in Lakeside Pokhara, or accommodation near Phewa Lake before heading toward the mountains.\n\nThis extra time can be useful for meeting your guide, checking equipment, organizing permits, buying last-minute supplies, and resting before the trek begins.\n\nAfter returning, staying in Pokhara also gives tired trekkers somewhere to enjoy a hot shower, proper food, and a few slower days before continuing their Nepal journey."
            }
        ]),
        conclusion: "The best trekking guides do more than tell you where to walk. They can introduce you to local stories, traditions, villages, landscapes, and small details that would be easy to pass without noticing. Choose a local trekking guide in Nepal who makes you feel safe, informed, and comfortable asking questions. With the right person beside you, trekking becomes more than reaching a destination. It becomes a chance to understand Nepal and the Himalayas through someone who knows the trail firsthand."
    }
];

async function seedJournal() {
    try {
        console.log("Connecting to MongoDB for Journal Seeding...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected successfully.");

        const admin = await User.findOne({ email: "admin@himalayanama.com" });

        for (const journalData of journalEntries) {
            const existingBlog = await Blog.findOne({ slug: journalData.slug });
            if (existingBlog) {
                Object.assign(existingBlog, journalData, {
                    postedBy: admin ? admin._id : existingBlog.postedBy
                });
                await existingBlog.save();
                console.log(`Updated Journal entry: "${journalData.title}"`);
            } else {
                await Blog.create({
                    ...journalData,
                    postedBy: admin ? admin._id : null
                });
                console.log(`Created Journal entry: "${journalData.title}"`);
            }
        }

        console.log("All Journal Entries Seeded Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding journal entries:", err);
        process.exit(1);
    }
}

seedJournal();

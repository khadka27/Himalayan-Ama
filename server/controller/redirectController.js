const Review = require("../model/Reviews");
const geoip = require("geoip-lite")

exports.redirectShortLink = async (req, res) => {
    try {
        const { code } = req.params;
        const shortLink = `/s/${code}`;
        const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip || req.socket.remoteAddress;

        // Handle local development IP
        const lookupIp = ip === '::1' || ip === '127.0.0.1' ? '8.8.8.8' : ip;

        const geo = geoip.lookup(lookupIp);
        const country = geo?.country || "default";

        const review = await Review.findOne({ productLink: shortLink });

        if (!review) {
            console.log(`[Redirect] Review not found for link: ${shortLink}`);
            return res.status(404).send("Link Not Found");
        }

        if (review.affilatedLink) {
            // Handle case where affilatedLink is just a string (legacy data)
            if (typeof review.affilatedLink === 'string') {
                return res.redirect(review.affilatedLink);
            }

            const specificLink = country !== "default" ? review.affilatedLink[country] : null;

            if (specificLink) {
                return res.redirect(specificLink);
            } else if (review.affilatedLink.default) {
                return res.redirect(review.affilatedLink.default);
            } else {
                console.log("[Redirect] No default link found, returning 404");
            }
        }

        return res.status(404).send("Destination Not Found");

    } catch (err) {
        console.error("[Redirect] Server Error:", err);
        return res.status(500).send("Server Error");
    }
}

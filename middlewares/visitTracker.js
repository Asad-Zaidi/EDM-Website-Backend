// const Visit = require("../models/Visit");

// const visitTracker = async (req, res, next) => {
//     try {
//         const ip =
//             req.headers["x-forwarded-for"]?.split(",")[0] ||
//             req.socket.remoteAddress;
//         const page = req.originalUrl;
//         const userAgent = req.headers["user-agent"];

//         await Visit.create({ ipAddress: ip, page, userAgent });
//     } catch (err) {
//         console.error("Error tracking visit:", err);
//     }
//     next();
// };

// module.exports = visitTracker;
const Visit = require("../models/Visit");

module.exports = async (req, res, next) => {
    try {
        const skipPaths = ["/api/admin", "/api/auth", "/api/contact"]; // skip admin or API-only paths
        if (skipPaths.some(path => req.path.startsWith(path))) return next();

        await Visit.create({
            ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
            page: req.path || "unknown"
        });
    } catch (err) {
        console.error("Error tracking visit:", err);
    }
    next();
};

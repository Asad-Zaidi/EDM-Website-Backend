// backend/controllers/contactController.js
const Contact = require("../models/Contact");
const Message = require("../models/Message");

/**
 * GET /api/contact
 * Return the contact document (single doc).
 * If none exists, return a sensible default.
 */
const getContact = async (req, res) => {
    try {
        let contact = await Contact.findOne();
        if (!contact) {
            contact = await Contact.create({
                companyName: "My Company",
                whatsapp: "",
                email: "",
            });
        }
        res.json(contact);
    } catch (err) {
        console.error("getContact:", err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * PUT /api/contact
 * Admin-only: update contact info (partial updates allowed).
 * Protected by your auth + admin middleware.
 */
const updateContact = async (req, res) => {
    try {
        const payload = req.body;
        let contact = await Contact.findOne();
        if (!contact) {
            contact = new Contact(payload);
        } else {
            // Merge basic fields
            if (payload.companyName !== undefined) contact.companyName = payload.companyName;
            if (payload.whatsapp !== undefined) contact.whatsapp = payload.whatsapp;
            if (payload.email !== undefined) contact.email = payload.email;

            // social object
            if (payload.social && typeof payload.social === "object") {
                contact.social = { ...contact.social.toObject(), ...payload.social };
            }

            // extraFields: expect object of key->value from admin
            if (payload.extraFields && typeof payload.extraFields === "object") {
                for (const [k, v] of Object.entries(payload.extraFields)) {
                    contact.extraFields.set(k, v);
                }
            }
        }

        contact.updatedAt = Date.now();
        const saved = await contact.save();
        res.json(saved);
    } catch (err) {
        console.error("updateContact:", err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * POST /api/contact/message
 * Public: store a user message in DB.
 * returns the saved message
 */
const submitMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!email || !message) {
            return res.status(400).json({ message: "Email and message are required" });
        }
        const msg = await Message.create({
            name: name || "Anonymous",
            email,
            message,
        });

        // Optionally: add email notify logic here (nodemailer) if desired via env flag

        res.status(201).json(msg);
    } catch (err) {
        console.error("submitMessage:", err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET /api/contact/messages
 * Admin-only: list saved messages (with paging)
 */
const listMessages = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || "1", 10));
        const limit = Math.min(50, parseInt(req.query.limit || "20", 10));
        const skip = (page - 1) * limit;
        const total = await Message.countDocuments();
        const items = await Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.json({ items, page, limit, total });
    } catch (err) {
        console.error("listMessages:", err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * PUT /api/contact/messages/:id/handled
 * Admin-only: mark message handled/unhandled
 */
const setMessageHandled = async (req, res) => {
    try {
        const id = req.params.id;
        const handled = !!req.body.handled;
        const m = await Message.findByIdAndUpdate(id, { handled }, { new: true });
        if (!m) return res.status(404).json({ message: "Not found" });
        res.json(m);
    } catch (err) {
        console.error("setMessageHandled:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getContact,
    updateContact,
    submitMessage,
    listMessages,
    setMessageHandled,
};

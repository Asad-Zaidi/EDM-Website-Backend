const Contact = require("../models/Contact");

// Get contact info
const getContact = async (req, res) => {
    try {
        const contact = await Contact.findOne();
        if (!contact) return res.status(404).json({ message: "No contact info found" });
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update or create contact info (admin only)
const updateContact = async (req, res) => {
    try {
        const data = req.body;
        let contact = await Contact.findOne();

        if (contact) {
            contact = await Contact.findOneAndUpdate({}, data, { new: true });
        } else {
            contact = await Contact.create(data);
        }

        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getContact, updateContact };

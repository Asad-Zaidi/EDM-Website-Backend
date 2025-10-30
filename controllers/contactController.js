// controllers/contactController.js
const Message = require('../models/Message');
const Contact = require('../models/Contact');

// Public: Send Message
const sendMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message)
            return res.status(400).json({ success: false, message: 'All fields are required' });

        const newMsg = await Message.create({ name, email, message });
        res.status(201).json({ success: true, message: 'Message sent successfully', data: newMsg });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Public: Get contact info
const getContact = async (req, res) => {
    try {
        let contact = await Contact.findOne();
        if (!contact) contact = await Contact.create({});
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update contact info
const updateContact = async (req, res) => {
    try {
        const data = req.body;
        let contact = await Contact.findOne();
        if (!contact) contact = await Contact.create(data);
        else {
            Object.assign(contact, data);
            await contact.save();
        }
        res.json({ message: 'Contact info updated successfully', contact });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendMessage, getContact, updateContact };

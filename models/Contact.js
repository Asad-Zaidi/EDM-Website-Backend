const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    title: { type: String, default: 'Get in Touch' },
    description: { type: String, default: "We're here to help and answer any question you might have." },
    email: { type: String, default: 'info@yourcompany.com' },
    phone: { type: String, default: '+1 (555) 123-4567' },
    socials: {
        linkedin: { type: String, default: 'https://linkedin.com/yourcompany' },
        twitter: { type: String, default: 'https://twitter.com/yourcompany' },
        facebook: { type: String, default: 'https://facebook.com/yourcompany' },
        instagram: { type: String, default: 'https://instagram.com/yourcompany' },
        whatsapp: { type: String, default: 'https://wa.me/15551234567' },
        telegram: { type: String, default: 'https://t.me/yourcompany' },
    },
});

module.exports = mongoose.model('Contact', contactSchema);


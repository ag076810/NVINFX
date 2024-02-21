const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/add', async (req, res) => {
    const { name, tool, link, quantity } = req.body;

    try {
        const newMessage = new Message({
            name,
            tool,
            link,
            quantity
        });

        await newMessage.save();
        res.json({ success: true, message: 'Message added successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to add message' });
    }
});

// Add more routes as needed

module.exports = router;

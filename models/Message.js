// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: String,
  tool: String,
  link: String,
  quantity: Number,
  status: String,
  createdAt: Date,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

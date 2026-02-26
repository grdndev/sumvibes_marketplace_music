const mongoose = require("mongoose");

const message = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = message;

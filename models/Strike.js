const mongoose = require("mongoose");

module.exports = mongoose.model("Strike", new mongoose.Schema({
  userId: String,
  guildId: String,
  strikes: { type: Number, default: 0 }
}));

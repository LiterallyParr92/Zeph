const mongoose = require("mongoose");

module.exports = mongoose.model("TempBan", new mongoose.Schema({
  userId: String,
  guildId: String,
  unbanAt: Number
}));

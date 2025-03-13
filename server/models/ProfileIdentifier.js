const mongoose = require("mongoose");

const ClientInfoSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  cin: { type: String, required: true },
  telephone: { type: String, required: true },
  imageProcessed: { type: String, default: null }, // URL ou chemin de l'image traitée
  paymentCards: [{ type: String }],
});

module.exports = mongoose.model("ClientInfo", ClientInfoSchema);
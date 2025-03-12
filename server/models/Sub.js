const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  profileId: { type: String, required: true, unique: true }, // Champ personnalisé
  note: { type: String, default: "default" }, // Champ personnalisé
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
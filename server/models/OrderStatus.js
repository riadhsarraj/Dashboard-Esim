const mongoose = require("mongoose");

const CommandeStatusSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  evenements: { type: Number, required: true },
});

module.exports = mongoose.model("CommandeStatus", CommandeStatusSchema);
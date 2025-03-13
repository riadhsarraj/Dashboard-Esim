const mongoose = require("mongoose");

const CommandeDetailSchema = new mongoose.Schema({
  numeroCommande: { type: String, required: true },
  article: { type: String, required: true },
  prix: { type: Number, required: true },
  quantite: { type: Number, required: true },
});

module.exports = mongoose.model("CommandeDetail", CommandeDetailSchema);
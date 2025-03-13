const mongoose = require("mongoose");

const CommandeSchema = new mongoose.Schema({
  numeroCommande: { type: String, required: true },
  prix: { type: Number, required: true },
  quantite: { type: Number, required: true },
  fournisseur: { type: String, required: true },
  detailsClient: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Commande", CommandeSchema);
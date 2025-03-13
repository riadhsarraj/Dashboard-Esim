const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  numeroCommande: { type: String, required: true },
  intention: { type: String, required: true },
  etat: { type: String, required: true },
  statutPayeur: { type: String, required: true },
  montantTotal: { type: Number, required: true },
  numeroFacture: { type: Number, required: true },
  liensPaiement: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
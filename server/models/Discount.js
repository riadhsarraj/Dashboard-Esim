const mongoose = require("mongoose");

const ReductionSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["pourcentage", "montant"], required: true },
  valeur: { type: Number, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  actif: { type: String, enum: ["Actif", "Inactif"], required: true },
});

module.exports = mongoose.model("Reduction", ReductionSchema);
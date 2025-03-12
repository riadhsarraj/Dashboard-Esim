const mongoose = require("mongoose");

const PubliciteSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  contenu: { type: String, required: true },
  type: { type: String, required: true },
  popup: { type: String, required: true },
});

module.exports = mongoose.model("Publicite", PubliciteSchema);
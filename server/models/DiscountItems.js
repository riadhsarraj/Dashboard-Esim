const mongoose = require("mongoose");

const ArticleReductionSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
  reduction: { type: mongoose.Schema.Types.ObjectId, ref: "Reduction", required: true },
});

module.exports = mongoose.model("ArticleReduction", ArticleReductionSchema);
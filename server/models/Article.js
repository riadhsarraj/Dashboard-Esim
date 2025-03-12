const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [{
    type: String, // URLs ou chemins des images
  }],
});

const ArticleModel = mongoose.model("Article", ArticleSchema);
module.exports = ArticleModel;
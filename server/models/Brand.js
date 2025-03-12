const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const BrandModel = mongoose.model("Brand", BrandSchema);
module.exports = BrandModel;
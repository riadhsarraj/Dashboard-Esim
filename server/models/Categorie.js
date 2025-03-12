const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
});

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  kitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kit",
    required: true,
  },
});

const ItemModel = mongoose.model("Item", ItemSchema);
module.exports = ItemModel;
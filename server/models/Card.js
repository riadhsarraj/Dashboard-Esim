const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  holderName: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  cardType: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

const CardModel = mongoose.model("Card", CardSchema);
module.exports = CardModel;
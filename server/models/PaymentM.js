const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  secretId: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
    trim: true,
  },
  accountId: {
    type: String,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
  auth: {
    type: String,
    trim: true,
  },
  attributionId: {
    type: String,
    trim: true,
  },
  requestId: {
    type: String,
    trim: true,
  },
}, { timestamps: true }); // Ajoute createdAt et updatedAt

const PaymentMethodModel = mongoose.model("PaymentMethod", PaymentMethodSchema);
module.exports = PaymentMethodModel;
const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cin: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
});

const ClientModel = mongoose.model("Client", ClientSchema);
module.exports = ClientModel;
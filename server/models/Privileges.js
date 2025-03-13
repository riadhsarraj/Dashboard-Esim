const mongoose = require("mongoose");

const PrivilegeSchema = new mongoose.Schema({
  label: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Privilege", PrivilegeSchema);
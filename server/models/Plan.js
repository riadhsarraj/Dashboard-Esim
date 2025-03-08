const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Coverage: { type: String, required: true },
  Data: { type: String, required: true },
  Validity: { type: String, required: true },
  Price: { type: String, required: true },
  File: { type: String },
});

module.exports = mongoose.model('Plan', PlanSchema);
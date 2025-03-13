const express = require("express");
const router = express.Router();
const PaymentMethodModel = require("../models/PaymentM");

router.post("/createPaymentMethod", async (req, res) => {
  const { name, description, secretId, userId, accountId, token, auth, attributionId, requestId } = req.body;
  try {
    const existingMethod = await PaymentMethodModel.findOne({ name });
    if (existingMethod) return res.status(400).json({ message: "Payment method already exists!" });
    const newMethod = new PaymentMethodModel({
      name,
      description,
      secretId,
      userId,
      accountId,
      token,
      auth,
      attributionId,
      requestId,
    });
    await newMethod.save();
    res.status(201).json({ message: "Payment method created successfully", method: newMethod });
  } catch (error) {
    console.error("Error creating payment method:", error);
    res.status(500).json({ message: "Error creating payment method", error: error.message });
  }
});

router.get("/getPaymentMethods", async (req, res) => {
  try {
    const methods = await PaymentMethodModel.find({}, { __v: 0, _id: 0 });
    res.status(200).json(methods);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ message: "Error fetching payment methods", error: error.message });
  }
});

router.put("/updatePaymentMethodByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description, secretId, userId, accountId, token, auth, attributionId, requestId } = req.body;
  try {
    const method = await PaymentMethodModel.findOneAndUpdate(
      { name },
      { description, secretId, userId, accountId, token, auth, attributionId, requestId },
      { new: true, runValidators: true }
    );
    if (!method) return res.status(404).json({ message: "Payment method not found" });
    res.status(200).json({ message: "Payment method updated successfully", method });
  } catch (error) {
    console.error("Error updating payment method:", error);
    res.status(500).json({ message: "Error updating payment method", error: error.message });
  }
});

router.delete("/deletePaymentMethodByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const method = await PaymentMethodModel.findOneAndDelete({ name });
    if (!method) return res.status(404).json({ message: "Payment method not found" });
    res.status(200).json({ message: "Payment method deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    res.status(500).json({ message: "Error deleting payment method", error: error.message });
  }
});

module.exports = router;
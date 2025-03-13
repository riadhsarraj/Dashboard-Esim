const express = require("express");
const router = express.Router();
const CardModel = require("../models/Card");

router.post("/createCard", async (req, res) => {
  const { holderName, cardNumber, expirationDate, cardType, email } = req.body;
  try {
    const card = await CardModel.findOne({ cardNumber });
    if (card) return res.status(400).json({ message: "Card already exists!" });

    const newCard = new CardModel({ holderName, cardNumber, expirationDate, cardType, email });
    await newCard.save();
    res.status(201).json({ message: "Card created successfully" });
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ message: "Error creating card" });
  }
});

router.get("/getCards", async (req, res) => {
  try {
    const cards = await CardModel.find({}, { __v: 0 });
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Error fetching cards" });
  }
});

router.put("/updateCardByNumber/:cardNumber", async (req, res) => {
  const { cardNumber } = req.params;
  const { holderName, expirationDate, cardType, email } = req.body;
  try {
    const card = await CardModel.findOne({ cardNumber });
    if (!card) return res.status(404).json({ message: "Card not found" });
    if (holderName) card.holderName = holderName;
    if (expirationDate) card.expirationDate = expirationDate;
    if (cardType) card.cardType = cardType;
    if (email) card.email = email;
    await card.save();
    res.status(200).json({ message: "Card updated successfully" });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ message: "Error updating card" });
  }
});

router.delete("/deleteCardByNumber/:cardNumber", async (req, res) => {
  const { cardNumber } = req.params;
  try {
    const card = await CardModel.findOneAndDelete({ cardNumber });
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ message: "Error deleting card" });
  }
});

module.exports = router;
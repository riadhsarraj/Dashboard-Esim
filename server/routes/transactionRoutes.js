const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

router.get("/getCommandeTransactions/:numeroCommande", async (req, res) => {
  try {
    const transactions = await Transaction.find({ numeroCommande: req.params.numeroCommande });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des transactions", error });
  }
});

router.get("/getAllTransactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des transactions", error });
  }
});

router.post("/createTransaction", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la transaction", error });
  }
});

module.exports = router;
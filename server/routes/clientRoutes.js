const express = require("express");
const router = express.Router();
const ClientModel = require("../models/Client");

router.post("/createClient", async (req, res) => {
  const { username, email, cin, phone } = req.body;
  try {
    const client = await ClientModel.findOne({ email });
    if (client) return res.status(400).json({ message: "Client already exists!" });
    const newClient = new ClientModel({ username, email, cin, phone });
    await newClient.save();
    res.status(201).json({ message: "Client created successfully" });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ message: "Error creating client" });
  }
});

router.get("/getClients", async (req, res) => {
  try {
    const clients = await ClientModel.find({}, { __v: 0 });
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Error fetching clients" });
  }
});

module.exports = router;
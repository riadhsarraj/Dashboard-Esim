const express = require("express");
const router = express.Router();
const ClientInfo = require("../models/ProfileIdentifier");

router.get("/getClientInfos", async (req, res) => {
  try {
    const clientInfos = await ClientInfo.find();
    res.json(clientInfos);
  } catch (error) {
    console.error("Erreur dans /getClientInfos:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des clients", error: error.message });
  }
});

router.post("/createClientInfo", async (req, res) => {
  try {
    const clientInfo = new ClientInfo(req.body);
    await clientInfo.save();
    res.status(201).json(clientInfo);
  } catch (error) {
    console.error("Erreur dans /createClientInfo:", error);
    res.status(400).json({ message: "Erreur lors de la création du client", error: error.message });
  }
});

router.put("/updateClientInfo/:id", async (req, res) => {
  try {
    const clientInfo = await ClientInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!clientInfo) return res.status(404).json({ message: "Client non trouvé" });
    res.json(clientInfo);
  } catch (error) {
    console.error("Erreur dans /updateClientInfo:", error);
    res.status(400).json({ message: "Erreur lors de la mise à jour du client", error: error.message });
  }
});

router.delete("/deleteClientInfo/:id", async (req, res) => {
  try {
    const clientInfo = await ClientInfo.findByIdAndDelete(req.params.id);
    if (!clientInfo) return res.status(404).json({ message: "Client non trouvé" });
    res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("Erreur dans /deleteClientInfo:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du client", error: error.message });
  }
});

module.exports = router;
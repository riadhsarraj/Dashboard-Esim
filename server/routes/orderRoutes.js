const express = require("express");
const router = express.Router();
const CommandeStatus = require("../models/OrderStatus");
const Commande = require("../models/Orders");
const CommandeDetail = require("../models/OrderDetails");

router.get("/getCommandeStatus", async (req, res) => {
  try {
    const commandeStatus = await CommandeStatus.find();
    res.json(commandeStatus);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statuts des commandes", error });
  }
});

router.post("/createCommandeStatus", async (req, res) => {
  try {
    const commandeStatus = new CommandeStatus(req.body);
    await commandeStatus.save();
    res.status(201).json(commandeStatus);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création du statut de commande", error });
  }
});

router.put("/updateCommandeStatusByNom/:nom", async (req, res) => {
  try {
    const commandeStatus = await CommandeStatus.findOneAndUpdate({ nom: req.params.nom }, req.body, { new: true });
    if (!commandeStatus) return res.status(404).json({ message: "Statut de commande non trouvé" });
    res.json(commandeStatus);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du statut de commande", error });
  }
});

router.delete("/deleteCommandeStatusByNom/:nom", async (req, res) => {
  try {
    const commandeStatus = await CommandeStatus.findOneAndDelete({ nom: req.params.nom });
    if (!commandeStatus) return res.status(404).json({ message: "Statut de commande non trouvé" });
    res.json({ message: "Statut de commande supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du statut de commande", error });
  }
});

router.get("/getCommandes", async (req, res) => {
  try {
    const commandes = await Commande.find();
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des commandes", error });
  }
});

router.post("/createCommande", async (req, res) => {
  try {
    const commande = new Commande({ ...req.body, status: "CREATED" });
    await commande.save();
    res.status(201).json(commande);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la commande", error });
  }
});

router.put("/updateCommandeStatus/:numeroCommande", async (req, res) => {
  try {
    const commande = await Commande.findOneAndUpdate(
      { numeroCommande: req.params.numeroCommande },
      { status: req.body.status },
      { new: true }
    );
    if (!commande) return res.status(404).json({ message: "Commande non trouvée" });
    res.json(commande);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du statut", error });
  }
});

router.get("/getCommandeDetails/:numeroCommande", async (req, res) => {
  try {
    const details = await CommandeDetail.find({ numeroCommande: req.params.numeroCommande });
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des détails", error });
  }
});

module.exports = router;
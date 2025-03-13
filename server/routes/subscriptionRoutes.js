const express = require("express");
const router = express.Router();
const Subscription = require("../models/Sub");

router.get("/getSubscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des abonnements", error });
  }
});

router.post("/createSubscription", async (req, res) => {
  try {
    const newSubscription = new Subscription(req.body);
    await newSubscription.save();
    res.status(201).json({ message: "Abonnement créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création", error });
  }
});

router.put("/updateSubscription/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;
    const updatedData = req.body;
    const updatedSubscription = await Subscription.findOneAndUpdate(
      { profileId },
      updatedData,
      { new: true }
    );
    if (updatedSubscription) {
      res.status(200).json({ message: "Abonnement mis à jour avec succès", updatedSubscription });
    } else {
      res.status(404).json({ message: "Abonnement non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'abonnement", error });
  }
});

router.delete("/deleteSubscription/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;
    const deletedSubscription = await Subscription.findOneAndDelete({ profileId });
    if (deletedSubscription) {
      res.status(200).json({ message: "Abonnement supprimé avec succès", deletedSubscription });
    } else {
      res.status(404).json({ message: "Abonnement non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'abonnement", error });
  }
});

module.exports = router;
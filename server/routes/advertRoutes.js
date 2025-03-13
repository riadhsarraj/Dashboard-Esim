const express = require("express");
const router = express.Router();
const Publicite = require("../models/Advertisment");

router.get("/getPublicites", async (req, res) => {
  try {
    const publicites = await Publicite.find();
    res.json(publicites);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des publicités", error });
  }
});

router.post("/createPublicite", async (req, res) => {
  try {
    const publicite = new Publicite(req.body);
    await publicite.save();
    res.status(201).json(publicite);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la publicité", error });
  }
});

router.put("/updatePubliciteByNom/:nom", async (req, res) => {
  try {
    const publicite = await Publicite.findOneAndUpdate({ nom: req.params.nom }, req.body, { new: true });
    if (!publicite) return res.status(404).json({ message: "Publicité non trouvée" });
    res.json(publicite);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour de la publicité", error });
  }
});

router.delete("/deletePubliciteByNom/:nom", async (req, res) => {
  try {
    const publicite = await Publicite.findOneAndDelete({ nom: req.params.nom });
    if (!publicite) return res.status(404).json({ message: "Publicité non trouvée" });
    res.json({ message: "Publicité supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la publicité", error });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Reduction = require("../models/Discount");
const ArticleReduction = require("../models/DiscountItems");

router.get("/getReductions", async (req, res) => {
  try {
    const reductions = await Reduction.find();
    res.json(reductions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des réductions", error });
  }
});

router.post("/createReduction", async (req, res) => {
  try {
    const reduction = new Reduction(req.body);
    await reduction.save();
    res.status(201).json(reduction);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la réduction", error });
  }
});

router.put("/updateReductionByNom/:nom", async (req, res) => {
  try {
    const reduction = await Reduction.findOneAndUpdate({ nom: req.params.nom }, req.body, { new: true });
    if (!reduction) return res.status(404).json({ message: "Réduction non trouvée" });
    res.json(reduction);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour de la réduction", error });
  }
});

router.delete("/deleteReductionByNom/:nom", async (req, res) => {
  try {
    const reduction = await Reduction.findOneAndDelete({ nom: req.params.nom });
    if (!reduction) return res.status(404).json({ message: "Réduction non trouvée" });
    res.json({ message: "Réduction supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la réduction", error });
  }
});

router.get("/getArticleReductions", async (req, res) => {
  try {
    const articleReductions = await ArticleReduction.find();
    res.json(articleReductions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des relations article-réduction", error });
  }
});

router.post("/createArticleReduction", async (req, res) => {
  try {
    const articleReduction = new ArticleReduction(req.body);
    await articleReduction.save();
    res.status(201).json(articleReduction);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la relation article-réduction", error });
  }
});

router.put("/updateArticleReduction/:id", async (req, res) => {
  try {
    const articleReduction = await ArticleReduction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!articleReduction) return res.status(404).json({ message: "Relation article-réduction non trouvée" });
    res.json(articleReduction);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour de la relation article-réduction", error });
  }
});

router.delete("/deleteArticleReduction/:id", async (req, res) => {
  try {
    const articleReduction = await ArticleReduction.findByIdAndDelete(req.params.id);
    if (!articleReduction) return res.status(404).json({ message: "Relation article-réduction non trouvée" });
    res.json({ message: "Relation article-réduction supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la relation article-réduction", error });
  }
});

module.exports = router;
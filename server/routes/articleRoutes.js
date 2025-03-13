const express = require("express");
const router = express.Router();
const ArticleModel = require("../models/Article");

router.post("/createArticle", async (req, res) => {
  const { name, description, barcode, price, images } = req.body;
  try {
    const existingArticle = await ArticleModel.findOne({ name }) || await ArticleModel.findOne({ barcode });
    if (existingArticle) return res.status(400).json({ message: "Article or barcode already exists!" });
    const newArticle = new ArticleModel({ name, description, barcode, price, images: images || [] });
    await newArticle.save();
    res.status(201).json({ message: "Article created successfully", article: newArticle });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Error creating article", error: error.message });
  }
});

router.get("/getArticles", async (req, res) => {
  try {
    const articles = await ArticleModel.find({}, { __v: 0 });
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles", error: error.message });
  }
});

router.put("/updateArticleByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description, barcode, price, images } = req.body;
  try {
    const article = await ArticleModel.findOneAndUpdate(
      { name },
      { description, barcode, price, images },
      { new: true, runValidators: true }
    );
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json({ message: "Article updated successfully", article });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Error updating article", error: error.message });
  }
});

router.delete("/deleteArticleByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const article = await ArticleModel.findOneAndDelete({ name });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Error deleting article", error: error.message });
  }
});

module.exports = router;
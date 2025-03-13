const express = require("express");
const router = express.Router();
const CategoryModel = require("../models/Categorie");

router.post("/createCategory", async (req, res) => {
  const { name, description } = req.body;
  try {
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) return res.status(400).json({ message: "Category already exists!" });
    const newCategory = new CategoryModel({ name, description });
    await newCategory.save();
    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
});

router.get("/getCategories", async (req, res) => {
  try {
    const categories = await CategoryModel.find({}, { __v: 0 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
});

router.put("/updateCategoryByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description } = req.body;
  try {
    const category = await CategoryModel.findOneAndUpdate(
      { name },
      { description },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
});

router.delete("/deleteCategoryByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const category = await CategoryModel.findOneAndDelete({ name });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
});

module.exports = router;
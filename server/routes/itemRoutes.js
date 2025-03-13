const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ItemModel = require("../models/Childcat");
const CategoryModel = require("../models/Categorie");
const KitModel = require("../models/Kit");

router.post("/createItem", async (req, res) => {
  const { name, description, categoryId, kitId } = req.body;
  try {
    const existingItem = await ItemModel.findOne({ name });
    if (existingItem) return res.status(400).json({ message: "Item already exists!" });
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return res.status(400).json({ message: "Invalid categoryId" });
    const category = await CategoryModel.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });
    if (!mongoose.Types.ObjectId.isValid(kitId)) return res.status(400).json({ message: "Invalid kitId" });
    const kit = await KitModel.findById(kitId);
    if (!kit) return res.status(404).json({ message: "Kit not found" });
    const newItem = new ItemModel({ name, description, categoryId, kitId });
    await newItem.save();
    res.status(201).json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item", error: error.message });
  }
});

router.get("/getItems", async (req, res) => {
  try {
    const items = await ItemModel.find().populate("categoryId", "name").populate("kitId", "name");
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
});

router.put("/updateItemByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description, categoryId, kitId } = req.body;
  try {
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) return res.status(400).json({ message: "Invalid categoryId" });
    if (categoryId) {
      const category = await CategoryModel.findById(categoryId);
      if (!category) return res.status(404).json({ message: "Category not found" });
    }
    if (kitId && !mongoose.Types.ObjectId.isValid(kitId)) return res.status(400).json({ message: "Invalid kitId" });
    if (kitId) {
      const kit = await KitModel.findById(kitId);
      if (!kit) return res.status(404).json({ message: "Kit not found" });
    }
    const item = await ItemModel.findOneAndUpdate(
      { name },
      { description, categoryId, kitId },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
});

router.delete("/deleteItemByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const item = await ItemModel.findOneAndDelete({ name });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
});

module.exports = router;
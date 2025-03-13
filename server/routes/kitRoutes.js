const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const KitModel = require("../models/Kit");
const CategoryModel = require("../models/Categorie");

router.post("/createKit", async (req, res) => {
  const { name, description, categoryId } = req.body;
  try {
    const existingKit = await KitModel.findOne({ name });
    if (existingKit) return res.status(400).json({ message: "Kit already exists!" });
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return res.status(400).json({ message: "Invalid categoryId" });
    const category = await CategoryModel.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });
    const newKit = new KitModel({ name, description, categoryId });
    await newKit.save();
    res.status(201).json({ message: "Kit created successfully", kit: newKit });
  } catch (error) {
    console.error("Error creating kit:", error);
    res.status(500).json({ message: "Error creating kit", error: error.message });
  }
});

router.get("/getKits", async (req, res) => {
  try {
    const kits = await KitModel.find().populate("categoryId", "name");
    res.status(200).json(kits);
  } catch (error) {
    console.error("Error fetching kits:", error);
    res.status(500).json({ message: "Error fetching kits", error: error.message });
  }
});

router.put("/updateKitByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description, categoryId } = req.body;
  try {
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) return res.status(400).json({ message: "Invalid categoryId" });
    if (categoryId) {
      const category = await CategoryModel.findById(categoryId);
      if (!category) return res.status(404).json({ message: "Category not found" });
    }
    const kit = await KitModel.findOneAndUpdate(
      { name },
      { description, categoryId },
      { new: true, runValidators: true }
    );
    if (!kit) return res.status(404).json({ message: "Kit not found" });
    res.status(200).json({ message: "Kit updated successfully", kit });
  } catch (error) {
    console.error("Error updating kit:", error);
    res.status(500).json({ message: "Error updating kit", error: error.message });
  }
});

router.delete("/deleteKitByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const kit = await KitModel.findOneAndDelete({ name });
    if (!kit) return res.status(404).json({ message: "Kit not found" });
    res.status(200).json({ message: "Kit deleted successfully" });
  } catch (error) {
    console.error("Error deleting kit:", error);
    res.status(500).json({ message: "Error deleting kit", error: error.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const BrandModel = require("../models/Brand");

router.post("/createBrand", async (req, res) => {
  const { name, description } = req.body;
  try {
    const existingBrand = await BrandModel.findOne({ name });
    if (existingBrand) return res.status(400).json({ message: "Brand already exists!" });
    const newBrand = new BrandModel({ name, description });
    await newBrand.save();
    res.status(201).json({ message: "Brand created successfully", brand: newBrand });
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({ message: "Error creating brand", error: error.message });
  }
});

router.get("/getBrands", async (req, res) => {
  try {
    const brands = await BrandModel.find({}, { __v: 0 });
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Error fetching brands", error: error.message });
  }
});

router.put("/updateBrandByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description } = req.body;
  try {
    const brand = await BrandModel.findOneAndUpdate(
      { name },
      { description },
      { new: true, runValidators: true }
    );
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.status(200).json({ message: "Brand updated successfully", brand });
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ message: "Error updating brand", error: error.message });
  }
});

router.delete("/deleteBrandByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const brand = await BrandModel.findOneAndDelete({ name });
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Error deleting brand", error: error.message });
  }
});

module.exports = router;
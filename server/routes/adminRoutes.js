const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/Admin");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("API fonctionnelle !");
});

router.post("/createAdmin", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const admin = await UserModel.findOne({ email });
    if (admin) return res.status(400).json({ message: "Admin already exists!" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAdmin = new UserModel({ username, password: hashedPassword, email });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Error creating admin" });
  }
});

router.get("/getAdmins", async (req, res) => {
  try {
    const admins = await UserModel.find({}, { password: 0, __v: 0 });
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Error fetching admins" });
  }
});

router.put("/updateAdminByEmail/:email", async (req, res) => {
  const { email } = req.params;
  const { username, newEmail, password } = req.body;
  try {
    const decodedEmail = decodeURIComponent(email);
    const admin = await UserModel.findOne({ email: decodedEmail });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (username) admin.username = username;
    if (newEmail) admin.email = newEmail;
    if (password) admin.password = bcrypt.hashSync(password, 10);
    await admin.save();
    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Error updating admin" });
  }
});

router.delete("/deleteAdminByEmail/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const decodedEmail = decodeURIComponent(email);
    const admin = await UserModel.findOneAndDelete({ email: decodedEmail });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Error deleting admin" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Email or password incorrect" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: "Email or password incorrect" });
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "24h" });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "An error occurred, please try again later" });
  }
});

module.exports = router;
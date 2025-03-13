const express = require("express");
const router = express.Router();
const Privilege = require("../models/Privileges");

router.get("/getPrivileges", async (req, res) => {
  try {
    const privileges = await Privilege.find();
    res.json(privileges);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des privilèges", error });
  }
});

router.post("/createPrivilege", async (req, res) => {
  try {
    const privilege = new Privilege(req.body);
    await privilege.save();
    res.status(201).json(privilege);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création du privilège", error });
  }
});

router.put("/updatePrivilege/:id", async (req, res) => {
  try {
    const privilege = await Privilege.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!privilege) return res.status(404).json({ message: "Privilège non trouvé" });
    res.json(privilege);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du privilège", error });
  }
});

router.delete("/deletePrivilege/:id", async (req, res) => {
  try {
    const privilege = await Privilege.findByIdAndDelete(req.params.id);
    if (!privilege) return res.status(404).json({ message: "Privilège non trouvé" });
    res.json({ message: "Privilège supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du privilège", error });
  }
});

module.exports = router;
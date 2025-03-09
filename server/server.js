const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const UserModel = require("./models/Admin"); // Modèle pour les administrateurs
const Plan = require('./models/Plan'); // Modèle pour les plans
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const ClientModel = require("./models/Client"); 
const CardModel = require("./models/Card");
const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur de connexion MongoDB:", err));


app.get("/", (req, res) => {
  res.send("API fonctionnelle !");
});
app.post("/createAdmin", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const admin = await UserModel.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAdmin = new UserModel({
      username,
      password: hashedPassword,
      email,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Error creating admin" });
  }
});

app.get("/getAdmins", async (req, res) => {
  try {
    const admins = await UserModel.find({}, { password: 0, __v: 0 }); // Exclure le mot de passe et __v
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Error fetching admins" });
  }
});

app.put("/updateAdminByEmail/:email", async (req, res) => {
  const { email } = req.params;
  const { username, newEmail, password } = req.body;

  try {
    const decodedEmail = decodeURIComponent(email); 
    const admin = await UserModel.findOne({ email: decodedEmail });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
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
app.delete("/deleteAdminByEmail/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const decodedEmail = decodeURIComponent(email); // Décoder l'email
    const admin = await UserModel.findOneAndDelete({ email: decodedEmail });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Error deleting admin" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Email or password incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Email or password incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "24h" });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "An error occurred, please try again later" });
  }
});

app.post('/plans', upload.single('File'), async (req, res) => {
  try {
    const { Title, Coverage, Data, Validity, Price } = req.body;
    const File = req.file ? req.file.path : null;

    const newPlan = new Plan({ Title, Coverage, Data, Validity, Price, File });
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/createClient", async (req, res) => {
  const { username, email, cin, phone } = req.body;
  try {
    const client = await ClientModel.findOne({ email });
    if (client) {
      return res.status(400).json({ message: "Client already exists!" });
    }
    const newClient = new ClientModel({
      username,
      email,
      cin,
      phone,
    });

    await newClient.save();
    res.status(201).json({ message: "Client created successfully" });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ message: "Error creating client" });
  }
});
app.get("/getClients", async (req, res) => {
  try {
    const clients = await ClientModel.find({}, { __v: 0 }); // Exclure __v
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Error fetching clients" });
  }
});

app.post("/createCard", async (req, res) => {
  const { holderName, cardNumber, expirationDate, cardType, email } = req.body;
  try {
    const card = await CardModel.findOne({ cardNumber });
    if (card) {
      return res.status(400).json({ message: "Card already exists!" });
    }

    const newCard = new CardModel({
      holderName,
      cardNumber,
      expirationDate,
      cardType,
      email,
    });

    await newCard.save();
    res.status(201).json({ message: "Card created successfully" });
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ message: "Error creating card" });
  }
});

app.get("/getCards", async (req, res) => {
  try {
    const cards = await CardModel.find({}, { __v: 0 }); 
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Error fetching cards" });
  }
});

app.put("/updateCardByNumber/:cardNumber", async (req, res) => {
  const { cardNumber } = req.params;
  const { holderName, expirationDate, cardType, email } = req.body;

  try {
    const card = await CardModel.findOne({ cardNumber });
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    if (holderName) card.holderName = holderName;
    if (expirationDate) card.expirationDate = expirationDate;
    if (cardType) card.cardType = cardType;
    if (email) card.email = email;

    await card.save();
    res.status(200).json({ message: "Card updated successfully" });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ message: "Error updating card" });
  }
});

app.delete("/deleteCardByNumber/:cardNumber", async (req, res) => {
  const { cardNumber } = req.params;

  try {
    const card = await CardModel.findOneAndDelete({ cardNumber });
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ message: "Error deleting card" });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
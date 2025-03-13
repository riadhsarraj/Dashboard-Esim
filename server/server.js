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
const Subscription = require("./models/Sub");
const PaymentMethodModel = require("./models/PaymentM");
const CategoryModel = require("./models/Categorie");
const KitModel = require("./models/Kit");
const ItemModel = require("./models/Childcat");
const BrandModel = require("./models/Brand");
const ArticleModel = require("./models/Article");
const Publicite = require("./models/Advertisment");
const Reduction = require("./models/Discount");
const ArticleReduction = require("./models/DiscountItems");
const CommandeStatus = require("./models/OrderStatus");
const CommandeDetail = require("./models/OrderDetails");
const Commande = require("./models/Orders");
const Transaction = require("./models/Transaction");
const Privilege = require("./models/Privileges");
const ClientInfo = require("./models/ProfileIdentifier");
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

app.get("/getSubscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des abonnements", error });
  }
});

app.post("/createSubscription", async (req, res) => {
  try {
    const newSubscription = new Subscription(req.body);
    await newSubscription.save();
    res.status(201).json({ message: "Abonnement créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création", error });
  }
});

app.put("/updateSubscription/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;
    const updatedData = req.body;

    const updatedSubscription = await Subscription.findOneAndUpdate({ profileId }, updatedData, {
      new: true,
    });

    if (updatedSubscription) {
      res.status(200).json({ message: "Abonnement mis à jour avec succès", updatedSubscription });
    } else {
      res.status(404).json({ message: "Abonnement non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'abonnement", error });
  }
});

app.delete("/deleteSubscription/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;
    const deletedSubscription = await Subscription.findOneAndDelete({ profileId });

    if (deletedSubscription) {
      res.status(200).json({ message: "Abonnement supprimé avec succès", deletedSubscription });
    } else {
      res.status(404).json({ message: "Abonnement non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'abonnement", error });
  }
});

app.post("/createPaymentMethod", async (req, res) => {
  const { name, description, secretId, userId, accountId, token, auth, attributionId, requestId } = req.body;
  try {
    const existingMethod = await PaymentMethodModel.findOne({ name });
    if (existingMethod) {
      return res.status(400).json({ message: "Payment method already exists!" });
    }
    const newMethod = new PaymentMethodModel({
      name,
      description,
      secretId,
      userId,
      accountId,
      token,
      auth,
      attributionId,
      requestId,
    });
    await newMethod.save();
    res.status(201).json({ message: "Payment method created successfully", method: newMethod });
  } catch (error) {
    console.error("Error creating payment method:", error);
    res.status(500).json({ message: "Error creating payment method", error: error.message });
  }
});

app.get("/getPaymentMethods", async (req, res) => {
  try {
    const methods = await PaymentMethodModel.find({}, { __v: 0, _id: 0 }); // Exclure __v et _id
    res.status(200).json(methods);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ message: "Error fetching payment methods", error: error.message });
  }
});

app.put("/updatePaymentMethodByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description, secretId, userId, accountId, token, auth, attributionId, requestId } = req.body;
  try {
    const method = await PaymentMethodModel.findOneAndUpdate(
      { name },
      { description, secretId, userId, accountId, token, auth, attributionId, requestId },
      { new: true, runValidators: true }
    );
    if (!method) {
      return res.status(404).json({ message: "Payment method not found" });
    }
    res.status(200).json({ message: "Payment method updated successfully", method });
  } catch (error) {
    console.error("Error updating payment method:", error);
    res.status(500).json({ message: "Error updating payment method", error: error.message });
  }
});

app.delete("/deletePaymentMethodByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const method = await PaymentMethodModel.findOneAndDelete({ name });
    if (!method) {
      return res.status(404).json({ message: "Payment method not found" });
    }
    res.status(200).json({ message: "Payment method deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    res.status(500).json({ message: "Error deleting payment method", error: error.message });
  }
});

app.post("/createCategory", async (req, res) => {
  const { name, description } = req.body;
  try {
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists!" });
    }
    const newCategory = new CategoryModel({ name, description });
    await newCategory.save();
    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
});

app.get("/getCategories", async (req, res) => {
  try {
    const categories = await CategoryModel.find({}, { __v: 0 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
});

app.put("/updateCategoryByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description } = req.body;
  try {
    const category = await CategoryModel.findOneAndUpdate(
      { name },
      { description },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
});

app.delete("/deleteCategoryByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const category = await CategoryModel.findOneAndDelete({ name });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
});

// Routes pour les kits
app.post("/createKit", async (req, res) => {
  const { name, description, categoryId } = req.body;
  try {
    const existingKit = await KitModel.findOne({ name });
    if (existingKit) {
      return res.status(400).json({ message: "Kit already exists!" });
    }
    // Vérifier si categoryId est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const newKit = new KitModel({ name, description, categoryId });
    await newKit.save();
    res.status(201).json({ message: "Kit created successfully", kit: newKit });
  } catch (error) {
    console.error("Error creating kit:", error);
    res.status(500).json({ message: "Error creating kit", error: error.message });
  }
});

app.get("/getKits", async (req, res) => {
  try {
    const kits = await KitModel.find().populate("categoryId", "name");
    res.status(200).json(kits);
  } catch (error) {
    console.error("Error fetching kits:", error);
    res.status(500).json({ message: "Error fetching kits", error: error.message });
  }
});

app.put("/updateKitByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description, categoryId } = req.body;
  try {
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }
    if (categoryId) {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }
    const kit = await KitModel.findOneAndUpdate(
      { name },
      { description, categoryId },
      { new: true, runValidators: true }
    );
    if (!kit) {
      return res.status(404).json({ message: "Kit not found" });
    }
    res.status(200).json({ message: "Kit updated successfully", kit });
  } catch (error) {
    console.error("Error updating kit:", error);
    res.status(500).json({ message: "Error updating kit", error: error.message });
  }
});

app.delete("/deleteKitByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const kit = await KitModel.findOneAndDelete({ name });
    if (!kit) {
      return res.status(404).json({ message: "Kit not found" });
    }
    res.status(200).json({ message: "Kit deleted successfully" });
  } catch (error) {
    console.error("Error deleting kit:", error);
    res.status(500).json({ message: "Error deleting kit", error: error.message });
  }
});

// Routes pour les items
app.post("/createItem", async (req, res) => {
  const { name, description, categoryId, kitId } = req.body;
  try {
    const existingItem = await ItemModel.findOne({ name });
    if (existingItem) {
      return res.status(400).json({ message: "Item already exists!" });
    }
    // Vérifier si categoryId est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    // Vérifier si kitId est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(kitId)) {
      return res.status(400).json({ message: "Invalid kitId" });
    }
    const kit = await KitModel.findById(kitId);
    if (!kit) {
      return res.status(404).json({ message: "Kit not found" });
    }
    const newItem = new ItemModel({ name, description, categoryId, kitId });
    await newItem.save();
    res.status(201).json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item", error: error.message });
  }
});

app.get("/getItems", async (req, res) => {
  try {
    const items = await ItemModel.find()
      .populate("categoryId", "name")
      .populate("kitId", "name");
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
});

app.put("/updateItemByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description, categoryId, kitId } = req.body;
  try {
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }
    if (categoryId) {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }
    if (kitId && !mongoose.Types.ObjectId.isValid(kitId)) {
      return res.status(400).json({ message: "Invalid kitId" });
    }
    if (kitId) {
      const kit = await KitModel.findById(kitId);
      if (!kit) {
        return res.status(404).json({ message: "Kit not found" });
      }
    }
    const item = await ItemModel.findOneAndUpdate(
      { name },
      { description, categoryId, kitId },
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
});

app.delete("/deleteItemByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const item = await ItemModel.findOneAndDelete({ name });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
});

app.post("/createBrand", async (req, res) => {
  const { name, description } = req.body;
  try {
    const existingBrand = await BrandModel.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists!" });
    }
    const newBrand = new BrandModel({ name, description });
    await newBrand.save();
    res.status(201).json({ message: "Brand created successfully", brand: newBrand });
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({ message: "Error creating brand", error: error.message });
  }
});

app.get("/getBrands", async (req, res) => {
  try {
    const brands = await BrandModel.find({}, { __v: 0 });
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Error fetching brands", error: error.message });
  }
});

app.put("/updateBrandByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description } = req.body;
  try {
    const brand = await BrandModel.findOneAndUpdate(
      { name },
      { description },
      { new: true, runValidators: true }
    );
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand updated successfully", brand });
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ message: "Error updating brand", error: error.message });
  }
});

app.delete("/deleteBrandByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const brand = await BrandModel.findOneAndDelete({ name });
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Error deleting brand", error: error.message });
  }
});

app.post("/createArticle", async (req, res) => {
  const { name, description, barcode, price, images } = req.body;
  try {
    const existingArticle = await ArticleModel.findOne({ name }) || await ArticleModel.findOne({ barcode });
    if (existingArticle) {
      return res.status(400).json({ message: "Article or barcode already exists!" });
    }
    const newArticle = new ArticleModel({ name, description, barcode, price, images: images || [] });
    await newArticle.save();
    res.status(201).json({ message: "Article created successfully", article: newArticle });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Error creating article", error: error.message });
  }
});

app.get("/getArticles", async (req, res) => {
  try {
    const articles = await ArticleModel.find({}, { __v: 0 });
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles", error: error.message });
  }
});

app.put("/updateArticleByName/:name", async (req, res) => {
  const { name } = req.params;
  const { description, barcode, price, images } = req.body;
  try {
    const article = await ArticleModel.findOneAndUpdate(
      { name },
      { description, barcode, price, images },
      { new: true, runValidators: true }
    );
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article updated successfully", article });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Error updating article", error: error.message });
  }
});

app.delete("/deleteArticleByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const article = await ArticleModel.findOneAndDelete({ name });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Error deleting article", error: error.message });
  }
});


app.get("/getPublicites", async (req, res) => {
  try {
    const publicites = await Publicite.find();
    res.json(publicites);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des publicités", error });
  }
});

// Créer une publicité
app.post("/createPublicite", async (req, res) => {
  try {
    const publicite = new Publicite(req.body);
    await publicite.save();
    res.status(201).json(publicite);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la publicité", error });
  }
});

// Mettre à jour une publicité par nom
app.put("/updatePubliciteByNom/:nom", async (req, res) => {
  try {
    const publicite = await Publicite.findOneAndUpdate({ nom: req.params.nom }, req.body, { new: true });
    if (!publicite) {
      return res.status(404).json({ message: "Publicité non trouvée" });
    }
    res.json(publicite);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour de la publicité", error });
  }
});

// Supprimer une publicité par nom
app.delete("/deletePubliciteByNom/:nom", async (req, res) => {
  try {
    const publicite = await Publicite.findOneAndDelete({ nom: req.params.nom });
    if (!publicite) {
      return res.status(404).json({ message: "Publicité non trouvée" });
    }
    res.json({ message: "Publicité supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la publicité", error });
  }
});

app.get("/getReductions", async (req, res) => {
  try {
    const reductions = await Reduction.find();
    res.json(reductions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des réductions", error });
  }
});

app.post("/createReduction", async (req, res) => {
  try {
    const reduction = new Reduction(req.body);
    await reduction.save();
    res.status(201).json(reduction);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la réduction", error });
  }
});

app.put("/updateReductionByNom/:nom", async (req, res) => {
  try {
    const reduction = await Reduction.findOneAndUpdate({ nom: req.params.nom }, req.body, { new: true });
    if (!reduction) {
      return res.status(404).json({ message: "Réduction non trouvée" });
    }
    res.json(reduction);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour de la réduction", error });
  }
});

app.delete("/deleteReductionByNom/:nom", async (req, res) => {
  try {
    const reduction = await Reduction.findOneAndDelete({ nom: req.params.nom });
    if (!reduction) {
      return res.status(404).json({ message: "Réduction non trouvée" });
    }
    res.json({ message: "Réduction supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la réduction", error });
  }
});

app.get("/getArticleReductions", async (req, res) => {
  try {
    const articleReductions = await ArticleReduction.find();
    res.json(articleReductions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des relations article-réduction", error });
  }
});

// Créer une relation article-réduction
app.post("/createArticleReduction", async (req, res) => {
  try {
    const articleReduction = new ArticleReduction(req.body);
    await articleReduction.save();
    res.status(201).json(articleReduction);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la relation article-réduction", error });
  }
});

// Mettre à jour une relation article-réduction
app.put("/updateArticleReduction/:id", async (req, res) => {
  try {
    const articleReduction = await ArticleReduction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!articleReduction) {
      return res.status(404).json({ message: "Relation article-réduction non trouvée" });
    }
    res.json(articleReduction);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour de la relation article-réduction", error });
  }
});

// Supprimer une relation article-réduction
app.delete("/deleteArticleReduction/:id", async (req, res) => {
  try {
    const articleReduction = await ArticleReduction.findByIdAndDelete(req.params.id);
    if (!articleReduction) {
      return res.status(404).json({ message: "Relation article-réduction non trouvée" });
    }
    res.json({ message: "Relation article-réduction supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la relation article-réduction", error });
  }
});

app.get("/getCommandeStatus", async (req, res) => {
  try {
    const commandeStatus = await CommandeStatus.find();
    res.json(commandeStatus);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statuts des commandes", error });
  }
});

// Créer un statut de commande
app.post("/createCommandeStatus", async (req, res) => {
  try {
    const commandeStatus = new CommandeStatus(req.body);
    await commandeStatus.save();
    res.status(201).json(commandeStatus);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création du statut de commande", error });
  }
});

// Mettre à jour un statut de commande par nom
app.put("/updateCommandeStatusByNom/:nom", async (req, res) => {
  try {
    const commandeStatus = await CommandeStatus.findOneAndUpdate({ nom: req.params.nom }, req.body, { new: true });
    if (!commandeStatus) {
      return res.status(404).json({ message: "Statut de commande non trouvé" });
    }
    res.json(commandeStatus);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du statut de commande", error });
  }
});

// Supprimer un statut de commande par nom
app.delete("/deleteCommandeStatusByNom/:nom", async (req, res) => {
  try {
    const commandeStatus = await CommandeStatus.findOneAndDelete({ nom: req.params.nom });
    if (!commandeStatus) {
      return res.status(404).json({ message: "Statut de commande non trouvé" });
    }
    res.json({ message: "Statut de commande supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du statut de commande", error });
  }
});

app.get("/getCommandes", async (req, res) => {
  try {
    const commandes = await Commande.find();
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des commandes", error });
  }
});

// Créer une commande
app.post("/createCommande", async (req, res) => {
  try {
    const commande = new Commande({ ...req.body, status: "CREATED" });
    await commande.save();
    res.status(201).json(commande);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la commande", error });
  }
});

// Mettre à jour le statut d'une commande
app.put("/updateCommandeStatus/:numeroCommande", async (req, res) => {
  try {
    const commande = await Commande.findOneAndUpdate({ numeroCommande: req.params.numeroCommande }, { status: req.body.status }, { new: true });
    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.json(commande);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du statut", error });
  }
});

// Récupérer les détails d'une commande
app.get("/getCommandeDetails/:numeroCommande", async (req, res) => {
  try {
    const details = await CommandeDetail.find({ numeroCommande: req.params.numeroCommande });
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des détails", error });
  }
});

// Récupérer les transactions d'une commande
app.get("/getCommandeTransactions/:numeroCommande", async (req, res) => {
  try {
    const transactions = await Transaction.find({ numeroCommande: req.params.numeroCommande });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des transactions", error });
  }
});

app.get("/getAllTransactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des transactions", error });
  }
});

// Créer une transaction
app.post("/createTransaction", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la transaction", error });
  }
});

app.get("/getPrivileges", async (req, res) => {
  try {
    const privileges = await Privilege.find();
    res.json(privileges);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des privilèges", error });
  }
});

// Créer un privilège
app.post("/createPrivilege", async (req, res) => {
  try {
    const privilege = new Privilege(req.body);
    await privilege.save();
    res.status(201).json(privilege);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création du privilège", error });
  }
});

// Mettre à jour un privilège
app.put("/updatePrivilege/:id", async (req, res) => {
  try {
    const privilege = await Privilege.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!privilege) {
      return res.status(404).json({ message: "Privilège non trouvé" });
    }
    res.json(privilege);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du privilège", error });
  }
});

// Supprimer un privilège
app.delete("/deletePrivilege/:id", async (req, res) => {
  try {
    const privilege = await Privilege.findByIdAndDelete(req.params.id);
    if (!privilege) {
      return res.status(404).json({ message: "Privilège non trouvé" });
    }
    res.json({ message: "Privilège supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du privilège", error });
  }
});

app.get("/getClientInfos", async (req, res) => {
  try {
    const clientInfos = await ClientInfo.find(); // Supprimez .populate("commands") pour tester
    res.json(clientInfos);
  } catch (error) {
    console.error("Erreur dans /getClientInfos:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des clients", error: error.message });
  }
});

app.get("/getClientInfos", async (req, res) => {
  try {
    const clientInfos = await ClientInfo.find(); // Sans .populate pour tester
    res.json(clientInfos);
  } catch (error) {
    console.error("Erreur dans /getClientInfos:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des clients", error: error.message });
  }
});

// Créer un client
app.post("/createClientInfo", async (req, res) => {
  try {
    const clientInfo = new ClientInfo(req.body);
    await clientInfo.save();
    res.status(201).json(clientInfo);
  } catch (error) {
    console.error("Erreur dans /createClientInfo:", error);
    res.status(400).json({ message: "Erreur lors de la création du client", error: error.message });
  }
});

// Mettre à jour un client
app.put("/updateClientInfo/:id", async (req, res) => {
  try {
    const clientInfo = await ClientInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!clientInfo) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.json(clientInfo);
  } catch (error) {
    console.error("Erreur dans /updateClientInfo:", error);
    res.status(400).json({ message: "Erreur lors de la mise à jour du client", error: error.message });
  }
});

// Supprimer un client
app.delete("/deleteClientInfo/:id", async (req, res) => {
  try {
    const clientInfo = await ClientInfo.findByIdAndDelete(req.params.id);
    if (!clientInfo) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("Erreur dans /deleteClientInfo:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du client", error: error.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
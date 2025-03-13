// server.js
const express = require("express");
const cors = require("cors"); // Ajoutez cette ligne pour importer cors
const app = express();
const connectDB = require("./config/db");

// Middleware
app.use(express.json());
app.use(cors()); // Maintenant cors est défini et peut être utilisé

// Connexion à la base de données
connectDB();

// Importer et utiliser les routes
const adminRoutes = require("./routes/adminRoutes");
const clientRoutes = require("./routes/clientRoutes");
const clientInfoRoutes = require("./routes/clientInfoRoutes");
const cardRoutes = require("./routes/cardRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const paymentMethodRoutes = require("./routes/paymentMethodRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const kitRoutes = require("./routes/kitRoutes");
const itemRoutes = require("./routes/itemRoutes");
const brandRoutes = require("./routes/brandRoutes");
const articleRoutes = require("./routes/articleRoutes");
const advertRoutes = require("./routes/advertRoutes");
const discountRoutes = require("./routes/discountRoutes");
const orderRoutes = require("./routes/orderRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const privilegeRoutes = require("./routes/privilegeRoutes");

app.use("/admin", adminRoutes);
app.use("/clients", clientRoutes);
app.use("/clientInfos", clientInfoRoutes);
app.use("/cards", cardRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/paymentMethods", paymentMethodRoutes);
app.use("/categories", categoryRoutes);
app.use("/kits", kitRoutes);
app.use("/items", itemRoutes);
app.use("/brands", brandRoutes);
app.use("/articles", articleRoutes);
app.use("/advertisements", advertRoutes);
app.use("/discounts", discountRoutes);
app.use("/orders", orderRoutes);
app.use("/transactions", transactionRoutes);
app.use("/privileges", privilegeRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
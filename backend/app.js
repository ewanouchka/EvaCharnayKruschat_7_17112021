// imports
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// import des routes
// const sauceRoutes = require("./routes/sauces.js");

// import des variables environnementales
const dotEnv = require("dotenv");
dotEnv.config();
// const dbUsername = process.env.DATABASE_USERNAME;

// connection à la base de données MySQL

// on initialise express
const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// on transforme le corps de la requête en objet maintenable
app.use(bodyParser.json());

// pour la gestion de l'enregistrement des images
app.use("/images", express.static(path.join(__dirname, "images")));

// pour l'utilisation des routes sauces et user
// app.use("/api/sauces", sauceRoutes);

module.exports = app;

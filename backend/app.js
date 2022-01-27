// imports
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// import des routes
const userRoutes = require("./routes/users.js");
const profileRoutes = require("./routes/profiles.js");
const messageRoutes = require("./routes/messages.js");
const commentRoutes = require("./routes/comments.js");

// import des variables environnementales
const dotEnv = require("dotenv");
dotEnv.config();
// const dbUsername = process.env.DATABASE_USERNAME;

// on initialise express
const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Welcome"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// configuration bodyparser
// pour forcer le parse dans des objets inclus dans d'autres objets
app.use(bodyParser.urlencoded({ extended: true }));
// pour transformer le corps de la requête en objet maintenable
app.use(bodyParser.json());

// pour la gestion de l'enregistrement des images
app.use("/images", express.static(path.join(__dirname, "images")));

// pour l'utilisation des routes
app.use("/api/auth", userRoutes); // revoir convention de nommage
app.use("/api/profile", profileRoutes); // revoir convention de nommage
app.use("/api/messages", messageRoutes); // revoir convention de nommage
app.use("/api/comments", commentRoutes); // revoir convention de nommage

module.exports = app;

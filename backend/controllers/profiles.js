// import des modules pour sécurisation des données
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import des models
const models = require("../db/models");

// import variables environnementales
const dotEnv = require("dotenv");
dotEnv.config();
const dbSecretToken = process.env.TOKEN_SECRET;

// fonction accès au profil utilisateur
exports.getUserProfile = (req, res, next) => {
  console.log("je lance la fonction get User Profile");
  const headerAuth = req.headers["authorization"];
  console.log(headerAuth);
  let userToken = "";

  if (headerAuth != null) {
    userToken = headerAuth.replace("Bearer ", "");
  }

  const getUserId = () => {
    let userId = -1;

    if (userToken != null) {
      try {
        console.log("je vérifie le token et récupère le userID");
        const jwtTokenInfo = jwt.verify(userToken, dbSecretToken);
        if (jwtTokenInfo != null) {
          userId = jwtTokenInfo.userId;
        }
      } catch (error) {
        res.status(500).json({ error: "l'id utilisateur n'a pas pu être récupéré" });
      }
    }
    return userId;
  };

  const userId = getUserId(userToken);

  if (userId < 0) {
    console.log("le token n'est pas bon donc pas de userID");
    return res.status(400).json({ error: "token non reconnu" });
  } else {
    console.log("je recherche mon user");
    models.User.findOne({
      attributes: ["id", "email", "first_name", "last_name"],
      where: { id: userId },
    })
      .then(function (user) {
        console.log("then...");
        if (user) {
          console.log("je retourne mon user");
          res.status(201).json(user);
        } else {
          console.log("je n'ai pas mon user");
          res.status(404).json({ error: "utilisateur inconnu" });
        }
      })
      .catch(function () {
        res.status(500).json({ error: "échec de l'accès à l'utilisateur" });
      });
  }
};

// fonction modification du profil utilisateur
exports.updateUserProfile = (req, res, next) => {};

// fonction suppression d'un utilisateur
exports.deleteUserProfile = (req, res, next) => {};

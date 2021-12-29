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
  models.User.findOne({
    attributes: ["id", "email", "first_name", "last_name"],
    where: { id: req.body.userId },
  })
    .then(function (user) {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ error: "utilisateur inconnu" });
      }
    })
    .catch(function () {
      res.status(500).json({ error: "échec de l'accès à l'utilisateur" });
    });
  //}
};

// fonction modification du profil utilisateur
exports.updateUserProfile = (req, res, next) => {
  models.User.findOne({
    attributes: ["id", "email", "first_name", "last_name", "password"],
    where: { id: req.body.userId },
  })
    .then(function (userFound) {
      if (userFound) {
        const updateUser = (newPass) => {
          userFound
            .update({
              first_name: req.body.first_name ? req.body.first_name : userFound.first_name,
              last_name: req.body.last_name ? req.body.last_name : userFound.last_name,
              email: req.body.email ? req.body.email : userFound.email,
              password: newPass,
            })
            .then(function (userFound) {
              return res.status(201).json(userFound);
            })
            .catch(function (err) {
              res.status(500).json({ error: "échec de la mise à jour utilisateur" });
            });
        };
        if (req.body.password) {
          bcrypt.hash(req.body.password, 10, function (err, hash) {
            updateUser(hash);
          });
        } else {
          updateUser(userFound.password);
        }
      } else {
        res.status(404).json({ error: "utilisateur inconnu" });
      }
    })
    .catch(function () {
      res.status(500).json({ error: "échec de l'accès à l'utilisateur" });
    });
};

// fonction suppression d'un utilisateur
exports.deleteUserProfile = (req, res, next) => {
  models.User.findOne({
    attributes: ["id", "password"],
    where: { id: req.body.userId },
  })
    .then(function (userFound) {
      if (userFound) {
        bcrypt.compare(req.body.password, userFound.password, function (err, resBcrypt) {
          if (resBcrypt) {
            userFound
              .destroy({ where: { id: req.body.userId } })
              .then(function () {
                return res.status(201).json({ message: "utilisateur supprimé !" });
              })
              .catch(function (err) {
                res.status(500).json({ error: "échec de la suppression utilisateur" });
              });
          } else {
            return res.status(403).json({ error: "Mot de passe incorrect !" });
          }
        });
      } else {
        res.status(404).json({ error: "utilisateur inconnu" });
      }
    })
    .catch(function () {
      res.status(500).json({ error: "échec de l'accès à l'utilisateur" });
    });
};

// import des modules pour sécurisation des données
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import des models
const models = require("../models");

// import variables environnementales
const dotEnv = require("dotenv");
dotEnv.config();
const dbSecretToken = process.env.TOKEN_SECRET;

// fonction enregistrer un nouvel utilisateur
exports.signup = (req, res, next) => {
  /* check si tous les champs sont remplis (peut-être voir dans le front ?)
  if (
    req.body.first_name == null ||
    req.body.last_name == null ||
    req.body.email == null ||
    req.body.password == null
  ) {
    return res.status(400).json({ error: "Il manque des informations !" });
  }*/

  // on vérifie que l'email de la requête est bien différent de ceux déjà présents dans la base de données
  models.User.findOne({
    attributes: ["email"],
    where: { email: req.body.email },
  })
    .then((userFound) => {
      // s'il n'existe pas déjà, on hash le mot de passe et on crée l'utilisateur
      if (!userFound) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          const newUser = models.User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hash,
            isAdmin: false,
          })
            .then((newUser) => {
              res.status(201).json({ userId: newUser.id });
            })
            .catch((err) => res.status(400).json({ error: "L'enregistrement de l'utilisateur a échoué." }));
        });
      } else {
        // s'il existe déjà, on renvoie un message d'erreur
        return res.status(409).json({ error: "Cet utilisateur existe déjà !" });
      }
    })
    // si on ne parvient pas à vérifier la liste des emails enregistrés, on renvoie une erreur spécifique
    .catch(() => res.status(500).json({ error: "La vérification de la liste utilisateurs a échoué." }));
};

// fonction connexion d'un utilisateur
exports.login = (req, res, next) => {
  /* check si tous les champs sont remplis (peut-être voir dans le front ?)
  if (req.body.email == null || req.body.password == null) {
    console.log("champ vide");
    return res.status(400).json({ error: "Il manque des informations !" });
  }*/

  models.User.findOne({
    where: { email: req.body.email },
  })
    .then((userFound) => {
      if (userFound) {
        bcrypt.compare(req.body.password, userFound.password, function (err, resBcrypt) {
          if (resBcrypt) {
            return res.status(200).json({
              userId: userFound.id,
              token: jwt.sign({ userId: userFound.id, isAdmin: userFound.isAdmin }, dbSecretToken, {
                expiresIn: "24h",
              }),
            });
          } else {
            return res.status(403).json({ error: "Mot de passe incorrect !" });
          }
        });
      } else {
        return res.status(404).json({ error: "Utilisateur non trouvé !" });
      }
    })
    .catch((err) => res.status(500).json({ error: "La vérification de la liste utilisateurs a échoué." }));
};

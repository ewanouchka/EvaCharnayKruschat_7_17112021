// import des modules pour sécurisation des données
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import des models
const models = require("../db/models");

// import variables environnementales
const dotEnv = require("dotenv");
dotEnv.config();
const dbSecretToken = process.env.TOKEN_SECRET;

// fonction enregistrer un nouvel utilisateur
exports.signup = (req, res, next) => {
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
              res.status(201).json({
                userId: newUser.id,
                token: jwt.sign({ userId: newUser.id, isAdmin: newUser.isAdmin }, dbSecretToken, {
                  expiresIn: "24h",
                }),
              });
            })
            .catch((err) => res.status(400).json({ error: "L'enregistrement de l'utilisateur a échoué." }));
        });
      } else {
        // s'il existe déjà, on renvoie un message d'erreur
        return res.status(409).json({ error: "Cet e-mail est déjà utilisé !" });
      }
    })
    // si on ne parvient pas à vérifier la liste des emails enregistrés, on renvoie une erreur spécifique
    .catch(() => res.status(500).json({ error: "La vérification de la liste utilisateurs a échoué." }));
};

// fonction connexion d'un utilisateur
exports.login = (req, res, next) => {
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

// fonction accès au profil utilisateur
exports.getUserProfile = (req, res, next) => {
  const headerAuth = req.headers["authorization"];
  let userToken = "";

  if (headerAuth != null) {
    userToken = headerAuth.replace("Bearer ", "");
  }

  const getUserId = () => {
    let userId = -1;

    if (userToken != null) {
      try {
        const jwtTokenInfo = jwt.verify(userToken, dbSecretToken);
        if (jwtTokenInfo != null) {
          userId = jwtTokenInfo.userId;
        }
      } catch (err) {}
    }
    return userId;
  };

  const userId = getUserId(userToken);

  if (userId < 0) {
    return res.status(400).json({ error: "token non reconnu" });
  } else {
    models.User.findOne({
      attributes: ["id", "email", "first_name", "last_name"],
      where: { id: userId },
    })
      .then(function (user) {
        console.log("then...");
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "utilisateur inconnu" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "échec de l'accès à l'utilisateur" });
      });
  }
};

// fonction modification du profil utilisateur
exports.updateUserProfile = (req, res, next) => {};

// fonction suppression d'un utilisateur
exports.deleteUserProfile = (req, res, next) => {};

// import des modules pour sécurisation des données
const bcrypt = require("bcrypt");

// import des models
const models = require("../db/models");

// fonction accès au profil utilisateur
exports.getUserProfile = (req, res, next) => {
  // constantes
  const userId = res.locals.userId;
  const isAdmin = res.locals.isAdmin;

  models.User.findOne({
    where: { id: req.params.id },
  })
    .then((userFound) => {
      if (userFound === null) {
        return res.status(404).json({ error: "Profil non trouvé" });
      }
      if (!isAdmin && userFound.id != userId) {
        return res.status(403).json({ error: "Utilisateur non autorisé" });
      }
      return res.status(201).json(userFound);
    })
    .catch(() => {
      return res.status(500).json({ error: "échec de l'accès à l'utilisateur" });
    });
};

// fonction modification du profil utilisateur
const updateUser = (req, res, userFound, newPass, next) => {
  userFound
    .update({
      first_name: req.body.first_name ? req.body.first_name : userFound.first_name,
      last_name: req.body.last_name ? req.body.last_name : userFound.last_name,
      email: req.body.email ? req.body.email : userFound.email,
      password: newPass,
    })
    .then((userFound) => {
      return res.status(201).json(userFound);
    })
    .catch(() => {
      res.status(500).json({ error: "Echec de la mise à jour utilisateur" });
    });
};

exports.updateUserProfile = (req, res, next) => {
  // constantes
  const userId = res.locals.userId;
  const isAdmin = res.locals.isAdmin;

  models.User.findOne({
    where: { id: req.params.id },
  })
    .then((userFound) => {
      if (!isAdmin && userFound.id != userId) {
        return res.status(403).json({ error: "Utilisateur non autorisé" });
      }
      if (req.body.password) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          updateUser(req, res, userFound, hash);
        });
      } else {
        updateUser(req, res, userFound, userFound.password);
      }
    })
    .catch(() => {
      res.status(500).json({ error: "Echec de l'accès à l'utilisateur" });
    });
};

// fonction suppression d'un utilisateur
exports.deleteUserProfile = (req, res, next) => {
  // constantes
  const userId = res.locals.userId;
  const isAdmin = res.locals.isAdmin;

  models.User.findOne({
    attributes: ["id", "password"],
    where: { id: req.params.id },
  })
    .then((userFound) => {
      if (!isAdmin && userFound.id != userId) {
        return res.status(403).json({ error: "Utilisateur non autorisé" });
      }
      bcrypt.compare(req.body.password, userFound.password, (err, resBcrypt) => {
        if (resBcrypt) {
          userFound
            .destroy({ where: { id: req.params.id } })
            .then(() => {
              return res.status(201).json({ message: "Utilisateur supprimé !" });
            })
            .catch(() => {
              res.status(500).json({ error: "Echec de la suppression utilisateur" });
            });
        } else {
          return res.status(403).json({ error: "Mot de passe incorrect !" });
        }
      });
    })
    .catch(() => {
      res.status(500).json({ error: "Echec de l'accès à l'utilisateur" });
    });
};
